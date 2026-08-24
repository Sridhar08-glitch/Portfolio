"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  BrainCircuit,
  Boxes,
  Code2,
  Download,
  LockKeyhole,
  Mouse,
  Rocket,
  Users,
  CalendarDays,
  Globe2,
} from "lucide-react";
import type { Site } from "@/lib/schemas";
import { TechIcon } from "@/lib/tech-icons";
import { useMotionEnabled } from "@/components/ui/reveal";

const EASE: [number, number, number, number] = [0.22, 0.68, 0, 1];

/**
 * Very thin gold lines drifting like silk waves (reference bottom-right).
 * SMIL path morphs — cheap, GPU-friendly; rendered static under reduced motion.
 */
function GoldWaves() {
  const enabled = useMotionEnabled();
  const lines = [0, 1, 2, 3, 4];
  const d1 = (i: number) =>
    `M0 ${150 - i * 16} C 260 ${95 - i * 10}, 520 ${175 - i * 14}, 920 ${70 - i * 9}`;
  const d2 = (i: number) =>
    `M0 ${125 - i * 13} C 260 ${180 - i * 15}, 520 ${85 - i * 11}, 920 ${115 - i * 13}`;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute bottom-0 right-0 h-52 w-[62%] opacity-70"
      viewBox="0 0 920 200"
      preserveAspectRatio="none"
    >
      {lines.map((i) => (
        <path
          key={i}
          d={d1(i)}
          fill="none"
          stroke={i % 2 ? "rgb(var(--c-gold))" : "rgb(var(--c-clay))"}
          strokeOpacity={0.1 + i * 0.05}
          strokeWidth={0.8}
        >
          {enabled && (
            <animate
              attributeName="d"
              values={`${d1(i)};${d2(i)};${d1(i)}`}
              dur={`${8 + i * 1.6}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
            />
          )}
        </path>
      ))}
    </svg>
  );
}

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

const HERO_TECH = ["Python", "Django", "React", "PostgreSQL", "AWS S3"];

/** Floating capability cards on the arc — honest qualitative traits. */
const CAPS: { icon: React.ElementType; title: string; sub: string; offset: number }[] = [
  { icon: Code2, title: "Clean Code", sub: "Maintainable. Scalable.", offset: 8 },
  { icon: LockKeyhole, title: "Secure Systems", sub: "Security-first approach.", offset: -32 },
  { icon: BrainCircuit, title: "AI Integrated", sub: "Self-hosted & data-driven.", offset: -22 },
  { icon: Rocket, title: "Performance", sub: "Optimised for scale.", offset: 12 },
];

export function Hero({
  site,
  systems,
  clientPlatforms,
  domains,
}: {
  site: Site;
  systems: number;
  clientPlatforms: number;
  domains: number;
}) {
  const firstName = site.name.split(" ")[0];

  const stats: { icon: React.ElementType; value: string; label: string }[] = [
    { icon: Boxes, value: `${systems}`, label: "Systems built" },
    { icon: CalendarDays, value: "3+", label: "Years experience" },
    { icon: Users, value: `${clientPlatforms}`, label: "Client platforms live" },
    { icon: Globe2, value: `${domains}`, label: "Problem domains" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* backdrop: grid + copper wave glow bottom-right */}
      <div className="grid-field pointer-events-none absolute inset-0" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[720px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(var(--c-gold) / 0.35), rgb(var(--c-clay) / 0.12) 60%, transparent)",
        }}
      />

      <div className="shell relative grid items-center gap-10 pb-10 pt-10 lg:grid-cols-[1fr_1fr] lg:gap-4 lg:pb-14 lg:pt-6">
        {/* ------------------------------------------------------- left */}
        <div className="relative z-10 py-4 lg:py-10">
          <Rise delay={0}>
            <p className="flex items-center gap-3 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-gold">
              <Code2 size={15} aria-hidden />
              Full Stack Developer
              <span aria-hidden className="h-px w-16 bg-gold/50" />
            </p>
          </Rise>

          <Rise delay={0.08}>
            <h1 className="serif mt-6 text-6xl leading-[0.98] sm:text-7xl lg:text-[5.4rem]">
              Hi, I&apos;m
              <br />
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
            <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-muted">
              {site.heroSupport}{" "}
              <span className="text-gold">Built to create impact.</span>
            </p>
          </Rise>

          <Rise delay={0.22}>
            <ul className="mt-6 flex flex-wrap gap-2">
              {HERO_TECH.map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/70 px-4 py-2 font-mono text-[0.72rem]"
                >
                  <TechIcon name={t} size={15} />
                  {t.replace(" S3", "")}
                </li>
              ))}
            </ul>
          </Rise>

          <Rise delay={0.3} className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/work" className="btn-gold">
              View my work <ArrowUpRight size={16} aria-hidden />
            </Link>
            <Link
              href="/resume"
              className="inline-flex items-center gap-2 font-medium text-gold underline-offset-4 transition-colors hover:text-clay hover:underline"
            >
              <Download size={16} aria-hidden /> Download resume
            </Link>
          </Rise>

          {/* Stats bar — every number real and computed */}
          <Rise delay={0.38}>
            <dl className="card-dark mt-9 grid max-w-2xl grid-cols-2 divide-line/70 sm:grid-cols-4 sm:divide-x">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-4 py-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold">
                    <s.icon size={16} aria-hidden />
                  </span>
                  <div>
                    <dd className="font-display text-xl font-bold leading-none">{s.value}</dd>
                    <dt className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-muted">
                      {s.label}
                    </dt>
                  </div>
                </div>
              ))}
            </dl>
          </Rise>

          <Rise delay={0.46}>
            <p className="mt-9 hidden items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-muted lg:flex">
              <Mouse size={15} aria-hidden className="text-gold" />
              Scroll to explore
            </p>
          </Rise>
        </div>

        {/* ------------------------------------------------------ right */}
        <div className="relative h-[420px] sm:h-[520px] lg:h-[640px]">
          {/* curved golden-lines bar — its own element with room to breathe */}
          <div
            aria-hidden
            className="absolute -right-2 top-0 hidden h-[68%] w-[20%] opacity-45 lg:block"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgb(var(--c-gold) / 0.75) 0 1.5px, transparent 1.5px 9px)",
              clipPath: "ellipse(100% 100% at 100% 0%)",
              maskImage:
                "linear-gradient(to bottom, black 45%, transparent 96%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 45%, transparent 96%)",
            }}
          />

          {/* the composed portrait — shifted left of the bar, deeply feathered
              so it melts into the canvas with no visible frame */}
          <Rise delay={0.15} className="absolute inset-y-0 left-0 right-[3%]">
            <Image
              src="/images/hero-composite.png"
              alt="Sridhar Mahalingam"
              fill
              priority
              quality={95}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-top"
              style={{
                maskImage:
                  "radial-gradient(105% 100% at 48% 40%, black 45%, transparent 87%)",
                WebkitMaskImage:
                  "radial-gradient(105% 100% at 48% 40%, black 45%, transparent 87%)",
              }}
            />
          </Rise>

          {/* curved dotted guide — bulges around the subject like the reference */}
          <svg
            aria-hidden
            className="pointer-events-none absolute -right-2 top-1/2 hidden h-[92%] w-48 -translate-y-1/2 overflow-visible lg:block"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
          >
            <path
              d="M 62 -10 Q -55 200 62 410"
              fill="none"
              stroke="rgb(var(--c-gold) / 0.5)"
              strokeWidth="1.2"
              strokeDasharray="2 7"
              vectorEffect="non-scaling-stroke"
              className="dash-flow"
            />
            {[60, 160, 250, 345].map((y, i) => (
              <circle
                key={i}
                cx={[30, 6, 8, 34][i]}
                cy={y}
                r="2.4"
                fill="rgb(var(--c-gold))"
                className="node-pulse"
              />
            ))}
          </svg>

          {/* floating capability cards — hugging the curve */}
          <div className="absolute inset-y-0 right-0 z-10 hidden flex-col justify-center gap-5 lg:flex">
            {CAPS.map((c, i) => (
              <Rise key={c.title} delay={0.35 + i * 0.12}>
                <div
                  className="card-dark float-y flex w-60 items-center gap-3.5 p-4 backdrop-blur-sm"
                  style={{
                    transform: `translateX(${c.offset}px)`,
                    animationDelay: `${i * 0.5}s`,
                    "--glow": "rgb(var(--c-gold) / 0.4)",
                  } as React.CSSProperties}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-gold">
                    <c.icon size={18} aria-hidden />
                  </span>
                  <div>
                    <p className="font-display text-[0.9rem] font-semibold">{c.title}</p>
                    <p className="mt-0.5 text-[0.7rem] text-muted">{c.sub}</p>
                  </div>
                </div>
              </Rise>
            ))}
          </div>

          {/* capability chips on small screens */}
          <div className="absolute inset-x-0 bottom-0 z-10 grid grid-cols-2 gap-2 lg:hidden">
            {CAPS.map((c) => (
              <div key={c.title} className="card-dark flex items-center gap-2.5 p-3 backdrop-blur-sm">
                <c.icon size={15} className="shrink-0 text-gold" aria-hidden />
                <p className="font-display text-[0.76rem] font-semibold">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll FAB */}
      <a
        href="#systems"
        aria-label="Scroll to systems"
        className="absolute bottom-6 right-8 z-10 hidden h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold transition-all hover:translate-y-1 hover:bg-gold/10 lg:grid"
      >
        <ArrowDown size={18} />
      </a>
    </section>
  );
}
