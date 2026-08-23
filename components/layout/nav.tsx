"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Site } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/#areas", label: "Areas" },
  { href: "/#decisions", label: "Decisions" },
  { href: "/#experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/#contact", label: "Contact" },
];

export function Nav({ site }: { site: Site }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/85 backdrop-blur">
      <nav className="shell flex h-16 items-center justify-between" aria-label="Primary">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-theme bg-mineral font-mono text-sm font-bold on-dark"
          >
            SM
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-semibold">{site.name}</span>
            <span className="label mt-0.5 normal-case tracking-[0.12em]">
              {site.location}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active =
              l.href.startsWith("/work") && pathname.startsWith("/work");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "rounded-theme px-3 py-2 text-sm text-muted transition-colors hover:bg-panel hover:text-ink",
                    active && "text-ink",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-theme border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line/70 bg-surface md:hidden">
          <ul className="shell flex flex-col py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-theme px-3 py-3 text-base text-ink hover:bg-panel"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
