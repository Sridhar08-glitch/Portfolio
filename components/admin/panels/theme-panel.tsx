"use client";

import { AlertTriangle, Check } from "lucide-react";
import type { Theme } from "@/lib/schemas";
import {
  PRESETS,
  TOKEN_KEYS,
  auditContrast,
  hexToTriplet,
  themeCssVars,
  tripletToHex,
} from "@/lib/theme";
import { PanelHeader } from "./panel-header";
import { SelectField, Toggle } from "../fields";

const TOKEN_LABEL: Record<string, string> = {
  mineral: "Mineral (primary)",
  blue: "Blue",
  sand: "Sand",
  clay: "Clay",
  gold: "Gold",
  surface: "Surface (page bg)",
  ink: "Ink (body text)",
  muted: "Muted text",
  line: "Line / border",
  panel: "Panel",
};

const FONT_CHOICES = ["Space Grotesk", "Inter", "JetBrains Mono"];
const FONT_VAR: Record<string, string> = {
  "Space Grotesk": "var(--font-display)",
  Inter: "var(--font-body)",
  "JetBrains Mono": "var(--font-mono)",
};

export function ThemePanel({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (t: Theme) => void;
}) {
  const set = <K extends keyof Theme>(key: K, value: Theme[K]) =>
    onChange({ ...theme, [key]: value });

  const audit = auditContrast(theme.colors);
  const failing = audit.filter((a) => !a.passesAA);

  const previewStyle = {
    ...themeCssVars(theme),
    "--font-display": FONT_VAR[theme.fonts.display] ?? "var(--font-display)",
    "--font-body": FONT_VAR[theme.fonts.body] ?? "var(--font-body)",
    "--font-mono": FONT_VAR[theme.fonts.mono] ?? "var(--font-mono)",
  } as React.CSSProperties;

  return (
    <div>
      <PanelHeader title="Theme" subtitle="Colours, type, shape and motion. Live-previewed below; changes save to your draft." />

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-6">
          {/* Presets */}
          <div>
            <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">Preset</p>
            <div className="flex gap-2">
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => onChange({ ...theme, preset: key, colors: preset.colors })}
                  className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                    theme.preset === key
                      ? "border-adminAccent bg-adminAccent/15 text-adminAccent"
                      : "border-adminLine text-adminMuted hover:text-adminInk"
                  }`}
                >
                  {preset.label}
                  <span className="mt-1 flex gap-1">
                    {TOKEN_KEYS.slice(0, 5).map((t) => (
                      <span key={t} className="h-3 flex-1 rounded-sm" style={{ backgroundColor: `rgb(${preset.colors[t]})` }} />
                    ))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">Colours</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {TOKEN_KEYS.map((token) => (
                <label key={token} className="flex items-center gap-2 rounded-md border border-adminLine bg-adminBg px-2 py-1.5">
                  <input
                    type="color"
                    value={tripletToHex(theme.colors[token])}
                    onChange={(e) =>
                      set("colors", { ...theme.colors, [token]: hexToTriplet(e.target.value) })
                    }
                    aria-label={TOKEN_LABEL[token]}
                    className="h-7 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <span className="min-w-0 flex-1 truncate text-xs">{TOKEN_LABEL[token]}</span>
                  <span className="font-mono text-[0.62rem] text-adminMuted">{tripletToHex(theme.colors[token])}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Type + shape */}
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField label="Display font" value={theme.fonts.display} options={FONT_CHOICES} onChange={(v) => set("fonts", { ...theme.fonts, display: v })} />
            <SelectField label="Body font" value={theme.fonts.body} options={FONT_CHOICES} onChange={(v) => set("fonts", { ...theme.fonts, body: v })} />
            <SelectField label="Mono font" value={theme.fonts.mono} options={FONT_CHOICES} onChange={(v) => set("fonts", { ...theme.fonts, mono: v })} />
            <SelectField label="Radius" value={theme.radius} options={["0rem", "0.25rem", "0.375rem", "0.5rem", "0.75rem"]} onChange={(v) => set("radius", v)} />
            <SelectField label="Spacing" value={theme.spacing} options={["compact", "regular", "roomy"] as const} onChange={(v) => set("spacing", v)} />
            <SelectField label="Motion" value={theme.motion} options={["off", "subtle", "moderate"] as const} onChange={(v) => set("motion", v)} />
            <SelectField label="Project layout" value={theme.projectLayout} options={["bands", "grid"] as const} onChange={(v) => set("projectLayout", v)} />
          </div>

          <div className="grid gap-2">
            <Toggle label="Show portrait" checked={theme.showPortrait} onChange={(v) => set("showPortrait", v)} />
            <Toggle label="Show writing section" checked={theme.showWriting} onChange={(v) => set("showWriting", v)} />
          </div>
        </div>

        {/* Preview + contrast */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">Live preview</p>
          <div style={previewStyle} className="rounded-lg border border-adminLine p-5" data-preview>
            <div className="rounded-theme p-5" style={{ backgroundColor: "rgb(var(--c-surface))", color: "rgb(var(--c-ink))" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgb(var(--c-muted))" }}>
                Systems developer
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", marginTop: "0.5rem", lineHeight: 1.1 }}>
                I build software around constraints.
              </p>
              <p style={{ marginTop: "0.5rem", color: "rgb(var(--c-muted))", fontSize: "0.9rem" }}>
                A quick preview of body copy on the surface colour.
              </p>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ backgroundColor: "rgb(var(--c-mineral))", color: "rgb(var(--c-surface))", padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontSize: "0.8rem" }}>
                  Primary
                </span>
                <span style={{ border: "1px solid rgb(var(--c-line))", padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontSize: "0.8rem" }}>
                  Ghost
                </span>
                <span style={{ backgroundColor: "rgb(var(--c-clay))", color: "rgb(var(--c-surface))", padding: "0.5rem 1rem", borderRadius: "var(--radius)", fontSize: "0.8rem" }}>
                  Clay
                </span>
              </div>
            </div>
          </div>

          {/* Contrast audit */}
          <div>
            <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">Contrast (WCAG AA)</p>
            {failing.length > 0 && (
              <p className="mb-2 flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-300">
                <AlertTriangle size={15} /> Contrast too low — choose a darker/lighter value.
              </p>
            )}
            <ul className="flex flex-col gap-1.5">
              {audit.map((a) => (
                <li key={a.pair} className="flex items-center justify-between rounded-md border border-adminLine bg-adminBg px-3 py-1.5 text-xs">
                  <span className="text-adminMuted">{a.pair}</span>
                  <span className={`inline-flex items-center gap-1.5 font-mono ${a.passesAA ? "text-adminAccent" : "text-amber-400"}`}>
                    {a.passesAA ? <Check size={13} /> : <AlertTriangle size={13} />}
                    {a.ratio.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
