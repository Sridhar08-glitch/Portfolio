import {
  site,
  publicProjects,
  experience,
  skills,
  decisions,
  activeConstraints,
} from "./content";

/**
 * Deterministic portfolio assistant. Every answer is assembled from the same
 * validated content files that render the site — no LLM, no API, no
 * hallucination. (Education/certification facts below come straight from the
 * resume, which is the content source of truth.)
 */

export type AssistantReply = {
  text: string;
  links?: { label: string; href: string }[];
  chips?: string[];
};

const DEFAULT_CHIPS = [
  "Projects",
  "Skills",
  "Experience",
  "ShieldDNS",
  "Contact",
  "Resume",
];

const EDUCATION =
  "B.Tech in Petrochemical Technology — Anna University, India (2022), CGPA 7.61/10. Certifications: Full Stack Development with Python (IBM Certification, SLA Institute, Chennai) and a Codeathon Event Project (IBM Certification).";

function projectAnswer(id: string): AssistantReply | null {
  const p = publicProjects.find(
    (x) =>
      x.id === id ||
      x.title.toLowerCase().includes(id) ||
      id.includes(x.id.replace(/-/g, " ")),
  );
  if (!p) return null;
  return {
    text: `${p.title} — ${p.category}.\n\n${p.summary}\n\nStack: ${p.technologies.slice(0, 8).join(", ")}${p.technologies.length > 8 ? "…" : ""}.`,
    links: [
      { label: `Open the ${p.title} case study`, href: `/work/${p.id}` },
      ...p.links.slice(0, 1).map((l) => ({ label: l.label, href: l.href })),
    ],
    chips: ["More projects", "Skills", "Contact"],
  };
}

export function greet(): AssistantReply {
  return {
    text: `Hi — I'm the portfolio assistant. I answer from the same data that powers this site (no AI guessing — fitting, for a portfolio full of self-hosted AI).\n\nAsk me about ${site.name.split(" ")[0]}'s projects, skills, experience, education or how to get in touch.`,
    chips: DEFAULT_CHIPS,
  };
}

