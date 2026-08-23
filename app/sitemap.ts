import type { MetadataRoute } from "next";
import { orderedProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/writing"].map((path) => ({
    url: absoluteUrl(path || "/"),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projectRoutes = orderedProjects.map((p) => ({
    url: absoluteUrl(`/work/${p.id}`),
    changeFrequency: "monthly" as const,
    priority: p.tier === "flagship" ? 0.9 : 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
