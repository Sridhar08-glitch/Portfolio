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
 * hallucination — and every reply is formatted as terminal command output.
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

function out(cmd: string, ...lines: string[]): string {
  return [`$ ${cmd}`, "", ...lines].join("\n");
}

function projectAnswer(id: string): AssistantReply | null {
  const p = publicProjects.find(
    (x) =>
      x.id === id ||
      x.title.toLowerCase().includes(id) ||
      id.includes(x.id.replace(/-/g, " ")),
  );
  if (!p) return null;
  return {
    text: out(
      `cat ~/projects/${p.id}`,
      `NAME    ${p.title}`,
      `TYPE    ${p.category}`,
      `STATUS  ${p.status}`,
      `STACK   ${p.technologies.slice(0, 6).join(" · ")}${p.technologies.length > 6 ? " …" : ""}`,
      "",
      p.summary,
    ),
    links: [
      { label: "open case-study", href: `/work/${p.id}` },
      ...p.links.slice(0, 1).map((l) => ({ label: l.label.toLowerCase(), href: l.href })),
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

  /* Greetings — greet back, command style */
  if (/^(hi|hello|hey|salam|hola|good (morning|afternoon|evening))\b/.test(q)) {
    const timeWord = /morning/.test(q)
      ? "good morning"
      : /afternoon/.test(q)
        ? "good afternoon"
        : /evening/.test(q)
          ? "good evening"
          : "hello";
    return {
      text: out(
        `echo "${timeWord}"`,
        `${timeWord.charAt(0).toUpperCase() + timeWord.slice(1)}! 👋 Welcome to Sridhar's portfolio.`,
        "Ask about his projects, experience, skills — or how to reach him.",
      ),
      chips: DEFAULT_CHIPS,
    };
  }

  /* About the assistant itself */
  if (/who are you|what are you|your name|are you (a )?(bot|ai|human)|chatgpt|gpt/.test(q)) {
    return {
      text: out(
        "man sm-shell",
        "SM-SHELL(1)                    portfolio tools",
        "",
        "NAME     sm-shell — deterministic portfolio assistant",
        "ENGINE   no LLM · no cloud API · zero hallucination",
        "SOURCE   the same validated data files that render this site",
        "PURPOSE  answer anything about Sridhar, with facts only",
      ),
      chips: ["Who is Sridhar", "Projects", "Contact"],
    };
  }

  /* Small talk */
  if (/how are you|how('s| is) it going|what'?s up/.test(q)) {
    return {
      text: out(
        "uptime",
        "status: running smooth · 0 hallucinations to date",
        "more importantly — what would you like to know about Sridhar?",
      ),
      chips: DEFAULT_CHIPS,
    };
  }

  /* Thanks */
  if (/thank|thanks|thx|appreciated?/.test(q)) {
    return {
      text: out(
        'echo "you\'re welcome"',
        "You're welcome! Anything else — projects, experience, or how to reach him — I'm right here.",
      ),
      chips: ["Contact", "Resume", "Projects"],
    };
  }

  /* Goodbye */
  if (/\b(bye|goodbye|see you|later|exit|quit)\b/.test(q)) {
    return {
      text: out(
        "logout",
        "session closed — thanks for stopping by.",
        "Sridhar's inbox, however, never logs out:",
      ),
      links: site.email ? [{ label: site.email, href: `mailto:${site.email}` }] : undefined,
    };
  }

  /* Help */
  if (/^help$|what can you (do|answer)|how (do|can) (i|you) use/.test(q)) {
    return {
      text: out(
        "help",
        "AVAILABLE TOPICS",
        "  projects      all 19 systems, or ask one by name",
        "  skills        the stack, organised by capability",
        "  experience    the career timeline",
        "  education     degree and certifications",
        "  resume        preview / download the PDF",
        "  contact       email, phone, socials",
        "",
        "type a question or click a command · `clear` resets",
      ),
      chips: DEFAULT_CHIPS,
    };
  }

  /* Who is Sridhar */
  if (/who is|about (sridhar|him|the developer)|tell me about (sridhar|him)|introduce/.test(q)) {
    return {
      text: out(
        "whoami --verbose",
        `NAME    ${site.name}`,
        "ROLE    Full Stack Developer · Senior Backend @ Holora Performance",
        "FROM    Chennai, India",
        `BASE    ${site.location}`,
        "YEARS   3+ shipping production software end to end",
        "SCOPE   security · ERPs · e-commerce · healthcare · mobile · self-hosted AI",
        "ORIGIN  studied petrochemical engineering → fell in love with code",
      ),
      links: [{ label: "read the full story", href: "/#about" }],
      chips: ["Projects", "Experience", "Why hire him"],
    };
  }

  /* Why hire */
  if (/why (should i )?(hire|choose)|strength|good at|what makes|stand out|best at/.test(q)) {
    return {
      text: out(
        "cat ~/strengths",
        "- sole-owner delivery    entire platforms alone, schema → nginx",
        "- breadth with depth     19 systems · 7 domains · real decisions",
        "- direct communication   ran UK & Qatar clients in English, no middleman",
        "- self-hosted mindset    if it can run on owned infrastructure, it does",
        "",
        "the best evidence is the work itself ↓",
      ),
      links: [{ label: "browse the projects", href: "/work" }],
      chips: ["Experience", "Contact", "Resume"],
    };
  }

  /* Availability */
  if (/available|availability|open to|notice period|join|start date|freelance|full.?time|remote/.test(q)) {
    return {
      text: out(
        "status --availability",
        "CURRENT   Senior Backend Developer @ Holora Performance",
        "OPEN TO   full-time roles · freelance projects · consultations",
        "VISA      Qatar residence permit · transferable · NOC available",
        "NOTICE    to be confirmed on offer",
      ),
      links: [{ label: "get in touch", href: "/#contact" }],
      chips: ["Contact", "Resume"],
    };
  }

  /* Private topics */
  if (/salary|pay|age|married|religion|personal life|girlfriend|family/.test(q)) {
    return {
      text: out(
        "sudo cat ~/private",
        "Permission denied.",
        "that one's for Sridhar directly — he responds personally:",
      ),
      links: [{ label: "open contact form", href: "/#contact" }],
      chips: ["Contact", "Projects"],
    };
  }

  /* Socials */
  if (/github|linkedin|instagram|social/.test(q)) {
    return {
      text: out("ls ~/socials", "found 3 profiles:"),
      links: [
        ...(site.github ? [{ label: "github — the code", href: site.github }] : []),
        ...(site.linkedin ? [{ label: "linkedin — the career", href: site.linkedin }] : []),
        ...(site.instagram ? [{ label: "instagram — @ig_sd_sha", href: site.instagram }] : []),
      ],
      chips: ["Contact", "Projects"],
    };
  }

  /* Specific projects (most specific intent wins) */
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
      text: out(
        "open ~/resume.pdf",
        "FILE     Sridhar_Mahalingam_Resume.pdf",
        "COVERS   projects · experience · stack · education",
      ),
      links: [
        { label: "preview in browser", href: "/resume/Sridhar_Mahalingam_Resume.pdf" },
        { label: "download pdf", href: "/resume/Sridhar_Mahalingam_Resume.pdf" },
      ],
      chips: ["Experience", "Skills", "Contact"],
    };
  }

  /* Contact */
  if (/contact|email|phone|hire|reach|touch|connect|whatsapp|call/.test(q)) {
    return {
      text: out(
        "cat ~/contact",
        `EMAIL     ${site.email ?? "—"}`,
        `PHONE     ${site.phone ?? "—"}`,
        `LOCATION  ${site.location}`,
        "STATUS    open to opportunities",
      ),
      links: [
        ...(site.email ? [{ label: "send email", href: `mailto:${site.email}` }] : []),
        { label: "open contact form", href: "/#contact" },
      ],
      chips: ["Resume", "Projects"],
    };
  }

  /* Experience */
  if (/experience|career|job|work history|employ|holora|techynova|years/.test(q)) {
    const lines = experience.map(
      (e) =>
        `${(e.start + " – " + e.end).padEnd(22)} ${e.role} @ ${e.company} (${e.location})`,
    );
    return {
      text: out(
        "history --career",
        ...lines,
        "",
        "total: 3+ years · 5 client platforms shipped · backend lead at Holora",
      ),
      links: [{ label: "view full timeline", href: "/#experience" }],
      chips: ["Projects", "Skills", "Resume"],
    };
  }

  /* Education */
  if (/educat|degree|university|college|study|certif/.test(q)) {
    return {
      text: out(
        "cat ~/education",
        "DEGREE   B.Tech, Petrochemical Technology",
        "SCHOOL   Anna University, India · 2022 · CGPA 7.61/10",
        "CERTS    Full Stack Development with Python (IBM, SLA Institute)",
        "         Codeathon Event Project (IBM Certification)",
      ),
      chips: ["Experience", "Skills", "Contact"],
    };
  }

  /* Skills */
  if (/skill|stack|tech|language|framework|tool|database|frontend|backend/.test(q)) {
    const lines = skills
      .slice(0, 6)
      .map(
        (g) =>
          `${g.name.toLowerCase().padEnd(22)} ${g.items.slice(0, 4).join(" · ")}${g.items.length > 4 ? " …" : ""}`,
      );
    return {
      text: out("ls ~/skills", ...lines),
      links: [{ label: "full breakdown", href: "/#skills" }],
      chips: ["Projects", "AI / ML", "Experience"],
    };
  }

  /* AI */
  if (/\bai\b|machine learning|\bml\b|ocr|vision|model/.test(q)) {
    const ai = publicProjects.filter((p) => p.constraints.includes("ai-ml"));
    return {
      text: out(
        "ls ~/projects --filter=ai",
        ...ai.map((p) => `${p.id.padEnd(26)} ${p.category.toLowerCase()}`),
        "",
        "all trained & served on self-hosted infrastructure — zero third-party APIs",
      ),
      links: ai.slice(0, 2).map((p) => ({ label: p.title.toLowerCase(), href: `/work/${p.id}` })),
      chips: ["MeetingMind", "Airsume", "TrafficVision"],
    };
  }

  /* Projects overview */
  if (/project|system|portfolio|built|work|show/.test(q) || q === "more projects") {
    const flag = publicProjects.filter((p) => p.tier === "flagship");
    return {
      text: out(
        "ls ~/projects --flagship",
        ...flag.map((p) => `${p.id.padEnd(18)} ${p.category.toLowerCase()}`),
        "",
        `total: ${publicProjects.length} projects · ${activeConstraints().length} domains · + client platforms for UK & Qatar`,
      ),
      links: [{ label: "browse all projects", href: "/work" }],
      chips: ["ShieldDNS", "MeetingMind", "CommerceOS", "Client work"],
    };
  }

  /* Client work */
  if (/client|freelance|business|delivered/.test(q)) {
    const prod = publicProjects.filter((p) => p.tier === "production");
    return {
      text: out(
        "ls ~/projects --client",
        ...prod.map((p) => `${p.id.padEnd(26)} ${p.category.toLowerCase()}`),
        "",
        "all five delivered end to end at Techynova · live in production",
      ),
      links: [{ label: "see production work", href: "/work" }],
      chips: ["Projects", "Experience", "Contact"],
    };
  }

  /* Decisions */
  if (/decision|why|trade.?off|architecture|design/.test(q)) {
    const d = decisions.slice(0, 4);
    return {
      text: out(
        "cat ~/decisions | head -4",
        ...d.map((x) => `- ${x.question}`),
        "",
        "engineering judgment gets its own section on the site",
      ),
      links: [{ label: "read the decisions", href: "/#decisions" }],
      chips: ["Projects", "Skills"],
    };
  }

  /* Location / visa */
  if (/location|where|doha|qatar|visa|relocat/.test(q)) {
    return {
      text: out(
        "curl -s ipinfo/sridhar",
        `CITY    ${site.location}`,
        "VISA    Qatar residence permit · transferable · NOC available",
        "ROOTS   Chennai, India",
      ),
      chips: ["Contact", "Resume", "Experience"],
    };
  }

  /* Fallback */
  return {
    text: out(
      `${q.split(" ")[0] || "input"}: command not found`,
      "I only answer from real portfolio data and couldn't match that.",
      "try one of these — or ask about a project by name:",
    ),
    chips: DEFAULT_CHIPS,
  };
}
