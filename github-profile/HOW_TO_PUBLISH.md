# How to publish your GitHub profile page

GitHub shows a README on your profile when you create a repository named
**exactly the same as your username**: `Sridhar08-glitch/Sridhar08-glitch`.

## Steps (5 minutes)

1. Go to https://github.com/new
2. Repository name: `Sridhar08-glitch` (GitHub will show a special note:
   "You found a secret! ... special repository")
3. Set it **Public**, tick **Add a README file**, create.
4. Upload the contents of this folder into that repo:
   - `README.md` (replace the generated one)
   - the `assets/` folder (banner + screenshots)

   Easiest way — from this folder:
   ```bash
   cd github-profile
   git init
   git remote add origin https://github.com/Sridhar08-glitch/Sridhar08-glitch.git
   git add .
   git commit -m "Profile README"
   git branch -M main
   git push -u origin main --force
   ```
5. Visit https://github.com/Sridhar08-glitch — the README now IS your profile page.

## Before pushing — one edit

The portfolio links use the placeholder `https://sridharportfolio1.netlify.app`.
Once your real domain is live, find-and-replace it in `README.md`.

## Enable the contribution snake (one click)

The animated snake is generated INSIDE your repo by
`.github/workflows/snake.yml` — no third-party server involved.

After pushing:
1. Open the repo → **Actions** tab → enable workflows if prompted.
2. Run **"Generate contribution snake"** once (workflow_dispatch → Run workflow).
3. It commits `github-snake.svg` to an `output` branch; the README picks it up.
   From then on it refreshes daily automatically.

Until the first run, the snake image shows as broken — that's expected.

## Notes

- The stats cards (github-readme-stats) render live from GitHub's API — no setup.
- "private" project rows are honest placeholders; swap in repo links whenever
  you open-source them.
- The pipe character in any project description would break the tables — keep
  descriptions pipe-free if you edit.
