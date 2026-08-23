import Image from "next/image";
import {
  CloudCog,
  Database,
  Quote,
  Radio,
  ServerCog,
  Settings2,
  Sparkles,
} from "lucide-react";
import type { Site } from "@/lib/schemas";
import { Reveal, Stagger } from "@/components/ui/reveal";
import { Cta } from "@/components/ui/primitives";

/** Honest, computed stats + personal quote strip (reference bottom band). */
export function StatsBand({
  site,
  systems,
  technologies,
  domains,
}: {
  site: Site;
  systems: number;
  technologies: number;
  domains: number;
}) {
  const stats: [string, string][] = [
    ["3+", "Years experience"],
    [`${systems}`, "Systems built"],
    [`${technologies}+`, "Technologies"],
    [`${domains}`, "Problem domains"],
  ];
  return (
    <section className="mt-24 border-y border-line bg-panel/60 sm:mt-32">
      <div className="shell grid items-center gap-8 py-10 lg:grid-cols-[1.2fr_1fr_auto]">
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map(([value, label]) => (
            <Reveal as="div" key={label}>
              <dt className="sr-only">{label}</dt>
              <dd>
                <span
                  className="serif block bg-clip-text text-4xl font-semibold text-transparent sm:text-5xl"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
                  }}
                >
                  {value}
                </span>
                <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                  {label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>

        {site.quote && (
          <Reveal as="div" className="flex gap-3 border-line lg:border-l lg:pl-8">
            <Quote size={20} className="mt-1 shrink-0 text-gold" aria-hidden />
            <div>
              <p className="serif text-lg italic leading-snug">{site.quote}</p>
              <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                — {site.name}
              </p>
            </div>
          </Reveal>
        )}

        {site.aboutPortrait && (
          <Reveal as="div" className="hidden justify-self-end lg:block">
            <Image
              src={site.aboutPortrait.src}
              alt={site.aboutPortrait.alt}
              width={96}
              height={96}
              className="h-24 w-24 rounded-theme border border-gold/40 object-cover object-top"
            />
          </Reveal>
        )}
      </div>
    </section>
  );
}

/** "What I do" — capability tiles, every line backed by the resume. */
const SERVICES: { icon: React.ElementType; title: string; body: string }[] = [
  {
    icon: Settings2,
    title: "System design",
    body: "Architecture that outlives the framework — clean boundaries, metadata-driven design, event sourcing.",
  },
  {
    icon: ServerCog,
    title: "Backend development",
    body: "Django REST services with versioned contracts, JWT authentication and role-based access control.",
  },
  {
    icon: Radio,
    title: "Real-time systems",
    body: "WebSockets, live tracking and notification pipelines that make software feel immediate.",
  },
  {
    icon: Database,
    title: "Database engineering",
    body: "PostgreSQL schema design, indexing strategy and query tuning under production load.",
  },
  {
    icon: CloudCog,
    title: "Deployment & operations",
    body: "Linux VPS administration, Nginx, HTTPS, environment separation, backups and post-release support.",
  },
  {
    icon: Sparkles,
    title: "Self-hosted AI",
    body: "OCR, computer vision and meeting intelligence — trained and served entirely on owned hardware.",
  },
];

export function WhatIDo({ site }: { site: Site }) {
  return (
    <section className="shell mt-24 sm:mt-32">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr]">
        <Reveal as="div">
          <p className="label">What I do</p>
          <h2 className="serif mt-3 text-3xl sm:text-4xl">
            Design, build and ship systems that{" "}
            <em className="text-gold">last.</em>
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            I partner with businesses and teams to build secure, reliable
            software — and I stay with it from the first schema sketch to the
            production server.
          </p>
          {site.email && (
            <div className="mt-6">
              <Cta href={`mailto:${site.email}`} variant="ghost" external>
                Let&apos;s collaborate
              </Cta>
            </div>
          )}
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Reveal as="div" key={s.title} className="h-full">
              <div className="card-dark h-full p-5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-mineral/12 text-mineral">
                  <s.icon size={18} aria-hidden />
                </span>
                <h3 className="mt-3.5 font-display text-[1.02rem] font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** About — cream editorial band with portrait. */
export function AboutBand({ site }: { site: Site }) {
  if (!site.aboutBody.length) return null;
  return (
    <section id="about" className="band-cream mt-24 scroll-mt-24 sm:mt-32">
      <div className="shell grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.6fr]">
        <Reveal as="div">
          <p className="label">About</p>
          <h2 className="serif mt-3 text-3xl sm:text-4xl">
            Systems first,
            <br />
            <em className="text-clay">frameworks second.</em>
          </h2>
          {site.aboutPortrait && (
            <Image
              src={site.aboutPortrait.src}
              alt={site.aboutPortrait.alt}
              width={site.aboutPortrait.width ?? 420}
              height={site.aboutPortrait.height ?? 280}
              className="mt-7 w-full max-w-sm rounded-theme border border-surface/15 object-cover"
            />
          )}
        </Reveal>
        <Reveal as="div" className="flex flex-col gap-5 self-center">
          {site.aboutBody.map((para, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "text-xl font-medium leading-relaxed text-surface"
                  : "leading-relaxed text-surface/70"
              }
            >
              {para}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
