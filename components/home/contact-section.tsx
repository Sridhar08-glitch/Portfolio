"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import type { Site } from "@/lib/schemas";
import { Reveal } from "@/components/ui/reveal";

const inputCls =
  "w-full rounded-theme border border-line bg-panel/70 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-mineral";

type SendState = "idle" | "sending" | "sent" | "error";

export function ContactSection({ site }: { site: Site }) {
  const [state, setState] = useState<SendState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          subject: fd.get("subject"),
          message: fd.get("message"),
          company: fd.get("company") ?? "",
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) {
        setState("sent");
        form.reset();
      } else {
        setState("error");
        setError(json.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setError("Network error — please email me directly.");
    }
  }

  const cards = [
    site.email && {
      icon: Mail,
      title: "Email",
      sub: "Best way to reach me",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    site.github && {
      icon: Github,
      title: "GitHub",
      sub: "Check out the code",
      value: site.github.replace("https://", ""),
      href: site.github,
    },
    site.linkedin && {
      icon: Linkedin,
      title: "LinkedIn",
      sub: "Let's connect",
      value: site.linkedin.replace("https://", ""),
      href: site.linkedin,
    },
    {
      icon: MapPin,
      title: "Location",
      sub: site.location,
      value: "Transferable visa · NOC available",
      href: null,
    },
  ].filter(Boolean) as {
    icon: React.ElementType;
    title: string;
    sub: string;
    value: string;
    href: string | null;
  }[];

  return (
    <section id="contact" className="shell mt-24 scroll-mt-24 sm:mt-32">
      <Reveal as="div">
        <p className="label flex items-center gap-2">
          <span className="node-pulse h-1.5 w-1.5 rounded-full bg-mineral" aria-hidden />
          Get in touch
        </p>
        <h2 className="serif mt-4 text-4xl sm:text-5xl">
          Let&apos;s build something{" "}
          <em
            className="bg-clip-text italic text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(100deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
            }}
          >
            useful.
          </em>
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Open to discussing interesting projects, collaborations and
          opportunities to solve real problems.
        </p>
      </Reveal>

      {/* Method cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-mineral/12 text-mineral">
                <c.icon size={17} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-display text-[0.95rem] font-semibold">
                  {c.title}
                  {c.href && (
                    <ArrowRight size={13} className="text-muted transition-transform group-hover:translate-x-1" aria-hidden />
                  )}
                </span>
                <span className="mt-0.5 block font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
                  {c.sub}
                </span>
                <span className="mt-1.5 block truncate text-[0.78rem] text-muted">{c.value}</span>
              </span>
            </>
          );
          return c.href ? (
            <a
              key={c.title}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="card-dark group flex items-start gap-3.5 p-5"
            >
              {inner}
            </a>
          ) : (
            <div key={c.title} className="card-dark flex items-start gap-3.5 p-5">{inner}</div>
          );
        })}
      </div>

      {/* Form + pitch */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Reveal as="div" className="card-dark p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold/12 text-gold">
              <Send size={17} aria-hidden />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold">Send a message</h3>
              <p className="text-sm text-muted">
                Have a project in mind, or just want to say hi? It lands straight in my inbox.
              </p>
            </div>
          </div>

          {state === "sent" ? (
            <div className="mt-8 flex flex-col items-center gap-3 rounded-theme border border-mineral/40 bg-mineral/8 py-12 text-center">
              <CheckCircle2 size={28} className="text-mineral" aria-hidden />
              <p className="font-display text-lg font-semibold">Message sent.</p>
              <p className="max-w-xs text-sm text-muted">
                Thanks for reaching out — I&apos;ll get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setState("idle")}
                className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-gold"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 grid gap-3.5">
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="sr-only" htmlFor="cf-name">Your name</label>
                <input id="cf-name" name="name" required maxLength={120} placeholder="Your name" className={inputCls} />
                <label className="sr-only" htmlFor="cf-email">Your email</label>
                <input id="cf-email" name="email" type="email" required maxLength={200} placeholder="Your email" className={inputCls} />
              </div>
              <label className="sr-only" htmlFor="cf-subject">Subject</label>
              <input id="cf-subject" name="subject" required maxLength={200} placeholder="Subject" className={inputCls} />
              <label className="sr-only" htmlFor="cf-message">Your message</label>
              <textarea id="cf-message" name="message" required maxLength={5000} rows={6} placeholder="Your message" className={`${inputCls} resize-y`} />
              {/* Honeypot — hidden from real users */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              {state === "error" && error && (
                <p role="alert" className="rounded-theme border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
                  {error}
                  {site.email && (
                    <>
                      {" "}
                      <a href={`mailto:${site.email}`} className="underline">
                        Email me directly →
                      </a>
                    </>
                  )}
                </p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={state === "sending"} className="btn-gold disabled:opacity-60">
                  {state === "sending" ? (
                    <>
                      <Loader2 size={15} className="animate-spin" aria-hidden /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <Send size={15} aria-hidden />
                    </>
                  )}
                </button>
                <p className="flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted">
                  <Lock size={12} aria-hidden /> Your information is never shared.
                </p>
              </div>
            </form>
          )}
        </Reveal>

        <Reveal as="div" className="card-dark flex flex-col justify-center gap-6 p-6 sm:p-8">
          <div>
            <h3 className="font-display text-lg font-semibold">Let&apos;s work together.</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              I enjoy working on challenging problems that create real impact —
              whether that&apos;s a full-time role, a freelance project or a
              technical consultation.
            </p>
          </div>
          <ul className="flex flex-col gap-4">
            {[
              ["Direct communication", "Requirements, scope and demos — handled directly in English."],
              ["Confidential", "Your ideas and information stay safe with me."],
              ["End-to-end ownership", "From database schema to deployment and post-launch support."],
            ].map(([t, b]) => (
              <li key={t} className="flex gap-3">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-mineral" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">{t}</p>
                  <p className="mt-0.5 text-[0.82rem] leading-relaxed text-muted">{b}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="flex items-center gap-2 border-t border-line pt-5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-mineral">
            <span className="node-pulse h-1.5 w-1.5 rounded-full bg-mineral" aria-hidden />
            {site.availability}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
