"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RotateCw, ShieldCheck, ShieldX } from "lucide-react";
import type { DiagramStage } from "@/lib/schemas";
import { useMotionEnabled } from "@/components/ui/reveal";
import { stageIcon } from "./stage-icon";
import { cn } from "@/lib/utils";

/**
 * The portfolio's single signature interaction. A sample DNS request descends
 * the ShieldDNS pipeline; each stage activates in turn and the request resolves
 * to ALLOW or BLOCK. It plays once on scroll-in (no loop, no timers — a single
 * declarative Framer sequence) and is replayable by the user, which also shows
 * the "most requests exit early" path. Fully static under reduced motion.
 */

const EASE: [number, number, number, number] = [0.22, 0.68, 0, 1];
const STEP = 0.42;

type Run = { domain: string; exit: number; outcome: "allow" | "block"; note: string };

const RUNS: Run[] = [
  {
    domain: "tracker.ads.example",
    exit: 5,
    outcome: "block",
    note: "No early match — descends to the authoritative Patricia trie, matches a blocklist entry, blocked.",
  },
  {
    domain: "images.wikipedia.org",
    exit: 2,
    outcome: "allow",
    note: "Seen recently — answered from the LFU hot cache without a full match. The common case is nearly free.",
  },
];

export function ShieldFunnel({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  const enabled = useMotionEnabled();
  const [runIndex, setRunIndex] = useState(0);
  const run = RUNS[runIndex % RUNS.length];
  // Pipeline = every stage except the final "verdict" stage from content.
  const flow = stages.slice(0, -1);

  return (
    <figure>
      <div className="relative overflow-hidden rounded-theme border border-line bg-panel p-5 sm:p-8">
        <div className="grid-field pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative flex items-center justify-between gap-4">
          <p className="label">Live request · {run.domain}</p>
          <button
            type="button"
            onClick={() => setRunIndex((i) => i + 1)}
            className="inline-flex items-center gap-1.5 rounded-theme border border-line bg-surface px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors hover:bg-mineral hover:on-dark"
          >
            <RotateCw size={12} /> Run again
          </button>
        </div>

        <ol
          key={enabled ? runIndex : "static"}
          className="relative mt-6 flex flex-col items-stretch gap-0"
        >
          {flow.map((stage, i) => {
            const active = i <= run.exit;
            const isExit = i === run.exit;
            const delay = i * STEP;
            const Icon = stageIcon(stage.id, stage.label);
            return (
              <li key={stage.id} className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "w-full max-w-md rounded-theme border px-4 py-2.5 transition-colors",
                    active
                      ? "border-mineral bg-surface"
                      : "border-dashed border-muted/40 bg-transparent",
                  )}
                  initial={enabled ? { opacity: 0.25, y: 8 } : false}
                  whileInView={
                    enabled ? { opacity: active ? 1 : 0.4, y: 0 } : undefined
                  }
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.4, ease: EASE, delay }}
                >
                  <div className="flex items-center gap-3">
                    <motion.span
                      aria-hidden
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-lg border",
                        active
                          ? "border-mineral/60 bg-mineral/15 text-mineral shadow-[0_0_16px_-4px_rgb(var(--c-mineral)/0.6)]"
                          : "border-line text-muted/60",
                      )}
                      initial={enabled ? { scale: 0.6 } : false}
                      whileInView={enabled ? { scale: isExit ? 1.15 : 1 } : undefined}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, ease: EASE, delay: delay + 0.1 }}
                    >
                      <Icon size={17} />
                    </motion.span>
                    <span className="flex-1 text-left font-mono text-xs font-medium sm:text-sm">
                      {stage.label}
                    </span>
                  </div>
                  {stage.detail && (
                    <p className="mt-1 pl-12 text-[0.72rem] text-muted">{stage.detail}</p>
                  )}
                  {isExit && (
                    <span className="mt-1 inline-block pl-12 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-clay">
                      request exits here
                    </span>
                  )}
                </motion.div>

                {i < flow.length - 1 && (
                  <motion.span
                    aria-hidden
                    className={cn(
                      "my-1 block w-px",
                      active && i < run.exit ? "bg-mineral" : "bg-line",
                    )}
                    style={{ height: 22, transformOrigin: "top" }}
                    initial={enabled ? { scaleY: 0 } : false}
                    whileInView={enabled ? { scaleY: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, ease: EASE, delay: delay + 0.2 }}
                  />
                )}
              </li>
            );
          })}

          {/* Verdict */}
          <motion.li
            className="mt-3 flex justify-center"
            initial={enabled ? { opacity: 0, y: 10 } : false}
            whileInView={enabled ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: EASE,
              delay: (run.exit + 1) * STEP,
            }}
          >
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-theme px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.14em] on-dark",
                run.outcome === "block" ? "bg-clay" : "bg-mineral",
              )}
            >
              {run.outcome === "block" ? (
                <>
                  <ShieldX size={18} /> Block
                </>
              ) : (
                <>
                  <ShieldCheck size={18} /> Allow
                </>
              )}
            </span>
          </motion.li>
        </ol>

        <p className="relative mt-5 max-w-md text-sm text-muted">{run.note}</p>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
