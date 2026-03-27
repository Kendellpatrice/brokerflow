import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const db = getAdminDb();
    const now = Date.now();

    // Rate limiting: max 3 OTP requests per email per 5 minutes
    const rateLimitRef = db.collection("otpRateLimit").doc(email);
    const rateLimitSnap = await rateLimitRef.get();

    if (rateLimitSnap.exists) {
      const { count, windowStart } = rateLimitSnap.data() as { count: number; windowStart: number };
      if (now - windowStart < RATE_LIMIT_WINDOW_MS) {
        if (count >= RATE_LIMIT_MAX) {
          return NextResponse.json(
            { error: "Too many requests. Please wait before requesting a new code." },
            { status: 429 }
          );
        }
        await rateLimitRef.update({ count: FieldValue.increment(1) });
      } else {
        await rateLimitRef.set({ count: 1, windowStart: now });
      }
    } else {
      await rateLimitRef.set({ count: 1, windowStart: now });
    }

    const code = generateOtp();
    const expiresAt = new Date(now + 10 * 60 * 1000);

    await db.collection("otpCodes").doc(email).set({
      code,
      expiresAt,
      used: false,
      attempts: 0,
    });

    const { error } = await resend.emails.send({
      from: "BrokerFlow <services@brokerflow.agency>",
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
      return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-otp] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
