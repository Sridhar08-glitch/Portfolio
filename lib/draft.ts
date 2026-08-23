import type { Content } from "./schemas";
import { fingerprint } from "./utils";

/**
 * Draft model (no backend):
 *  - Base content lives in /content/*.json and is what visitors always see.
 *  - The admin edits a draft held in localStorage.
 *  - Each draft records the fingerprint of the base it forked from, so we can
 *    detect when the published base has changed underneath it (stale draft).
 *  - Export produces a ZIP of only the changed files; committing them publishes.
 */

export const DRAFT_KEY = "sridhar-portfolio:draft:v1";

export type Draft = {
  content: Content;
  /** Snapshot of the base this draft forked from — enables a true 3-way rebase. */
  base: Content;
  baseFingerprint: string;
  updatedAt: string;
};

export function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

export function saveDraft(content: Content, base: Content, now: string) {
  if (typeof window === "undefined") return;
  const draft: Draft = {
    content,
    base,
    baseFingerprint: fingerprint(base),
    updatedAt: now,
  };
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function discardDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DRAFT_KEY);
}

export function isStale(draft: Draft, currentBaseFingerprint: string): boolean {
  return draft.baseFingerprint !== currentBaseFingerprint;
}

export function hasChanges(content: Content, base: Content): boolean {
  return fingerprint(content) !== fingerprint(base);
}

const eq = (a: unknown, b: unknown) => fingerprint(a) === fingerprint(b);

export type Conflict = { path: string; base: unknown; draft: unknown; next: unknown };

/**
 * Three-way merge of a single value.
 *  - only the user changed a field  → keep the user's value
 *  - only the base changed a field  → take the new base value
 *  - both changed it the same way   → take it
 *  - both changed it differently    → conflict (keep user's, flag it)
 * Objects merge per key; arrays of objects match by id/slug.
 */
function mergeValue(
  base: unknown,
  draft: unknown,
  next: unknown,
  path: string,
  conflicts: Conflict[],
): unknown {
  if (eq(draft, base)) return next; // user didn't touch it → adopt new base
  if (eq(next, base)) return draft; // base didn't change → keep user edit
  if (eq(draft, next)) return draft; // converged independently

  const isObj = (v: unknown) =>
    v !== null && typeof v === "object" && !Array.isArray(v);

  // Arrays of keyed objects — merge element-wise by id/slug.
  if (Array.isArray(base) && Array.isArray(draft) && Array.isArray(next)) {
    const keyed =
      draft.every((x) => isObj(x) && ("id" in (x as object) || "slug" in (x as object)));
    if (keyed) return mergeKeyedArray(base, draft, next, path, conflicts);
    // Non-keyed arrays: treat as atomic → conflict.
    conflicts.push({ path, base, draft, next });
    return draft;
  }

  if (isObj(base) && isObj(draft) && isObj(next)) {
    const out: Record<string, unknown> = {};
    const keys = new Set([
      ...Object.keys(base as object),
      ...Object.keys(draft as object),
      ...Object.keys(next as object),
    ]);
    for (const k of keys) {
      out[k] = mergeValue(
        (base as Record<string, unknown>)[k],
        (draft as Record<string, unknown>)[k],
        (next as Record<string, unknown>)[k],
        path ? `${path}.${k}` : k,
        conflicts,
      );
    }
    return out;
  }

  // Divergent primitives → conflict, prefer the user's value.
  conflicts.push({ path, base, draft, next });
  return draft;
}

function keyOf(x: unknown): string {
  const o = x as Record<string, unknown>;
  return String(o.id ?? o.slug);
}

function mergeKeyedArray(
  base: unknown[],
  draft: unknown[],
  next: unknown[],
  path: string,
  conflicts: Conflict[],
): unknown[] {
  const baseMap = new Map(base.map((x) => [keyOf(x), x]));
  const nextMap = new Map(next.map((x) => [keyOf(x), x]));
  const out: unknown[] = [];
  const seen = new Set<string>();

  // Preserve the draft's ordering, merging each surviving element.
  for (const d of draft) {
    const key = keyOf(d);
    seen.add(key);
    const b = baseMap.get(key);
    const n = nextMap.get(key);
    if (n === undefined) {
      // Deleted in new base. If the user also edited it, that's a conflict.
      if (b !== undefined && !eq(d, b)) {
        conflicts.push({ path: `${path}[${key}]`, base: b, draft: d, next: undefined });
      }
      continue; // element removed
    }
    out.push(mergeValue(b ?? n, d, n, `${path}[${key}]`, conflicts));
  }
  // Elements added by the new base that the draft never had.
  for (const n of next) {
    const key = keyOf(n);
    if (!seen.has(key) && !baseMap.has(key)) out.push(n);
  }
  return out;
}

export function rebaseDraft(
  base: Content,
  draft: Content,
  next: Content,
): { merged: Content; conflicts: Conflict[] } {
  const conflicts: Conflict[] = [];
  const merged = mergeValue(base, draft, next, "", conflicts) as Content;
  return { merged, conflicts };
}
