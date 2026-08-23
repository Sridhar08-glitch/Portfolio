"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import type { Constraint } from "@/lib/schemas";
import { CONSTRAINT_COLORS } from "@/lib/theme";
import { useMotionEnabled } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * The hero's animated radial hub — seven constraint nodes wired to a central
 * "SYSTEMS I BUILD" core. Dotted connectors flow toward the core, nodes pulse,
 * and hovering/focusing a card lights its path. Clicking filters the work index.
 * On small screens it degrades to a tidy 2-column grid (no SVG).
 */

const ICONS: Record<string, React.ElementType> = {
  security: ShieldCheck,
  enterprise: Building2,
  offline: HardDrive,
  realtime: Zap,
  "ai-ml": Brain,
  mobile: Smartphone,
  commerce: ShoppingCart,
};

const SUBS: Record<string, string> = {
  security: "DNS · VPN · Filtering · Threat detection",
  enterprise: "ERP · Event sourcing · Multi-tenancy",
  offline: "Local-first · Sync · Conflict resolution",
  realtime: "WebSockets · Notifications · Live ops",
  "ai-ml": "OCR · Document intelligence · Vision",
  mobile: "Flutter · React Native · Kotlin",
  commerce: "Payments · Orders · Inventory",
};

/** Desktop geometry (percent). Anchor = where the connector meets the card. */
const LAYOUT: Record<
  string,
  { style: React.CSSProperties; anchor: [number, number] }
> = {
  security: { style: { left: 0, top: "4%", width: "30%" }, anchor: [28, 12] },
  enterprise: { style: { left: 0, top: "36%", width: "30%" }, anchor: [28, 44] },
  offline: { style: { left: 0, top: "68%", width: "30%" }, anchor: [28, 76] },
  realtime: { style: { right: 0, top: "4%", width: "30%" }, anchor: [72, 12] },
  "ai-ml": { style: { right: 0, top: "36%", width: "30%" }, anchor: [72, 44] },
  mobile: { style: { right: 0, top: "68%", width: "30%" }, anchor: [72, 76] },
  commerce: {
    style: { left: "50%", bottom: 0, width: "30%", transform: "translateX(-50%)" },
    anchor: [50, 88],
  },
};

const CENTER: [number, number] = [50, 44];
/** Core-ring radii in viewBox units (the circle is ~176px in a ~700×560 box). */
const RING: [number, number] = [14, 17];

/** Point on the ring edge in the direction of the anchor — connectors plug in
 *  here instead of vanishing under the circle, so the flow visibly arrives. */
function ringPoint(anchor: [number, number]): [number, number] {
  const [ax, ay] = anchor;
  const [cx, cy] = CENTER;
  const dx = ax - cx;
  const dy = ay - cy;
  const s = 1 / Math.sqrt((dx / RING[0]) ** 2 + (dy / RING[1]) ** 2 || 1);
  return [cx + dx * s, cy + dy * s];
}

function pathFor(anchor: [number, number]): string {
  const [ax, ay] = anchor;
  const [ex, ey] = ringPoint(anchor);
  const mx = (ax + ex) / 2;
  return `M ${ax} ${ay} Q ${mx} ${ay} ${ex} ${ey}`;
}

