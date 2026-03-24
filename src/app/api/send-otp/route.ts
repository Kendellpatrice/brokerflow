import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/firestore";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const code = generateOtp();
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 10 * 60 * 1000)); // 10 min

  await setDoc(doc(db, "otpCodes", email), { code, expiresAt, used: false });

  const { error } = await resend.emails.send({
    from: "BrokerFlow <onboarding@resend.dev>",
    to: email,
    subject: "Your BrokerFlow verification code",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <h2 style="color:#1a2b3d;margin-bottom:8px">Your verification code</h2>
        <p style="color:#64748b;margin-bottom:24px">Enter this code to sign in to your mortgage fact-find.</p>
        <div style="background:#f6f7f7;border-radius:12px;padding:24px;text-align:center;letter-spacing:0.4em;font-size:32px;font-weight:700;color:#1a2b3d;font-family:monospace">
          ${code}
        </div>
        <p style="color:#94a3b8;font-size:13px;margin-top:24px">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("[send-otp] Resend error:", error);
    return NextResponse.json({ error: `Failed to send email: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
