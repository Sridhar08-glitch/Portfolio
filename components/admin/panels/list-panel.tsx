"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Content } from "@/lib/schemas";
import { PanelHeader } from "./panel-header";
import { StringListField, TextArea, TextField, Toggle } from "../fields";

type Kind = "experience" | "skills" | "decisions" | "posts";

const META: Record<Kind, { title: string; subtitle: string; noun: string }> = {
  experience: { title: "Experience", subtitle: "Roles shown in the experience timeline.", noun: "role" },
  skills: { title: "Skills", subtitle: "Capability groups shown in the skills grid.", noun: "group" },
  decisions: { title: "Engineering decisions", subtitle: "Q&A shown in the decisions section.", noun: "decision" },
  posts: { title: "Writing", subtitle: "Posts. With none published, the site shows an honest empty state.", noun: "post" },
};

function blank(kind: Kind): Record<string, unknown> {
  switch (kind) {
    case "experience":
      return { id: `role-${Date.now()}`, company: "", role: "", location: "", start: "", end: "", current: false, summary: "", bullets: [] };
    case "skills":
      return { id: `group-${Date.now()}`, name: "", blurb: "", items: [] };
    case "decisions":
      return { id: `decision-${Date.now()}`, question: "", answer: "", projects: [] };
    case "posts":
      return { slug: `post-${Date.now()}`, title: "", date: "", summary: "", tags: [], draft: true, body: "" };
  }
}

export function ListPanel({
  kind,
  content,
  setContent,
}: {
  kind: Kind;
  content: Content;
  setContent: React.Dispatch<React.SetStateAction<Content>>;
}) {
  const items = content[kind] as Record<string, unknown>[];
  const [open, setOpen] = useState<number | null>(0);
  const meta = META[kind];

  const write = (next: Record<string, unknown>[]) =>
    setContent((c) => ({ ...c, [kind]: next }));

  const update = (i: number, patch: Record<string, unknown>) =>
    write(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    write(next);
  };

  return (
    <div>
      <PanelHeader
        title={meta.title}
        subtitle={meta.subtitle}
        action={
          <button
            onClick={() => {
              write([...items, blank(kind)]);
              setOpen(items.length);
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-adminAccent px-3 py-2 text-sm font-medium text-adminBg"
          >
            <Plus size={15} /> Add {meta.noun}
          </button>
        }
      />
      <div className="flex flex-col gap-2">
        {items.map((it, i) => {
          const label =
            (it.title as string) ||
            (it.company as string) ||
            (it.name as string) ||
            (it.question as string) ||
            `Item ${i + 1}`;
          const isOpen = open === i;
          return (
            <div key={(it.id as string) ?? (it.slug as string) ?? i} className="rounded-md border border-adminLine bg-adminPanel">
              <div className="flex items-center gap-2 px-3 py-2.5">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="min-w-0 flex-1 text-left text-sm font-medium"
                  aria-expanded={isOpen}
                >
                  {label || <span className="text-adminMuted">Untitled</span>}
                </button>
                <button onClick={() => move(i, -1)} aria-label="Move up" className="rounded p-1 text-adminMuted hover:text-adminInk disabled:opacity-30" disabled={i === 0}>
                  <ChevronUp size={15} />
                </button>
                <button onClick={() => move(i, 1)} aria-label="Move down" className="rounded p-1 text-adminMuted hover:text-adminInk disabled:opacity-30" disabled={i === items.length - 1}>
                  <ChevronDown size={15} />
                </button>
                <button
                  onClick={() => { if (confirm("Delete this item from your draft?")) write(items.filter((_, j) => j !== i)); }}
                  aria-label="Delete"
                  className="rounded p-1 text-adminMuted hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-adminLine p-4">
                  {kind === "experience" && <ExperienceForm item={it} onChange={(patch) => update(i, patch)} />}
                  {kind === "skills" && <SkillForm item={it} onChange={(patch) => update(i, patch)} />}
                  {kind === "decisions" && <DecisionForm item={it} onChange={(patch) => update(i, patch)} />}
                  {kind === "posts" && <PostForm item={it} onChange={(patch) => update(i, patch)} />}
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="rounded-md border border-dashed border-adminLine px-4 py-8 text-center text-sm text-adminMuted">
            No {meta.noun}s yet.
          </p>
        )}
      </div>
    </div>
  );
}

type FormProps = { item: Record<string, unknown>; onChange: (patch: Record<string, unknown>) => void };

function ExperienceForm({ item, onChange }: FormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Company" value={(item.company as string) ?? ""} onChange={(v) => onChange({ company: v })} />
        <TextField label="Role" value={(item.role as string) ?? ""} onChange={(v) => onChange({ role: v })} />
        <TextField label="Location" value={(item.location as string) ?? ""} onChange={(v) => onChange({ location: v })} />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Start" value={(item.start as string) ?? ""} onChange={(v) => onChange({ start: v })} />
          <TextField label="End" value={(item.end as string) ?? ""} onChange={(v) => onChange({ end: v })} />
        </div>
      </div>
      <Toggle label="Current role" checked={Boolean(item.current)} onChange={(v) => onChange({ current: v })} />
      <TextArea label="Summary" value={(item.summary as string) ?? ""} onChange={(v) => onChange({ summary: v })} rows={3} />
      <StringListField label="Bullets" items={(item.bullets as string[]) ?? []} onChange={(v) => onChange({ bullets: v })} />
    </div>
  );
}

function SkillForm({ item, onChange }: FormProps) {
  return (
    <div className="grid gap-4">
      <TextField label="Name" value={(item.name as string) ?? ""} onChange={(v) => onChange({ name: v })} />
      <TextField label="Blurb" value={(item.blurb as string) ?? ""} onChange={(v) => onChange({ blurb: v || undefined })} />
      <StringListField label="Items" items={(item.items as string[]) ?? []} onChange={(v) => onChange({ items: v })} />
    </div>
  );
}

function DecisionForm({ item, onChange }: FormProps) {
  return (
    <div className="grid gap-4">
      <TextField label="Question" value={(item.question as string) ?? ""} onChange={(v) => onChange({ question: v })} />
      <TextArea label="Answer" value={(item.answer as string) ?? ""} onChange={(v) => onChange({ answer: v })} rows={5} />
      <StringListField label="Related project ids" items={(item.projects as string[]) ?? []} onChange={(v) => onChange({ projects: v })} placeholder="project-id" />
    </div>
  );
}

function PostForm({ item, onChange }: FormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <TextField label="Title" value={(item.title as string) ?? ""} onChange={(v) => onChange({ title: v })} />
        <TextField label="Slug" value={(item.slug as string) ?? ""} onChange={(v) => onChange({ slug: v })} />
        <TextField label="Date" value={(item.date as string) ?? ""} onChange={(v) => onChange({ date: v })} placeholder="2026-08-23" />
      </div>
      <Toggle label="Draft (hidden from the site)" checked={Boolean(item.draft)} onChange={(v) => onChange({ draft: v })} />
      <TextArea label="Summary" value={(item.summary as string) ?? ""} onChange={(v) => onChange({ summary: v })} rows={2} />
      <StringListField label="Tags" items={(item.tags as string[]) ?? []} onChange={(v) => onChange({ tags: v })} />
      <TextArea label="Body (Markdown)" value={(item.body as string) ?? ""} onChange={(v) => onChange({ body: v })} rows={8} />
    </div>
  );
}
