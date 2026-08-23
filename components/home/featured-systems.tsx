import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/schemas";
import { SystemDiagram } from "@/components/systems/system-diagram";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge, TechList } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const ACCENT_BAR: Record<string, string> = {
  mineral: "bg-mineral",
  blue: "bg-blue",
  clay: "bg-clay",
  gold: "bg-gold",
};

function FlagshipBand({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <Reveal as="article" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <div className={cn("order-1", flip ? "lg:order-2" : "lg:order-1")}>
        <div className="flex items-center gap-3">
          <span className={cn("h-3 w-3 rounded-full", ACCENT_BAR[project.accent])} aria-hidden />
          <p className="label">{project.category}</p>
        </div>
        <h3 className="mt-3 text-3xl sm:text-4xl">
          <Link href={`/work/${project.id}`} className="hover:text-mineral">
            {project.title}
          </Link>
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-muted">{project.summary}</p>

        {project.decision && (
          <div className="mt-5 border-l-2 border-mineral/40 pl-4">
            <p className="label mb-1 normal-case tracking-[0.1em] text-mineral">
              Key decision
            </p>
            <p className="text-[0.95rem] font-medium">{project.decision.title}</p>
          </div>
        )}

        <div className="mt-5">
          <TechList items={project.technologies} limit={7} />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <StatusBadge status={project.status} />
          <Link
            href={`/work/${project.id}`}
            className="inline-flex items-center gap-2 font-mono text-sm text-mineral hover:gap-3"
          >
            Read case study <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      <div className={cn("order-2", flip ? "lg:order-1" : "lg:order-2")}>
        {project.diagram && <SystemDiagram diagram={project.diagram} />}
      </div>
    </Reveal>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Reveal as="article" className="panel group flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label">{project.category}</p>
          <h3 className="mt-2 text-2xl">
            <Link href={`/work/${project.id}`} className="hover:text-mineral">
              {project.title}
            </Link>
          </h3>
        </div>
        <span
          className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", ACCENT_BAR[project.accent])}
          aria-hidden
        />
      </div>
      <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-muted">
        {project.summary}
      </p>
      <div className="mt-4">
        <TechList items={project.technologies} limit={5} />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <StatusBadge status={project.status} />
        <Link
          href={`/work/${project.id}`}
          className="inline-flex items-center gap-1.5 font-mono text-sm text-mineral group-hover:gap-3"
        >
          Case study <ArrowRight size={14} />
        </Link>
      </div>
    </Reveal>
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
    <div className="mt-12 flex flex-col gap-16 sm:gap-24">
      {flagship.map((p, i) => (
        <FlagshipBand key={p.id} project={p} flip={i % 2 === 1} />
      ))}

      {featured.length > 0 && (
        <div>
          <p className="label">Also built · featured systems</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {featured.map((p) => (
              <FeaturedCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
