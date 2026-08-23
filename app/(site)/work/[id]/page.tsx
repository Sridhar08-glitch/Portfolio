import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProject,
  orderedProjects,
  adjacentProjects,
  site,
} from "@/lib/content";
import { projectJsonLd, absoluteUrl } from "@/lib/seo";
import { ProjectDetail } from "@/components/work/project-detail";

export function generateStaticParams() {
  return orderedProjects.map((p) => ({ id: p.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const p = getProject(params.id);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: absoluteUrl(`/work/${p.id}`) },
    openGraph: {
      title: `${p.title} — ${site.name}`,
      description: p.summary,
      url: absoluteUrl(`/work/${p.id}`),
      type: "article",
    },
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = getProject(params.id);
  if (!project) notFound();

  const { prev, next } = adjacentProjects(project.id);
  const constraintLabels = Object.fromEntries(
    site.constraints.map((c) => [c.key, c.label]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
      <ProjectDetail
        project={project}
        prev={prev}
        next={next}
        constraintLabels={constraintLabels}
        site={site}
      />
    </>
  );
}
