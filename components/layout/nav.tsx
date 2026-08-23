"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Site } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home", hash: "" },
  { href: "/#systems", label: "Systems", hash: "systems" },
  { href: "/work", label: "Projects", hash: null },
  { href: "/#experience", label: "Experience", hash: "experience" },
  { href: "/#decisions", label: "Decisions", hash: "decisions" },
  { href: "/writing", label: "Writing", hash: null },
  { href: "/#about", label: "About", hash: "about" },
  { href: "/#contact", label: "Contact", hash: "contact" },
] as const;

const SECTION_IDS = ["systems", "decisions", "experience", "about", "writing", "contact"];

export function Nav({ site }: { site: Site }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string>("");
  const pathname = usePathname();

  /**
   * Scroll-spy: on the home page, watch the section landmarks and light up the
   * matching nav item as the user scrolls (and instantly on click/hashchange).
   */
  useEffect(() => {
    if (pathname !== "/") {
      setSection("");
      return;
    }
    const fromHash = () => setSection(window.location.hash.replace("#", ""));
    fromHash();
    window.addEventListener("hashchange", fromHash);

    const els = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setSection(visible[0].target.id);
        } else if (window.scrollY < 320) {
          setSection("");
        }
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      window.removeEventListener("hashchange", fromHash);
      observer.disconnect();
    };
  }, [pathname]);

  function isActive(link: (typeof LINKS)[number]): boolean {
    if (link.href === "/work") return pathname.startsWith("/work");
    if (link.href === "/writing")
      return pathname.startsWith("/writing") || (pathname === "/" && section === "writing");
    if (pathname !== "/") return false;
    if (link.hash === "") return section === "";
    return section === link.hash;
  }

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
            const active = isActive(l);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => {
                    if (l.hash !== null) setSection(l.hash);
                  }}
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
                  onClick={() => {
                    setOpen(false);
                    if (l.hash !== null) setSection(l.hash);
                  }}
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
