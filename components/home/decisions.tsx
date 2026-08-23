"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Decision, Project } from "@/lib/schemas";
import { cn } from "@/lib/utils";

/**
 * Engineering decisions — the section written for CTOs and senior engineers.
 * Each question expands to the reasoning and the trade-off, with links to the
 * projects where the decision was actually made.
 */
export function Decisions({
  decisions,
  projectTitles,
}: {
  decisions: Decision[];
  projectTitles: Record<string, string>;
}) {
  const [open, setOpen] = useState<string | null>(decisions[0]?.id ?? null);

  return (
    <ul className="mt-8 divide-y divide-line border-y border-line">
      {decisions.map((d) => {
        const isOpen = open === d.id;
        return (
          <li key={d.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : d.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-display text-xl sm:text-2xl">{d.question}</span>
                <Plus
                  size={20}
                  aria-hidden
                  className={cn(
                    "shrink-0 text-mineral transition-transform ease-systems",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all ease-systems",
                isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl text-[1.02rem] leading-relaxed text-muted">
                  {d.answer}
                </p>
                {d.projects.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {d.projects.map((pid) => (
                      <li key={pid}>
                        <Link
                          href={`/work/${pid}`}
                          className="rounded-theme border border-line px-2.5 py-1 font-mono text-[0.72rem] hover:border-mineral hover:text-mineral"
                        >
                          {projectTitles[pid] ?? pid}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export type { Decision, Project };
