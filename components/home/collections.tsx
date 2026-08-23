import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Github, Globe, ImageOff } from "lucide-react";
import type { Project } from "@/lib/schemas";
import { Reveal, Stagger } from "@/components/ui/reveal";
import { TechIcon } from "@/lib/tech-icons";

/* Country pulled from the role/summary copy where the resume supports it. */
const REGION: Record<string, string> = {
  "plugged-in-scents": "United Kingdom",
  "seven-stars-stationery": "Qatar",
  "indiguard-security": "United Kingdom",
  "nh-livespace": "India",
  techynova: "India",
};

/** Production / client work — cream editorial band cards (reference style). */
export function ProductionWork({ projects }: { projects: Project[] }) {
  return (
    <Stagger className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {projects.map((p) => {
        const live = p.links.find((l) => l.kind === "live");
        const image = p.images[0];
        return (
          <Reveal as="article" key={p.id} className="h-full">
            <div className="group flex h-full flex-col overflow-hidden rounded-theme border border-surface/12 bg-sand shadow-sm transition-transform ease-systems hover:-translate-y-1">
              {/* Image slot — grayscale treatment; graceful placeholder until photos are added */}
              <div className="relative flex h-28 items-center justify-center overflow-hidden border-b border-surface/10 bg-surface/5">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                ) : (
                  <ImageOff size={20} className="text-surface/25" aria-hidden />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4 text-surface">
                <h3 className="font-display text-[1rem] font-semibold leading-tight">
                  <Link href={`/work/${p.id}`} className="hover:text-clay">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-surface/55">
                  {p.category}
                  {REGION[p.id] && <> · {REGION[p.id]}</>}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <ul className="flex items-center gap-1.5">
                    {p.technologies.slice(0, 5).map((t) => (
                      <li
                        key={t}
                        title={t}
                        className="grid h-7 w-7 place-items-center rounded-md border border-surface/12 bg-white/70 text-surface/70"
                      >
                        <TechIcon name={t} size={15} />
                      </li>
                    ))}
                  </ul>
                  {live && (
                    <a
                      href={live.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Visit ${p.title} (live site)`}
                      className="grid h-7 w-7 place-items-center rounded-md border border-surface/15 text-surface/60 transition-colors hover:border-clay hover:text-clay"
                    >
                      <Globe size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </Stagger>
  );
}

/** Additional builds — compact dark cards, deliberately lower weight. */
export function AdditionalBuilds({ projects }: { projects: Project[] }) {
  return (
    <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {projects.map((p) => {
        const repo = p.links.find((l) => l.kind === "repo");
        return (
          <Reveal as="article" key={p.id} className="h-full">
            <div className="card-dark flex h-full flex-col p-5">
              <h3 className="font-display text-[1.02rem] font-semibold">
                <Link href={`/work/${p.id}`} className="hover:text-gold">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted">
                {p.category}
              </p>
              <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                {p.summary}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <ul className="flex items-center gap-1.5">
                  {p.technologies.slice(0, 4).map((t) => (
                    <li key={t} title={t} className="text-muted/80">
                      <TechIcon name={t} size={14} />
                    </li>
                  ))}
                </ul>
                {repo ? (
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${p.title} on GitHub`}
                    className="text-muted transition-colors hover:text-gold"
                  >
                    <Github size={16} />
                  </a>
                ) : (
                  <Link
                    href={`/work/${p.id}`}
                    aria-label={`${p.title} details`}
                    className="text-muted transition-colors hover:text-gold"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </Reveal>
        );
      })}
    </Stagger>
  );
}

export function ViewAllLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-gold hover:gap-3"
    >
      {children} <ArrowRight size={14} aria-hidden />
    </Link>
  );
}
