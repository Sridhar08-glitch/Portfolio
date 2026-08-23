import JSZip from "jszip";
import type { Content } from "./schemas";
import { fingerprint } from "./utils";

/**
 * Export only the content files that actually changed versus the published base,
 * as a ZIP the developer unzips over /content and commits. We never touch the
 * repo directly — the developer stays in control of what gets published.
 */

type FileMap = Record<string, unknown>;

function contentToFiles(c: Content): FileMap {
  return {
    "content/site.json": c.site,
    "content/theme.json": c.theme,
    "content/projects.json": c.projects,
    "content/experience.json": c.experience,
    "content/skills.json": c.skills,
    "content/decisions.json": c.decisions,
    "content/posts.json": c.posts,
  };
}

export function changedFiles(draft: Content, base: Content): string[] {
  const d = contentToFiles(draft);
  const b = contentToFiles(base);
  return Object.keys(d).filter((k) => fingerprint(d[k]) !== fingerprint(b[k]));
}

export async function buildExportZip(
  draft: Content,
  base: Content,
  now: string,
): Promise<Blob> {
  const zip = new JSZip();
  const files = contentToFiles(draft);
  const changed = changedFiles(draft, base);

  for (const path of changed) {
    zip.file(path, JSON.stringify(files[path], null, 2) + "\n");
  }

  const readme = [
    "# Portfolio content export",
    "",
    `Generated: ${now}`,
    "",
    "## Changed files",
    ...changed.map((f) => `- ${f}`),
    "",
    "## How to publish",
    "1. Unzip this archive at the root of the portfolio repository.",
    "2. It overwrites only the files listed above under `content/`.",
    "3. Run `npm run check` to validate the content.",
    "4. Commit and push — Vercel rebuilds and the changes go live.",
    "",
    "Visitors keep seeing the previously published version until you commit.",
  ].join("\n");
  zip.file("EXPORT_README.md", readme);

  return zip.generateAsync({ type: "blob" });
}
