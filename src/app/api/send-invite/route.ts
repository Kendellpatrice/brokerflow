import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/firestore";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { leadId, leadName, leadEmail } = await req.json();

  if (!leadId || !leadName || !leadEmail) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const token = randomUUID();
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days

  // Store the invite token and mark it as the active token on the lead doc.
  // Any previously issued token is implicitly expired because the lead doc now
  // points to this new token — the validation step checks activeInviteToken.
  await Promise.all([
    setDoc(doc(db, "brokerLeadInvites", token), { leadId, leadEmail, expiresAt }),
    setDoc(doc(db, "brokerLeads", leadId), { activeInviteToken: token }, { merge: true }),
  ]);

  const inviteUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000"}/invite/${token}`;

  const { error } = await resend.emails.send({
    from: "BrokerFlow <onboarding@resend.dev>",
    to: leadEmail,
    subject: "Your mortgage fact-find is ready to complete",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <div style="margin-bottom:24px">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#1a2b3d;border-radius:10px;color:white;font-size:16px;font-weight:700">u</span>
        </div>
        <h2 style="color:#1a2b3d;margin:0 0 8px">Hi ${leadName},</h2>
        <p style="color:#64748b;margin:0 0 24px">Your broker has invited you to complete your digital mortgage fact-find. This helps us understand your financial situation so we can find the right loan for you.</p>
        <a href="${inviteUrl}" style="display:inline-block;background:#1a2b3d;color:white;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px">
          Start my fact-find →
        </a>
        <p style="color:#94a3b8;font-size:13px;margin-top:24px">This link expires in 30 days. If you have questions, please contact your broker directly.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">© ${new Date().getFullYear()} uBroker. All rights reserved.</p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send invitation email." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
