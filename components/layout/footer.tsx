import Link from "next/link";
import { Github, Mail, MapPin, Phone } from "lucide-react";
import type { Site } from "@/lib/schemas";
import { TechIcon } from "@/lib/tech-icons";

export function Footer({ site }: { site: Site }) {
  const year = 2026;
  return (
    <footer className="mt-28 border-t border-line">
      <div className="shell grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="label">Let&apos;s connect</p>
          <h2 className="serif mt-4 max-w-2xl text-4xl sm:text-5xl">
            Have an idea worth building?{" "}
            <em className="text-gold">Let&apos;s make it real.</em>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            From a rough sketch to a running product — I&apos;m open to new
            projects, roles and collaborations. Based in {site.location}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {site.email && (
              <a href={`mailto:${site.email}`} className="btn-gold">
                <Mail size={16} /> Get in touch
              </a>
            )}
            {site.github && (
              <a href={site.github} target="_blank" rel="noreferrer noopener" className="btn-ghost">
                <Github size={16} /> View GitHub
              </a>
            )}
          </div>
        </div>

        <div className="card-dark flex flex-col justify-center gap-4 p-7">
          <p className="label">Direct</p>
          {site.email && (
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-sm hover:text-gold">
              <Mail size={15} className="text-gold" /> {site.email}
            </a>
          )}
          {site.phone && (
            <a href={`tel:${site.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 text-sm hover:text-gold">
              <Phone size={15} className="text-gold" /> {site.phone}
            </a>
          )}
          <p className="flex items-center gap-3 text-sm text-muted">
            <MapPin size={15} className="text-gold" /> {site.location}
          </p>
          <div className="mt-2 flex gap-2">
            {site.github && (
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                title="GitHub"
                className="grid h-10 w-10 place-items-center rounded-theme border border-line transition-all hover:-translate-y-0.5 hover:border-gold"
              >
                <TechIcon name="GitHub" size={17} />
              </a>
            )}
            {site.linkedin && (
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="grid h-10 w-10 place-items-center rounded-theme border border-line transition-all hover:-translate-y-0.5 hover:border-gold"
              >
                <TechIcon name="LinkedIn" size={17} />
              </a>
            )}
            {site.instagram && (
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                title="Instagram (@ig_ds_sha)"
                className="grid h-10 w-10 place-items-center rounded-theme border border-line transition-all hover:-translate-y-0.5 hover:border-gold"
              >
                <TechIcon name="Instagram" size={17} />
              </a>
            )}
            {site.email && (
              <a
                href={`mailto:${site.email}`}
                aria-label="Email"
                title="Email"
                className="grid h-10 w-10 place-items-center rounded-theme border border-line text-gold transition-all hover:-translate-y-0.5 hover:border-gold"
              >
                <Mail size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <Link href="/admin" className="label hover:text-ink">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
