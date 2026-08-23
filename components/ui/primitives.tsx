import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project, Claim, Link as LinkT } from "@/lib/schemas";
import { ArrowUpRight, Github, Globe } from "lucide-react";

const STATUS_LABEL: Record<Project["status"], string> = {
  production: "Production",
  "client-delivered": "Client delivered",
  personal: "Personal project",
  "in-development": "In development",
  prototype: "Prototype",
  research: "Research",
  training: "In training",
  academic: "Academic",
};

const STATUS_TONE: Record<Project["status"], string> = {
  production: "text-mineral border-mineral/40 bg-mineral/5",
  "client-delivered": "text-mineral border-mineral/40 bg-mineral/5",
  personal: "text-blue border-blue/40 bg-blue/5",
  "in-development": "text-clay border-clay/40 bg-clay/5",
  prototype: "text-clay border-clay/40 bg-clay/5",
  research: "text-clay border-clay/40 bg-clay/5",
  training: "text-clay border-clay/40 bg-clay/5",
  academic: "text-muted border-line bg-panel",
};

export function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-[0.12em]",
        STATUS_TONE[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function SectionHeading({
  index,
  label,
  title,
  intro,
  id,
}: {
  index?: string;
  label: string;
  title: string;
  intro?: string;
  id?: string;
}) {
  return (
    <div id={id} className="max-w-2xl scroll-mt-24">
      <p className="label flex items-center gap-3">
        {index && <span className="text-mineral/70">{index}</span>}
        {label}
      </p>
      <h2 className="mt-3 text-3xl sm:text-4xl md:text-[2.75rem]">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function TechList({
  items,
  limit,
  className,
}: {
  items: string[];
  limit?: number;
  className?: string;
}) {
  const shown = limit ? items.slice(0, limit) : items;
  const rest = limit ? items.length - shown.length : 0;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((t) => (
        <li
          key={t}
          className="rounded-theme border border-line bg-surface px-2 py-1 font-mono text-[0.72rem] text-muted"
        >
          {t}
        </li>
      ))}
      {rest > 0 && (
        <li className="rounded-theme px-2 py-1 font-mono text-[0.72rem] text-muted">
          +{rest} more
        </li>
      )}
    </ul>
  );
}

const CLAIM_MARK: Record<Claim["kind"], { label: string; tone: string }> = {
  measured: { label: "Measured", tone: "text-mineral" },
  "design-target": { label: "Design target", tone: "text-clay" },
  qualitative: { label: "Qualitative", tone: "text-muted" },
};

export function ClaimItem({ claim }: { claim: Claim }) {
  const mark = CLAIM_MARK[claim.kind];
  return (
    <li className="border-l-2 border-line pl-4">
      <p className="text-[0.95rem]">{claim.statement}</p>
      <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.1em]">
        <span className={mark.tone}>{mark.label}</span>
        <span className="text-muted"> · {claim.source}</span>
      </p>
    </li>
  );
}

export function ProjectLinks({ links }: { links: LinkT[] }) {
  if (!links.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {links.map((l) => {
        const Icon = l.kind === "repo" ? Github : l.kind === "live" ? Globe : ArrowUpRight;
        return (
          <li key={l.href}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-theme border border-line px-3 py-2 text-sm transition-colors hover:bg-panel"
            >
              <Icon size={15} /> {l.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function Cta({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center gap-2 rounded-theme px-5 py-3 text-sm font-medium transition-transform ease-systems hover:-translate-y-0.5",
    variant === "primary"
      ? "bg-mineral on-dark"
      : "border border-line hover:bg-panel",
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
