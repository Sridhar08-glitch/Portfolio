"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Constraint, Project } from "@/lib/schemas";
import { StatusBadge, TechList } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const TIER_LABEL: Record<Project["tier"], string> = {
  flagship: "Flagship",
  featured: "Featured",
  production: "Production",
  additional: "Additional",
};

function WorkCard({ project }: { project: Project }) {
  return (
    <article className="panel group flex h-full flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="label">{project.category}</p>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
          {TIER_LABEL[project.tier]}
        </span>
      </div>
      <h2 className="mt-2 text-2xl">
        <Link href={`/work/${project.id}`} className="hover:text-mineral">
          {project.title}
        </Link>
      </h2>
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
          Open <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

export function WorkGrid({
  projects,
  constraints,
}: {
  projects: Project[];
  constraints: Constraint[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((p) => p.constraints.includes(filter));
  }, [filter, projects]);

  const filters = [{ key: "all", label: "All" }, ...constraints];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by constraint">
        {filters.map((f) => {
          const count =
            f.key === "all"
              ? projects.length
              : projects.filter((p) => p.constraints.includes(f.key)).length;
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={cn(
                "rounded-theme border px-3 py-1.5 font-mono text-xs transition-colors",
                active
                  ? "border-mineral bg-mineral on-dark"
                  : "border-line hover:bg-panel",
              )}
            >
              {f.label} <span className="opacity-60">· {count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <WorkCard key={p.id} project={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-muted">No projects match that filter.</p>
      )}
    </div>
  );
}
