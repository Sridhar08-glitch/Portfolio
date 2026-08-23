# Project state

_Read this before modifying anything in a new session._

## Status: complete and building

All phases done. `npm run check` and `npm run build` pass; site verified in-browser
with no console errors.

## What was built

- **Foundation** — Next.js 14 App Router, TS strict, Tailwind, Zod schemas, two-preset
  theme system, validated content loaders, content-validation script.
- **Content** — all 20 projects, experience, skills, 8 engineering decisions, site
  config, drawn from the resume. 6 flagship case studies, 4 featured, 5 production,
  4 additional, 1 hidden (none — all public).
- **Shell** — root layout (server-inlined theme, no flash), `(site)` group with nav +
  footer, standalone `/admin`, SEO (metadata, sitemap, robots, Person + CreativeWork
  JSON-LD), 404.
- **Home** — hero with interactive constraint→systems map; flagship bands (alternating,
  each with its own diagram grammar); production/additional collections; decisions
  accordion; experience; skills; writing empty state.
- **Diagrams** — 9 distinct grammars (funnel/stream/lattice/projection/clusters/review/
  hub/spatial/journey). ShieldDNS funnel is the signature interaction (replayable,
  once-on-view, reduced-motion safe, shows both ALLOW and BLOCK paths).
- **Work** — filterable index + static case-study pages with prev/next.
- **Admin** — soft gate, localStorage draft + banner, fingerprint stale detection +
  3-way rebase with conflict report, projects CRUD + dnd-kit reorder + show/hide,
  site/experience/skills/decisions/writing editors, theme editor with live preview +
  WCAG contrast audit, JSON import (validated) + ZIP export of changed files + discard.

## Key decisions / gotchas

- `lib/content.ts` `parse()` uses `<S extends z.ZodTypeAny>` returning `z.infer<S>` —
  needed so Zod `.default()` fields type as required (output), not optional (input).
- Public pages ship **zero theme JS**: tokens are inlined on `<html>` server-side in
  `app/layout.tsx`. The admin applies themes to a scoped preview only.
- Admin uses a hardcoded dark palette (`adminBg`, `adminAccent`, … in tailwind.config)
  — intentionally not theme-driven; it's a tool.
- `clay` was darkened to `150 82 55` after the theme editor's own contrast audit flagged
  the original `185 121 93` at 2.87 (below AA). Changed in `theme.json` + both presets.
- Fonts: Space Grotesk / Inter / JetBrains Mono via `next/font/google` (Clash Display
  from the plan isn't on Google, so Space Grotesk substitutes for display).
- Route types: after moving pages into `(site)`, delete `.next` before `tsc` if you see
  stale `.next/types` errors — a fresh `next build` regenerates them.

## Open items (see GAPS.md)

- Add real LinkedIn URL and production `siteUrl`.
- Add project screenshots to `public/images` + each project's `images` array.
- Re-verify the two `measured` claims (MeetingMind 14 ms, Airsume taxonomy counts).
