import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, createCustomToken } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const MAX_ATTEMPTS = 5;
const GENERIC_ERROR = "Invalid or expired code.";

function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin) return process.env.NODE_ENV !== "production";
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!validateOrigin(req)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json();
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body?.code === "string" ? body.code.trim() : "";

  if (!email || !code) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const db = getAdminDb();
  const otpRef = db.collection("otpCodes").doc(email);
  const snap = await otpRef.get();

  if (!snap.exists) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const { code: storedCode, expiresAt, used, attempts = 0 } = snap.data() as {
    code: string;
    expiresAt: FirebaseFirestore.Timestamp;
    used: boolean;
    attempts: number;
  };

  // Reject if already used, too many attempts, or expired — all with the same message
  if (used || attempts >= MAX_ATTEMPTS || expiresAt.toDate() < new Date()) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  if (code !== storedCode) {
    await otpRef.update({ attempts: FieldValue.increment(1) });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  await otpRef.update({ used: true });

  const customToken = await createCustomToken(email);
  return NextResponse.json({ success: true, customToken });
}
