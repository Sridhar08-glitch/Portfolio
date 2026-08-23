"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import type { Site } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#systems", label: "Systems" },
  { href: "/work", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/#decisions", label: "Decisions" },
  { href: "/writing", label: "Writing" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Nav({ site }: { site: Site }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/85 backdrop-blur-md">
      <nav className="shell flex h-[68px] items-center justify-between gap-6" aria-label="Primary">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="serif text-2xl font-semibold tracking-tight text-ink">
            S<span className="text-gold">M</span>
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-[0.82rem] font-semibold uppercase tracking-[0.14em]">
              {site.name}
            </span>
            <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted">
              {site.role}
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => {
            const active =
              (l.href === "/work" && pathname.startsWith("/work")) ||
              (l.href === "/writing" && pathname.startsWith("/writing")) ||
              (l.href === "/" && pathname === "/");
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "relative rounded-theme px-3 py-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
                    active ? "text-gold" : "text-muted hover:text-ink",
                  )}
                >
                  {l.label}
                  {active && (
                    <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          {site.portrait && (
            <Image
              src={site.portrait.src}
              alt={site.portrait.alt}
              width={38}
              height={38}
              className="hidden h-[38px] w-[38px] rounded-full border border-gold/50 object-cover sm:block"
            />
          )}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-theme border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line/80 bg-surface lg:hidden">
          <ul className="shell flex flex-col py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-theme px-3 py-3 font-mono text-sm uppercase tracking-[0.12em] text-ink hover:bg-panel"
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
