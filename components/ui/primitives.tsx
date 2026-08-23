import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Project, Claim, Link as LinkT } from "@/lib/schemas";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import { TechIcon } from "@/lib/tech-icons";

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
  production: "text-mineral border-mineral/50 bg-mineral/10",
  "client-delivered": "text-mineral border-mineral/50 bg-mineral/10",
  personal: "text-blue border-blue/50 bg-blue/10",
  "in-development": "text-gold border-gold/50 bg-gold/10",
  prototype: "text-gold border-gold/50 bg-gold/10",
  research: "text-clay border-clay/50 bg-clay/10",
  training: "text-clay border-clay/50 bg-clay/10",
  academic: "text-muted border-line bg-panel",
};

export function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em]",
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
  cream = false,
  action,
}: {
  index?: string;
  label: string;
  title: string;
  intro?: string;
  id?: string;
  cream?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div id={id} className="flex scroll-mt-24 flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="label flex items-center gap-3">
          {index && <span className={cream ? "text-clay" : "text-gold"}>{index}</span>}
          {label}
        </p>
        <h2 className="mt-3 text-3xl sm:text-4xl md:text-[2.6rem]">{title}</h2>
        {intro && (
          <p className={cn("mt-4 text-lg leading-relaxed", cream ? "text-surface/65" : "text-muted")}>
            {intro}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function TechList({
  items,
  limit,
  className,
  icons = true,
  cream = false,
}: {
  items: string[];
  limit?: number;
  className?: string;
  icons?: boolean;
  cream?: boolean;
}) {
  const shown = limit ? items.slice(0, limit) : items;
  const rest = limit ? items.length - shown.length : 0;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((t) => (
        <li
          key={t}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-theme border px-2 py-1 font-mono text-[0.7rem]",
            cream
              ? "border-surface/15 bg-surface/5 text-surface/75"
              : "border-line bg-surface/60 text-muted",
          )}
        >
          {icons && <TechIcon name={t} size={12} className="opacity-80" />}
          {t}
        </li>
      ))}
      {rest > 0 && (
        <li className={cn("px-1.5 py-1 font-mono text-[0.7rem]", cream ? "text-surface/50" : "text-muted")}>
          +{rest}
        </li>
      )}
    </ul>
  );
}

const CLAIM_MARK: Record<Claim["kind"], { label: string; tone: string }> = {
  measured: { label: "Measured", tone: "text-mineral" },
  "design-target": { label: "Design target", tone: "text-gold" },
  qualitative: { label: "Qualitative", tone: "text-muted" },
};

export function ClaimItem({ claim }: { claim: Claim }) {
  const mark = CLAIM_MARK[claim.kind];
  return (
    <li className="border-l-2 border-line pl-4">
      <p className="text-[0.95rem]">{claim.statement}</p>
      <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.1em]">
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
              className="btn-ghost !px-4 !py-2 text-sm"
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
  const cls = variant === "primary" ? "btn-gold" : "btn-ghost";
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
