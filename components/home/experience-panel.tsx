"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Quote } from "lucide-react";
import type { Experience } from "@/lib/schemas";
import { dateRange, cn } from "@/lib/utils";
import { TechIcon } from "@/lib/tech-icons";

/**
 * Reference-style career view: selectable timeline rail on the left, detail
 * panel on the right (summary, responsibilities, technologies). Data is the
 * real two-role history — client platforms were delivered under Techynova.
 */

/** Technologies surfaced per role, taken from the role's own bullet copy. */
const ROLE_TECH: Record<string, string[]> = {
  holora: [
    "Python", "Django REST Framework", "PostgreSQL", "Redis", "Celery",
    "PyTorch", "Tauri", "Nginx", "Linux",
  ],
  techynova: [
    "React.js", "Next.js", "Django", "MySQL", "Stripe", "AWS S3", "Nginx", "Linux",
  ],
};

export function ExperiencePanel({ experience }: { experience: Experience[] }) {
  const [activeId, setActiveId] = useState(experience[0]?.id);
  const active = experience.find((e) => e.id === activeId) ?? experience[0];
  if (!active) return null;

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(240px,1fr)_2.4fr]">
      {/* Timeline rail */}
      <div className="relative" role="tablist" aria-label="Roles">
        <span
          aria-hidden
          className="absolute bottom-6 left-[5px] top-6 hidden w-px bg-gradient-to-b from-mineral/70 via-line to-transparent lg:block"
        />
        <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {experience.map((job) => {
            const on = job.id === active.id;
            return (
              <button
                key={job.id}
                role="tab"
                aria-selected={on}
                onClick={() => setActiveId(job.id)}
                className={cn(
                  "relative min-w-[230px] shrink-0 rounded-theme border p-4 text-left transition-all lg:ml-6 lg:min-w-0",
                  on
                    ? "border-mineral/60 bg-mineral/10 shadow-[0_0_28px_-8px_rgb(var(--c-mineral)/0.45)]"
                    : "border-line bg-panel/60 hover:border-muted/40",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[27px] top-5 hidden h-[11px] w-[11px] rounded-full border-2 bg-surface lg:block",
                    on ? "border-mineral shadow-[0_0_10px_rgb(var(--c-mineral)/0.7)]" : "border-line",
                  )}
                />
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display text-[0.95rem] font-semibold">{job.company}</span>
                  {job.current && (
                    <span className="rounded-full border border-mineral/50 bg-mineral/15 px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-mineral">
                      Current
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-[0.82rem] text-muted">{job.role}</span>
                <span className="mt-1.5 block font-mono text-[0.62rem] text-muted/80">
                  {dateRange(job.start, job.end)} · {job.location}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div
        className="card-dark p-6 sm:p-8"
        style={{ "--glow": "rgb(var(--c-mineral) / 0.35)" } as React.CSSProperties}
        role="tabpanel"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl font-semibold">{active.company}</h3>
            <p className="mt-1 font-medium text-mineral">{active.role}</p>
            <p className="mt-1.5 flex items-center gap-2 font-mono text-xs text-muted">
              <MapPin size={12} aria-hidden /> {active.location} · {dateRange(active.start, active.end)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3 rounded-theme border border-line bg-surface/40 p-4">
          <Quote size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden />
          <p className="text-[0.95rem] leading-relaxed text-muted">{active.summary}</p>
        </div>

        <p className="label mt-7">Key responsibilities</p>
        <ul className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {active.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-[0.9rem] leading-relaxed">
              <CheckCircle2 size={15} className="mt-1 shrink-0 text-mineral" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {ROLE_TECH[active.id] && (
          <>
            <p className="label mt-7">Technologies used</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {ROLE_TECH[active.id].map((t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-theme border border-line bg-surface/50 px-2.5 py-1.5 font-mono text-[0.72rem]"
                >
                  <TechIcon name={t} size={13} className="text-muted" /> {t}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
