import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="label">404 — no route resolved</p>
      <h1 className="mt-4 text-5xl sm:text-7xl">Dead end in the graph.</h1>
      <p className="mt-4 max-w-md text-muted">
        That path doesn&apos;t connect to any node here. Head back to the map and
        pick a system.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-theme bg-mineral px-5 py-3 text-sm font-medium on-dark"
        >
          Back home
        </Link>
        <Link
          href="/work"
          className="rounded-theme border border-line px-5 py-3 text-sm font-medium hover:bg-panel"
        >
          Browse work
        </Link>
      </div>
    </section>
  );
}
