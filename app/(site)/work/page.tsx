import type { Metadata } from "next";
import { orderedProjects, activeConstraints } from "@/lib/content";
import { SectionHeading } from "@/components/ui/primitives";
import { WorkGrid } from "@/components/work/work-grid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Every system — flagship engineering projects, production client work and additional builds — filterable by the constraint it was built around.",
};

export default function WorkPage() {
  return (
    <section className="shell pt-14 sm:pt-20">
      <SectionHeading
        label="All work"
        title="The full body of work."
        intro="Every system across security, enterprise, offline, real-time, AI, mobile and commerce. Filter by the constraint each project was built around."
      />
      <div className="mt-10">
        <WorkGrid projects={orderedProjects} constraints={activeConstraints()} />
      </div>
    </section>
  );
}
