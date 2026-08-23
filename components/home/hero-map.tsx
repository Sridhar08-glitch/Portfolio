"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Constraint } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type MiniProject = { id: string; title: string };

/**
 * The hero centrepiece: seven engineering constraints converging on one hub.
 * Hovering or focusing a constraint highlights its line and reveals the systems
 * built under it. Connectors are drawn in a percentage-based SVG so they stay
 * aligned to the evenly-spaced rows at any width. Keyboard accessible; on small
 * screens it degrades to a simple list with the same reveal.
 */
export function HeroMap({
  constraints,
  groups,
  total,
}: {
  constraints: Constraint[];
  groups: Record<string, MiniProject[]>;
  total: number;
}) {
  const [active, setActive] = useState<string | null>(null);
  const n = constraints.length;
  const activeProjects = active ? groups[active] ?? [] : [];

  return (
    <div className="panel overflow-hidden">
      <div className="relative grid gap-0 md:grid-cols-[1.1fr_1fr]">
        {/* Left: constraints + connectors */}
        <div className="relative p-5 sm:p-7">
          {/* connector layer */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {constraints.map((c, i) => {
              const y = ((i + 0.5) / n) * 100;
              const on = active === c.key;
              return (
                <line
                  key={c.key}
                  x1="6"
                  y1={y}
                  x2="100"
                  y2="50"
                  stroke={on ? "rgb(var(--c-mineral))" : "rgb(var(--c-line))"}
                  strokeWidth={on ? 0.8 : 0.4}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          <p className="label relative">Constraints</p>
          <ul className="relative mt-3 flex flex-col">
            {constraints.map((c) => {
              const on = active === c.key;
              const count = groups[c.key]?.length ?? 0;
              return (
                <li key={c.key}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(c.key)}
                    onFocus={() => setActive(c.key)}
                    onMouseLeave={() => setActive(null)}
                    onBlur={() => setActive(null)}
                    aria-pressed={on}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-theme px-3 py-2.5 text-left transition-colors",
                      on ? "bg-mineral on-dark" : "hover:bg-surface",
                    )}
                  >
                    <span className="font-display text-lg sm:text-xl">{c.label}</span>
                    <span
                      className={cn(
                        "font-mono text-[0.68rem]",
                        on ? "opacity-80" : "text-muted",
                      )}
                    >
                      {count} {count === 1 ? "system" : "systems"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: hub + reveal */}
        <div className="relative flex flex-col justify-center border-t border-line bg-surface p-5 sm:p-7 md:border-l md:border-t-0">
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 rounded-theme bg-mineral px-4 py-2 font-display text-base on-dark">
              Systems I build
            </span>
            <p className="mt-2 font-mono text-xs text-muted">
              {total} projects across {n} kinds of constraint
            </p>
          </div>

          <div className="min-h-[9.5rem] rounded-theme border border-line bg-panel p-4">
            {active ? (
              <>
                <p className="text-sm text-muted">
                  {constraints.find((c) => c.key === active)?.blurb}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {activeProjects.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/work/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-theme border border-line bg-surface px-2.5 py-1 font-mono text-[0.72rem] hover:border-mineral hover:text-mineral"
                      >
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="flex h-full items-center text-sm text-muted">
                Hover a constraint to see the systems built around it — from DNS
                security to offline sync to self-hosted AI.
              </p>
            )}
          </div>

          <Link
            href="/work"
            className="mt-4 inline-flex items-center gap-2 self-start font-mono text-sm text-mineral hover:gap-3"
          >
            Explore all work <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
