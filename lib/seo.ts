import type { Metadata } from "next";
import { site } from "./content";
import type { Project } from "./schemas";

const base = site.siteUrl.replace(/\/$/, "");

export function absoluteUrl(path = ""): string {
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultMetadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
  applicationName: `${site.name} Portfolio`,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "systems developer",
    "full-stack developer",
    "Django",
    "Next.js",
    "offline-first",
    "self-hosted AI",
    site.name,
  ],
  alternates: { canonical: base },
  openGraph: {
    type: "website",
    url: base,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    siteName: `${site.name} Portfolio`,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
  robots: { index: true, follow: true },
};

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    address: { "@type": "PostalAddress", addressLocality: site.location },
    url: base,
    email: site.email ? `mailto:${site.email}` : undefined,
    sameAs: [site.github, site.linkedin].filter(Boolean),
  };
}

export function projectJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    about: p.category,
    author: { "@type": "Person", name: site.name },
    description: p.summary,
    url: absoluteUrl(`/work/${p.id}`),
    keywords: p.technologies.join(", "),
  };
}
