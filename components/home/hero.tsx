import Image from "next/image";
import { HeroMap } from "./hero-map";
import { Cta } from "@/components/ui/primitives";
import type { Site, Project } from "@/lib/schemas";

export function Hero({
  site,
  groups,
  total,
}: {
  site: Site;
  groups: Record<string, Pick<Project, "id" | "title">[]>;
  total: number;
}) {
  return (
    <section className="shell pt-14 sm:pt-20">
      <div className="grid items-start gap-8 lg:grid-cols-[1.55fr_1fr]">
        <div>
          <p className="label">{site.role} · {site.location}</p>
          {/* Hero text renders immediately — never animation-delayed. */}
          <h1 className="mt-5 text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
            {site.heroThesis}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {site.heroSupport}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Cta href="/work">See the systems</Cta>
            {site.email && (
              <Cta href={`mailto:${site.email}`} variant="ghost" external>
                Get in touch
              </Cta>
            )}
          </div>
        </div>

        {site.portrait && (
          <div className="justify-self-start lg:justify-self-end">
            <div className="relative w-fit">
              <Image
                src={site.portrait.src}
                alt={site.portrait.alt}
                width={site.portrait.width ?? 240}
                height={site.portrait.height ?? 300}
                priority
                className="rounded-theme border border-line grayscale"
                sizes="(max-width: 1024px) 40vw, 240px"
              />
              <div className="mt-3 max-w-[240px]">
                <p className="font-display text-lg">{site.name}</p>
                <p className="mt-1 text-sm text-muted">{site.availability}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div id="areas" className="mt-14 scroll-mt-24 sm:mt-16">
        <HeroMap
          constraints={site.constraints}
          groups={groups}
          total={total}
        />
      </div>
    </section>
  );
}
