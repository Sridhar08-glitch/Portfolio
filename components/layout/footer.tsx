import Link from "next/link";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import type { Site } from "@/lib/schemas";

export function Footer({ site }: { site: Site }) {
  const year = 2026;
  return (
    <footer id="contact" className="mt-24 border-t border-line bg-panel">
      <div className="shell grid gap-10 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="label">Get in touch</p>
          <h2 className="mt-3 max-w-xl text-3xl sm:text-4xl">
            Building something that has to work around a real constraint?
          </h2>
          <p className="mt-4 max-w-md text-muted">
            I&apos;m {site.availability.toLowerCase()}. Open to conversations about
            systems, backend and full-stack work.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 rounded-theme bg-mineral px-5 py-3 text-sm font-medium on-dark transition-transform ease-systems hover:-translate-y-0.5"
              >
                <Mail size={16} /> Get in touch
              </a>
            )}
            {site.github && (
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-theme border border-line px-5 py-3 text-sm font-medium transition-colors hover:bg-surface"
              >
                <Github size={16} /> View GitHub
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end md:text-right">
          <p className="label">Direct</p>
          {site.email && (
            <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-sm hover:text-mineral md:flex-row-reverse">
              <Mail size={15} /> {site.email}
            </a>
          )}
          {site.phone && (
            <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 text-sm hover:text-mineral md:flex-row-reverse">
              <Phone size={15} /> {site.phone}
            </a>
          )}
          {site.github && (
            <a href={site.github} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 text-sm hover:text-mineral md:flex-row-reverse">
              <Github size={15} /> GitHub
            </a>
          )}
          {site.linkedin && (
            <a href={site.linkedin} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 text-sm hover:text-mineral md:flex-row-reverse">
              <Linkedin size={15} /> LinkedIn
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. Built with Next.js — a portfolio of systems, not screenshots.
          </p>
          <Link href="/admin" className="label hover:text-ink">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
