import { MapPin } from "lucide-react";
import type { Experience, SkillGroup } from "@/lib/schemas";
import { Reveal, Stagger } from "@/components/ui/reveal";
import { dateRange } from "@/lib/utils";
import { TechIcon } from "@/lib/tech-icons";

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  return (
    <div className="relative mt-10 flex flex-col gap-10">
      {/* timeline spine */}
      <span
        aria-hidden
        className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-gold/70 via-line to-transparent"
      />
      {experience.map((job) => (
        <Reveal
          as="article"
          key={job.id}
          className="relative grid gap-4 pl-8 md:grid-cols-[1fr_2fr] md:gap-10"
        >
          <span
            aria-hidden
            className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-gold bg-surface shadow-[0_0_12px_rgb(var(--c-gold)/0.5)]"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold">{job.company}</h3>
              {job.current && (
                <span className="rounded-full bg-gold px-2 py-0.5 font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-surface">
                  Now
                </span>
              )}
            </div>
            <p className="mt-1 font-medium text-gold">{job.role}</p>
            <p className="mt-1.5 font-mono text-xs text-muted">{dateRange(job.start, job.end)}</p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted">
              <MapPin size={12} aria-hidden /> {job.location}
            </p>
          </div>
          <div>
            <p className="leading-relaxed text-muted">{job.summary}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {job.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-[0.95rem] leading-relaxed">
                  <span aria-hidden className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-gold" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <Reveal as="article" key={g.id} className="h-full">
          <div className="card-dark h-full p-5">
            <h3 className="font-display text-lg font-semibold">{g.name}</h3>
            {g.blurb && <p className="mt-1 text-sm text-muted">{g.blurb}</p>}
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-theme border border-line bg-surface/50 px-2 py-1 font-mono text-[0.7rem] text-ink/85"
                >
                  <TechIcon name={item} size={12} className="text-muted" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </Stagger>
  );
}
