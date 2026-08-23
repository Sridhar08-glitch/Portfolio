# Project state

_Read this before modifying anything in a new session._

## v2 redesign (approved reference images)

The site was fully reskinned to the owner's reference set: **verdant dark**
(forest-green canvas + cream bands + gold/copper), Fraunces serif hero,
animated radial constraint hub, icon-pipeline diagrams for every project
(stage→icon resolver in `components/systems/stage-icon.tsx`), mini icon
elaborations on all cards, instrument-panel detail pages (TOC sidebar, honest
stat chips, who-it's-for/where-it-fits, four-panel alternatives, colored brand
logos), sidebar-filtered /work index, decisions filters + principles row,
interactive experience panel, Resend contact form (`/api/contact`,
`RESEND_API_KEY`), resume PDF (`public/resume/`), and a deterministic chat
assistant (`lib/assistant.ts` + `components/chat/`). Reference mockups'
invented metrics/employers/tech were deliberately NOT copied — layouts adopted,
facts kept real. Shell widened to 96rem.

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
