import { cn } from "@/lib/utils";

/**
 * Every architecture visual is a <figure> with a real <figcaption> — the
 * caption is the mandatory text alternative from the content layer, so the
 * meaning survives with images off, for screen readers, and in print.
 */
export function DiagramFrame({
  caption,
  children,
  className,
  grid = true,
  label,
}: {
  caption: string;
  children: React.ReactNode;
  className?: string;
  grid?: boolean;
  label?: string;
}) {
  return (
    <figure className={cn("relative", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-theme border border-line bg-panel p-5 sm:p-8",
        )}
      >
        {grid && (
          <div className="grid-field pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        )}
        {label && (
          <p className="label relative mb-5">{label}</p>
        )}
        <div className="relative">{children}</div>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}

const ACCENT: Record<string, string> = {
  mineral: "rgb(var(--c-mineral))",
  blue: "rgb(var(--c-blue))",
  clay: "rgb(var(--c-clay))",
  gold: "rgb(var(--c-gold))",
};

export function accentColor(accent?: string): string {
  return ACCENT[accent ?? "mineral"] ?? ACCENT.mineral;
}

/** A labelled node used across the non-interactive grammars. */
export function Node({
  children,
  tone = "surface",
  className,
}: {
  children: React.ReactNode;
  tone?: "surface" | "mineral" | "outline";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-theme px-3 py-2 text-center font-mono text-[0.72rem] leading-tight tracking-tight sm:text-xs",
        tone === "mineral" && "bg-mineral on-dark",
        tone === "surface" && "border border-line bg-surface text-ink",
        tone === "outline" && "border border-dashed border-muted/50 text-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}
