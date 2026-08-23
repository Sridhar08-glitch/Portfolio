import { z } from "zod";
import siteJson from "@/content/site.json";
import themeJson from "@/content/theme.json";
import projectsJson from "@/content/projects.json";
import experienceJson from "@/content/experience.json";
import skillsJson from "@/content/skills.json";
import decisionsJson from "@/content/decisions.json";
import postsJson from "@/content/posts.json";
import {
  SiteSchema,
  ThemeSchema,
  ProjectsSchema,
  ExperiencesSchema,
  SkillsSchema,
  DecisionsSchema,
  PostsSchema,
  TIERS,
  type Project,
  type Content,
} from "./schemas";

/**
 * Parse a content file and, on failure, throw an error that names the file,
 * the offending path and what was expected — so a malformed field never renders
 * silently. This is what scripts/validate-content.mjs surfaces at build time.
 */
function parse<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown,
  file: string,
): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const lines = result.error.issues.map(
      (i) => `  • ${i.path.join(".") || "(root)"} — ${i.message}`,
    );
    throw new Error(
      `Invalid content in ${file}:\n${lines.join("\n")}\n\n` +
        `Fix the field above (an omitted field is fine; an invalid one is not).`,
    );
  }
  return result.data;
}

export const site = parse(SiteSchema, siteJson, "content/site.json");
export const baseTheme = parse(ThemeSchema, themeJson, "content/theme.json");
export const projects = parse(
  ProjectsSchema,
  projectsJson,
  "content/projects.json",
);
export const experience = parse(
  ExperiencesSchema,
  experienceJson,
  "content/experience.json",
);
export const skills = parse(SkillsSchema, skillsJson, "content/skills.json");
export const decisions = parse(
  DecisionsSchema,
  decisionsJson,
  "content/decisions.json",
);
export const posts = parse(PostsSchema, postsJson, "content/posts.json");

/* --------------------------------------------------------------- selectors */

/** Only public projects ever reach a page. */
export const publicProjects = projects.filter((p) => p.visibility === "public");

export function projectsByTier(tier: (typeof TIERS)[number]): Project[] {
  return publicProjects.filter((p) => p.tier === tier);
}

export function getProject(id: string): Project | undefined {
  return publicProjects.find((p) => p.id === id);
}

/**
 * Ordered list used for prev/next navigation and the work index. Flagship
 * first, then featured, production and additional — the visual hierarchy.
 */
const TIER_ORDER: Record<string, number> = {
  flagship: 0,
  featured: 1,
  production: 2,
  additional: 3,
};

export const orderedProjects = [...publicProjects].sort(
  (a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier],
);

export function adjacentProjects(id: string): {
  prev: Project | null;
  next: Project | null;
} {
  const i = orderedProjects.findIndex((p) => p.id === id);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? orderedProjects[i - 1] : null,
    next: i < orderedProjects.length - 1 ? orderedProjects[i + 1] : null,
  };
}

/** Distinct constraint keys actually used by public projects, in site order. */
export function activeConstraints() {
  const used = new Set(publicProjects.flatMap((p) => p.constraints));
  return site.constraints.filter((c) => used.has(c.key));
}

export function projectsForConstraint(key: string): Project[] {
  return publicProjects.filter((p) => p.constraints.includes(key));
}

/** Everything as one object, for the admin base snapshot and fingerprinting. */
export const content: Content = {
  site,
  theme: baseTheme,
  projects,
  experience,
  skills,
  decisions,
  posts,
};
