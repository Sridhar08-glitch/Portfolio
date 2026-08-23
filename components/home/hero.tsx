"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Building2,
  HardDrive,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Zap,
} from "lucide-react";
import type { Site } from "@/lib/schemas";
import { CONSTRAINT_COLORS } from "@/lib/theme";
import { Cta } from "@/components/ui/primitives";
import { useMotionEnabled } from "@/components/ui/reveal";
import { SystemsHub } from "./systems-hub";

const EASE: [number, number, number, number] = [0.22, 0.68, 0, 1];
const ICONS: Record<string, React.ElementType> = {
  security: ShieldCheck,
  enterprise: Building2,
  offline: HardDrive,
  realtime: Zap,
  "ai-ml": Brain,
  mobile: Smartphone,
  commerce: ShoppingCart,
};

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

      <div className="shell relative grid items-center gap-12 pb-14 pt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-8 lg:pb-20 lg:pt-20">
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
            <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-muted">
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

          <Rise delay={0.32}>
            <ul className="mt-10 grid max-w-md grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-7 lg:max-w-none">
              {site.constraints.map((c) => {
                const Icon = ICONS[c.key] ?? Zap;
                const color = CONSTRAINT_COLORS[c.key] ?? "#3AA189";
                return (
                  <li key={c.key} className="flex flex-col items-center gap-2 text-center">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-lg border transition-transform hover:-translate-y-1"
                      style={{ borderColor: `${color}55`, color }}
                    >
                      <Icon size={17} aria-hidden />
                    </span>
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted">
                      {c.label}
                    </span>
                  </li>
                );
              })}
            </ul>
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
