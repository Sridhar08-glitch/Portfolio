"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  Braces,
  Download,
  FileText,
  GraduationCap,
  Palette,
  RotateCcw,
  Settings,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { Content } from "@/lib/schemas";
import {
  loadDraft,
  saveDraft,
  discardDraft,
  isStale,
  hasChanges,
  rebaseDraft,
  type Conflict,
} from "@/lib/draft";
import { cn, fingerprint } from "@/lib/utils";
import { SitePanel } from "./panels/site-panel";
import { ProjectsPanel } from "./panels/projects-panel";
import { ListPanel } from "./panels/list-panel";
import { ThemePanel } from "./panels/theme-panel";
import { DataPanel } from "./panels/data-panel";

type SectionId =
  | "site"
  | "projects"
  | "experience"
  | "skills"
  | "decisions"
  | "writing"
  | "theme"
  | "data";

const NAV: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "site", label: "Site", icon: Settings },
  { id: "projects", label: "Projects", icon: Boxes },
  { id: "experience", label: "Experience", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "decisions", label: "Decisions", icon: Sparkles },
  { id: "writing", label: "Writing", icon: FileText },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "data", label: "Import / Export", icon: Download },
];

function now() {
  return new Date().toISOString();
}

export function AdminApp({ base }: { base: Content }) {
  const baseFingerprint = useMemo(() => fingerprint(base), [base]);
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState<Content>(base);
  const [draftBase, setDraftBase] = useState<Content>(base);
  const [section, setSection] = useState<SectionId>("projects");
  const [stale, setStale] = useState(false);
  const [conflicts, setConflicts] = useState<Conflict[] | null>(null);

  // Source-of-truth rule: on load, a draft (if present) becomes the working copy.
  useEffect(() => {
    const d = loadDraft();
    if (d) {
      setContent(d.content);
      setDraftBase(d.base);
      if (isStale(d, baseFingerprint)) setStale(true);
    }
    setReady(true);
  }, [baseFingerprint]);

  // Autosave the working copy as a draft whenever it diverges from base.
  useEffect(() => {
    if (!ready) return;
    if (hasChanges(content, draftBase)) {
      saveDraft(content, draftBase, now());
    }
  }, [content, ready, draftBase]);

  const changed = hasChanges(content, draftBase);

  function handleDiscard() {
    discardDraft();
    setContent(base);
    setDraftBase(base);
    setStale(false);
    setConflicts(null);
  }

  function handleRebase() {
    const { merged, conflicts } = rebaseDraft(draftBase, content, base);
    setContent(merged);
    setDraftBase(base);
    saveDraft(merged, base, now());
    setStale(false);
    setConflicts(conflicts);
  }

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-adminBg text-adminMuted">Loading editor…</div>;
  }

  return (
    <div className="min-h-screen bg-adminBg text-adminInk">
      <div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-adminLine lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2.5 p-5">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-adminAccent font-mono text-sm font-bold text-adminBg">
              SM
            </span>
            <div>
              <p className="font-display text-sm">Content editor</p>
              <p className="font-mono text-[0.65rem] text-adminMuted">no-backend · local draft</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => setSection(n.id)}
                  aria-current={section === n.id}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    section === n.id
                      ? "bg-adminAccent/15 text-adminAccent"
                      : "text-adminMuted hover:bg-adminPanel hover:text-adminInk",
                  )}
                >
                  <Icon size={16} /> {n.label}
                </button>
              );
            })}
          </nav>
          <div className="hidden p-4 lg:block">
            <a href="/" target="_blank" rel="noreferrer" className="font-mono text-xs text-adminMuted hover:text-adminAccent">
              ↗ View published site
            </a>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-5 sm:p-8">
          {/* Draft banner */}
          {changed && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-adminAccent/40 bg-adminAccent/10 px-4 py-3">
              <p className="flex items-center gap-2 text-sm">
                <Braces size={15} className="text-adminAccent" />
                <span>
                  <strong>Local draft.</strong> Visitors still see the published
                  version. Export to publish.
                </span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setSection("data")}
                  className="rounded-md bg-adminAccent px-3 py-1.5 text-xs font-medium text-adminBg"
                >
                  Export
                </button>
                <button
                  onClick={handleDiscard}
                  className="inline-flex items-center gap-1.5 rounded-md border border-adminLine px-3 py-1.5 text-xs hover:border-red-400 hover:text-red-400"
                >
                  <RotateCcw size={13} /> Discard
                </button>
              </div>
            </div>
          )}

          {/* Stale draft warning */}
          {stale && (
            <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
              <p className="text-sm font-medium text-amber-300">
                Published content changed while this draft existed.
              </p>
              <p className="mt-1 text-sm text-adminMuted">
                Rebase merges your edits onto the newer published base (your
                changes win on conflict, and conflicts are listed). Or discard to
                start fresh from the new base.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleRebase}
                  className="rounded-md bg-adminAccent px-3 py-1.5 text-xs font-medium text-adminBg"
                >
                  Rebase draft
                </button>
                <button
                  onClick={handleDiscard}
                  className="rounded-md border border-adminLine px-3 py-1.5 text-xs hover:border-red-400 hover:text-red-400"
                >
                  Discard draft
                </button>
              </div>
            </div>
          )}

          {/* Rebase conflict report */}
          {conflicts && conflicts.length > 0 && (
            <div className="mb-6 rounded-lg border border-adminLine bg-adminPanel px-4 py-3">
              <p className="text-sm font-medium">
                Rebased with {conflicts.length} conflict(s) — your value was kept:
              </p>
              <ul className="mt-2 flex flex-col gap-1 font-mono text-xs text-adminMuted">
                {conflicts.map((c, i) => (
                  <li key={i}>• {c.path}</li>
                ))}
              </ul>
              <button
                onClick={() => setConflicts(null)}
                className="mt-2 text-xs text-adminAccent"
              >
                Dismiss
              </button>
            </div>
          )}

          {section === "site" && (
            <SitePanel
              site={content.site}
              onChange={(site) => setContent((c) => ({ ...c, site }))}
            />
          )}
          {section === "projects" && (
            <ProjectsPanel
              projects={content.projects}
              constraints={content.site.constraints}
              onChange={(projects) => setContent((c) => ({ ...c, projects }))}
            />
          )}
          {section === "experience" && (
            <ListPanel kind="experience" content={content} setContent={setContent} />
          )}
          {section === "skills" && (
            <ListPanel kind="skills" content={content} setContent={setContent} />
          )}
          {section === "decisions" && (
            <ListPanel kind="decisions" content={content} setContent={setContent} />
          )}
          {section === "writing" && (
            <ListPanel kind="posts" content={content} setContent={setContent} />
          )}
          {section === "theme" && (
            <ThemePanel
              theme={content.theme}
              onChange={(theme) => setContent((c) => ({ ...c, theme }))}
            />
          )}
          {section === "data" && (
            <DataPanel
              content={content}
              base={draftBase}
              onImport={(next) => setContent(next)}
              onDiscard={handleDiscard}
            />
          )}
        </main>
      </div>
    </div>
  );
}
