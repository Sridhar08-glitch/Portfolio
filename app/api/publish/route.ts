import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Auto-publish: commits changed content files straight to the GitHub repo via
 * the Contents API. Netlify's git integration then rebuilds automatically, so
 * an admin edit goes live in ~2 minutes with zero manual steps.
 *
 * Required env (server-side only, never exposed to the browser):
 *   GITHUB_TOKEN        fine-grained PAT — Contents: read & write on this repo
 *   GITHUB_REPO         e.g. "Sridhar08-glitch/sridharportfolio"
 *   GITHUB_BRANCH       e.g. "main" (default) — the branch Netlify deploys
 *   ADMIN_PUBLISH_KEY   the admin passphrase, checked before any commit
 */

const BodySchema = z.object({
  key: z.string().min(1),
  files: z
    .array(
      z.object({
        // Only content files are ever publishable — nothing else in the repo.
        path: z.string().regex(/^content\/[a-z]+\.json$/),
        content: z.string().min(2).max(2_000_000),
      }),
    )
    .min(1)
    .max(10),
});

const GH = "https://api.github.com";

export async function POST(request: Request) {
  const { GITHUB_TOKEN, GITHUB_REPO, ADMIN_PUBLISH_KEY } = process.env;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!GITHUB_TOKEN || !GITHUB_REPO || !ADMIN_PUBLISH_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Auto-publish is not configured. Set GITHUB_TOKEN, GITHUB_REPO and ADMIN_PUBLISH_KEY in the environment — or use Export → commit instead.",
      },
      { status: 503 },
    );
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid publish payload." }, { status: 400 });
  }

  if (body.key !== ADMIN_PUBLISH_KEY) {
    return NextResponse.json({ ok: false, error: "Wrong passphrase." }, { status: 401 });
  }

  // Every content file is validated by Zod at build time; a malformed publish
  // would fail the Netlify build rather than break the live site. Still, parse
  // here as a first gate.
  for (const f of body.files) {
    try {
      JSON.parse(f.content);
    } catch {
      return NextResponse.json(
        { ok: false, error: `${f.path} is not valid JSON.` },
        { status: 400 },
      );
    }
  }

  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };

  const committed: string[] = [];
  for (const f of body.files) {
    // Current sha is required to update an existing file.
    const getRes = await fetch(
      `${GH}/repos/${GITHUB_REPO}/contents/${f.path}?ref=${branch}`,
      { headers, cache: "no-store" },
    );
    let sha: string | undefined;
    if (getRes.ok) {
      sha = ((await getRes.json()) as { sha: string }).sha;
    } else if (getRes.status !== 404) {
      return NextResponse.json(
        { ok: false, error: `GitHub read failed for ${f.path} (${getRes.status}). Check GITHUB_TOKEN/GITHUB_REPO.`, committed },
        { status: 502 },
      );
    }

    const putRes = await fetch(`${GH}/repos/${GITHUB_REPO}/contents/${f.path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `content: publish ${f.path.replace("content/", "")} from admin`,
        content: Buffer.from(f.content, "utf8").toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });
    if (!putRes.ok) {
      const detail = await putRes.text();
      return NextResponse.json(
        { ok: false, error: `GitHub commit failed for ${f.path} (${putRes.status}): ${detail.slice(0, 200)}`, committed },
        { status: 502 },
      );
    }
    committed.push(f.path);
  }

  return NextResponse.json({ ok: true, committed });
}
