import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Lock,
  MapPinned,
  Scale,
  UsersRound,
} from "lucide-react";
import type { Project, Site } from "@/lib/schemas";
import { ACCENT_HEX } from "@/lib/theme";
import { SystemDiagram } from "@/components/systems/system-diagram";
import {
  ClaimItem,
  ProjectLinks,
  StatusBadge,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { TechIcon } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

function SectionShell({
  id,
  label,
  title,
  children,
  className,
}: {
  id: string;
  label: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal as="section" className={cn("scroll-mt-28", className)}>
      <div id={id}>
        <p className="label">{label}</p>
        {title && <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>}
        <div className="mt-5">{children}</div>
      </div>
    </Reveal>
  );
}

export function ProjectDetail({
  project,
  prev,
  next,
  constraintLabels,
  site,
}: {
  project: Project;
  prev: Project | null;
  next: Project | null;
  constraintLabels: Record<string, string>;
  site: Site;
}) {
  const p = project;
  const color = ACCENT_HEX[p.accent] ?? ACCENT_HEX.mineral;

  const toc = [
    { id: "overview", label: "Overview", show: true },
    { id: "problem", label: "Problem & constraints", show: Boolean(p.problem || p.constraintsNarrative) },
    { id: "architecture", label: "Architecture", show: Boolean(p.diagram || p.architecture) },
    { id: "how", label: "How it works", show: p.implementation.length > 0 },
    { id: "decisions", label: "Engineering decisions", show: Boolean(p.decision || p.alternative) },
    { id: "highlights", label: "Technical highlights", show: p.highlights.length > 0 },
    { id: "evidence", label: "Claims & evidence", show: p.claims.length > 0 || p.outcomes.length > 0 },
    { id: "stack", label: "Tech stack", show: p.technologies.length > 0 },
  ].filter((t) => t.show);

  return (
    <div className="shell grid gap-10 pt-10 lg:grid-cols-[230px_1fr] lg:pt-14">
      {/* ---------------------------------------------------------- sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 flex flex-col gap-7">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft size={14} /> Back to all projects
          </Link>

          <nav aria-label="On this page">
            <p className="label mb-2">On this page</p>
            <ul className="flex flex-col border-l border-line">
              {toc.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="block border-l-2 border-transparent py-1.5 pl-4 text-[0.82rem] text-muted transition-colors hover:border-gold hover:text-ink"
                  >
                    {t.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="card-dark flex flex-col gap-3.5 p-4" style={{ "--glow": `${color}44` } as React.CSSProperties}>
            <div>
              <p className="label mb-1.5">Status</p>
              <StatusBadge status={p.status} />
            </div>
            <div>
              <p className="label mb-1">Role</p>
              <p className="text-[0.8rem] leading-snug">{p.role}</p>
            </div>
            <div>
              <p className="label mb-1.5">Domain</p>
              <ul className="flex flex-wrap gap-1.5">
                {p.constraints.map((c) => (
                  <li key={c}>
                    <Link
                      href={`/work?c=${c}`}
                      className="rounded-theme border border-line px-2 py-0.5 font-mono text-[0.62rem] text-muted transition-colors hover:border-gold hover:text-gold"
                    >
                      {constraintLabels[c] ?? c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------ main */}
      <article className="min-w-0">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-gold lg:hidden"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        {/* Header */}
        <header id="overview" className="mt-4 scroll-mt-28 lg:mt-0">
          <p className="label">
            {p.tier === "flagship" ? "Flagship system" : p.category}
          </p>
          <h1
            className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl"
            style={{
              backgroundImage: `linear-gradient(120deg, rgb(var(--c-ink)), ${color})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {p.title}
          </h1>
          <p className="mt-3 text-xl font-medium" style={{ color }}>
            {p.category}
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{p.summary}</p>

          {/* Honest fact chips (no invented metrics) */}
          <dl className="mt-7 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-theme border border-line bg-line sm:grid-cols-4">
            {[
              [`${p.technologies.length}`, "Technologies"],
              [`${p.constraints.length}`, p.constraints.length === 1 ? "Domain" : "Domains"],
              [`${p.implementation.length || "—"}`, "Capabilities"],
              [`${p.links.length || "—"}`, "Public links"],
            ].map(([v, l]) => (
              <div key={l} className="bg-panel px-4 py-3">
                <dd className="font-display text-xl font-bold" style={{ color }}>{v}</dd>
                <dt className="mt-0.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted">{l}</dt>
              </div>
            ))}
          </dl>

          {p.links.length > 0 && (
            <div className="mt-6">
              <ProjectLinks links={p.links} />
            </div>
          )}

          {/* Who it's for / where it fits */}
          {p.audience && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div
                className="rounded-theme border p-5"
                style={{ borderColor: `${color}44`, background: `${color}0d` }}
              >
                <p className="flex items-center gap-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
                  <UsersRound size={15} aria-hidden /> Who it&apos;s for
                </p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">
                  {p.audience.who}
                </p>
              </div>
              <div
                className="rounded-theme border p-5"
                style={{ borderColor: `${color}44`, background: `${color}0d` }}
              >
                <p className="flex items-center gap-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em]" style={{ color }}>
                  <MapPinned size={15} aria-hidden /> Where it fits
                </p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">
                  {p.audience.where}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Problem & constraints */}
        {(p.problem || p.constraintsNarrative) && (
          <SectionShell id="problem" label="The hard part" className="mt-14">
            <div className="grid gap-4 md:grid-cols-2">
              {p.problem && (
                <div className="card-dark p-6">
                  <p className="flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.12em]">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-clay/15 text-clay">
                      <CircleAlert size={15} aria-hidden />
                    </span>
                    The problem
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">{p.problem}</p>
                </div>
              )}
              {p.constraintsNarrative && (
                <div className="card-dark p-6">
                  <p className="flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.12em]">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-mineral/15 text-mineral">
                      <Lock size={15} aria-hidden />
                    </span>
                    Key constraints
                  </p>
                  <p className="mt-4 leading-relaxed text-muted">{p.constraintsNarrative}</p>
                </div>
              )}
            </div>
          </SectionShell>
        )}

        {/* Architecture */}
        {(p.diagram || p.architecture) && (
          <SectionShell id="architecture" label="Architecture overview" className="mt-14">
            {p.architecture && (
              <p className="mb-6 max-w-3xl text-lg leading-relaxed">{p.architecture}</p>
            )}
            {p.diagram && <SystemDiagram diagram={p.diagram} accent={p.accent} />}
          </SectionShell>
        )}

        {/* How it works */}
        {p.implementation.length > 0 && (
          <SectionShell id="how" label="How it works" title="What's actually in it." className="mt-14">
            <ol className="grid gap-3 md:grid-cols-2">
              {p.implementation.map((item, i) => (
                <li key={i} className="flex gap-4 rounded-theme border border-line bg-panel/60 p-4">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md font-mono text-[0.68rem] font-bold"
                    style={{ background: `${color}1c`, color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[0.92rem] leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </SectionShell>
        )}

        {/* Decisions */}
        {(p.decision || p.alternative) && (
          <SectionShell
            id="decisions"
            label="Engineering decisions"
            title={p.decision?.title ?? "The judgment calls."}
            className="mt-14"
          >
            {p.decision && (
              <p className="max-w-3xl text-lg leading-relaxed">{p.decision.body}</p>
            )}
            {p.tradeoff && (
              <div className="mt-5 flex gap-3 rounded-theme border border-gold/40 bg-gold/5 p-5">
                <Scale size={17} className="mt-0.5 shrink-0 text-gold" aria-hidden />
                <div>
                  <p className="label text-gold">The trade-off</p>
                  <p className="mt-1.5 leading-relaxed">{p.tradeoff}</p>
                </div>
              </div>
            )}
            {p.alternative && (
              <div className="mt-8 grid gap-3 overflow-hidden rounded-theme border border-line bg-line sm:grid-cols-2 lg:grid-cols-4 lg:gap-px">
                {(
                  [
                    ["The obvious approach", p.alternative.obvious, "text-clay"],
                    ["Why I didn't choose it", p.alternative.whyNot, "text-clay"],
                    ["My approach", p.alternative.approach, "text-mineral"],
                    ["Trade-offs", p.alternative.tradeoff, "text-gold"],
                  ] as const
                ).map(([label, body, tone]) => (
                  <div key={label} className="bg-panel p-5">
                    <p className={cn("font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em]", tone)}>
                      {label}
                    </p>
                    <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{body}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionShell>
        )}

        {/* Highlights */}
        {p.highlights.length > 0 && (
          <SectionShell id="highlights" label="Technical highlights" className="mt-14">
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.highlights.map((h, i) => (
                <li key={i} className="flex gap-3 rounded-theme bg-panel p-4">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color }} aria-hidden />
                  <span className="text-[0.92rem] leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </SectionShell>
        )}

        {/* Evidence — the honest version of the reference's "Results" panel */}
        {(p.claims.length > 0 || p.outcomes.length > 0) && (
          <SectionShell id="evidence" label="Claims & evidence" className="mt-14">
            {p.outcomes.length > 0 && (
              <ul className="mb-6 flex flex-col gap-2">
                {p.outcomes.map((o, i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mineral" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            )}
            <ul className="flex flex-col gap-4">
              {p.claims.map((c, i) => (
                <ClaimItem key={i} claim={c} />
              ))}
            </ul>
            <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted">
              Every statement above carries its evidence class — nothing is invented.
            </p>
          </SectionShell>
        )}

        {/* Stack */}
        {p.technologies.length > 0 && (
          <SectionShell id="stack" label="Tech stack" className="mt-14">
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {p.technologies.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2.5 rounded-theme border border-line bg-panel/60 px-3 py-2.5"
                >
                  {/* Original brand mark in its official colour */}
                  <TechIcon name={t} size={18} colored className="shrink-0" />
                  <span className="truncate font-mono text-[0.74rem]">{t}</span>
                </li>
              ))}
            </ul>
          </SectionShell>
        )}

        {/* Connect */}
        <div
          className="card-dark mt-16 flex flex-wrap items-center justify-between gap-5 p-7"
          style={{ "--glow": `${color}55` } as React.CSSProperties}
        >
          <div>
            <p className="font-display text-lg font-semibold">
              Want to go deeper on {p.title}?
            </p>
            <p className="mt-1 text-sm text-muted">
              I&apos;m happy to walk through the architecture and the decisions behind it.
            </p>
          </div>
          {site.email && (
            <a href={`mailto:${site.email}`} className="btn-gold">
              Get in touch <ArrowRight size={15} />
            </a>
          )}
        </div>

        {/* Prev / next */}
        <nav className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2" aria-label="More projects">
          {prev ? (
            <Link
              href={`/work/${prev.id}`}
              className="group rounded-theme border border-line p-4 transition-colors hover:border-gold"
            >
              <span className="label flex items-center gap-2">
                <ArrowLeft size={12} aria-hidden /> Previous project
              </span>
              <span className="mt-1.5 block font-display font-semibold group-hover:text-gold">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
          {next && (
            <Link
              href={`/work/${next.id}`}
              className="group rounded-theme border border-line p-4 text-right transition-colors hover:border-gold"
            >
              <span className="label flex items-center justify-end gap-2">
                Next project <ArrowRight size={12} aria-hidden />
              </span>
              <span className="mt-1.5 block font-display font-semibold group-hover:text-gold">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
