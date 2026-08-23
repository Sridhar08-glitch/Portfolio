"use client";

import type { Site } from "@/lib/schemas";
import { PanelHeader } from "./panel-header";
import { StringListField, TextArea, TextField } from "../fields";

export function SitePanel({
  site,
  onChange,
}: {
  site: Site;
  onChange: (site: Site) => void;
}) {
  const set = <K extends keyof Site>(key: K, value: Site[K]) =>
    onChange({ ...site, [key]: value });

  return (
    <div>
      <PanelHeader
        title="Site settings"
        subtitle="Identity, hero copy and contact details shown across the site."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <TextField label="Name" value={site.name} onChange={(v) => set("name", v)} />
        <TextField label="Role" value={site.role} onChange={(v) => set("role", v)} />
        <TextField label="Location" value={site.location} onChange={(v) => set("location", v)} />
        <TextField
          label="Availability"
          value={site.availability}
          onChange={(v) => set("availability", v)}
        />
      </div>

      <div className="mt-5 grid gap-5">
        <TextArea label="Tagline" value={site.tagline} onChange={(v) => set("tagline", v)} rows={2} />
        <TextField label="Hero thesis" value={site.heroThesis} onChange={(v) => set("heroThesis", v)} />
        <TextArea
          label="Hero support line"
          value={site.heroSupport}
          onChange={(v) => set("heroSupport", v)}
          rows={3}
        />
      </div>

      <h3 className="mt-8 font-display text-lg">Contact</h3>
      <div className="mt-3 grid gap-5 lg:grid-cols-2">
        <TextField label="Email" value={site.email ?? ""} onChange={(v) => set("email", v || undefined)} />
        <TextField label="Phone" value={site.phone ?? ""} onChange={(v) => set("phone", v || undefined)} />
        <TextField
          label="GitHub URL"
          value={site.github ?? ""}
          onChange={(v) => set("github", v || undefined)}
        />
        <TextField
          label="LinkedIn URL"
          hint="optional"
          value={site.linkedin ?? ""}
          onChange={(v) => set("linkedin", v || undefined)}
        />
        <TextField
          label="Site URL"
          hint="used for canonical + sitemap"
          value={site.siteUrl}
          onChange={(v) => set("siteUrl", v)}
        />
      </div>

      <h3 className="mt-8 font-display text-lg">About</h3>
      <div className="mt-3">
        <StringListField
          label="About paragraphs"
          items={site.aboutBody}
          onChange={(v) => set("aboutBody", v)}
          placeholder="A paragraph about you…"
        />
      </div>
    </div>
  );
}
