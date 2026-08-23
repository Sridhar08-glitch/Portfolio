import type { Metadata } from "next";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { posts } from "@/lib/content";
import { SectionHeading } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Writing",
  description: "Technical notes on systems, architecture and engineering decisions.",
};

export default function WritingPage() {
  const published = posts
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="shell pt-14 sm:pt-20">
      <SectionHeading
        label="Writing"
        title="Notes on building systems."
      />

      {published.length === 0 ? (
        <div className="mt-10 flex flex-col items-start gap-4 rounded-theme border border-dashed border-line p-8 sm:p-12">
          <PenLine size={24} className="text-mineral" aria-hidden />
          <div>
            <p className="text-2xl font-medium">Writing is in progress.</p>
            <p className="mt-3 max-w-xl leading-relaxed text-muted">
              Deep technical notes will appear here as projects reach publishable
              milestones — the ShieldDNS resolution pipeline, offline-first
              conflict reconciliation, and what it takes to keep an AI stack
              entirely on owned infrastructure.
            </p>
            <Link
              href="/work"
              className="mt-6 inline-block font-mono text-sm text-mineral"
            >
              In the meantime, explore the work →
            </Link>
          </div>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {published.map((post) => (
            <li key={post.slug} className="py-6">
              <p className="font-mono text-xs text-muted">{post.date}</p>
              <h2 className="mt-2 text-2xl">{post.title}</h2>
              <p className="mt-2 max-w-2xl text-muted">{post.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
