"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GraduationCap, Languages, MapPin, Rocket } from "lucide-react";
import type { Site } from "@/lib/schemas";
import { Cta } from "@/components/ui/primitives";
import { useMotionEnabled } from "@/components/ui/reveal";
import { SystemsHub } from "./systems-hub";

const EASE: [number, number, number, number] = [0.22, 0.68, 0, 1];

function Rise({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const enabled = useMotionEnabled();
  if (!enabled) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Quick personal facts — every one straight from the resume. */
const FACTS: { icon: React.ElementType; label: string }[] = [
  { icon: GraduationCap, label: "B.Tech · Anna University" },
  { icon: Languages, label: "English · Tamil" },
  { icon: Rocket, label: "Clients in UK · Qatar · India" },
];

export function Hero({
  site,
  counts,
  total,
}: {
  site: Site;
  counts: Record<string, number>;
  total: number;
}) {
  const firstName = site.name.split(" ")[0];
  return (
    <section className="relative overflow-hidden">
      {/* engineered backdrop: grid + gold aura */}
      <div className="grid-field pointer-events-none absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/3 h-[540px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--c-mineral) / 0.16), rgb(var(--c-gold) / 0.05) 55%, transparent)",
        }}
      />

      <div className="shell relative grid items-center gap-12 pb-14 pt-12 lg:grid-cols-[1.1fr_1.15fr] lg:gap-8 lg:pb-20 lg:pt-16">
        {/* Left — a real introduction */}
        <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
          {/* Portrait with glow ring */}
          <Rise delay={0.05} className="justify-self-center sm:justify-self-start">
            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-full opacity-70 blur-2xl"
                style={{
                  background:
                    "radial-gradient(closest-side, rgb(var(--c-gold) / 0.35), transparent 70%)",
                }}
              />
              <div className="relative overflow-hidden rounded-2xl border-2 border-gold/50 shadow-[0_0_40px_-8px_rgb(var(--c-gold)/0.45)]">
                <Image
                  src="/images/portrait-formal.png"
                  alt="Sridhar Mahalingam"
                  width={280}
                  height={360}
                  priority
                  className="h-[320px] w-[240px] object-cover sm:h-[360px] sm:w-[280px]"
                  style={{ objectPosition: "32% 12%" }}
                />
              </div>
              <p className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/40 bg-surface/90 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-gold backdrop-blur">
                <MapPin size={11} aria-hidden /> {site.location}
              </p>
            </div>
          </Rise>

          <div>
            <Rise delay={0.08}>
              <h1 className="serif text-5xl leading-[1.04] sm:text-6xl">
                Hi, I&apos;m{" "}
                <em
                  className="bg-clip-text italic text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(100deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
                  }}
                >
                  {firstName}.
                </em>
              </h1>
            </Rise>

            <Rise delay={0.16}>
              <p className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-muted">
                A software engineer from Chennai, India — now building in Doha,
                Qatar. For the last three years I&apos;ve been the person a
                business hands a problem to and gets working software back:
                web, mobile, backend and the server it runs on.
              </p>
              <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed text-muted">
                By day I lead backend engineering at Holora Performance. The
                rest of the time I&apos;m training my own AI models, sharpening
                ShieldDNS, and chasing whatever hard problem refuses to let me
                sleep.
              </p>
            </Rise>

            <Rise delay={0.24} className="mt-6 flex flex-wrap gap-2">
              {FACTS.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-3.5 py-1.5 font-mono text-[0.66rem] text-muted"
                >
                  <f.icon size={13} className="text-gold" aria-hidden />
                  {f.label}
                </span>
              ))}
            </Rise>

            <Rise delay={0.32} className="mt-7 flex flex-wrap gap-3">
              {site.email && (
                <Cta href={`mailto:${site.email}`} external>
                  Let&apos;s connect
                </Cta>
              )}
              <Cta href="/resume/Sridhar_Mahalingam_Resume.pdf" variant="ghost" external>
                View resume ↓
              </Cta>
            </Rise>
          </div>
        </div>

        {/* Right — the animated hub */}
        <Rise delay={0.2}>
          <SystemsHub constraints={site.constraints} counts={counts} total={total} />
        </Rise>
      </div>
    </section>
  );
}
