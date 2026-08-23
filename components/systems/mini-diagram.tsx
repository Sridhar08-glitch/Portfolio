import { Car, ShieldCheck, ShieldX } from "lucide-react";
import type { Diagram, DiagramStage } from "@/lib/schemas";
import { ACCENT_HEX } from "@/lib/theme";
import { stageIcon } from "./stage-icon";

/**
 * Card-sized project elaborations — each grammar drawn as a miniature icon
 * pipeline using the project's real stages, so a card reads as a tiny preview
 * of the architecture before the detail page. Decorative (aria-hidden); the
 * connector/pulse animations are globally disabled under reduced motion.
 */

function Tile({
  stage,
  color,
  filled = false,
  pulse = false,
}: {
  stage: DiagramStage;
  color: string;
  filled?: boolean;
  pulse?: boolean;
}) {
  const Icon = stageIcon(stage.id, stage.label);
  const short = stage.label.split("·")[0].trim().split(" ").slice(0, 2).join(" ");
  return (
    <span className="flex w-11 flex-col items-center gap-1">
      <span
        className={`grid h-7 w-7 place-items-center rounded-md border ${pulse ? "node-pulse" : ""}`}
        style={{
          background: filled ? color : `${color}1c`,
          borderColor: filled ? color : `${color}55`,
          color: filled ? "rgb(var(--c-surface))" : color,
        }}
      >
        <Icon size={13} />
      </span>
      <span className="w-full truncate text-center font-mono text-[0.5rem] leading-none text-muted">
        {short}
      </span>
    </span>
  );
}

function Dash({ color, w = 10 }: { color: string; w?: number }) {
  return (
    <svg width={w} height={2} className="mb-3 shrink-0 self-center" aria-hidden>
      <line x1="0" y1="1" x2={w} y2="1" stroke={color} strokeOpacity={0.6} strokeWidth={1.5} className="dash-flow" />
    </svg>
  );
}

function Row({ stages, color, filledId }: { stages: DiagramStage[]; color: string; filledId?: string }) {
  return (
    <div className="flex items-end justify-center">
      {stages.map((s, i) => (
        <span key={s.id} className="flex items-end">
          <Tile stage={s} color={color} filled={s.id === filledId} pulse={i === 0} />
          {i < stages.length - 1 && <Dash color={color} />}
        </span>
      ))}
    </div>
  );
}

export function MiniDiagram({
  diagram,
  accent,
  className,
}: {
  diagram?: Diagram;
  accent: string;
  className?: string;
}) {
  const color = ACCENT_HEX[accent] ?? ACCENT_HEX.mineral;
  const stages = diagram?.stages ?? [];
  const kind = diagram?.kind ?? "none";

  let scene: React.ReactNode;

  switch (kind) {
    case "funnel": {
      // request → filters → verdict chips
      const picks = [stages[0], stages[4], stages[5]].filter(Boolean) as DiagramStage[];
      scene = (
        <div className="flex items-center justify-center gap-1">
          <Row stages={picks} color={color} />
          <div className="mb-2 ml-1 flex flex-col gap-1">
            <span className="flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[0.5rem]" style={{ borderColor: `${color}66`, color }}>
              <ShieldCheck size={9} /> ALLOW
            </span>
            <span className="flex items-center gap-1 rounded border border-clay/60 px-1.5 py-0.5 font-mono text-[0.5rem] text-clay">
              <ShieldX size={9} /> BLOCK
            </span>
          </div>
        </div>
      );
      break;
    }
    case "stream": {
      const pipe = stages.slice(0, 3);
      const hub = stages[5];
      scene = (
        <div className="flex flex-col items-center gap-1">
          <Row stages={pipe} color={color} />
          {hub && (
            <div className="flex items-center gap-1.5 rounded-md border px-2 py-1" style={{ borderColor: `${color}55`, background: `${color}10` }}>
              <Tile stage={hub} color={color} filled />
            </div>
          )}
        </div>
      );
      break;
    }
    case "lattice": {
      const core = stages[0];
      const tenants = stages.slice(1, 5);
      scene = (
        <div className="flex flex-col items-center gap-1.5">
          {core && <Tile stage={core} color={color} filled pulse />}
          <div className="h-2 w-px" style={{ background: `${color}66` }} aria-hidden />
          <div className="flex gap-2">
            {tenants.map((t) => (
              <Tile key={t.id} stage={t} color={color} />
            ))}
          </div>
        </div>
      );
      break;
    }
    case "projection": {
      const picks = [stages[0], stages[3], stages[5]].filter(Boolean) as DiagramStage[];
      scene = <Row stages={picks} color={color} filledId={stages[5]?.id} />;
      break;
    }
    case "clusters": {
      const a = stages[0];
      const sync = stages.find((s) => s.id === "sync") ?? stages[3];
      const b = stages[stages.length - 1];
      scene = (
        <div className="flex items-end justify-center">
          {a && <Tile stage={{ ...a, label: "Device A" }} color={color} />}
          <Dash color={color} w={18} />
          {sync && <Tile stage={sync} color={color} filled pulse />}
          <Dash color={color} w={18} />
          {b && <Tile stage={{ ...b, label: "Device B" }} color={color} />}
        </div>
      );
      break;
    }
    case "review": {
      const picks = stages.slice(0, 3);
      scene = <Row stages={picks} color={color} filledId={stages[stages.length - 1]?.id} />;
      break;
    }
    case "hub": {
      // hospital-core style: patient centre + department spokes
      const core = stages[0];
      const spokes = stages.slice(1, 4);
      scene = (
        <div className="flex flex-col items-center gap-1">
          {core && <Tile stage={core} color={color} filled pulse />}
          <span className="h-2 w-px" style={{ background: `${color}66` }} aria-hidden />
          <div className="flex items-start gap-2.5">
            {spokes.map((s) => (
              <Tile key={s.id} stage={s} color={color} />
            ))}
          </div>
        </div>
      );
      break;
    }
    case "spatial": {
      scene = (
        <div className="flex items-center justify-center">
          <div className="rounded-lg border p-1.5" style={{ borderColor: `${color}40` }}>
            <div className="rounded-md border p-1.5" style={{ borderColor: `${color}66` }}>
              <div className="flex items-center gap-1.5 rounded border px-2 py-1" style={{ borderColor: color, background: `${color}14` }}>
                <Car size={13} style={{ color }} aria-hidden />
                <span className="font-mono text-[0.52rem]" style={{ color }}>
                  detect · lane
                </span>
              </div>
            </div>
          </div>
        </div>
      );
      break;
    }
    case "journey": {
      const picks = [stages[0], stages[3], stages[4]].filter(Boolean) as DiagramStage[];
      scene = <Row stages={picks} color={color} filledId={stages[4]?.id} />;
      break;
    }
    default: {
      scene = (
        <div className="flex items-center justify-center gap-1.5">
          {["build", "ship", "run"].map((s, i) => (
            <span key={s} className="flex items-center">
              <span
                className={`grid h-7 w-7 place-items-center rounded-md border ${i === 0 ? "node-pulse" : ""}`}
                style={{ background: `${color}1c`, borderColor: `${color}55`, color }}
              >
                <span className="font-mono text-[0.55rem] font-bold uppercase">{s[0]}</span>
              </span>
              {i < 2 && <Dash color={color} />}
            </span>
          ))}
        </div>
      );
    }
  }

  return (
    <div className={`grid place-items-center overflow-hidden ${className ?? ""}`} aria-hidden>
      {scene}
    </div>
  );
}
