import { MapPin } from "lucide-react";
import type { Experience, SkillGroup } from "@/lib/schemas";
import { Reveal } from "@/components/ui/reveal";
import { dateRange } from "@/lib/utils";

export function ExperienceTimeline({ experience }: { experience: Experience[] }) {
  return (
    <div className="mt-8 flex flex-col gap-8">
      {experience.map((job) => (
        <Reveal
          as="article"
          key={job.id}
          className="grid gap-4 border-l-2 border-line pl-6 md:grid-cols-[1fr_2fr] md:gap-8"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl">{job.company}</h3>
              {job.current && (
                <span className="rounded-full bg-mineral px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] on-dark">
                  Now
                </span>
              )}
            </div>
            <p className="mt-1 font-medium text-mineral">{job.role}</p>
            <p className="mt-1 font-mono text-xs text-muted">
              {dateRange(job.start, job.end)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-muted">
              <MapPin size={12} aria-hidden /> {job.location}
            </p>
          </div>
          <div>
            <p className="text-muted">{job.summary}</p>
            <ul className="mt-4 flex flex-col gap-2">
              {job.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-[0.95rem]">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mineral" />
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
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => (
        <Reveal as="article" key={g.id} className="rounded-theme border border-line p-5">
          <h3 className="font-display text-lg">{g.name}</h3>
          {g.blurb && <p className="mt-1 text-sm text-muted">{g.blurb}</p>}
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {g.items.map((item) => (
              <li
                key={item}
                className="rounded-theme bg-panel px-2.5 py-1 font-mono text-[0.72rem] text-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
