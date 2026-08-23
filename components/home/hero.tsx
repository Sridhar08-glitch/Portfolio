"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin } from "lucide-react";
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

export function Hero({
  site,
  counts,
  total,
}: {
  site: Site;
  counts: Record<string, number>;
  total: number;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* engineered backdrop: grid + gold aura */}
      <div className="grid-field pointer-events-none absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[540px] w-[820px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--c-mineral) / 0.16), rgb(var(--c-gold) / 0.05) 55%, transparent)",
        }}
      />

      <div className="shell relative grid items-center gap-12 pb-14 pt-14 lg:grid-cols-[1.05fr_1.2fr] lg:gap-6 lg:pb-20 lg:pt-20">
        {/* Left — statement */}
        <div>
          <Rise delay={0}>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-mineral/40 bg-mineral/10 px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-mineral">
              <span className="node-pulse h-1.5 w-1.5 rounded-full bg-mineral" aria-hidden />
              Senior Backend Developer · {site.location}
            </p>
          </Rise>

          <Rise delay={0.08}>
            <h1 className="serif mt-7 text-[2.9rem] leading-[1.06] sm:text-6xl lg:text-[4.2rem]">
              I build software
              <br />
              around{" "}
              <em
                className="bg-clip-text italic text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
                }}
              >
                constraints.
              </em>
            </h1>
          </Rise>

          <Rise delay={0.16}>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-muted">
              {site.heroSupport}
            </p>
          </Rise>

          <Rise delay={0.24} className="mt-8 flex flex-wrap gap-3">
            <Cta href="/#systems">Explore the systems</Cta>
            {site.email && (
              <Cta href={`mailto:${site.email}`} variant="ghost" external>
                Get in touch
              </Cta>
            )}
            <Cta href="/resume/Sridhar_Mahalingam_Resume.pdf" variant="ghost" external>
              View resume ↓
            </Cta>
          </Rise>

          {/* Who I am · where I am */}
          <Rise delay={0.32}>
            <div className="card-dark mt-10 flex max-w-xl items-center gap-5 p-5">
              <Image
                src="/images/portrait-studio.png"
                alt="Sridhar Mahalingam"
                width={88}
                height={112}
                className="h-28 w-[88px] shrink-0 rounded-theme border border-gold/40 object-cover object-top"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-display text-lg font-semibold">
                  {site.name}
                  <BadgeCheck size={16} className="shrink-0 text-mineral" aria-hidden />
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  Senior Backend Developer at Holora Performance — 3+ years of
                  shipping production systems end to end as the sole technical owner.
                </p>
                <p className="mt-2 flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-gold">
                  <MapPin size={12} aria-hidden /> {site.location} · transferable visa · NOC available
                </p>
              </div>
            </div>
          </Rise>
        </div>

        {/* Right — the animated hub */}
        <Rise delay={0.2}>
          <SystemsHub constraints={site.constraints} counts={counts} total={total} />
        </Rise>
      </div>
    </section>
  );
}
