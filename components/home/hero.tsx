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
  { icon: Code2, title: "Clean Code", sub: "Maintainable. Scalable.", offset: 0 },
  { icon: LockKeyhole, title: "Secure Systems", sub: "Security-first approach.", offset: 26 },
  { icon: BrainCircuit, title: "AI Integrated", sub: "Self-hosted & data-driven.", offset: 18 },
  { icon: Rocket, title: "Performance", sub: "Optimised for scale.", offset: -10 },
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
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              I build secure, scalable and intelligent systems that solve
              real-world problems and{" "}
              <span className="text-gold">create impact.</span>
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
            <a
              href="/resume/Sridhar_Mahalingam_Resume.pdf"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 font-medium text-gold underline-offset-4 transition-colors hover:text-clay hover:underline"
            >
              <Download size={16} aria-hidden /> Download resume
            </a>
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
          {/* copper disc behind the subject */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[16%] h-[55%] aspect-square -translate-x-[62%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, rgb(var(--c-gold) / 0.75), rgb(var(--c-clay) / 0.55) 55%, rgb(var(--c-clay) / 0.25))",
            }}
          />
          {/* vertical line texture, right edge */}
          <div
            aria-hidden
            className="absolute right-0 top-[6%] h-[46%] w-[22%] opacity-25"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgb(var(--c-gold) / 0.6) 0 1px, transparent 1px 9px)",
              maskImage: "linear-gradient(to bottom, black 60%, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent)",
            }}
          />

          {/* portrait — blended, no container */}
          <Rise delay={0.15} className="absolute inset-x-0 bottom-0 flex justify-center lg:justify-center">
            <Image
              src="/images/portrait-mono.png"
              alt="Sridhar Mahalingam"
              width={720}
              height={900}
              priority
              quality={95}
              className="h-[420px] w-auto sm:h-[520px] lg:h-[620px]"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 82%, transparent 99%), linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 82%, transparent 99%)",
                maskComposite: "intersect",
              }}
            />
          </Rise>

          {/* dotted arc guiding the capability cards */}
          <svg
            aria-hidden
            className="pointer-events-none absolute -right-6 top-1/2 hidden h-[86%] w-40 -translate-y-1/2 lg:block"
            viewBox="0 0 100 400"
            preserveAspectRatio="none"
          >
            <path
              d="M 90 0 Q -30 200 90 400"
              fill="none"
              stroke="rgb(var(--c-gold) / 0.45)"
              strokeWidth="1.2"
              strokeDasharray="2 7"
              vectorEffect="non-scaling-stroke"
              className="dash-flow"
            />
            {[70, 170, 270, 360].map((y, i) => (
              <circle key={i} cx={i % 2 ? 22 : 34} cy={y} r="2.4" fill="rgb(var(--c-gold))" className="node-pulse" />
            ))}
          </svg>

          {/* floating capability cards */}
          <div className="absolute inset-y-0 right-0 z-10 hidden flex-col justify-center gap-5 lg:flex">
            {CAPS.map((c, i) => (
              <Rise key={c.title} delay={0.35 + i * 0.12}>
                <div
                  className="card-dark float-y flex w-60 items-center gap-3.5 p-4 backdrop-blur-sm"
                  style={{
                    transform: `translateX(${-c.offset}px)`,
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
