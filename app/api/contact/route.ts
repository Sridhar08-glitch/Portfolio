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
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
  /** Honeypot — real users never fill this. */
  company: z.string().max(0).optional().or(z.literal("")),
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
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Portfolio Contact <onboarding@resend.dev>",
    to: [site.email],
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject}`,
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
