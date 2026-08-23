import {
  ArrowDown,
  ArrowRight,
  CircleUser,
  RefreshCw,
  UserCheck,
  WifiOff,
} from "lucide-react";
import type { DiagramStage } from "@/lib/schemas";
import { DiagramFrame, Node } from "./diagram-frame";

/* Small connectors that stay responsive (chevrons, not fixed SVG lines). */
function FlowArrow({ vertical }: { vertical?: boolean }) {
  return (
    <span aria-hidden className="grid shrink-0 place-items-center text-muted">
      {vertical ? <ArrowDown size={16} /> : <ArrowRight size={16} />}
    </span>
  );
}

/* ------------------------------------------------------------ stream (MeetingMind) */
export function StreamDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  const pipe = stages.slice(0, 5);
  const hub = stages[5];
  const approve = stages[6];
  return (
    <DiagramFrame caption={caption} label="Asynchronous pipeline → event-sourced knowledge">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1.5">
          {pipe.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 md:flex-1 md:flex-col md:gap-1.5">
              <Node className="w-full">{s.label}</Node>
              {i < pipe.length - 1 && <FlowArrow />}
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {hub && (
            <Node tone="mineral" className="px-4 py-4 text-sm">
              {hub.label}
              <span className="mt-1 block text-[0.68rem] font-normal opacity-80">
                append-only · time-travel queries
              </span>
            </Node>
          )}
          {approve && (
            <div className="flex items-center gap-3 rounded-theme border border-dashed border-muted/50 px-4 py-4">
              <UserCheck size={18} className="shrink-0 text-clay" aria-hidden />
              <span className="font-mono text-xs">{approve.label}</span>
            </div>
          )}
        </div>
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------------ lattice (CommerceOS) */
export function LatticeDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  const core = stages[0];
  const tenants = stages.slice(1);
  return (
    <DiagramFrame caption={caption} label="One engine · isolated tenants">
      <div className="flex flex-col items-center gap-5">
        <Node tone="mineral" className="px-6 py-3 text-sm">
          {core?.label}
        </Node>
        <div aria-hidden className="h-4 w-px bg-line" />
        <div className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4">
          {tenants.map((t) => (
            <div key={t.id} className="rounded-theme border border-line bg-surface p-3">
              <p className="font-mono text-xs">{t.label}</p>
              <div className="mt-2 flex gap-1" aria-hidden>
                {[0, 1, 2].map((n) => (
                  <span key={n} className="h-1.5 flex-1 rounded-full bg-line" />
                ))}
              </div>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted">
                isolated at query layer
              </p>
            </div>
          ))}
        </div>
      </div>
    </DiagramFrame>
  );
}

/* ------------------------------------------------------- projection (No-Code ERP) */
export function ProjectionDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  return (
    <DiagramFrame caption={caption} label="Command → event → projection">
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-1.5">
        {stages.map((s, i) => {
          const isStream = s.id === "stream";
          return (
            <div key={s.id} className="flex items-center gap-2 lg:flex-col lg:gap-1.5">
              {isStream ? (
                <div className="relative w-full min-w-[9rem] lg:w-auto">
                  <div className="relative rounded-theme border border-mineral bg-mineral/5 p-2">
                    {[0, 1, 2].map((n) => (
                      <div
                        key={n}
                        className="mb-1 rounded-sm bg-mineral/80 px-2 py-1 text-center font-mono text-[0.62rem] on-dark last:mb-0"
                      >
                        event {n + 1}
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-center font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
                    immutable
                  </p>
                </div>
              ) : (
                <Node
                  tone={s.id === "state" ? "mineral" : "surface"}
                  className="w-full min-w-[7rem] lg:w-auto"
                >
                  {s.label}
                </Node>
              )}
              {i < stages.length - 1 && <FlowArrow />}
            </div>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-clay">
        <RefreshCw size={13} aria-hidden /> replay events → reconstruct any point in time
      </p>
    </DiagramFrame>
  );
}

/* -------------------------------------------------- clusters (Construction ERP) */
export function ClustersDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  return (
    <DiagramFrame caption={caption} label="Two devices · no central server">
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-theme border border-line bg-surface p-4">
          <p className="font-mono text-xs font-semibold">Device A</p>
          <Node className="mt-3">Local write</Node>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
            <WifiOff size={12} aria-hidden /> offline · fully productive
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 py-2">
          <RefreshCw size={18} className="text-mineral" aria-hidden />
          <span className="rounded-full border border-mineral px-2.5 py-1 text-center font-mono text-[0.6rem] uppercase tracking-[0.1em] text-mineral">
            peer sync
          </span>
          <span className="rounded-theme border border-dashed border-clay/60 px-2.5 py-1 text-center font-mono text-[0.6rem] uppercase tracking-[0.1em] text-clay">
            reconcile conflicts
          </span>
        </div>

        <div className="rounded-theme border border-line bg-surface p-4">
          <p className="font-mono text-xs font-semibold">Device B</p>
          <Node className="mt-3">Local write</Node>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
            <WifiOff size={12} aria-hidden /> offline · fully productive
          </p>
        </div>
      </div>
    </DiagramFrame>
  );
}

/* ---------------------------------------------- review (Airsume / OCR) */
export function ReviewDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  const head = stages.slice(0, 3);
  const tail = stages.slice(3);
  return (
    <DiagramFrame caption={caption} label="Confidence gate → human review">
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1.5">
        {head.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 md:flex-col md:gap-1.5">
            <Node className="w-full md:w-auto">{s.label}</Node>
            {i < head.length - 1 && <FlowArrow />}
          </div>
        ))}
        <FlowArrow />
        <div className="grid flex-1 gap-2">
          {tail.map((s) => (
            <Node
              key={s.id}
              tone={s.id === "review" ? "outline" : "mineral"}
              className="text-left"
            >
              {s.label}
            </Node>
          ))}
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
            below threshold → held, never fabricated
          </p>
        </div>
      </div>
    </DiagramFrame>
  );
}

/* --------------------------------------------------------- hub (Medical ERP) */
export function HubDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  const core = stages[0];
  const spokes = stages.slice(1);
  return (
    <DiagramFrame caption={caption} label="Patient record at the centre · real-time spokes">
      <div className="flex flex-col items-center gap-4">
        <Node tone="mineral" className="px-6 py-3 text-sm">
          {core?.label}
        </Node>
        <div aria-hidden className="h-3 w-px bg-line" />
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {spokes.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <span aria-hidden className="h-3 w-px bg-line" />
              <Node className="w-full">{s.label}</Node>
            </div>
          ))}
        </div>
        <p className="mt-1 rounded-full border border-mineral/40 bg-mineral/5 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-mineral">
          events pushed over WebSockets
        </p>
      </div>
    </DiagramFrame>
  );
}

