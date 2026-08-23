"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Decision, Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Engineering decisions — terminal-prompt accordion for CTOs and senior
 * engineers. Each question expands to the reasoning, trade-off and the projects
 * where the decision was actually made.
 */
export function Decisions({
  decisions,
  projectTitles,
}: {
  decisions: Decision[];
  projectTitles: Record<string, string>;
}) {
  const [open, setOpen] = useState<string | null>(decisions[0]?.id ?? null);
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Filter chips — every project that actually has a decision attached.
  const projectIds = Array.from(new Set(decisions.flatMap((d) => d.projects)));
  const shown =
    projectFilter === "all"
      ? decisions
      : decisions.filter((d) => d.projects.includes(projectFilter));

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter decisions by project">
        <button
          type="button"
          onClick={() => setProjectFilter("all")}
          aria-pressed={projectFilter === "all"}
          className={cn(
            "rounded-theme border px-3 py-1.5 font-mono text-[0.7rem] transition-colors",
            projectFilter === "all"
              ? "border-mineral/60 bg-mineral/10 text-mineral"
              : "border-line text-muted hover:text-ink",
          )}
        >
          All decisions · {decisions.length}
        </button>
        {projectIds.map((pid) => {
          const active = projectFilter === pid;
          const count = decisions.filter((d) => d.projects.includes(pid)).length;
          return (
            <button
              key={pid}
              type="button"
              onClick={() => setProjectFilter(active ? "all" : pid)}
              aria-pressed={active}
              className={cn(
                "rounded-theme border px-3 py-1.5 font-mono text-[0.7rem] transition-colors",
                active
                  ? "border-mineral/60 bg-mineral/10 text-mineral"
                  : "border-line text-muted hover:text-ink",
              )}
            >
              {projectTitles[pid] ?? pid} · {count}
            </button>
          );
        })}
      </div>
      <DecisionList
        decisions={shown}
        projectTitles={projectTitles}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

function DecisionList({
  decisions,
  projectTitles,
  open,
  setOpen,
}: {
  decisions: Decision[];
  projectTitles: Record<string, string>;
  open: string | null;
  setOpen: (id: string | null) => void;
}) {
  return (
    <ul className="mt-5 overflow-hidden rounded-theme border border-line bg-panel/50">
      {decisions.map((d, i) => {
        const isOpen = open === d.id;
        return (
          <li key={d.id} className={cn(i > 0 && "border-t border-line")}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : d.id)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors sm:px-7",
                  isOpen ? "bg-mineral/5" : "hover:bg-ink/[0.03]",
                )}
              >
                <span className="flex min-w-0 items-baseline gap-3 font-mono text-[0.95rem] sm:text-base">
                  <span aria-hidden className="shrink-0 text-gold">$</span>
                  <span className={cn("truncate", isOpen ? "text-ink" : "text-muted")}>
                    {d.question}
                  </span>
                </span>
                <Plus
                  size={17}
                  aria-hidden
                  className={cn(
                    "shrink-0 text-gold transition-transform duration-300 ease-systems",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300 ease-systems",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t border-line/60 px-5 py-5 sm:px-7">
                  <p className="max-w-3xl leading-relaxed text-muted">{d.answer}</p>
                  {d.projects.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {d.projects.map((pid) => (
                        <li key={pid}>
                          <Link
                            href={`/work/${pid}`}
                            className="rounded-theme border border-line px-2.5 py-1 font-mono text-[0.7rem] text-muted transition-colors hover:border-gold hover:text-gold"
                          >
                            {projectTitles[pid] ?? pid}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const PRINCIPLES: { icon: string; title: string; body: string }[] = [
  { icon: "◎", title: "Start with constraints", body: "Understand the real constraints before choosing a solution." },
  { icon: "⚖", title: "Evaluate trade-offs", body: "No solution is perfect. Trade-offs are inevitable — name them." },
  { icon: "◇", title: "Prefer simplicity", body: "Simple to operate, simple to understand, simple to evolve." },
  { icon: "🛡", title: "Security by default", body: "Security is not a feature, it's a foundation." },
  { icon: "↗", title: "Own it end to end", body: "From schema to deployment — sole-owner delivery, no hand-offs." },
];

export function DecisionPrinciples() {
  return (
    <div className="mt-10 rounded-theme border border-line bg-panel/40 p-6 sm:p-8">
      <p className="text-center font-display text-lg font-semibold text-gold">
        Decision-making principles
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {PRINCIPLES.map((p) => (
          <li key={p.title} className="rounded-theme border border-line/70 bg-surface/40 p-4 text-center">
            <span aria-hidden className="text-xl text-mineral">{p.icon}</span>
            <p className="mt-2 font-display text-[0.85rem] font-semibold">{p.title}</p>
            <p className="mt-1.5 text-[0.74rem] leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type { Decision, Project };
