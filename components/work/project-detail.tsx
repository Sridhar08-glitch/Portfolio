import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/schemas";
import { SystemDiagram } from "@/components/systems/system-diagram";
import {
  ClaimItem,
  ProjectLinks,
  StatusBadge,
  TechList,
} from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

function Block({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="border-t border-line pt-8">
      <p className="label">{label}</p>
      {title && <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>}
      <div className="mt-4 max-w-3xl">{children}</div>
    </Reveal>
  );
}

export function ProjectDetail({
  project,
  prev,
  next,
  constraintLabels,
}: {
  project: Project;
  prev: Project | null;
  next: Project | null;
  constraintLabels: Record<string, string>;
}) {
  const p = project;
  return (
    <article className="shell pt-14 sm:pt-20">
      <Link
        href="/work"
        className="inline-flex items-center gap-2 font-mono text-sm text-muted hover:text-mineral"
      >
        <ArrowLeft size={15} /> All work
      </Link>

      {/* Header */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="label">{p.category}</p>
          <StatusBadge status={p.status} />
        </div>
        <h1 className="mt-4 max-w-4xl text-4xl sm:text-5xl md:text-6xl">{p.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{p.summary}</p>

        <dl className="mt-8 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
          <div>
            <dt className="label">Role</dt>
            <dd className="mt-1.5 text-sm">{p.role}</dd>
          </div>
          <div>
            <dt className="label">Built around</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {p.constraints.map((c) => (
                <Link
                  key={c}
                  href="/work"
                  className="rounded-theme border border-line px-2 py-0.5 font-mono text-[0.72rem] text-muted hover:border-mineral hover:text-mineral"
                >
                  {constraintLabels[c] ?? c}
                </Link>
              ))}
            </dd>
          </div>
          <div>
            <dt className="label">Stack</dt>
            <dd className="mt-1.5">
              <TechList items={p.technologies} />
            </dd>
          </div>
        </dl>

        {p.links.length > 0 && (
          <div className="mt-6">
            <ProjectLinks links={p.links} />
          </div>
        )}
      </header>

      {/* Signature diagram */}
      {p.diagram && (
        <div className="mt-10">
          <SystemDiagram diagram={p.diagram} />
        </div>
      )}

      <div className="mt-12 flex flex-col gap-10">
        {p.problem && (
          <Block label="The problem" title="What made this hard.">
            <p className="text-lg leading-relaxed">{p.problem}</p>
          </Block>
        )}

        {p.constraintsNarrative && (
          <Block label="Constraints">
            <p className="text-lg leading-relaxed">{p.constraintsNarrative}</p>
          </Block>
        )}

        {p.architecture && (
          <Block label="Architecture" title="How it fits together.">
            <p className="text-lg leading-relaxed">{p.architecture}</p>
          </Block>
        )}

        {p.decision && (
          <Block label="Key engineering decision" title={p.decision.title}>
            <p className="text-lg leading-relaxed">{p.decision.body}</p>
            {p.tradeoff && (
              <div className="mt-5 rounded-theme border border-clay/40 bg-clay/5 p-5">
                <p className="label normal-case tracking-[0.1em] text-clay">The trade-off</p>
                <p className="mt-2 leading-relaxed">{p.tradeoff}</p>
              </div>
            )}
          </Block>
        )}

        {p.alternative && (
          <Block
            label="What most people would do differently"
            title="The obvious path, and why I didn't take it."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-theme border border-line p-5">
                <p className="label normal-case tracking-[0.1em]">The obvious approach</p>
                <p className="mt-2 leading-relaxed">{p.alternative.obvious}</p>
              </div>
              <div className="rounded-theme border border-line p-5">
                <p className="label normal-case tracking-[0.1em]">Why I didn&apos;t use it</p>
                <p className="mt-2 leading-relaxed">{p.alternative.whyNot}</p>
              </div>
              <div className="rounded-theme border border-mineral/40 bg-mineral/5 p-5">
                <p className="label normal-case tracking-[0.1em] text-mineral">The approach</p>
                <p className="mt-2 leading-relaxed">{p.alternative.approach}</p>
              </div>
              <div className="rounded-theme border border-clay/40 bg-clay/5 p-5">
                <p className="label normal-case tracking-[0.1em] text-clay">The trade-off</p>
                <p className="mt-2 leading-relaxed">{p.alternative.tradeoff}</p>
              </div>
            </div>
          </Block>
        )}

        {p.implementation.length > 0 && (
          <Block label="Implementation" title="What's actually in it.">
            <ul className="flex flex-col gap-3">
              {p.implementation.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mineral"
                  />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {p.highlights.length > 0 && (
          <Block label="Technical highlights">
            <ul className="grid gap-3 sm:grid-cols-2">
              {p.highlights.map((h, i) => (
                <li key={i} className="rounded-theme bg-panel p-4 text-[0.95rem]">
                  {h}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {p.claims.length > 0 && (
          <Block label="Claims & evidence">
            <ul className="flex flex-col gap-4">
              {p.claims.map((c, i) => (
                <ClaimItem key={i} claim={c} />
              ))}
            </ul>
          </Block>
        )}

        {p.outcomes.length > 0 && (
          <Block label="Outcomes">
            <ul className="flex flex-col gap-2">
              {p.outcomes.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mineral" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </Block>
        )}
      </div>

      {/* Prev / next */}
      <nav
        className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
        aria-label="More projects"
      >
        {prev ? (
          <Link href={`/work/${prev.id}`} className="group rounded-theme border border-line p-5 hover:border-mineral">
            <span className="label flex items-center gap-2">
              <ArrowLeft size={13} /> Previous
            </span>
            <span className="mt-2 block text-lg group-hover:text-mineral">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/work/${next.id}`}
            className="group rounded-theme border border-line p-5 text-right hover:border-mineral sm:justify-self-end"
          >
            <span className="label flex items-center justify-end gap-2">
              Next <ArrowRight size={13} />
            </span>
            <span className="mt-2 block text-lg group-hover:text-mineral">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
