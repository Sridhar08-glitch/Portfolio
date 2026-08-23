// Lightweight content gate for `npm run check`. Full Zod schema validation runs
// during `next build` (lib/content.ts throws on malformed content) and types are
// checked by `tsc`. This script enforces the invariants that matter most for
// credibility: unique ids, valid enums, and the claim/evidence rule.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const TIERS = ["flagship", "featured", "production", "additional"];
const STATUSES = [
  "production",
  "client-delivered",
  "personal",
  "in-development",
  "prototype",
  "research",
  "training",
  "academic",
];
const CLAIM_KINDS = ["measured", "design-target", "qualitative"];

const errors = [];
const warnings = [];
const measured = [];

const projects = read("content/projects.json");
const site = read("content/site.json");

const ids = new Set();
for (const p of projects) {
  const where = `projects.json → "${p.title ?? p.id ?? "?"}"`;
  if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) errors.push(`${where}: id must be kebab-case`);
  if (ids.has(p.id)) errors.push(`${where}: duplicate id "${p.id}"`);
  ids.add(p.id);
  if (!TIERS.includes(p.tier)) errors.push(`${where}: invalid tier "${p.tier}"`);
  if (!STATUSES.includes(p.status)) errors.push(`${where}: invalid status "${p.status}"`);
  for (const field of ["title", "category", "role", "summary"]) {
    if (!p[field] || typeof p[field] !== "string") errors.push(`${where}: missing "${field}"`);
  }
  const knownConstraints = new Set((site.constraints ?? []).map((c) => c.key));
  for (const c of p.constraints ?? []) {
    if (!knownConstraints.has(c)) warnings.push(`${where}: constraint "${c}" not defined in site.json`);
  }
  for (const claim of p.claims ?? []) {
    if (!CLAIM_KINDS.includes(claim.kind))
      errors.push(`${where}: claim has invalid kind "${claim.kind}"`);
    if (!claim.source || !claim.source.trim())
      errors.push(`${where}: claim "${claim.statement}" has no source (evidence required)`);
    if (claim.kind === "measured") measured.push(`${p.title}: ${claim.statement}`);
  }
}

console.log(`\nContent check — ${projects.length} projects`);
if (measured.length) {
  console.log(`\nMeasured claims (each must trace to real evidence):`);
  for (const m of measured) console.log(`  • ${m}`);
}
if (warnings.length) {
  console.log(`\nWarnings:`);
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (errors.length) {
  console.error(`\n✗ ${errors.length} content error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(`\n✓ Content valid.\n`);
