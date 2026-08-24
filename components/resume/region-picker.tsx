"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, FileType } from "lucide-react";

/**
 * Region-aware resume downloads. Files are generated from two masters by
 * scripts/generate-resumes.ps1 and live in public/resume/ as
 * Sridhar_Mahalingam_Software_Developer_<Region>[_Full].{pdf,docx}.
 * Detection is fully client-side (timezone, then browser language) — no
 * network call, no IP lookup.
 */

const BASE = "/resume/Sridhar_Mahalingam_Software_Developer_";

type Region = {
  id: string;
  name: string;
  flag: string;
  file: string;
  meta: string;
  note: string;
};

const REGIONS: Region[] = [
  {
    id: "qatar",
    name: "Qatar",
    flag: "🇶🇦",
    file: "Qatar",
    meta: "Photo · nationality · transferable visa & NOC",
    note: "Qatar-specific version — based in Doha with a transferable visa and NOC available.",
  },
  {
    id: "gulf",
    name: "Gulf & Middle East",
    flag: "🌍",
    file: "Gulf",
    meta: "Photo · nationality · open to GCC relocation",
    note: "GCC-wide version — the photo, nationality and visa details expected across the Gulf, open to UAE, Saudi Arabia, Kuwait, Bahrain and Oman.",
  },
  {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    file: "India",
    meta: "Photo · Indian citizen · no sponsorship required",
    note: "India version — Indian citizen with full right to work, no sponsorship required.",
  },
  {
    id: "singapore",
    name: "Singapore & SE Asia",
    flag: "🇸🇬",
    file: "Singapore",
    meta: "No photo · Employment Pass sponsorship stated",
    note: "Formatted for Singapore — states that Employment Pass sponsorship is required, with qualifications verifiable for MOM assessment.",
  },
  {
    id: "uk",
    name: "United Kingdom & Ireland",
    flag: "🇬🇧",
    file: "UK",
    meta: "CV format · no photo · sponsorship stated",
    note: "UK CV conventions — no photo, and states that Skilled Worker visa sponsorship is required.",
  },
  {
    id: "europe",
    name: "European Union",
    flag: "🇪🇺",
    file: "Europe",
    meta: "Photo · EU Blue Card route stated",
    note: "Continental-Europe conventions — includes the photo, and states that employer-sponsored work authorisation (EU Blue Card route) is required.",
  },
  {
    id: "us",
    name: "United States",
    flag: "🇺🇸",
    file: "US",
    meta: "No photo · no personal details · US spelling",
    note: "US employers commonly discard resumes with photos or personal details, so this version omits both — and states that visa sponsorship is required.",
  },
  {
    id: "canada",
    name: "Canada",
    flag: "🇨🇦",
    file: "Canada",
    meta: "No photo · work-permit sponsorship stated",
    note: "Same conventions as the US, and states that employer work-permit sponsorship is required.",
  },
  {
    id: "australia",
    name: "Australia & New Zealand",
    flag: "🇦🇺",
    file: "Australia",
    meta: "No photo · work rights stated",
    note: "Australia/NZ conventions — longer resumes are standard, and employer-sponsored work visa is stated as required.",
  },
];

const DEFAULT_REGION = "qatar";

const TZ_EXACT: Record<string, string> = {
  "Asia/Qatar": "qatar",
  "Asia/Kolkata": "india",
  "Asia/Calcutta": "india",
  "Europe/London": "uk",
  "Europe/Dublin": "uk",
  "Europe/Belfast": "uk",
  "Pacific/Auckland": "australia",
};

const TZ_CONTAINS: [string, string][] = [
  ["Dubai", "gulf"], ["Riyadh", "gulf"], ["Kuwait", "gulf"], ["Bahrain", "gulf"],
  ["Muscat", "gulf"], ["Baghdad", "gulf"], ["Amman", "gulf"], ["Beirut", "gulf"],
  ["Singapore", "singapore"], ["Kuala_Lumpur", "singapore"], ["Jakarta", "singapore"],
  ["Manila", "singapore"], ["Bangkok", "singapore"], ["Ho_Chi_Minh", "singapore"],
  ["Hong_Kong", "singapore"], ["Brunei", "singapore"],
  ["Toronto", "canada"], ["Vancouver", "canada"], ["Edmonton", "canada"],
  ["Winnipeg", "canada"], ["Halifax", "canada"], ["Regina", "canada"],
  ["St_Johns", "canada"], ["Moncton", "canada"],
];

const LANG_SUFFIX: Record<string, string> = {
  GB: "uk", IE: "uk", CA: "canada", US: "us", AU: "australia", NZ: "australia",
  SG: "singapore", MY: "singapore", IN: "india",
  AE: "gulf", SA: "gulf", QA: "qatar", KW: "gulf", BH: "gulf", OM: "gulf",
};

