import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firestore";
import { doc, getDoc, Timestamp } from "firebase/firestore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const snap = await getDoc(doc(db, "brokerLeadInvites", token));

  if (!snap.exists()) {
    return new NextResponse(invalidPage("This invitation link is invalid."), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  const { leadId, expiresAt } = snap.data() as { leadId: string; leadEmail: string; expiresAt: Timestamp };

  if (expiresAt.toDate() < new Date()) {
    return new NextResponse(invalidPage("This invitation link has expired. Please contact your broker for a new link."), {
      status: 410,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check that this token is still the active one (a resend would have replaced it)
  const leadSnap = await getDoc(doc(db, "brokerLeads", leadId));
  if (!leadSnap.exists() || leadSnap.data().activeInviteToken !== token) {
    return new NextResponse(invalidPage("A newer invitation link has been sent. Please check your email for the latest link."), {
      status: 410,
      headers: { "Content-Type": "text/html" },
    });
  }

  const response = NextResponse.redirect(new URL("/", _req.url));
  response.cookies.set("session", "client", {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
  });

  return response;
}

function invalidPage(message: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invalid Link — BrokerFlow</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f6f7f7; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px; }
    .card { background: white; border-radius: 16px; padding: 40px 32px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .icon { font-size: 40px; margin-bottom: 16px; }
    h1 { color: #1a2b3d; font-size: 20px; font-weight: 700; margin-bottom: 10px; }
    p { color: #64748b; font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🔗</div>
    <h1>Link unavailable</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
