import { z } from "zod";

/**
 * Every content file is validated against these schemas at load time and by
 * scripts/validate-content.mjs at build time. TypeScript types are derived with
 * z.infer so the data and the code can never drift apart.
 *
 * Guiding rule (from the brief): an omitted field is correct behaviour; an
 * invented one is a defect. Optional fields exist precisely so that missing
 * information stays missing instead of being filled with plausible copy.
 */

/* ------------------------------------------------------------------ claims */
/**
 * Any statement a visitor could read as a fact carries its evidence class.
 * - measured:      a real, observed number (requires a source)
 * - design-target: an intended goal, presented as such
 * - qualitative:   a descriptive engineering fact with no number to prove
 */
export const ClaimSchema = z.object({
  statement: z.string().min(1),
  kind: z.enum(["measured", "design-target", "qualitative"]),
  source: z.string().min(1),
});
export type Claim = z.infer<typeof ClaimSchema>;

/* ------------------------------------------------------------------- links */
export const LinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  kind: z.enum(["repo", "live", "demo", "docs", "other"]).default("other"),
});
export type Link = z.infer<typeof LinkSchema>;

/* ---------------------------------------------------------------- diagrams */
/**
 * Each flagship gets a genuinely different visual grammar. The `kind` selects
 * the React component that draws it; `stages` carries the labelled data; and
 * `caption` is the mandatory text alternative that screen readers announce and
 * that renders as a <figcaption>, so no diagram is meaning-only-if-you-can-see.
 */
export const DiagramStageSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().optional(),
});
export type DiagramStage = z.infer<typeof DiagramStageSchema>;

export const DiagramSchema = z.object({
  kind: z.enum([
    "funnel", // ShieldDNS — vertical decision pipeline
    "stream", // event / knowledge stream
    "lattice", // multi-tenant isolation
    "projection", // command -> event -> projection
    "clusters", // offline devices + sync bridge
    "review", // document -> confidence -> human review
    "hub", // hub-and-spoke operational workflow
    "spatial", // city -> lane spatial model
    "journey", // mobile service lifecycle
    "none",
  ]),
  caption: z.string().min(1),
  stages: z.array(DiagramStageSchema).default([]),
});
export type Diagram = z.infer<typeof DiagramSchema>;

/* --------------------------------------------------------- image reference */
export const ImageRefSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});
export type ImageRef = z.infer<typeof ImageRefSchema>;

/* ---------------------------------------------------- "obvious vs actual" */
export const AlternativeSchema = z.object({
  obvious: z.string().min(1),
  whyNot: z.string().min(1),
  approach: z.string().min(1),
  tradeoff: z.string().min(1),
});
export type Alternative = z.infer<typeof AlternativeSchema>;

/* ---------------------------------------------------------------- project */
export const TIERS = ["flagship", "featured", "production", "additional"] as const;
export const STATUSES = [
  "production",
  "client-delivered",
  "personal",
  "in-development",
  "prototype",
  "research",
  "training",
  "academic",
] as const;

export const ProjectSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "id must be kebab-case"),
  title: z.string().min(1),
  category: z.string().min(1),
  tier: z.enum(TIERS),
  status: z.enum(STATUSES),
  visibility: z.enum(["public", "private"]).default("public"),
  featured: z.boolean().default(false),
  accent: z.enum(["mineral", "blue", "clay", "gold"]).default("mineral"),
  role: z.string().min(1),
  /** One or two sentences a recruiter understands (target 25-40 words). */
  summary: z.string().min(1),
  /** Constraint tags this system is organised around (keys from site.constraints). */
  constraints: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  /** Who this system serves and where it fits — shown atop the case study. */
  audience: z
    .object({ who: z.string().min(1), where: z.string().min(1) })
    .optional(),
  /** Deep case-study fields — all optional; present only when supported. */
  problem: z.string().optional(),
  constraintsNarrative: z.string().optional(),
  architecture: z.string().optional(),
  decision: z
    .object({ title: z.string().min(1), body: z.string().min(1) })
    .optional(),
  tradeoff: z.string().optional(),
  alternative: AlternativeSchema.optional(),
  implementation: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
  claims: z.array(ClaimSchema).default([]),
  links: z.array(LinkSchema).default([]),
  images: z.array(ImageRefSchema).default([]),
  diagram: DiagramSchema.optional(),
});
export type Project = z.infer<typeof ProjectSchema>;
export const ProjectsSchema = z.array(ProjectSchema);

/* ------------------------------------------------------------- experience */
export const ExperienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  current: z.boolean().default(false),
  summary: z.string().min(1),
  bullets: z.array(z.string()).default([]),
});
export type Experience = z.infer<typeof ExperienceSchema>;
export const ExperiencesSchema = z.array(ExperienceSchema);

/* ----------------------------------------------------------------- skills */
export const SkillGroupSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  blurb: z.string().optional(),
  items: z.array(z.string().min(1)).min(1),
});
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
export const SkillsSchema = z.array(SkillGroupSchema);

/* --------------------------------------------------- engineering decisions */
export const DecisionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  projects: z.array(z.string()).default([]),
});
export type Decision = z.infer<typeof DecisionSchema>;
export const DecisionsSchema = z.array(DecisionSchema);

/* --------------------------------------------------------------- writing */
export const PostSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  body: z.string().default(""),
});
export type Post = z.infer<typeof PostSchema>;
export const PostsSchema = z.array(PostSchema);

/* ------------------------------------------------------------ site config */
export const ConstraintSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  blurb: z.string().min(1),
});
export type Constraint = z.infer<typeof ConstraintSchema>;

export const SiteSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  heroThesis: z.string().min(1),
  heroSupport: z.string().min(1),
  location: z.string().min(1),
  availability: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  siteUrl: z.string().url(),
  constraints: z.array(ConstraintSchema).min(1),
  portrait: ImageRefSchema.optional(),
  aboutPortrait: ImageRefSchema.optional(),
  aboutBody: z.array(z.string()).default([]),
  quote: z.string().optional(),
});
export type Site = z.infer<typeof SiteSchema>;

/* ------------------------------------------------------------------ theme */
export const ThemeColorsSchema = z.object({
  mineral: z.string(),
  blue: z.string(),
  sand: z.string(),
  clay: z.string(),
  gold: z.string(),
  surface: z.string(),
  ink: z.string(),
  muted: z.string(),
  line: z.string(),
  panel: z.string(),
});
export type ThemeColors = z.infer<typeof ThemeColorsSchema>;

export const ThemeSchema = z.object({
  preset: z.string().min(1),
  colors: ThemeColorsSchema,
  fonts: z.object({
    display: z.string().min(1),
    body: z.string().min(1),
    mono: z.string().min(1),
  }),
  radius: z.string().min(1),
  spacing: z.enum(["compact", "regular", "roomy"]).default("regular"),
  motion: z.enum(["off", "subtle", "moderate"]).default("moderate"),
  projectLayout: z.enum(["bands", "grid"]).default("bands"),
  showPortrait: z.boolean().default(true),
  showWriting: z.boolean().default(true),
});
export type Theme = z.infer<typeof ThemeSchema>;

/* --------------------------------------------------- aggregate site content */
export const ContentSchema = z.object({
  site: SiteSchema,
  theme: ThemeSchema,
  projects: ProjectsSchema,
  experience: ExperiencesSchema,
  skills: SkillsSchema,
  decisions: DecisionsSchema,
  posts: PostsSchema,
});
export type Content = z.infer<typeof ContentSchema>;
