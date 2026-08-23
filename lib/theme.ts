import type { Theme, ThemeColors } from "./schemas";

/**
 * Colors are stored as space-separated RGB triplets ("18 63 59") so Tailwind can
 * compose them with alpha via rgb(var(--c-x) / <alpha-value>). The theme editor
 * works in hex and converts at the boundary.
 */

export const TOKEN_KEYS: (keyof ThemeColors)[] = [
  "mineral",
  "blue",
  "sand",
  "clay",
  "gold",
  "surface",
  "ink",
  "muted",
  "line",
  "panel",
];

/** Two shipped palettes, both WCAG-AA-safe for their text pairings. */
export const PRESETS: Record<string, { label: string; colors: ThemeColors }> = {
  verdant: {
    label: "Verdant Dark",
    colors: {
      mineral: "58 161 137", // teal-green accent
      blue: "77 138 129", // deep teal secondary
      sand: "241 235 223", // cream — light band background
      clay: "201 106 76", // copper / rust
      gold: "201 160 87", // gold
      surface: "10 20 17", // canvas (near-black green)
      ink: "237 230 214", // cream text on dark
      muted: "148 166 152",
      line: "38 58 49",
      panel: "16 32 27", // raised dark
    },
  },
  ivory: {
    label: "Warm Ivory (light)",
    colors: {
      mineral: "18 63 59",
      blue: "49 90 99",
      sand: "216 203 184",
      clay: "150 82 55",
      gold: "150 108 42",
      surface: "238 231 219",
      ink: "27 42 40",
      muted: "92 104 100",
      line: "205 194 176",
      panel: "245 240 231",
    },
  },
};

/**
 * Fixed per-constraint accent hues (from the approved reference design).
 * These are identity colors for the hub, cards and diagrams — not theme tokens.
 */
export const CONSTRAINT_COLORS: Record<string, string> = {
  security: "#3AA189",
  enterprise: "#C9A057",
  offline: "#7E9E8C",
  realtime: "#C05B3F",
  "ai-ml": "#A99A45",
  mobile: "#4BA47B",
  commerce: "#AF6B41",
};

export const ACCENT_HEX: Record<string, string> = {
  mineral: "#3AA189",
  blue: "#4D8A81",
  clay: "#C05B3F",
  gold: "#C9A057",
};

export const SPACING_SCALE: Record<Theme["spacing"], string> = {
  compact: "0.85",
  regular: "1",
  roomy: "1.15",
};

/** Write the theme onto the document as CSS custom properties. */
export function applyTheme(theme: Theme, root?: HTMLElement) {
  const el = root ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (!el) return;
  for (const key of TOKEN_KEYS) {
    el.style.setProperty(`--c-${key}`, theme.colors[key]);
  }
  el.style.setProperty("--radius", theme.radius);
  el.style.setProperty("--space-scale", SPACING_SCALE[theme.spacing]);
  el.dataset.motion = theme.motion;
}

/** Server-side inline style object for the initial (flash-free) paint. */
export function themeCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const key of TOKEN_KEYS) vars[`--c-${key}`] = theme.colors[key];
  vars["--radius"] = theme.radius;
  vars["--space-scale"] = SPACING_SCALE[theme.spacing];
  return vars;
}

/* ------------------------------------------------------------- hex <-> rgb */

export function tripletToHex(triplet: string): string {
  const [r, g, b] = triplet.trim().split(/\s+/).map((n) => parseInt(n, 10));
  const h = (n: number) =>
    Math.max(0, Math.min(255, n || 0)).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function hexToTriplet(hex: string): string {
  const m = hex.replace("#", "");
  const full =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/* --------------------------------------------------------- WCAG contrast */

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(triplet: string): number {
  const [r, g, b] = triplet.trim().split(/\s+/).map((n) => parseInt(n, 10));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type ContrastCheck = {
  pair: string;
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
};

/**
 * The pairings that actually carry text on the site. The theme editor blocks
 * (warns on) any change that drops one of these below WCAG AA.
 */
export function auditContrast(colors: ThemeColors): ContrastCheck[] {
  const pairs: [string, keyof ThemeColors, keyof ThemeColors][] = [
    ["Body text on surface", "ink", "surface"],
    ["Body text on panel", "ink", "panel"],
    ["Muted text on surface", "muted", "surface"],
    ["Surface text on mineral", "surface", "mineral"],
    ["Surface text on blue", "surface", "blue"],
    ["Surface text on clay", "surface", "clay"],
  ];
  return pairs.map(([label, fg, bg]) => {
    const ratio = contrastRatio(colors[fg], colors[bg]);
    return {
      pair: label,
      ratio: Math.round(ratio * 100) / 100,
      passesAA: ratio >= 4.5,
      passesAALarge: ratio >= 3,
    };
  });
}
