import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/schemas";
import { ACCENT_HEX } from "@/lib/theme";
import { MiniDiagram } from "@/components/systems/mini-diagram";
import { Reveal, Stagger } from "@/components/ui/reveal";

/**
 * Reference-style featured grid: compact dark cards, each topped with an
 * animated mini-diagram in the project's accent — six flagships across, then
 * the featured tier beneath at the same treatment.
 */

function SystemCard({ project }: { project: Project }) {
  const color = ACCENT_HEX[project.accent] ?? ACCENT_HEX.mineral;
  return (
    <Link
      href={`/work/${project.id}`}
      className="card-dark group flex h-full flex-col overflow-hidden"
      style={{ "--glow": `${color}66` } as React.CSSProperties}
    >
      <div
        className="relative border-b border-line/70 px-3 pt-3"
        style={{ background: `linear-gradient(160deg, ${color}14, transparent 70%)` }}
      >
        <MiniDiagram diagram={project.diagram} accent={project.accent} className="h-24 w-full" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-[1.02rem] font-semibold leading-tight">
          {project.title}
        </h3>
        <p className="mt-1 line-clamp-1 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-muted">
          {project.category}
        </p>
        <span
          className="mt-auto flex items-center gap-1.5 pt-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-all group-hover:gap-3"
          style={{ color }}
        >
          Case study <ArrowRight size={13} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function FeaturedSystems({
  flagship,
  featured,
}: {
  flagship: Project[];
  featured: Project[];
}) {
  return (
    <div className="mt-10">
      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {flagship.map((p) => (
          <Reveal as="div" key={p.id}>
            <SystemCard project={p} />
          </Reveal>
        ))}
      </Stagger>

      {featured.length > 0 && (
        <>
          <p className="label mt-10">Also engineered</p>
          <Stagger className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => (
              <Reveal as="div" key={p.id}>
                <SystemCard project={p} />
              </Reveal>
            ))}
          </Stagger>
        </>
      )}
    </div>
  );
}
