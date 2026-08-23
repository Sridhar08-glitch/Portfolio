import { RefreshCw, Radio, UserCheck, WifiOff } from "lucide-react";
import type { DiagramStage } from "@/lib/schemas";
import { DiagramFrame } from "./diagram-frame";
import { IconNode } from "./stage-icon";

/**
 * Icon-pipeline grammars — every project's architecture drawn with meaningful
 * icon nodes and animated connectors, in the project's accent colour. Each
 * grammar keeps a distinct topology so no two systems read the same.
 */

type P = { stages: DiagramStage[]; caption: string; color: string };

/** Animated dotted connector. */
function Flow({ vertical, color, length = 26 }: { vertical?: boolean; color: string; length?: number }) {
  const w = vertical ? 2 : length;
  const h = vertical ? length : 2;
  return (
    <svg width={w} height={h} className="shrink-0 self-center" aria-hidden>
      <line
        x1={vertical ? 1 : 0}
        y1={vertical ? 0 : 1}
        x2={vertical ? 1 : length}
        y2={vertical ? length : 1}
        stroke={color}
        strokeOpacity={0.65}
        strokeWidth={1.5}
        className="dash-flow"
      />
    </svg>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="rounded-full border px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em]"
      style={{ borderColor: `${color}55`, color, background: `${color}12` }}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------- stream (MeetingMind) */
export function StreamDiagram({ stages, caption, color }: P) {
  const pipe = stages.slice(0, 5);
  const hub = stages[5];
  const approve = stages[6];
  return (
    <DiagramFrame caption={caption} label="Asynchronous pipeline → event-sourced knowledge">
      <div className="flex flex-col gap-7">
        <div className="flex flex-wrap items-start justify-center gap-1.5 sm:flex-nowrap">
          {pipe.map((s, i) => (
            <div key={s.id} className="flex items-start gap-1.5">
              <IconNode id={s.id} label={s.label} color={color} />
              {i < pipe.length - 1 && <Flow color={color} length={22} />}
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {hub && (
            <div
              className="flex items-center gap-4 rounded-theme border p-4"
              style={{ borderColor: `${color}55`, background: `${color}10` }}
            >
              <IconNode id={hub.id} label="" color={color} filled />
              <div>
                <p className="font-mono text-xs font-semibold">{hub.label}</p>
                <p className="mt-1 text-[0.68rem] text-muted">
                  append-only · time-travel queries · conflict detection
                </p>
              </div>
            </div>
          )}
          {approve && (
            <div className="flex items-center gap-4 rounded-theme border border-dashed p-4" style={{ borderColor: `${color}66` }}>
              <UserCheck size={22} style={{ color }} aria-hidden className="shrink-0" />
              <div>
                <p className="font-mono text-xs font-semibold">{approve.label}</p>
                <p className="mt-1 text-[0.68rem] text-muted">
                  AI suggests with evidence — a person approves, edits or rejects
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DiagramFrame>
  );
}

/* ---------------------------------------------------- lattice (CommerceOS) */
export function LatticeDiagram({ stages, caption, color }: P) {
  const core = stages[0];
  const tenants = stages.slice(1);
  return (
    <DiagramFrame caption={caption} label="One engine · isolated tenants">
      <div className="flex flex-col items-center gap-0">
        {core && <IconNode id={core.id} label={core.label} color={color} filled />}
        <Flow vertical color={color} length={20} />
        <DistributionBus nodes={tenants} color={color} cols={4} />
        <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
          every tenant isolated at the query layer — one engine, zero data bleed
        </p>
      </div>
    </DiagramFrame>
  );
}

/* ----------------------------------------------- projection (No-Code ERP) */
export function ProjectionDiagram({ stages, caption, color }: P) {
  return (
    <DiagramFrame caption={caption} label="Command → event → projection">
      <div className="flex flex-wrap items-start justify-center gap-1.5">
        {stages.map((s, i) => (
          <div key={s.id} className="flex items-start gap-1.5">
            <IconNode
              id={s.id}
              label={s.label}
              color={color}
              filled={s.id === "state"}
              detail={s.id === "stream" ? "immutable · append-only" : undefined}
            />
            {i < stages.length - 1 && <Flow color={color} length={20} />}
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.12em]" style={{ color }}>
        <RefreshCw size={13} aria-hidden /> replay events → reconstruct any point in time
      </p>
    </DiagramFrame>
  );
}

/* ------------------------------------------- clusters (Construction ERP) */
export function ClustersDiagram({ stages, caption, color }: P) {
  const findStage = (id: string) => stages.find((s) => s.id === id);
  const sync = findStage("sync");
  const reconcile = findStage("reconcile");
  return (
    <DiagramFrame caption={caption} label="Two devices · no central server">
      <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
        {(["a", "b"] as const).map((side) => (
          <div
            key={side}
            className="rounded-theme border p-5"
            style={{ borderColor: `${color}40`, background: `${color}0a` }}
          >
            <p className="font-mono text-xs font-semibold">Device {side.toUpperCase()}</p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <IconNode id={`${side}-write`} label="Local write" color={color} />
              <IconNode id="state" label="On-device store" color={color} size="sm" />
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted">
              <WifiOff size={12} aria-hidden /> offline · fully productive
            </p>
          </div>
        ))}

        <div className="order-first flex flex-row items-center justify-center gap-3 md:order-none md:flex-col">
          {sync && <IconNode id="sync" label={sync.label} color={color} filled size="sm" />}
          <Flow vertical color={color} length={18} />
          {reconcile && (
            <IconNode id="reconcile" label={reconcile.label} color={color} size="sm" />
          )}
          <Chip color={color}>peer-to-peer</Chip>
        </div>
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------ review (Airsume / OCR) */
export function ReviewDiagram({ stages, caption, color }: P) {
  const head = stages.slice(0, -1);
  const last = stages[stages.length - 1];
  const isReviewLast = last?.id === "review";
  return (
    <DiagramFrame caption={caption} label="Confidence gate → human review">
      <div className="flex flex-wrap items-start justify-center gap-1.5">
        {head.map((s, i) => (
          <div key={s.id} className="flex items-start gap-1.5">
            <IconNode id={s.id} label={s.label} color={color} />
            {i < head.length - 1 && <Flow color={color} length={20} />}
          </div>
        ))}
        {last && (
          <>
            <Flow color={color} length={20} />
            <IconNode id={last.id} label={last.label} color={color} filled={!isReviewLast} />
          </>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Chip color={color}>above threshold → flows on</Chip>
        <Chip color={color}>below threshold → held for human review, never fabricated</Chip>
      </div>
    </DiagramFrame>
  );
}

/** Org-chart style bus: trunk from the core, animated distribution bar, and a
 *  drop into every node — so each spoke is visibly wired to the centre. */
function DistributionBus({
  nodes,
  color,
  cols,
}: {
  nodes: DiagramStage[];
  color: string;
  cols: number;
}) {
  const n = Math.min(nodes.length, cols);
  const inset = 100 / (n * 2); // centre of first/last column, in percent
  return (
    <div className="w-full">
      {/* horizontal bar spanning first → last column centre */}
      <div className="relative h-[2px]" aria-hidden>
        <svg
          className="absolute h-[2px]"
          style={{ left: `${inset}%`, right: `${inset}%`, width: `${100 - inset * 2}%` }}
          preserveAspectRatio="none"
          viewBox="0 0 100 2"
        >
          <line x1="0" y1="1" x2="100" y2="1" stroke={color} strokeOpacity={0.6} strokeWidth={1.5} vectorEffect="non-scaling-stroke" className="dash-flow" />
        </svg>
      </div>
      {/* drops + nodes */}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {nodes.slice(0, n).map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-1">
            <Flow vertical color={color} length={16} />
            <IconNode id={s.id} label={s.label} color={color} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ hub (Medical ERP) */
export function HubDiagram({ stages, caption, color }: P) {
  const core = stages[0];
  const spokes = stages.slice(1);
  return (
    <DiagramFrame caption={caption} label="Patient record at the centre · real-time spokes">
      <div className="flex flex-col items-center">
        {core && <IconNode id={core.id} label={core.label} color={color} filled />}
        <Flow vertical color={color} length={20} />
        {/* Desktop: one connected bus of 5 · mobile: two rows of buses */}
        <div className="hidden w-full sm:block">
          <DistributionBus nodes={spokes} color={color} cols={5} />
        </div>
        <div className="w-full sm:hidden">
          <DistributionBus nodes={spokes.slice(0, 3)} color={color} cols={3} />
          <div className="mt-4">
            <DistributionBus nodes={spokes.slice(3)} color={color} cols={2} />
          </div>
        </div>
        <p className="mt-5 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.12em]" style={{ color }}>
          <Radio size={13} aria-hidden /> events pushed over WebSockets
        </p>
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------ spatial (TrafficVision) */
export function SpatialDiagram({ stages, caption, color }: P) {
  return (
    <DiagramFrame caption={caption} label="Nested spatial model">
      <div className="mx-auto max-w-lg">
        {stages.reduceRight<React.ReactNode>(
          (inner, s, i) => (
            <div
              key={s.id}
              className="rounded-theme border p-3 sm:p-4"
              style={{
                borderColor: `${color}${(9 - i * 2).toString(16)}0`.slice(0, 9),
                background: `${color}0${Math.min(9, 2 + i)}`,
              }}
            >
              <div className="mb-2 flex items-center gap-2.5">
                <IconNode id={s.id} label="" color={color} size="sm" />
                <div>
                  <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.1em]" style={{ color }}>
                    {s.label}
                  </p>
                  {s.detail && <p className="text-[0.62rem] text-muted">{s.detail}</p>}
                </div>
              </div>
              {inner}
            </div>
          ),
          <div className="mt-1 flex justify-center">
            <Chip color={color}>frame-by-frame vehicle detection</Chip>
          </div>,
        )}
      </div>
    </DiagramFrame>
  );
}

/* -------------------------------------------------------- journey (CarWash) */
export function JourneyDiagram({ stages, caption, color }: P) {
  return (
    <DiagramFrame caption={caption} label="Service lifecycle">
      <ol className="flex flex-wrap items-start justify-center gap-1.5">
        {stages.map((s, i) => (
          <li key={s.id} className="flex items-start gap-1.5">
            <div className="relative">
              <IconNode id={s.id} label={s.label} color={color} filled={s.id === "live"} />
              <span
                className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full font-mono text-[0.55rem] font-bold"
                style={{ background: color, color: "rgb(var(--c-surface))" }}
                aria-hidden
              >
                {i + 1}
              </span>
            </div>
            {i < stages.length - 1 && <Flow color={color} length={20} />}
          </li>
        ))}
      </ol>
      <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
        <Radio size={12} aria-hidden style={{ color }} /> live status streams over WebSockets + Google Maps
      </p>
    </DiagramFrame>
  );
}
