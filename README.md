# Sridhar Mahalingam — Systems Engineering Portfolio

A premium personal portfolio built around one idea: **a portfolio of systems, not screenshots.** Every major visual is a diagram of how a real system behaves, drawn from actual architecture — a DNS security pipeline, offline device synchronisation, event sourcing, multi-tenant isolation, self-hosted AI.

Built with Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, Framer Motion and Zod. No backend, no database, no third-party CMS — deployable to the Vercel free tier.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (also validates all content via Zod)
npm run start      # serve the production build
npm run check      # typecheck + lint + content validation
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Project structure

```
app/
  layout.tsx            root: fonts + server-inlined theme tokens (no flash)
  (site)/               public site (shares nav + footer)
    layout.tsx          nav, footer, skip link, Person JSON-LD
    page.tsx            home
    work/page.tsx       work index (filterable)
    work/[id]/page.tsx  project case study (static per project)
    writing/page.tsx    writing (honest empty state)
  admin/                content editor — noindex, standalone (no public chrome)
  sitemap.ts robots.ts not-found.tsx

content/                the single source of truth (all editable copy)
  site.json theme.json projects.json experience.json
  skills.json decisions.json posts.json

lib/
  schemas.ts   Zod schemas → all types via z.infer
  content.ts   validated loaders + selectors (throws clear errors)
  theme.ts     two presets, CSS-var application, WCAG contrast audit
  draft.ts     localStorage draft + fingerprint + 3-way rebase
  export.ts    ZIP export of only changed content files
  seo.ts utils.ts

components/
  layout/  home/  work/  systems/ (diagrams)  ui/  admin/

public/images/          portrait + identity photography

scripts/validate-content.mjs   content gate for `npm run check`
```

---

## Editing content

Everything a visitor reads lives in `content/*.json`. There are two ways to edit it.

### A. Edit the JSON directly

Change a file under `content/`, then run `npm run check` to validate. Malformed
content fails the build with a message naming the file, field and problem — invalid
content never renders silently.

### B. Use the admin editor at `/admin`

A no-backend content editor. Default passphrase is `sridhar-admin` (override with
`NEXT_PUBLIC_ADMIN_KEY`). It is a soft convenience lock, not a security boundary —
the admin can only edit a **local draft** in your browser and produce an export;
it cannot publish anything on its own.

Workflow:

1. Open `/admin` and edit — the working copy is saved to `localStorage` as a draft.
   A banner reminds you visitors still see the published version.
2. **Projects** — add, edit, delete, reorder (drag-and-drop), and show/hide.
3. **Theme** — colours, fonts, radius, spacing, motion and layout, with two
   presets, a live preview and a WCAG-AA contrast audit that warns before you
   ship an inaccessible combination.
4. **Import / Export** — export a ZIP containing **only the content files that
   changed**. Unzip it over the repo, run `npm run check`, commit and push;
   Vercel rebuilds and the change goes live.
5. **Discard** returns to the published content.

**Stale drafts:** if the published content changes while a draft exists (detected
by a content fingerprint), the editor offers a three-way **rebase** — your edits
win on conflict and conflicts are listed — or a discard. It never silently
overwrites either side.

---

## Claims & evidence

To keep the portfolio credible, every measurable statement carries an evidence
class in the content (`measured` | `design-target` | `qualitative`) with a source.
`npm run check` lists all `measured` claims so they can be verified, and the case
studies render the class next to each claim. Design targets are shown as targets,
never as benchmarked numbers. See `GAPS.md` for information deliberately omitted.

---

## Images

Static images live in `public/images` and are referenced from content by path.
The portrait uses `next/image` with explicit dimensions. To add project
screenshots later, drop files into `public/images` and reference them in a
project's `images` array (each needs `alt` text).

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel (framework auto-detected as Next.js).
3. Set `NEXT_PUBLIC_ADMIN_KEY` (optional) and update `siteUrl` in
   `content/site.json` to the real domain (used for canonical URLs, sitemap and
   Open Graph).
4. **Contact form (Resend):** create a free account at resend.com, generate an
   API key, and set `RESEND_API_KEY` in the host's env vars. Messages arrive at
   the `email` in `content/site.json` from Resend's shared onboarding sender —
   no DNS setup needed. Until the key is set, the form degrades gracefully and
   points visitors to email directly.
5. **One-click publish from /admin (optional but recommended):** lets the admin
   commit content edits straight to GitHub so the host auto-rebuilds — no
   manual export. Set these env vars (server-side):
   - `GITHUB_TOKEN` — fine-grained PAT with **Contents: read & write** scoped
     to this repository only (github.com → Settings → Developer settings →
     Fine-grained tokens)
   - `GITHUB_REPO` — e.g. `Sridhar08-glitch/sridharportfolio`
   - `GITHUB_BRANCH` — the deployed branch (default `main`)
   - `ADMIN_PUBLISH_KEY` — same value as the admin passphrase
   Then Admin → Import/Export → **🚀 Publish** commits the draft; the site is
   live ~2 minutes later. Without these vars the button explains itself and the
   ZIP export flow still works.
6. Deploy. No other environment variables are required.

## Extras

- **Resume:** served from `public/resume/Sridhar_Mahalingam_Resume.pdf`
  (preview + download from the hero and the assistant). Replace the file to
  update it.
- **Assistant:** the floating chat answers only from the validated content
  layer (`lib/assistant.ts`) — deterministic, no LLM, no API cost, never
  hallucinates. Update content and the assistant updates with it.

---

## Accessibility & performance

- Semantic HTML, one `<h1>` per page, logical heading order, skip-to-content.
- Every architecture diagram is a `<figure>` with a real `<figcaption>` text
  alternative from the content layer.
- Visible keyboard focus; the hero map, filters and decisions are keyboard operable.
- `prefers-reduced-motion` and the in-site motion setting both disable animation.
- WCAG AA contrast enforced (and audited live in the theme editor).
- Static generation, `next/font`, `next/image`, minimal client JS (public pages
  ship no theme JavaScript — tokens are server-inlined).
