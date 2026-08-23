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
import { FeaturedSystems } from "@/components/home/featured-systems";
import { ProductionWork, AdditionalBuilds } from "@/components/home/collections";
import { Decisions } from "@/components/home/decisions";
import {
  ExperienceTimeline,
  SkillsGrid,
} from "@/components/home/experience-skills";
import { WritingTeaser } from "@/components/home/writing-teaser";

export default function HomePage() {
  const flagship = projectsByTier("flagship");
  const featured = projectsByTier("featured");
  const production = projectsByTier("production");
  const additional = projectsByTier("additional");

  // Constraint → project chips for the hero map.
  const groups: Record<string, { id: string; title: string }[]> = {};
  for (const c of activeConstraints()) {
    groups[c.key] = projectsForConstraint(c.key).map((p) => ({
      id: p.id,
      title: p.title,
    }));
  }

  const projectTitles = Object.fromEntries(
    publicProjects.map((p) => [p.id, p.title]),
  );

  return (
    <>
      <Hero site={site} groups={groups} total={publicProjects.length} />

      <section className="shell mt-24 sm:mt-32">
        <SectionHeading
          index="01"
          label="Selected systems"
          title="Six systems, six different problems."
          intro="Each flagship is organised around a genuinely different constraint — and drawn with a different visual grammar, because the architecture is what makes it interesting."
        />
        <FeaturedSystems flagship={flagship} featured={featured} />
      </section>

      <section className="shell mt-24 sm:mt-32">
        <SectionHeading
          index="02"
          label="Production work"
          title="Shipped for real businesses."
          intro="Client platforms delivered end to end at Techynova for UK and Qatar businesses — architecture, backend, frontend, deployment and direct client communication."
        />
        <ProductionWork projects={production} />
      </section>

      <section className="shell mt-24 sm:mt-32">
        <SectionHeading
          index="03"
          label="Additional builds"
          title="Earlier and smaller work."
          intro="Useful projects kept deliberately at a lower visual weight — mobile, civic, inventory and cafeteria systems."
        />
        <AdditionalBuilds projects={additional} />
      </section>

      <section className="shell mt-24 scroll-mt-24 sm:mt-32" id="decisions">
        <SectionHeading
          index="04"
          label="Engineering decisions"
          title="How I think about trade-offs."
          intro="The reasoning underneath the software — written for engineers who want to go deeper than the feature list."
        />
        <Decisions decisions={decisions} projectTitles={projectTitles} />
      </section>

      <section className="shell mt-24 scroll-mt-24 sm:mt-32" id="experience">
        <SectionHeading
          index="05"
          label="Experience"
          title="Where I've worked."
        />
        <ExperienceTimeline experience={experience} />
      </section>

      <section className="shell mt-24 sm:mt-32" id="skills">
        <SectionHeading
          index="06"
          label="Skills"
          title="Organised around capability, not logos."
        />
        <SkillsGrid groups={skills} />
      </section>

      <section className="shell mt-24 scroll-mt-24 sm:mt-32" id="writing">
        <SectionHeading index="07" label="Writing" title="Notes, when they're ready." />
        <WritingTeaser posts={posts} />
      </section>
    </>
  );
}
