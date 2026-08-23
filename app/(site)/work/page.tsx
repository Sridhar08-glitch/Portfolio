import type { Metadata } from "next";
import { orderedProjects, activeConstraints, site } from "@/lib/content";
import { WorkGrid, WorkStats } from "@/components/work/work-grid";
import { Cta } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every system — flagship engineering projects, production client work and additional builds — filterable by tier, domain and status.",
};

export default function WorkPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="grid-field pointer-events-none absolute inset-0" aria-hidden />
        <div className="shell relative flex flex-wrap items-end justify-between gap-8 py-14 sm:py-16">
          <div className="max-w-xl">
            <p className="label">Home / Projects</p>
            <h1 className="serif mt-4 text-5xl sm:text-6xl">
              Projects{" "}
              <em
                className="bg-clip-text italic text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
                }}
              >
                I&apos;ve built.
              </em>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              A collection of systems, applications and tools — each built around
              a real constraint. Filter by tier, domain or status.
            </p>
          </div>
          <WorkStats projects={orderedProjects} />
        </div>
      </section>

      <section className="shell py-12">
        <WorkGrid projects={orderedProjects} constraints={activeConstraints()} />
      </section>

      {/* CTA band */}
      <section className="shell">
        <div
          className="card-dark flex flex-wrap items-center justify-between gap-6 p-8 sm:p-10"
          style={{ "--glow": "rgb(var(--c-gold) / 0.4)" } as React.CSSProperties}
        >
          <div>
            <h2 className="font-display text-2xl font-semibold">Have a project in mind?</h2>
            <p className="mt-2 max-w-md text-muted">
              I&apos;m always open to discussing new problems and building
              carefully engineered solutions.
            </p>
          </div>
          {site.email && (
            <Cta href={`mailto:${site.email}`} external>
              Let&apos;s build something
            </Cta>
          )}
        </div>
      </section>
    </>
  );
}