/* ---------------------------------------------------- spatial (TrafficVision) */
export function SpatialDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  return (
    <DiagramFrame caption={caption} label="Nested spatial model">
      <div className="mx-auto max-w-md">
        {stages.reduce<React.ReactNode>((inner, s, i) => {
          const depth = stages.length - i;
          return (
            <div
              key={s.id}
              className="rounded-theme border border-mineral/40 p-3"
              style={{ backgroundColor: `rgb(var(--c-mineral) / ${0.04 * depth})` }}
            >
              <p className="mb-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-mineral">
                {s.label}
              </p>
              {inner}
            </div>
          );
        }, <p className="rounded-sm bg-clay px-2 py-1 text-center font-mono text-[0.62rem] on-dark">vehicle detection</p>)}
      </div>
    </DiagramFrame>
  );
}

/* --------------------------------------------------------- journey (CarWash) */
export function JourneyDiagram({
  stages,
  caption,
}: {
  stages: DiagramStage[];
  caption: string;
}) {
  return (
    <DiagramFrame caption={caption} label="Service lifecycle">
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-1">
        {stages.map((s, i) => {
          const live = s.id === "live";
          return (
            <li key={s.id} className="flex items-center gap-2 sm:flex-1 sm:flex-col">
              <div
                className={`flex w-full items-center gap-2 rounded-theme border px-3 py-2 ${
                  live ? "border-mineral bg-mineral/5" : "border-line bg-surface"
                }`}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full font-mono text-[0.6rem] ${
                    live ? "bg-mineral on-dark" : "bg-panel text-muted"
                  }`}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="font-mono text-[0.72rem]">{s.label}</span>
                {live && <CircleUser size={13} className="ml-auto text-mineral" aria-hidden />}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
        live status streams over WebSockets + Google Maps
      </p>
    </DiagramFrame>
  );
}
