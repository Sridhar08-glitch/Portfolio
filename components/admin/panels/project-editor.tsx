"use client";

import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type {
  Claim,
  Constraint,
  DiagramStage,
  Link as LinkT,
  Project,
} from "@/lib/schemas";
import { TIERS, STATUSES } from "@/lib/schemas";
import {
  Field,
  SelectField,
  StringListField,
  TextArea,
  TextField,
  Toggle,
} from "../fields";

const DIAGRAM_KINDS = [
  "funnel",
  "stream",
  "lattice",
  "projection",
  "clusters",
  "review",
  "hub",
  "spatial",
  "journey",
  "none",
] as const;

const inputCls =
  "w-full rounded-md border border-adminLine bg-adminBg px-3 py-2 text-sm text-adminInk outline-none focus:border-adminAccent";

export function ProjectEditor({
  project,
  constraints,
  onBack,
  onChange,
}: {
  project: Project;
  constraints: Constraint[];
  allIds: string[];
  onBack: () => void;
  onChange: (p: Project) => void;
}) {
  const p = project;
  const set = <K extends keyof Project>(key: K, value: Project[K]) =>
    onChange({ ...p, [key]: value });

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm text-adminMuted hover:text-adminAccent"
      >
        <ArrowLeft size={15} /> All projects
      </button>
      <h2 className="font-display text-2xl">{p.title || "Untitled"}</h2>

      <div className="mt-6 flex flex-col gap-6">
        <section className="grid gap-4 lg:grid-cols-2">
          <TextField label="Title" value={p.title} onChange={(v) => set("title", v)} />
          <TextField
            label="ID (slug)"
            hint="kebab-case, unique"
            value={p.id}
            onChange={(v) => set("id", v)}
          />
          <TextField label="Category" value={p.category} onChange={(v) => set("category", v)} />
          <TextField label="Role" value={p.role} onChange={(v) => set("role", v)} />
          <SelectField label="Tier" value={p.tier} options={TIERS} onChange={(v) => set("tier", v)} />
          <SelectField label="Status" value={p.status} options={STATUSES} onChange={(v) => set("status", v)} />
          <SelectField
            label="Visibility"
            value={p.visibility}
            options={["public", "private"] as const}
            onChange={(v) => set("visibility", v)}
          />
          <SelectField
            label="Accent"
            value={p.accent}
            options={["mineral", "blue", "clay", "gold"] as const}
            onChange={(v) => set("accent", v)}
          />
        </section>

        <Toggle
          label="Featured on home page"
          checked={p.featured}
          onChange={(v) => set("featured", v)}
        />

        <TextArea label="Summary" hint="25–40 words" value={p.summary} onChange={(v) => set("summary", v)} rows={2} />

        {/* Constraints */}
        <Field label="Constraints">
          <div className="flex flex-wrap gap-2">
            {constraints.map((c) => {
              const on = p.constraints.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    set(
                      "constraints",
                      on
                        ? p.constraints.filter((k) => k !== c.key)
                        : [...p.constraints, c.key],
                    )
                  }
                  className={`rounded-md border px-2.5 py-1 text-xs ${
                    on
                      ? "border-adminAccent bg-adminAccent/15 text-adminAccent"
                      : "border-adminLine text-adminMuted"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Field>

        <StringListField label="Technologies" items={p.technologies} onChange={(v) => set("technologies", v)} />

        {/* Audience — who it's for / where it fits */}
        <div className="rounded-md border border-adminLine p-4">
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">
            Audience (shown atop the case study)
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            <TextArea
              label="Who it's for"
              value={p.audience?.who ?? ""}
              rows={3}
              onChange={(v) => {
                const where = p.audience?.where ?? "";
                set("audience", v || where ? { who: v, where } : undefined);
              }}
            />
            <TextArea
              label="Where it fits"
              value={p.audience?.where ?? ""}
              rows={3}
              onChange={(v) => {
                const who = p.audience?.who ?? "";
                set("audience", v || who ? { who, where: v } : undefined);
              }}
            />
          </div>
        </div>

        <h3 className="border-t border-adminLine pt-5 font-display text-lg">Case study</h3>
        <TextArea label="Problem" value={p.problem ?? ""} onChange={(v) => set("problem", v || undefined)} rows={3} />
        <TextArea
          label="Constraints narrative"
          value={p.constraintsNarrative ?? ""}
          onChange={(v) => set("constraintsNarrative", v || undefined)}
          rows={3}
        />
        <TextArea label="Architecture" value={p.architecture ?? ""} onChange={(v) => set("architecture", v || undefined)} rows={4} />

        {/* Decision */}
        <div className="rounded-md border border-adminLine p-4">
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">Key decision</p>
          <div className="grid gap-3">
            <TextField
              label="Decision title"
              value={p.decision?.title ?? ""}
              onChange={(v) =>
                set("decision", v || p.decision?.body ? { title: v, body: p.decision?.body ?? "" } : undefined)
              }
            />
            <TextArea
              label="Decision body"
              value={p.decision?.body ?? ""}
              onChange={(v) =>
                set("decision", v || p.decision?.title ? { title: p.decision?.title ?? "", body: v } : undefined)
              }
              rows={3}
            />
          </div>
        </div>

        <TextArea label="Trade-off" value={p.tradeoff ?? ""} onChange={(v) => set("tradeoff", v || undefined)} rows={2} />

        {/* Alternative */}
        <div className="rounded-md border border-adminLine p-4">
          <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">
            What most people would do differently
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {(["obvious", "whyNot", "approach", "tradeoff"] as const).map((k) => (
              <TextArea
                key={k}
                label={k}
                value={p.alternative?.[k] ?? ""}
                rows={3}
                onChange={(v) => {
                  const base = p.alternative ?? { obvious: "", whyNot: "", approach: "", tradeoff: "" };
                  const next = { ...base, [k]: v };
                  const empty = !next.obvious && !next.whyNot && !next.approach && !next.tradeoff;
                  set("alternative", empty ? undefined : next);
                }}
              />
            ))}
          </div>
        </div>

        <StringListField label="Implementation" items={p.implementation} onChange={(v) => set("implementation", v)} />
        <StringListField label="Highlights" items={p.highlights} onChange={(v) => set("highlights", v)} />
        <StringListField label="Outcomes" items={p.outcomes} onChange={(v) => set("outcomes", v)} />

        {/* Claims */}
        <ClaimsEditor claims={p.claims} onChange={(v) => set("claims", v)} />

        {/* Links */}
        <LinksEditor links={p.links} onChange={(v) => set("links", v)} />

        {/* Diagram */}
        <DiagramEditor
          kind={p.diagram?.kind}
          caption={p.diagram?.caption ?? ""}
          stages={p.diagram?.stages ?? []}
          onChange={(kind, caption, stages) => {
            if (!kind || kind === "none") {
              set("diagram", caption || stages.length ? { kind: "none", caption, stages } : undefined);
            } else {
              set("diagram", { kind, caption, stages });
            }
          }}
        />
      </div>
    </div>
  );
}

function ClaimsEditor({
  claims,
  onChange,
}: {
  claims: Claim[];
  onChange: (c: Claim[]) => void;
}) {
  const update = (i: number, patch: Partial<Claim>) =>
    onChange(claims.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  return (
    <div className="rounded-md border border-adminLine p-4">
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">
        Claims &amp; evidence
      </p>
      <div className="flex flex-col gap-3">
        {claims.map((c, i) => (
          <div key={i} className="rounded-md border border-adminLine bg-adminBg p-3">
            <textarea
              value={c.statement}
              rows={2}
              placeholder="Statement"
              onChange={(e) => update(i, { statement: e.target.value })}
              className={inputCls}
            />
            <div className="mt-2 flex gap-2">
              <select
                value={c.kind}
                onChange={(e) => update(i, { kind: e.target.value as Claim["kind"] })}
                className={inputCls}
                aria-label="Claim kind"
              >
                <option value="measured">measured</option>
                <option value="design-target">design-target</option>
                <option value="qualitative">qualitative</option>
              </select>
              <input
                value={c.source}
                placeholder="Source / evidence"
                onChange={(e) => update(i, { source: e.target.value })}
                className={inputCls}
              />
              <button
                type="button"
                aria-label="Remove claim"
                onClick={() => onChange(claims.filter((_, j) => j !== i))}
                className="shrink-0 rounded-md border border-adminLine px-2 text-adminMuted hover:border-red-400 hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...claims, { statement: "", kind: "qualitative", source: "" }])}
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-adminLine px-3 py-1.5 text-xs text-adminMuted hover:border-adminAccent hover:text-adminAccent"
        >
          <Plus size={14} /> Add claim
        </button>
      </div>
    </div>
  );
}

function LinksEditor({
  links,
  onChange,
}: {
  links: LinkT[];
  onChange: (l: LinkT[]) => void;
}) {
  const update = (i: number, patch: Partial<LinkT>) =>
    onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  return (
    <div className="rounded-md border border-adminLine p-4">
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">Links</p>
      <div className="flex flex-col gap-2">
        {links.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={l.label}
              placeholder="Label"
              onChange={(e) => update(i, { label: e.target.value })}
              className={inputCls}
            />
            <input
              value={l.href}
              placeholder="https://…"
              onChange={(e) => update(i, { href: e.target.value })}
              className={inputCls}
            />
            <select
              value={l.kind}
              onChange={(e) => update(i, { kind: e.target.value as LinkT["kind"] })}
              className={inputCls}
              aria-label="Link kind"
            >
              {["repo", "live", "demo", "docs", "other"].map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Remove link"
              onClick={() => onChange(links.filter((_, j) => j !== i))}
              className="shrink-0 rounded-md border border-adminLine px-2 text-adminMuted hover:border-red-400 hover:text-red-400"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...links, { label: "", href: "", kind: "other" }])}
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-adminLine px-3 py-1.5 text-xs text-adminMuted hover:border-adminAccent hover:text-adminAccent"
        >
          <Plus size={14} /> Add link
        </button>
      </div>
    </div>
  );
}

function DiagramEditor({
  kind,
  caption,
  stages,
  onChange,
}: {
  kind?: (typeof DIAGRAM_KINDS)[number];
  caption: string;
  stages: DiagramStage[];
  onChange: (
    kind: (typeof DIAGRAM_KINDS)[number],
    caption: string,
    stages: DiagramStage[],
  ) => void;
}) {
  const k = kind ?? "none";
  const update = (i: number, patch: Partial<DiagramStage>) =>
    onChange(k, caption, stages.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="rounded-md border border-adminLine p-4">
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">
        Architecture diagram
      </p>
      <div className="grid gap-3">
        <SelectField label="Kind" value={k} options={DIAGRAM_KINDS} onChange={(v) => onChange(v, caption, stages)} />
        <TextArea
          label="Caption (text alternative — required if a diagram is shown)"
          value={caption}
          onChange={(v) => onChange(k, v, stages)}
          rows={2}
        />
        {k !== "none" && (
          <div>
            <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">Stages</p>
            <div className="flex flex-col gap-2">
              {stages.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={s.id}
                    placeholder="id"
                    onChange={(e) => update(i, { id: e.target.value })}
                    className={`${inputCls} max-w-[7rem]`}
                  />
                  <input
                    value={s.label}
                    placeholder="Label"
                    onChange={(e) => update(i, { label: e.target.value })}
                    className={inputCls}
                  />
                  <input
                    value={s.detail ?? ""}
                    placeholder="Detail (optional)"
                    onChange={(e) => update(i, { detail: e.target.value || undefined })}
                    className={inputCls}
                  />
                  <button
                    type="button"
                    aria-label="Remove stage"
                    onClick={() => onChange(k, caption, stages.filter((_, j) => j !== i))}
                    className="shrink-0 rounded-md border border-adminLine px-2 text-adminMuted hover:border-red-400 hover:text-red-400"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onChange(k, caption, [...stages, { id: `s${stages.length + 1}`, label: "" }])}
                className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-adminLine px-3 py-1.5 text-xs text-adminMuted hover:border-adminAccent hover:text-adminAccent"
              >
                <Plus size={14} /> Add stage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
