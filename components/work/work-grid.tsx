"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, FlaskConical, LayoutGrid, RotateCcw, Users } from "lucide-react";
import type { Constraint, Project } from "@/lib/schemas";
import { ACCENT_HEX } from "@/lib/theme";
import { MiniDiagram } from "@/components/systems/mini-diagram";
import { StatusBadge } from "@/components/ui/primitives";
import { TechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

const TIER_LABEL: Record<Project["tier"], string> = {
  flagship: "Flagship",
  featured: "Featured",
  production: "Client",
  additional: "Additional",
};

const TIER_TONE: Record<Project["tier"], string> = {
  flagship: "border-mineral/50 bg-mineral/10 text-mineral",
  featured: "border-blue/50 bg-blue/10 text-blue",
  production: "border-gold/50 bg-gold/10 text-gold",
  additional: "border-line bg-panel text-muted",
};

const STATUS_GROUPS: { key: string; label: string; match: Project["status"][] }[] = [
  { key: "production", label: "Production", match: ["production", "client-delivered"] },
  { key: "development", label: "In development", match: ["in-development", "prototype"] },
  { key: "research", label: "Research", match: ["research", "training"] },
  { key: "personal", label: "Personal / academic", match: ["personal", "academic"] },
];

function FilterButton({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-theme border px-3 py-2 text-left font-mono text-[0.72rem] transition-colors",
        active
          ? "border-mineral/60 bg-mineral/10 text-mineral"
          : "border-transparent text-muted hover:bg-panel hover:text-ink",
      )}
    >
      <span className="truncate">{children}</span>
      {count !== undefined && <span className="shrink-0 opacity-70">{count}</span>}
    </button>
  );
}

function WorkCard({ project }: { project: Project }) {
  const color = ACCENT_HEX[project.accent] ?? ACCENT_HEX.mineral;
  return (
    <article
      className="card-dark group flex h-full flex-col overflow-hidden"
      style={{ "--glow": `${color}66` } as React.CSSProperties}
    >
      <div
        className="relative border-b border-line/70 px-4 pt-4"
        style={{ background: `linear-gradient(155deg, ${color}12, transparent 65%)` }}
      >
        <span
          className={cn(
            "absolute left-4 top-4 z-10 rounded-full border px-2 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em]",
            TIER_TONE[project.tier],
          )}
        >
          {TIER_LABEL[project.tier]}
        </span>
        <MiniDiagram diagram={project.diagram} accent={project.accent} className="h-28 w-full" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-lg font-semibold leading-tight">
          <Link href={`/work/${project.id}`} className="transition-colors hover:text-gold">
            {project.title}
          </Link>
        </h2>
        <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
          {project.category}
        </p>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>
        <ul className="mt-4 flex flex-wrap items-center gap-1.5">
          {project.technologies.slice(0, 5).map((t) => (
            <li
              key={t}
              title={t}
              className="grid h-6 w-6 place-items-center rounded-md border border-line bg-surface/60 text-muted"
            >
              <TechIcon name={t} size={12} />
            </li>
          ))}
          {project.technologies.length > 5 && (
            <li className="font-mono text-[0.62rem] text-muted">
              +{project.technologies.length - 5}
            </li>
          )}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-4">
          <StatusBadge status={project.status} />
          <Link
            href={`/work/${project.id}`}
            aria-label={`${project.title} case study`}
            className="flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition-all group-hover:gap-3"
            style={{ color }}
          >
            Open <ArrowRight size={13} aria-hidden />
          </Link>
        </div>
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
  const [tier, setTier] = useState<string>("all");
  const [domain, setDomain] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  // Deep links from the hero hub: /work?c=<constraint-key> (kept static-safe).
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (c && constraints.some((x) => x.key === c)) setDomain(c);
  }, [constraints]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (tier !== "all" && p.tier !== tier) return false;
      if (domain !== "all" && !p.constraints.includes(domain)) return false;
      if (status !== "all") {
        const group = STATUS_GROUPS.find((g) => g.key === status);
        if (group && !group.match.includes(p.status)) return false;
      }
      return true;
    });
  }, [projects, tier, domain, status]);

  const isFiltered = tier !== "all" || domain !== "all" || status !== "all";
  const tiers: Project["tier"][] = ["flagship", "featured", "production", "additional"];

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Sidebar filters */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-6">
          <div>
            <p className="label mb-2">Filter by tier</p>
            <FilterButton active={tier === "all"} onClick={() => setTier("all")} count={projects.length}>
              All projects
            </FilterButton>
            {tiers.map((t) => (
              <FilterButton
                key={t}
                active={tier === t}
                onClick={() => setTier(tier === t ? "all" : t)}
                count={projects.filter((p) => p.tier === t).length}
              >
                {TIER_LABEL[t]}
              </FilterButton>
            ))}
          </div>
          <div>
            <p className="label mb-2">Filter by domain</p>
            <FilterButton active={domain === "all"} onClick={() => setDomain("all")}>
              All domains
            </FilterButton>
            {constraints.map((c) => (
              <FilterButton
                key={c.key}
                active={domain === c.key}
                onClick={() => setDomain(domain === c.key ? "all" : c.key)}
                count={projects.filter((p) => p.constraints.includes(c.key)).length}
              >
                {c.label}
              </FilterButton>
            ))}
          </div>
          <div>
            <p className="label mb-2">Filter by status</p>
            {STATUS_GROUPS.map((g) => (
              <FilterButton
                key={g.key}
                active={status === g.key}
                onClick={() => setStatus(status === g.key ? "all" : g.key)}
                count={projects.filter((p) => g.match.includes(p.status)).length}
              >
                {g.label}
              </FilterButton>
            ))}
          </div>
          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setTier("all");
                setDomain("all");
                setStatus("all");
              }}
              className="btn-ghost !justify-center !px-4 !py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.12em]"
            >
              <RotateCcw size={13} /> Clear all filters
            </button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <p className="mb-4 font-mono text-xs text-muted" aria-live="polite">
          {filtered.length} project{filtered.length === 1 ? "" : "s"} found
        </p>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <WorkCard key={p.id} project={p} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="grid place-items-center rounded-theme border border-dashed border-line py-20 text-center">
            <div>
              <LayoutGrid size={22} className="mx-auto text-muted" aria-hidden />
              <p className="mt-3 text-muted">No projects match those filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Honest stat chips for the work index header. */
export function WorkStats({ projects }: { projects: Project[] }) {
  const production = projects.filter((p) =>
    ["production", "client-delivered"].includes(p.status),
  ).length;
  const client = projects.filter((p) => p.tier === "production").length;
  const research = projects.filter((p) => ["research", "training"].includes(p.status)).length;

  const stats: { icon: React.ElementType; value: string; label: string }[] = [
    { icon: LayoutGrid, value: `${projects.length}`, label: "Projects" },
    { icon: ArrowRight, value: `${production}`, label: "Live / delivered" },
    { icon: Users, value: `${client}`, label: "Client platforms" },
    { icon: FlaskConical, value: `${research}`, label: "Research" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[460px]">
      {stats.map((s) => (
        <div key={s.label} className="card-dark flex items-center gap-3 p-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/10 text-gold">
            <s.icon size={16} aria-hidden />
          </span>
          <div>
            <dd className="font-display text-xl font-bold leading-none">{s.value}</dd>
            <dt className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
              {s.label}
            </dt>
          </div>
        </div>
      ))}
    </dl>
  );
}
