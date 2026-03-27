import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";

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
  const idToken = typeof body?.idToken === "string" ? body.idToken : "";

  if (!idToken) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);

    // Determine role: check if user has a broker profile
    const db = getAdminDb();
    const brokerSnap = await db.collection("brokerProfiles").doc(decoded.uid).get();
    const role = brokerSnap.exists ? "broker" : "client";

    const sessionCookieOpts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    };

    const response = NextResponse.json({ success: true, role });
    response.cookies.set("session", role, sessionCookieOpts);

    // For client users, also set a readable leadRef cookie so the Fact Find Form
    // sidebar can display the ref immediately on render without waiting for Firestore.
    if (role === "client") {
      const leadSnap = await db.collection("brokerLeads")
        .where("email", "==", decoded.uid)
        .limit(1)
        .get();

      if (!leadSnap.empty) {
        const leadRef = leadSnap.docs[0].data().ref as string | undefined;
        if (leadRef) {
          response.cookies.set("leadRef", leadRef, {
            httpOnly: false, // intentionally readable by JS — display value only, not a credential
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
        }
      }
    }

    return response;
  } catch (err) {
    console.error("[session] Token verification failed:", err);
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }
}
