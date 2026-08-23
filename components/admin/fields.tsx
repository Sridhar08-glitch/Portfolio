"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* Compact, labelled form controls shared across every admin panel. */

export function Field({
  label,
  hint,
  children,
  id,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-adminMuted">
        {label}
      </span>
      {hint && <span className="ml-2 text-[0.7rem] text-adminMuted/70">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-adminLine bg-adminBg px-3 py-2 text-sm text-adminInk outline-none transition-colors focus:border-adminAccent";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  id?: string;
}) {
  return (
    <Field label={label} hint={hint} id={id}>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
  id?: string;
}) {
  return (
    <Field label={label} hint={hint} id={id}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputCls, "resize-y leading-relaxed")}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  id,
}: {
  label: string;
  value: T;
  options: readonly T[] | { value: T; label: string }[];
  onChange: (v: T) => void;
  id?: string;
}) {
  const opts = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  return (
    <Field label={label} id={id}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={inputCls}
      >
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-md border border-adminLine bg-adminBg px-3 py-2.5">
      <span className="text-sm text-adminInk">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-adminAccent" : "bg-adminLine",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}

/** Editor for a list of plain strings (tech, bullets, highlights…). */
export function StringListField({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  return (
    <Field label={label}>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(e) => update(i, e.target.value)}
              className={inputCls}
            />
            <button
              type="button"
              aria-label={`Remove ${label} item ${i + 1}`}
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="shrink-0 rounded-md border border-adminLine px-2 text-adminMuted hover:border-red-400 hover:text-red-500"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-dashed border-adminLine px-3 py-1.5 text-xs text-adminMuted hover:border-adminAccent hover:text-adminAccent"
        >
          <Plus size={14} /> Add {label.toLowerCase()}
        </button>
      </div>
    </Field>
  );
}
