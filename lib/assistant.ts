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
    text: "Ready. Ask anything about Sridhar — or run a command:",
    chips: DEFAULT_CHIPS,
  };
}

export function answer(raw: string): AssistantReply {
  const q = raw.toLowerCase().trim();

  /* Greetings — greet back like a person, not a banner */
  if (/^(hi|hello|hey|salam|hola|good (morning|afternoon|evening))\b/.test(q)) {
    const timeWord = /morning/.test(q)
      ? "Good morning"
      : /afternoon/.test(q)
        ? "Good afternoon"
        : /evening/.test(q)
          ? "Good evening"
          : "Hello";
    return {
      text: `${timeWord}! 👋 Welcome to Sridhar's portfolio. Happy to help — ask me about his projects, experience, skills, or how to reach him.`,
      chips: DEFAULT_CHIPS,
    };
  }

  /* Conversational — about the assistant itself */
  if (/who are you|what are you|your name|are you (a )?(bot|ai|human)|chatgpt|gpt/.test(q)) {
    return {
      text: "I'm SM-shell — a small deterministic assistant built into this portfolio. No LLM, no cloud API: every answer is assembled from the same validated data files that render the site. Ask me anything about Sridhar and I'll answer with facts, not guesses.",
      chips: ["Who is Sridhar", "Projects", "Contact"],
    };
  }

  /* How are you / small talk */
  if (/how are you|how('s| is) it going|what'?s up/.test(q)) {
    return {
      text: "Running at 0.02ms per query — can't complain. More importantly: what would you like to know about Sridhar?",
      chips: DEFAULT_CHIPS,
    };
  }

  /* Thanks */
  if (/thank|thanks|thx|appreciated?/.test(q)) {
    return {
      text: "You're welcome! If anything else comes to mind — projects, experience, or just how to reach Sridhar — I'm right here.",
      chips: ["Contact", "Resume", "Projects"],
    };
  }

  /* Goodbye */
  if (/\b(bye|goodbye|see you|later|exit|quit)\b/.test(q)) {
    return {
      text: "Goodbye — thanks for stopping by. If you'd like to continue the conversation with the real Sridhar, his inbox is always open.",
      links: site.email ? [{ label: site.email, href: `mailto:${site.email}` }] : undefined,
    };
  }

  /* Help / what can you do */
  if (/^help$|what can you (do|answer)|how (do|can) (i|you) use/.test(q)) {
    return {
      text: "I can answer anything the portfolio knows:\n\n• projects — all 19 systems, or ask about one by name\n• skills / stack — technologies organised by capability\n• experience — the career timeline\n• education — degree and certifications\n• resume — preview or download the PDF\n• contact — email, phone, socials\n\nType a question or click a command. `clear` resets the session.",
      chips: DEFAULT_CHIPS,
    };
  }

  /* Who is Sridhar / about him */
  if (/who is|about (sridhar|him|the developer)|tell me about (sridhar|him)|introduce/.test(q)) {
    return {
      text: `${site.name} is a Full Stack Developer from Chennai, India, now based in ${site.location}. 3+ years of shipping production software end to end — security tools, enterprise ERPs, e-commerce, healthcare platforms, mobile apps and self-hosted AI. Currently Senior Backend Developer at Holora Performance. He studied petrochemical engineering, fell in love with code, and never looked back.`,
      links: [{ label: "Read the full story", href: "/#about" }],
      chips: ["Projects", "Experience", "Why hire him"],
    };
  }

  /* Why hire / strengths */
  if (/why (should i )?(hire|choose)|strength|good at|what makes|stand out|best at/.test(q)) {
    return {
      text: "A few honest reasons:\n\n• Sole-owner delivery — he's shipped entire platforms alone, from database schema to Nginx config\n• Breadth with depth — 19 systems across 7 problem domains, each with real architectural decisions behind it\n• Direct communication — ran UK and Qatar client relationships in English without an account manager\n• Security-first, self-hosted mindset — if it can run on owned infrastructure, it does\n\nThe best evidence is the work itself.",
      links: [{ label: "Browse the projects", href: "/work" }],
      chips: ["Experience", "Contact", "Resume"],
    };
  }

  /* Availability / open to work */
  if (/available|availability|open to|notice period|join|start date|freelance|full.?time|remote/.test(q)) {
    return {
      text: `${site.availability}. Open to full-time roles, freelance projects and technical consultations. Notice period: to be confirmed on offer.`,
      links: [{ label: "Get in touch", href: "/#contact" }],
      chips: ["Contact", "Resume"],
    };
  }

  /* Private topics — decline politely */
  if (/salary|pay|age|married|religion|personal life|girlfriend|family/.test(q)) {
    return {
      text: "That's one for Sridhar directly rather than his data files. Drop him a message — he responds personally.",
      links: [{ label: "Open the contact form", href: "/#contact" }],
      chips: ["Contact", "Projects"],
    };
  }

  /* Socials */
  if (/github|linkedin|instagram|social/.test(q)) {
    return {
      text: "Find him here:",
      links: [
        ...(site.github ? [{ label: "GitHub — the code", href: site.github }] : []),
        ...(site.linkedin ? [{ label: "LinkedIn — the career", href: site.linkedin }] : []),
        ...(site.instagram ? [{ label: "Instagram — @ig_ds_sha", href: site.instagram }] : []),
      ],
      chips: ["Contact", "Projects"],
    };
  }

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
