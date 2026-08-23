import Link from "next/link";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import type { Project } from "@/lib/schemas";
import { Reveal } from "@/components/ui/reveal";
import { TechList } from "@/components/ui/primitives";

/* Production / client work — horizontal rows that read as a delivery record. */
export function ProductionWork({ projects }: { projects: Project[] }) {
  return (
    <ul className="mt-8 divide-y divide-line border-y border-line">
      {projects.map((p) => {
        const live = p.links.find((l) => l.kind === "live");
        return (
          <Reveal as="li" key={p.id} className="group">
            <div className="grid gap-3 py-6 md:grid-cols-[1.2fr_1.4fr_auto] md:items-center md:gap-6">
              <div>
                <h3 className="text-xl">
                  <Link href={`/work/${p.id}`} className="hover:text-mineral">
                    {p.title}
                  </Link>
                </h3>
                <p className="label mt-1 normal-case tracking-[0.1em]">{p.category}</p>
              </div>
              <p className="text-sm text-muted">{p.summary}</p>
              <div className="flex items-center gap-3 md:justify-end">
                <TechList items={p.technologies} limit={3} className="hidden lg:flex" />
                {live && (
                  <a
                    href={live.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-theme border border-line px-3 py-2 font-mono text-xs hover:bg-panel"
                  >
                    <Globe size={13} /> {live.label}
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}

/* Additional builds — compact, deliberately lower visual weight. */
export function AdditionalBuilds({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((p) => {
        const repo = p.links.find((l) => l.kind === "repo");
        return (
          <Reveal as="article" key={p.id} className="flex h-full flex-col rounded-theme border border-line p-5">
            <h3 className="text-lg">
              <Link href={`/work/${p.id}`} className="hover:text-mineral">
                {p.title}
              </Link>
            </h3>
            <p className="label mt-1 normal-case tracking-[0.08em]">{p.category}</p>
            <p className="mt-3 flex-1 text-sm text-muted">{p.summary}</p>
            <div className="mt-4 flex items-center justify-between">
              <TechList items={p.technologies} limit={2} />
              {repo ? (
                <a
                  href={repo.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${p.title} on GitHub`}
                  className="text-muted hover:text-mineral"
                >
                  <Github size={16} />
                </a>
              ) : (
                <Link href={`/work/${p.id}`} aria-label={`${p.title} details`} className="text-muted hover:text-mineral">
                  <ArrowUpRight size={16} />
                </Link>
              )}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