function detectRegion(): string {
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    tz = "";
  }
  if (tz) {
    if (TZ_EXACT[tz]) return TZ_EXACT[tz];
    for (const [needle, id] of TZ_CONTAINS) if (tz.includes(needle)) return id;
    if (tz.startsWith("Australia/")) return "australia";
    if (tz.startsWith("Europe/")) return "europe";
    if (tz.startsWith("America/") || tz.startsWith("US/")) return "us";
  }
  const lang = (navigator.languages?.[0] ?? navigator.language ?? "").toUpperCase();
  const suffix = lang.split("-")[1];
  if (suffix && LANG_SUFFIX[suffix]) return LANG_SUFFIX[suffix];
  if (/^(DE|NL|FR|ES|IT|SV|DA|PL|PT|FI)/.test(lang)) return "europe";
  return DEFAULT_REGION;
}

function FileLinks({ region, primary }: { region: Region; primary?: boolean }) {
  const base = BASE + region.file;
  if (primary) {
    return (
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={`${base}.pdf`} download className="btn-gold !px-5 !py-2.5 text-sm">
          <Download size={15} aria-hidden /> Download PDF
        </a>
        <a href={`${base}.docx`} download className="btn-ghost !px-5 !py-2.5 text-sm">
          <FileType size={15} aria-hidden /> Word (.docx)
        </a>
        <a href={`${base}_Full.pdf`} download className="btn-ghost !px-5 !py-2.5 text-sm">
          <FileText size={15} aria-hidden /> Detailed version
        </a>
      </div>
    );
  }
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <a href={`${base}.pdf`} download className="text-muted transition-colors hover:text-gold">
        PDF
      </a>
      <span className="text-muted/50" aria-hidden>·</span>
      <a href={`${base}.docx`} download className="text-muted transition-colors hover:text-gold">
        Word
      </a>
      <span className="text-muted/50" aria-hidden>·</span>
      <a href={`${base}_Full.pdf`} download className="text-muted transition-colors hover:text-gold">
        Detailed PDF
      </a>
      <span className="text-muted/50" aria-hidden>·</span>
      <a href={`${base}_Full.docx`} download className="text-muted transition-colors hover:text-gold">
        Detailed Word
      </a>
    </p>
  );
}

export function RegionPicker() {
  const [selected, setSelected] = useState<string | null>(null);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    setSelected(detectRegion());
    setDetected(true);
  }, []);

  const region = useMemo(
    () => REGIONS.find((r) => r.id === selected) ?? null,
    [selected],
  );

  const choose = (id: string) => {
    setSelected(id);
    setDetected(false);
    document.getElementById("resume-detected")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      {/* Detected / selected region panel */}
      <div
        id="resume-detected"
        aria-live="polite"
        className="card-dark scroll-mt-24 p-7 sm:p-8"
        style={{ "--glow": "rgb(var(--c-gold) / 0.35)" } as React.CSSProperties}
      >
        <p className="label flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
          {region ? (detected ? "Detected region" : "Selected region") : "Detecting region…"}
        </p>
        {region ? (
          <>
            <h2 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
              {region.flag} {region.name}
            </h2>
            <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
              {region.note}
            </p>
            <FileLinks region={region} primary />
          </>
        ) : (
          <h2 className="mt-3 font-display text-2xl font-semibold text-muted">—</h2>
        )}
        <p className="mt-5 text-sm text-muted">
          Not right?{" "}
          <a
            href="#all-versions"
            className="text-gold underline-offset-4 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("all-versions")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Choose a different region
          </a>
        </p>
      </div>

      {/* All regions */}
      <h2 id="all-versions" className="label mt-14 scroll-mt-24">
        All versions
      </h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REGIONS.map((r) => {
          const active = r.id === selected;
          return (
            <li key={r.id}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => choose(r.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(r.id);
                  }
                }}
                className={
                  "h-full cursor-pointer rounded-theme border p-5 transition-colors " +
                  (active
                    ? "border-gold/50 bg-gold/[0.06]"
                    : "border-line bg-panel/60 hover:border-gold/30 hover:bg-panel")
                }
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[1.02rem] font-semibold">
                    {r.flag} {r.name}
                  </span>
                  {active && (
                    <span className="rounded-full border border-gold/40 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-gold">
                      For you
                    </span>
                  )}
                </div>
                <p className="mt-2 font-mono text-[0.68rem] leading-relaxed text-muted">
                  {r.meta}
                </p>
                <FileLinks region={r} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
