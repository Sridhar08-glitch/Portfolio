import type { Config } from "tailwindcss";

/**
 * Colors, fonts, radius and spacing all resolve to CSS custom properties that
 * are written at runtime by the ThemeProvider (see lib/theme.ts). Nothing here
 * hardcodes a hex value — the theme editor is the single source of truth.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mineral: "rgb(var(--c-mineral) / <alpha-value>)",
        blue: "rgb(var(--c-blue) / <alpha-value>)",
        sand: "rgb(var(--c-sand) / <alpha-value>)",
        clay: "rgb(var(--c-clay) / <alpha-value>)",
        gold: "rgb(var(--c-gold) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        panel: "rgb(var(--c-panel) / <alpha-value>)",
        // Admin tool palette — deliberately distinct from the public theme and
        // not driven by CSS vars (the admin is a configuration tool, not themed).
        adminBg: "#0e1315",
        adminPanel: "#171e21",
        adminElevated: "#1e262a",
        adminLine: "#2b353a",
        adminInk: "#e7ece9",
        adminMuted: "#93a29c",
        adminAccent: "#57c3a0",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        theme: "var(--radius)",
      },
      maxWidth: {
        shell: "112rem",
      },
      transitionTimingFunction: {
        systems: "cubic-bezier(.22,.68,0,1)",
      },
    },
  },
  plugins: [],
};

export default config;
