import {
  site,
  projectsByTier,
  projectsForConstraint,
  activeConstraints,
  publicProjects,
  decisions,
  experience,
  skills,
  posts,
} from "@/lib/content";
import { SectionHeading } from "@/components/ui/primitives";
import { Hero } from "@/components/home/hero";
import { SystemsHub } from "@/components/home/systems-hub";
import { FeaturedSystems } from "@/components/home/featured-systems";
import { ProductionWork, ViewAllLink } from "@/components/home/collections";
import { AboutBand, WhatIDo } from "@/components/home/stats-about";
import { Decisions, DecisionPrinciples } from "@/components/home/decisions";
import { ExperiencePanel } from "@/components/home/experience-panel";
import { SkillsGrid } from "@/components/home/experience-skills";
import { WritingTeaser } from "@/components/home/writing-teaser";
import { ContactSection } from "@/components/home/contact-section";

export default function HomePage() {
  const flagship = projectsByTier("flagship");
  const featured = projectsByTier("featured");
  const production = projectsByTier("production");

  const counts: Record<string, number> = {};
  for (const c of activeConstraints()) {
    counts[c.key] = projectsForConstraint(c.key).length;
  }

  const projectTitles = Object.fromEntries(
    publicProjects.map((p) => [p.id, p.title]),
  );

  return (
    <>
      <Hero
        site={site}
        systems={publicProjects.length}
        clientPlatforms={production.length}
        domains={activeConstraints().length}
      />

      <section className="shell mt-16 scroll-mt-24 sm:mt-24" id="systems">
        <SectionHeading
          index="01"
          label="Systems I build"
          title="Seven constraints, one builder."
          intro="Every project here is organised around a hard constraint. Hover a domain to see it light up — click to filter the work."
        />
        <div className="mt-10">
          <SystemsHub
            constraints={site.constraints}
            counts={counts}
            total={publicProjects.length}
          />
        </div>

        <div className="mt-20">
          <SectionHeading
            label="Featured systems"
            title="Seven systems, seven different problems."
            intro="Each flagship is organised around a genuinely different constraint — and drawn with a different visual grammar, because the architecture is what makes it interesting."
            action={<ViewAllLink href="/work">Explore all systems</ViewAllLink>}
          />
        </div>
        <FeaturedSystems flagship={flagship} featured={featured} />
      </section>

      {/* Production client work — cream editorial band */}
      <section className="band-cream mt-24 sm:mt-32">
        <div className="shell py-16 sm:py-20">
          <SectionHeading
            index="02"
            label="Production client work"
            title="Shipped for real businesses."
            intro="Client platforms delivered end to end at Techynova for UK and Qatar businesses — architecture, backend, frontend, deployment and direct client communication."
            cream
            action={<ViewAllLink href="/work">View all projects</ViewAllLink>}
          />
          <ProductionWork projects={production} />
        </div>
      </section>

      <WhatIDo site={site} />

      <section className="shell mt-24 scroll-mt-24 sm:mt-32" id="decisions">
        <SectionHeading
          index="03"
          label="Engineering decisions"
          title="How I think about trade-offs."
          intro="The reasoning underneath the software — written for engineers who want to go deeper than the feature list."
        />
        <Decisions decisions={decisions} projectTitles={projectTitles} />
        <DecisionPrinciples />
      </section>

      <section className="shell mt-24 scroll-mt-24 sm:mt-32" id="experience">
        <SectionHeading
          index="04"
          label="Career timeline"
          title="Where I've worked."
          intro="Two roles, one delivery record — the client platforms were shipped end to end during the Techynova years."
        />
        <ExperiencePanel experience={experience} />
      </section>

      <section className="shell mt-24 sm:mt-32" id="skills">
        <SectionHeading
          index="05"
          label="Skills"
          title="Organised around capability, not logos."
        />
        <SkillsGrid groups={skills} />
      </section>

      <AboutBand site={site} />

      <section className="shell mt-24 scroll-mt-24 sm:mt-32" id="writing">
        <SectionHeading index="06" label="Writing" title="Notes, when they're ready." />
        <WritingTeaser posts={posts} />
      </section>

      <ContactSection site={site} />
    </>
  );
}