export function answer(raw: string): AssistantReply {
  const q = raw.toLowerCase().trim();

  /* Greetings */
  if (/^(hi|hello|hey|salam|hola)\b/.test(q)) return greet();

  /* Specific projects first (most specific intent wins) */
  const projectHit = publicProjects.find(
    (p) =>
      q.includes(p.id.replace(/-/g, " ")) ||
      q.includes(p.title.toLowerCase()) ||
      p.title
        .toLowerCase()
        .split(/[\s(]+/)
        .filter((w) => w.length > 3)
        .some((w) => q.includes(w)),
  );
  if (projectHit) {
    const reply = projectAnswer(projectHit.id);
    if (reply) return reply;
  }

  /* Resume */
  if (/resume|\bcv\b|curriculum/.test(q)) {
    return {
      text: "You can preview the resume in your browser or download the PDF — it covers the full project portfolio, experience and stack.",
      links: [
        { label: "Preview resume", href: "/resume/Sridhar_Mahalingam_Resume.pdf" },
        { label: "Download resume (PDF)", href: "/resume/Sridhar_Mahalingam_Resume.pdf" },
      ],
      chips: ["Experience", "Skills", "Contact"],
    };
  }

  /* Contact / hire */
  if (/contact|email|phone|hire|reach|touch|connect|whatsapp|call/.test(q)) {
    return {
      text: `The fastest way is email — or use the contact form on the home page and it lands straight in his inbox.${site.phone ? `\n\nPhone: ${site.phone}` : ""}\nLocation: ${site.location}. ${site.availability}.`,
      links: [
        ...(site.email ? [{ label: site.email, href: `mailto:${site.email}` }] : []),
        ...(site.github ? [{ label: "GitHub", href: site.github }] : []),
        { label: "Open the contact form", href: "/#contact" },
      ],
      chips: ["Resume", "Projects"],
    };
  }

  /* Experience */
  if (/experience|career|job|work history|employ|holora|techynova|years/.test(q)) {
    const lines = experience.map(
      (e) => `• ${e.role} — ${e.company}, ${e.location} (${e.start} – ${e.end})`,
    );
    return {
      text: `3+ years shipping production software end to end:\n\n${lines.join("\n")}\n\nAt Techynova he delivered five live client platforms for UK and Qatar businesses as the primary or sole engineer; at Holora Performance he leads backend engineering across a portfolio of products.`,
      links: [{ label: "See the career timeline", href: "/#experience" }],
      chips: ["Projects", "Skills", "Resume"],
    };
  }

  /* Education */
  if (/educat|degree|university|college|study|certif/.test(q)) {
    return {
      text: EDUCATION,
      chips: ["Experience", "Skills", "Contact"],
    };
  }

  /* Skills / stack */
  if (/skill|stack|tech|language|framework|tool|database|frontend|backend/.test(q)) {
    const lines = skills
      .slice(0, 6)
      .map((g) => `• ${g.name}: ${g.items.slice(0, 5).join(", ")}${g.items.length > 5 ? "…" : ""}`);
    return {
      text: `The stack, organised by capability:\n\n${lines.join("\n")}`,
      links: [{ label: "Full skills breakdown", href: "/#skills" }],
      chips: ["Projects", "AI / ML", "Experience"],
    };
  }

  /* AI */
  if (/\bai\b|machine learning|\bml\b|ocr|vision|model/.test(q)) {
    const ai = publicProjects.filter((p) => p.constraints.includes("ai-ml"));
    return {
      text: `All AI work runs on self-hosted infrastructure — no third-party inference API anywhere.\n\n${ai.map((p) => `• ${p.title} — ${p.category}`).join("\n")}`,
      links: ai.slice(0, 2).map((p) => ({ label: p.title, href: `/work/${p.id}` })),
      chips: ["MeetingMind", "Airsume", "TrafficVision"],
    };
  }

  /* Projects overview */
  if (/project|system|portfolio|built|work|show/.test(q) || q === "more projects") {
    const flag = publicProjects.filter((p) => p.tier === "flagship");
    return {
      text: `${publicProjects.length} projects across ${activeConstraints().length} problem domains. The flagships:\n\n${flag.map((p) => `• ${p.title} — ${p.category}`).join("\n")}\n\nPlus production client platforms for UK and Qatar businesses.`,
      links: [{ label: "Browse all projects", href: "/work" }],
      chips: ["ShieldDNS", "MeetingMind", "CommerceOS", "Client work"],
    };
  }

  /* Client work */
  if (/client|freelance|business|delivered/.test(q)) {
    const prod = publicProjects.filter((p) => p.tier === "production");
    return {
      text: `Five client platforms delivered end to end at Techynova:\n\n${prod.map((p) => `• ${p.title} — ${p.category}`).join("\n")}`,
      links: [{ label: "See production work", href: "/work" }],
      chips: ["Projects", "Experience", "Contact"],
    };
  }

  /* Decisions */
  if (/decision|why|trade.?off|architecture|design/.test(q)) {
    const d = decisions.slice(0, 4);
    return {
      text: `Engineering judgment is a section of its own here. A few of the questions answered:\n\n${d.map((x) => `• ${x.question}`).join("\n")}`,
      links: [{ label: "Read the decisions", href: "/#decisions" }],
      chips: ["Projects", "Skills"],
    };
  }

  /* Location / visa */
  if (/location|where|doha|qatar|visa|relocat/.test(q)) {
    return {
      text: `Based in ${site.location}. ${site.availability}.`,
      chips: ["Contact", "Resume", "Experience"],
    };
  }

  /* Fallback — honest, with directions */
  return {
    text: "I only answer from the real portfolio data, and I couldn't match that question. Try one of these — or ask about a specific project by name.",
    chips: DEFAULT_CHIPS,
  };
}
