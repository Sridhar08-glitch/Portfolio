# Content gaps

Information the portfolio needs but the source material doesn't (yet) support.
Recording it here is deliberate: an omitted field is correct; an invented one is a defect.

| Where | Missing | Source checked | Action taken |
|---|---|---|---|
| `site.json` → `linkedin` | LinkedIn profile URL | Resume lists "LinkedIn" as a link but no URL | Field omitted; add it in `/admin → Site` or `content/site.json`. Footer/JSON-LD render it only when present. |
| `site.json` → `siteUrl` | Real production domain | Not provided | Placeholder `https://sridhar-portfolio.vercel.app` set; **replace before launch** (drives canonical URLs, sitemap, Open Graph). |
| All flagship projects | Verified production/outcome metrics (users, latency, uptime, revenue) | Resume + project descriptions contain none | No `outcomes` fabricated. Performance framed as `design-target` where the resume states an intent (e.g. ShieldDNS "microsecond-scale lookups"), never as a measured benchmark. |
| MeetingMind AI | Evidence for the "~14 ms dashboard reads" figure | Stated in resume as the author's own figure | Kept as a `measured` claim sourced to "Author benchmark". Re-verify or downgrade to `design-target` if it can't be reproduced. |
| Airsume | Evidence for "432 skills / 33 categories / 10 industries" | Stated in resume | Kept as `measured`, sourced to the author-defined dataset (a counted artefact, not a performance metric). |
| Project screenshots | Real UI images for every project | Not yet provided | Layouts reserve `images` slots that render nothing until populated. Add to `public/images` + each project's `images` array (with `alt`). |
| Confidential / NDA work | Any detail on the NDA mobile app and generically-named employer products | Under NDA / not portfolio-safe | Intentionally excluded. Holora Performance appears only as current employment in Experience; all showcased projects are Sridhar's own. |

## Notes on attribution

Per the owner's confirmation, **Holora Performance is the current employer only** —
every project in this portfolio is Sridhar's own independent work. No project is
framed as an employer's product.
