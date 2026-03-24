import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firestore";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required." }, { status: 400 });
  }

  const snap = await getDoc(doc(db, "otpCodes", email));

  if (!snap.exists()) {
    return NextResponse.json({ error: "Invalid or expired code." }, { status: 400 });
  }

  const { code: storedCode, expiresAt, used } = snap.data() as {
    code: string;
    expiresAt: Timestamp;
    used: boolean;
  };

  if (used) {
    return NextResponse.json({ error: "This code has already been used." }, { status: 400 });
  }

  if (expiresAt.toDate() < new Date()) {
    return NextResponse.json({ error: "This code has expired. Please request a new one." }, { status: 400 });
  }

  if (code !== storedCode) {
    return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 });
  }

  await updateDoc(doc(db, "otpCodes", email), { used: true });

  return NextResponse.json({ success: true });
}
