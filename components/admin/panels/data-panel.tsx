"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Rocket, RotateCcw, Upload } from "lucide-react";
import type { Content } from "@/lib/schemas";
import { ContentSchema } from "@/lib/schemas";
import { buildExportZip, changedFiles, filesForPublish } from "@/lib/export";
import { SESSION_KEY } from "../gate";
import { PanelHeader } from "./panel-header";

export function DataPanel({
  content,
  base,
  onImport,
  onDiscard,
}: {
  content: Content;
  base: Content;
  onImport: (c: Content) => void;
  onDiscard: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const [imported, setImported] = useState(false);
  const [pubState, setPubState] = useState<"idle" | "publishing" | "done" | "error">("idle");
  const [pubMsg, setPubMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const changed = changedFiles(content, base);

  async function doPublish() {
    setPubState("publishing");
    setPubMsg(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: sessionStorage.getItem(SESSION_KEY) ?? "",
          files: filesForPublish(content, base),
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; committed?: string[] };
      if (json.ok) {
        setPubState("done");
        setPubMsg(
          `Committed ${json.committed?.length ?? 0} file(s) to GitHub. Netlify is rebuilding — live in ~2 minutes. Your draft is kept until you reload after the deploy.`,
        );
      } else {
        setPubState("error");
        setPubMsg(json.error ?? "Publish failed.");
      }
    } catch {
      setPubState("error");
      setPubMsg("Network error — publish did not complete.");
    }
  }

  async function doExport() {
    setBusy(true);
    try {
      const blob = await buildExportZip(content, base, new Date().toISOString());
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio-content-export.zip";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  function tryImport(text: string) {
    setImportError(null);
    setImported(false);
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setImportError("That isn't valid JSON.");
      return;
    }
    const result = ContentSchema.safeParse(parsed);
    if (!result.success) {
      const first = result.error.issues[0];
      setImportError(`${first.path.join(".") || "(root)"} — ${first.message}`);
      return;
    }
    onImport(result.data);
    setImported(true);
    setImportText("");
  }

  return (
    <div>
      <PanelHeader title="Import / Export" subtitle="Move content in and out. Nothing here touches the live site until you commit an export." />

      {/* One-click publish */}
      <section className="mb-8 rounded-lg border border-adminAccent/40 bg-adminAccent/5 p-5">
        <h3 className="flex items-center gap-2 font-display text-lg">
          <Rocket size={18} className="text-adminAccent" /> Publish to live site
        </h3>
        <p className="mt-1 text-sm text-adminMuted">
          Commits your changed content straight to GitHub — Netlify rebuilds
          automatically and the site updates in about two minutes. No manual
          export needed. Requires <code className="text-adminAccent">GITHUB_TOKEN</code> to be configured.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={doPublish}
            disabled={pubState === "publishing" || changed.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-adminAccent px-4 py-2 text-sm font-medium text-adminBg disabled:opacity-40"
          >
            {pubState === "publishing" ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Publishing…
              </>
            ) : (
              <>
                <Rocket size={15} /> Publish {changed.length > 0 ? `${changed.length} file(s)` : ""}
              </>
            )}
          </button>
          {changed.length === 0 && (
            <span className="text-sm text-adminMuted">No changes to publish.</span>
          )}
        </div>
        {pubMsg && (
          <p
            className={`mt-3 rounded-md border px-3 py-2 text-sm ${
              pubState === "done"
                ? "border-adminAccent/40 bg-adminAccent/10 text-adminAccent"
                : "border-red-500/40 bg-red-500/10 text-red-300"
            }`}
          >
            {pubMsg}
          </p>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Export */}
        <section className="rounded-lg border border-adminLine p-5">
          <h3 className="font-display text-lg">Export changed content</h3>
          <p className="mt-1 text-sm text-adminMuted">
            Downloads a ZIP of only the files that changed versus the published
            base. Unzip over the repo, run <code className="font-mono text-adminAccent">npm run check</code>, commit, and Vercel rebuilds.
          </p>
          <div className="mt-3">
            {changed.length === 0 ? (
              <p className="text-sm text-adminMuted">No changes to export yet.</p>
            ) : (
              <ul className="flex flex-col gap-1 font-mono text-xs text-adminMuted">
                {changed.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={doExport}
            disabled={busy || changed.length === 0}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-adminAccent px-4 py-2 text-sm font-medium text-adminBg disabled:opacity-40"
          >
            <Download size={15} /> {busy ? "Building…" : "Download export"}
          </button>
        </section>

        {/* Import */}
        <section className="rounded-lg border border-adminLine p-5">
          <h3 className="font-display text-lg">Import content</h3>
          <p className="mt-1 text-sm text-adminMuted">
            Paste a full content JSON object or upload a file. It&apos;s validated
            before it replaces your working draft.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              file.text().then(tryImport);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-adminLine px-4 py-2 text-sm hover:border-adminAccent"
          >
            <Upload size={15} /> Upload JSON file
          </button>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={5}
            placeholder='{ "site": {...}, "theme": {...}, "projects": [...], ... }'
            className="mt-3 w-full rounded-md border border-adminLine bg-adminBg px-3 py-2 font-mono text-xs outline-none focus:border-adminAccent"
          />
          <button
            onClick={() => tryImport(importText)}
            disabled={!importText.trim()}
            className="mt-2 rounded-md border border-adminLine px-4 py-2 text-sm hover:border-adminAccent disabled:opacity-40"
          >
            Import pasted JSON
          </button>
          {importError && <p className="mt-2 text-sm text-red-400">Invalid: {importError}</p>}
          {imported && <p className="mt-2 text-sm text-adminAccent">Imported into your draft.</p>}
        </section>
      </div>

      <section className="mt-8 rounded-lg border border-red-500/30 bg-red-500/5 p-5">
        <h3 className="font-display text-lg">Discard draft</h3>
        <p className="mt-1 text-sm text-adminMuted">
          Deletes your local draft and returns to the published content. This
          cannot be undone.
        </p>
        <button
          onClick={() => { if (confirm("Discard your local draft and return to published content?")) onDiscard(); }}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-red-500/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
        >
          <RotateCcw size={15} /> Discard draft
        </button>
      </section>
    </div>
  );
}
