import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const { leadName, leadEmail, token } = await req.json();

  if (!leadName || !leadEmail || !token) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 },
    );
  }

  const origin = new URL(req.url).origin;
  const inviteUrl = `${origin}/invite/${token}`;

  const { error } = await resend.emails.send({
    from: 'BrokerFlow <services@brokerflow.agency>',
    to: leadEmail,
    subject: 'Your Fact Find Form is ready to complete',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px">
        <div style="margin-bottom:24px">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;background:#1a2b3d;border-radius:10px;color:white;font-size:16px;font-weight:700">u</span>
        </div>
        <h2 style="color:#1a2b3d;margin:0 0 8px">Hi ${leadName},</h2>
        <p style="color:#64748b;margin:0 0 24px">Your broker has invited you to complete your digital mortgage fact-find. This helps us understand your financial situation so we can find the right loan for you.</p>
        <a href="${inviteUrl}" style="display:inline-block;background:#1a2b3d;color:white;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px">
          Start my Fact Find Form →
        </a>
        <p style="color:#94a3b8;font-size:13px;margin-top:24px">This link expires in 30 days. If you have questions, please contact your broker directly.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="color:#94a3b8;font-size:12px;margin:0">© ${new Date().getFullYear()} uBroker. All rights reserved.</p>
      </div>
    `,
  });

  if (error) {
    console.error('[send-invite] Resend error:', error);
    return NextResponse.json(
      { error: `Failed to send invitation email: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
