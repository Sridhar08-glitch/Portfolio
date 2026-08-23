"use client";

import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import type { Content } from "@/lib/schemas";
import { ACCENT_HEX, themeCssVars } from "@/lib/theme";
import { MiniDiagram } from "@/components/systems/mini-diagram";
import { TechIcon } from "@/lib/tech-icons";
import { PanelHeader } from "./panel-header";

/**
 * Live draft preview — renders the working copy (content + theme) with the
 * public site's tokens scoped to this panel, so every edit is visible
 * immediately. An approximation of the real pages, not a full render.
 */
export function PreviewPanel({ content }: { content: Content }) {
  const { site, theme, projects, experience } = content;
  const vars = themeCssVars(theme) as React.CSSProperties;
  const firstName = site.name.split(" ")[0];
  const flagship = projects.filter((p) => p.tier === "flagship" && p.visibility === "public").slice(0, 4);
  const production = projects.filter((p) => p.tier === "production" && p.visibility === "public").slice(0, 3);
  const current = experience.find((e) => e.current) ?? experience[0];

  return (
    <div>
      <PanelHeader
        title="Preview"
        subtitle="Your draft, rendered with the site's own tokens — updates live as you edit. Export + commit to make it real."
      />

      <div
        style={vars}
        className="overflow-hidden rounded-lg border border-adminLine"
      >
        <div style={{ background: "rgb(var(--c-surface))", color: "rgb(var(--c-ink))" }}>
          {/* ------------------------------------------------ hero preview */}
          <div className="border-b p-6 sm:p-8" style={{ borderColor: "rgb(var(--c-line))" }}>
            <p
              className="font-mono text-[0.62rem] uppercase tracking-[0.24em]"
              style={{ color: "rgb(var(--c-gold))" }}
            >
              &lt;/&gt; {site.role}
            </p>
            <h2 className="serif mt-3 text-4xl">
              Hi, I&apos;m{" "}
              <em
                className="bg-clip-text italic text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(100deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
                }}
              >
                {firstName}.
              </em>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "rgb(var(--c-muted))" }}>
              {site.heroSupport}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className="rounded-theme px-4 py-2 text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg, rgb(var(--c-gold)), rgb(var(--c-clay)))",
                  color: "rgb(var(--c-surface))",
                }}
              >
                View my work
              </span>
              <span
                className="rounded-theme border px-4 py-2 text-xs"
                style={{ borderColor: "rgb(var(--c-line))" }}
              >
                Download resume
              </span>
              <span className="ml-2 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em]" style={{ color: "rgb(var(--c-gold))" }}>
                <MapPin size={11} aria-hidden /> {site.location}
              </span>
            </div>
          </div>

          {/* --------------------------------------------- projects preview */}
          <div className="border-b p-6 sm:p-8" style={{ borderColor: "rgb(var(--c-line))" }}>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em]" style={{ color: "rgb(var(--c-muted))" }}>
              01 · Featured systems
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {flagship.map((p) => {
                const color = ACCENT_HEX[p.accent] ?? ACCENT_HEX.mineral;
                return (
                  <div
                    key={p.id}
                    className="overflow-hidden rounded-theme border"
                    style={{
                      borderColor: "rgb(var(--c-line))",
                      background: "rgb(var(--c-panel))",
                    }}
                  >
                    <div
                      className="border-b px-2 pt-2"
                      style={{
                        borderColor: "rgb(var(--c-line))",
                        background: `linear-gradient(160deg, ${color}14, transparent 70%)`,
                      }}
                    >
                      <MiniDiagram diagram={p.diagram} accent={p.accent} className="h-16 w-full" />
                    </div>
                    <div className="p-3">
                      <p className="font-display text-sm font-semibold leading-tight">{p.title}</p>
                      <p className="mt-0.5 truncate font-mono text-[0.55rem] uppercase tracking-[0.08em]" style={{ color: "rgb(var(--c-muted))" }}>
                        {p.category}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1 font-mono text-[0.58rem] uppercase tracking-[0.1em]" style={{ color }}>
                        Case study <ArrowRight size={10} aria-hidden />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------- client work (cream) */}
          <div
            className="border-b p-6 sm:p-8"
            style={{
              borderColor: "rgb(var(--c-line))",
              background: "rgb(var(--c-sand))",
              color: "rgb(var(--c-surface))",
            }}
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] opacity-60">
              02 · Production client work
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {production.map((p) => (
                <div
                  key={p.id}
                  className="rounded-theme border p-3"
                  style={{ borderColor: "rgb(var(--c-surface) / 0.15)", background: "rgb(255 255 255 / 0.4)" }}
                >
                  <p className="font-display text-sm font-semibold">{p.title}</p>
                  <p className="mt-0.5 truncate font-mono text-[0.55rem] uppercase tracking-[0.08em] opacity-60">
                    {p.category}
                  </p>
                  <div className="mt-2 flex gap-1.5">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span key={t} title={t} className="grid h-5 w-5 place-items-center rounded border bg-white/70" style={{ borderColor: "rgb(var(--c-surface) / 0.12)" }}>
                        <TechIcon name={t} size={11} />
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --------------------------------------------- footer preview */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-6 sm:p-8">
            <div>
              <p className="serif text-xl">
                Have an idea worth building?{" "}
                <em style={{ color: "rgb(var(--c-gold))" }}>Let&apos;s make it real.</em>
              </p>
              <p className="mt-1 text-xs" style={{ color: "rgb(var(--c-muted))" }}>
                {current ? `${current.role} @ ${current.company}` : site.availability}
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-[0.68rem]" style={{ color: "rgb(var(--c-muted))" }}>
              {site.email && (
                <span className="flex items-center gap-1.5">
                  <Mail size={12} style={{ color: "rgb(var(--c-gold))" }} /> {site.email}
                </span>
              )}
              {site.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={12} style={{ color: "rgb(var(--c-gold))" }} /> {site.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 font-mono text-[0.66rem] text-adminMuted">
        Approximate render — animations, the hub and full case-study pages appear
        after export → commit → build. Open{" "}
        <a href="/" target="_blank" rel="noreferrer" className="text-adminAccent underline">
          the published site
        </a>{" "}
        to compare.
      </p>
    </div>
  );
}
