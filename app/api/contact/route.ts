import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/content";

/**
 * Contact form endpoint — sends via Resend (free tier).
 * Requires RESEND_API_KEY in the environment (Vercel → Project → Env Vars).
 * The sender stays on Resend's shared onboarding domain so no DNS setup is
 * needed; replies go to the visitor via reply_to.
 */

const BodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
  /** Honeypot — humans never see it; bots (and overeager autofill) might fill
   *  it, so accept any value and silently drop instead of rejecting. */
  hp_field: z.string().optional(),
});

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "Mail service is not configured yet. Please email me directly." },
      { status: 503 },
    );
  }
  if (!site.email) {
    return NextResponse.json(
      { ok: false, error: "No destination address configured." },
      { status: 503 },
    );
  }

  let data: z.infer<typeof BodySchema>;
  try {
    data = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "Please fill every field with valid values." },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success, send nothing.
  if (data.hp_field) {
    return NextResponse.json({ ok: true });
  }

  // Escape user input before embedding in HTML — the sender controls these.
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#0b0b0b;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">
    <tr><td style="padding-bottom:18px;text-align:center;">
      <span style="font-size:22px;font-weight:700;color:#ece9e2;letter-spacing:1px;">S<span style="color:#c9a057;">M</span></span>
      <span style="display:block;margin-top:4px;font-size:11px;letter-spacing:3px;color:#9c988f;">PORTFOLIO &middot; NEW MESSAGE</span>
    </td></tr>
    <tr><td style="background:#161514;border:1px solid #2e2b27;border-radius:12px;overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="height:4px;background:linear-gradient(90deg,#c9a057,#c96a4c);font-size:0;">&nbsp;</td></tr>
        <tr><td style="padding:24px 28px 8px;">
          <p style="margin:0;font-size:11px;letter-spacing:2px;color:#9c988f;">FROM</p>
          <p style="margin:4px 0 0;font-size:17px;font-weight:600;color:#ece9e2;">${esc(data.name)}</p>
          <p style="margin:2px 0 0;font-size:13px;"><a href="mailto:${esc(data.email)}" style="color:#c9a057;text-decoration:none;">${esc(data.email)}</a></p>
        </td></tr>
        <tr><td style="padding:18px 28px 8px;">
          <p style="margin:0;font-size:11px;letter-spacing:2px;color:#9c988f;">SUBJECT</p>
          <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#ece9e2;">${esc(data.subject)}</p>
        </td></tr>
        <tr><td style="padding:18px 28px 24px;">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#9c988f;">MESSAGE</p>
          <div style="background:#0b0b0b;border:1px solid #2e2b27;border-radius:8px;padding:16px 18px;">
            <p style="margin:0;font-size:14px;line-height:1.7;color:#d8d4ca;white-space:pre-wrap;">${esc(data.message)}</p>
          </div>
        </td></tr>
        <tr><td style="padding:0 28px 26px;" align="center">
          <a href="mailto:${esc(data.email)}?subject=Re:%20${encodeURIComponent(data.subject)}"
             style="display:inline-block;background:linear-gradient(135deg,#c9a057,#c96a4c);color:#0b0b0b;font-size:14px;font-weight:700;padding:12px 32px;border-radius:8px;text-decoration:none;">
            Reply to ${esc(data.name.split(" ")[0])} &rarr;
          </a>
        </td></tr>
      </table>
    </td></tr>
    <tr><td style="padding-top:16px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#5c5952;">Sent from the contact form at sridharportfolio1.netlify.app</p>
    </td></tr>
  </table>
</body>
</html>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: [site.email],
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject}`,
    html,
    text: [
      `From: ${data.name} <${data.email}>`,
      "",
      data.message,
      "",
      "— Sent from the portfolio contact form",
    ].join("\n"),
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "Sending failed. Please email me directly instead." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
