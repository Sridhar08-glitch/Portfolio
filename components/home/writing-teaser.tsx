import Link from "next/link";
import { ArrowRight, PenLine } from "lucide-react";
import type { Post } from "@/lib/schemas";

/** Honest empty state — no fabricated articles. */
export function WritingTeaser({ posts }: { posts: Post[] }) {
  const published = posts.filter((p) => !p.draft);
  if (published.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-start gap-4 rounded-theme border border-dashed border-line p-8">
        <PenLine size={22} className="text-mineral" aria-hidden />
        <div>
          <p className="text-xl font-medium">Writing is in progress.</p>
          <p className="mt-2 max-w-xl text-muted">
            Deep technical notes — on the ShieldDNS pipeline, offline sync, and
            keeping AI on owned infrastructure — will appear here as projects
            reach publishable milestones.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <Link href="/writing" className="inline-flex items-center gap-2 text-mineral">
        Read all notes <ArrowRight size={15} />
      </Link>
    </div>
  );
}