export function SystemsHub({
  constraints,
  counts,
  total,
}: {
  constraints: Constraint[];
  counts: Record<string, number>;
  total: number;
}) {
  const enabled = useMotionEnabled();
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);

  const card = (c: Constraint, positioned: boolean, index = 0) => {
    const Icon = ICONS[c.key] ?? Zap;
    const color = CONSTRAINT_COLORS[c.key] ?? "#3AA189";
    const on = active === c.key;
    const layout = LAYOUT[c.key];
    // Positioning lives on a plain wrapper so Framer's animated transform on
    // the button never fights the layout translate (e.g. Commerce centering).
    const button = (
      <motion.button
        type="button"
        onMouseEnter={() => setActive(c.key)}
        onMouseLeave={() => setActive(null)}
        onFocus={() => setActive(c.key)}
        onBlur={() => setActive(null)}
        onClick={() => router.push(`/work?c=${c.key}`)}
        aria-label={`${c.label} — ${counts[c.key] ?? 0} systems. View projects.`}
        className="group w-full rounded-theme border p-3 text-left backdrop-blur-sm transition-colors sm:p-3.5"
        style={{
          borderColor: on ? color : `${color}44`,
          background: on ? `${color}1e` : "rgb(var(--c-panel) / 0.82)",
          boxShadow: on ? `0 0 28px -6px ${color}66` : undefined,
        }}
        initial={enabled ? { opacity: 0, scale: 0.9, y: 12 } : false}
        whileInView={enabled ? { opacity: 1, scale: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 160, damping: 19 }}
      >
        <span className="flex items-center gap-3">
          <span
            className="float-y grid h-12 w-12 shrink-0 place-items-center rounded-xl border transition-transform group-hover:scale-110"
            style={{
              background: `${color}1e`,
              borderColor: `${color}66`,
              color,
              boxShadow: `0 0 20px -6px ${color}88`,
              animationDelay: `${index * 0.4}s`,
            }}
          >
            <Icon size={24} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block whitespace-nowrap font-display text-[0.82rem] font-bold uppercase tracking-[0.08em]">
              {c.label}
            </span>
            <span className="mt-1 block truncate font-mono text-[0.6rem] text-muted">
              {SUBS[c.key] ?? c.blurb}
            </span>
          </span>
          <span
            className="hidden shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.62rem] font-bold lg:block"
            style={{ background: `${color}22`, color }}
          >
            {counts[c.key] ?? 0}
          </span>
        </span>
      </motion.button>
    );
    if (!positioned) return <div key={c.key}>{button}</div>;
    return (
      <div key={c.key} className="absolute" style={layout.style}>
        {button}
      </div>
    );
  };

  return (
    <div>
      {/* Desktop: radial composition */}
      <div className="relative hidden h-[560px] md:block" role="group" aria-label="Engineering constraints">
        {/* connector layer */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {constraints.map((c, i) => {
            const color = CONSTRAINT_COLORS[c.key] ?? "#3AA189";
            const on = active === c.key;
            const anchor = LAYOUT[c.key].anchor;
            const [ex, ey] = ringPoint(anchor);
            const d = pathFor(anchor);
            return (
              <g key={c.key}>
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeOpacity={on ? 0.95 : 0.5}
                  strokeWidth={on ? 1.8 : 1.2}
                  vectorEffect="non-scaling-stroke"
                  className="dash-flow"
                />
                {/* departure node at the card */}
                <circle
                  cx={anchor[0]}
                  cy={anchor[1]}
                  r={on ? 1.1 : 0.7}
                  fill={color}
                  className="node-pulse"
                />
                {/* arrival node where the connector plugs into the core ring */}
                <circle cx={ex} cy={ey} r={on ? 1 : 0.65} fill={color} />
                {/* energy dot travelling the path into the core (reference look) */}
                <circle
                  r={on ? 1.2 : 0.9}
                  fill={color}
                  className="anim-dot"
                  style={{ filter: `drop-shadow(0 0 3px ${color})` }}
                >
                  <animateMotion
                    dur={`${2.6 + (i % 3) * 0.5}s`}
                    begin={`${i * 0.45}s`}
                    repeatCount="indefinite"
                    path={d}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* center core */}
        <div
          className="absolute"
          style={{ left: "50%", top: "44%", transform: "translate(-50%, -50%)" }}
        >
          <div className="core-glow relative grid h-44 w-44 place-items-center rounded-full border border-gold/40 bg-panel/90">
            {/* outer orbit — slow, with colored markers (reference look) */}
            <svg
              className="orbit-spin absolute inset-[-22px] h-[calc(100%+44px)] w-[calc(100%+44px)]"
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke="rgb(var(--c-gold) / 0.45)"
                strokeWidth="0.6"
                strokeDasharray="1 6"
              />
              <circle cx="50" cy="2" r="1.7" fill="#C9A057" />
              <circle cx="91.5" cy="74" r="1.3" fill="#3AA189" />
              <circle cx="8.5" cy="74" r="1.3" fill="#C05B3F" />
            </svg>
            {/* inner orbit — counter-phase, tighter */}
            <svg
              className="orbit-spin absolute inset-[-8px] h-[calc(100%+16px)] w-[calc(100%+16px)]"
              style={{ animationDuration: "26s", animationDirection: "reverse" }}
              viewBox="0 0 100 100"
              aria-hidden
            >
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke="rgb(var(--c-mineral) / 0.4)"
                strokeWidth="0.5"
                strokeDasharray="0.8 5"
              />
              <circle cx="98" cy="50" r="1.2" fill="#4BA47B" />
              <circle cx="2" cy="50" r="1" fill="#A99A45" />
            </svg>
            <div className="text-center">
              <p className="font-display text-base font-bold uppercase leading-tight tracking-[0.14em]">
                Systems<br />I build
              </p>
              <p className="mt-1.5 font-mono text-[0.62rem] text-muted">
                {total} projects · {constraints.length} domains
              </p>
            </div>
          </div>
        </div>

        {constraints.map((c, i) => card(c, true, i))}
      </div>

      {/* Mobile: compact grid */}
      <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 md:hidden" role="group" aria-label="Engineering constraints">
        {constraints.map((c, i) => card(c, false, i))}
      </div>
    </div>
  );
}
