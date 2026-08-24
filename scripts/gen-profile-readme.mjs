// Generates github-profile/README.md with ALL project cards built straight
// from content/projects.json — the exact same data that renders the portfolio.
import { readFileSync, writeFileSync } from "node:fs";

const projects = JSON.parse(
  readFileSync(new URL("../content/projects.json", import.meta.url), "utf8"),
);

const EMOJI = {
  shielddns: "🛡️", "ai-research-agent": "🔬", "meetingmind-ai": "🧠", commerceos: "🛒", "nexus-erp": "🏢",
  "construction-erp": "🏗️", airsume: "📄", "s1-llm": "🤖", "medical-erp": "🏥",
  trafficvision: "🚦", "ocr-document-intelligence": "🔍", "carwash-booking": "🚗",
  "plugged-in-scents": "🕯️", "seven-stars-stationery": "✏️",
  "indiguard-security": "🎥", "nh-livespace": "🏠", techynova: "💻",
  "student-teacher-management": "🎓", "inventory-management": "📦",
  "people-safety": "🚨", "smart-cafeteria": "☕",
};

const STATUS = {
  production: ["PRODUCTION", "3AA189"],
  "client-delivered": ["CLIENT_DELIVERED", "3AA189"],
  personal: ["COMPLETED", "4D8A81"],
  "in-development": ["IN_DEVELOPMENT", "C9A057"],
  prototype: ["PROTOTYPE", "C9A057"],
  research: ["RESEARCH", "C05B3F"],
  training: ["IN_TRAINING", "C05B3F"],
  academic: ["ACADEMIC", "777777"],
};

const badge = (label, color) =>
  `<img src="https://img.shields.io/badge/${label.replace(/-/g, "--")}-${color}?style=flat-square" />`;

/** Screenshots that ship with the profile repo. */
const SHOTS = {
  "ai-research-agent": "./assets/ai-research-agent.png",
  "meetingmind-ai": "./assets/meetingmind.png",
  "plugged-in-scents": "./assets/pluggedinscents.png",
  "seven-stars-stationery": "./assets/sevenstars.png",
};

/** Expandable elaboration — problem, decision, trade-off from the portfolio. */
function details(p) {
  const bits = [];
  if (SHOTS[p.id]) bits.push(`<img src="${SHOTS[p.id]}" alt="${p.title} screenshot" width="100%" />`);
  if (p.audience?.who) bits.push(`<p><b>👥 Who it's for —</b> ${p.audience.who}</p>`);
  if (p.problem) bits.push(`<p><b>🎯 The problem —</b> ${p.problem}</p>`);
  if (p.decision) bits.push(`<p><b>🧠 Key decision · ${p.decision.title} —</b> ${p.decision.body}</p>`);
  if (p.tradeoff) bits.push(`<p><b>⚖️ Trade-off —</b> ${p.tradeoff}</p>`);
  if (p.highlights?.length)
    bits.push(`<p><b>✨ Highlights</b></p><ul>${p.highlights.slice(0, 3).map((h) => `<li>${h}</li>`).join("")}</ul>`);
  if (!bits.length) return "";
  return `\n<details><summary><b>📖 More about this system</b></summary>\n<br/>\n${bits.join("\n")}\n</details>`;
}

function card(p, deep = false) {
  const [sLabel, sColor] = STATUS[p.status] ?? [p.status, "777777"];
  const emoji = EMOJI[p.id] ?? "🔧";
  const live = p.links.find((l) => l.kind === "live");
  const repos = p.links.filter((l) => l.kind === "repo");
  const links = [];
  if (repos.length === 1) links.push(`<a href="${repos[0].href}"><b>Repo</b></a>`);
  else repos.forEach((r) => links.push(`<a href="${r.href}"><b>${r.label}</b></a>`));
  if (live) links.push(`<a href="${live.href}"><b>🌐 ${live.label}</b></a>`);
  if (!links.length) links.push("<i>private repository</i>");

  const tech = p.technologies.slice(0, 6).map((t) => `<code>${t}</code>`).join(" ");
  const more = p.technologies.length > 6 ? ` <sub>+${p.technologies.length - 6}</sub>` : "";

  return `<td width="50%" valign="top">

### ${emoji} ${p.title}

${badge(sLabel, sColor)}
<br/><sub><b>${p.category}</b> · ${p.role}</sub>

${p.summary}

${tech}${more}

🔗 ${links.join(" · ")}
${deep ? details(p) : ""}
</td>`;
}

function grid(list, deep = false) {
  const rows = [];
  for (let i = 0; i < list.length; i += 2) {
    const cells = [
      card(list[i], deep),
      list[i + 1] ? card(list[i + 1], deep) : "<td width=\"50%\"></td>",
    ];
    rows.push(`<tr>\n${cells.join("\n")}\n</tr>`);
  }
  return `<table>\n${rows.join("\n")}\n</table>`;
}

const byTier = (t) => projects.filter((p) => p.tier === t && p.visibility !== "private");
const flagship = byTier("flagship");
const featured = byTier("featured");
const production = byTier("production");
const additional = byTier("additional");

const cards = `## 🚀 Flagship Systems

Seven systems, seven different problems — each organised around a genuinely different constraint.
<sub>Every card expands — click <b>📖 More about this system</b> for the problem, the key decision and the trade-off.</sub>

${grid(flagship, true)}

## ⚙️ Featured Systems

${grid(featured, true)}

## 🌍 Production Client Work

Shipped end to end for real businesses in the UK, Qatar and India — architecture, backend, frontend, deployment and direct client communication.

${grid(production, true)}

## 🧩 Additional Builds

${grid(additional)}`;

const readme = readFileSync(new URL("../github-profile/README.md", import.meta.url), "utf8");
const START = "<!-- PROJECTS:START -->";
const END = "<!-- PROJECTS:END -->";
let out;
if (readme.includes(START) && readme.includes(END)) {
  out =
    readme.slice(0, readme.indexOf(START) + START.length) +
    "\n\n" + cards + "\n\n" +
    readme.slice(readme.indexOf(END));
} else {
  // First run: replace everything between the Tech Stack section's closing
  // divider and "## 📊 GitHub Stats" with the marked card sections.
  const anchorStart = readme.indexOf("## 🚀 Flagship Systems");
  const anchorEnd = readme.indexOf("## 📊 GitHub Stats");
  if (anchorStart === -1 || anchorEnd === -1) throw new Error("anchors not found");
  out =
    readme.slice(0, anchorStart) +
    `${START}\n\n${cards}\n\n${END}\n\n---\n\n` +
    readme.slice(anchorEnd);
}
writeFileSync(new URL("../github-profile/README.md", import.meta.url), out);
console.log(
  `cards generated: ${flagship.length} flagship · ${featured.length} featured · ${production.length} client · ${additional.length} additional = ${flagship.length + featured.length + production.length + additional.length} total`,
);
