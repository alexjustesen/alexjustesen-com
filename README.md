# alexjustesen.com

Personal website built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## Stack

- **Astro 7** — prerendered (`output: 'static'`) via the [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) adapter
- **Tailwind CSS v4** — installed as the [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/framework-guides/astro) plugin (CSS-first config)
- **TypeScript** — Astro's `strict` preset
- **Cloudflare Workers** — development and preview use `workerd`; production routes are served as static assets
- **No session storage** — sessions are disabled; no KV namespace is required

## Features

- **Content collections** — Blog posts from local Markdown (`src/content/blog/`) and projects fetched from GitHub at build time; both require a rebuild to publish updates
- **Custom GitHub loader** — `src/lib/github-loader.ts` validates repo metadata before storing it; requests time out after 10 seconds, and any fetch/validation failure fails the build instead of publishing a partial list
- **Shared profile data** — `src/data/profile.ts` supplies profile details and social links to the page components and API
- **Uses page** — `/uses` lists hardware, development software, tools, and AI agents from `src/data/uses.ts`, with a manually maintained update date
- **JSON:API profile endpoint** — `GET /api/profile` is prerendered; `public/_headers` preserves its `application/vnd.api+json` media type on Cloudflare, and `public/_redirects` normalizes trailing-slash requests
- **Typography** — JetBrains Mono loaded via `fontProviders.fontsource()`; only the body weight is preloaded
- **Images** — the homepage photo uses responsive, prioritized WebP images generated at build time; `/images/profile.webp` remains a stable public URL for the API and social cards
- **SEO and accessibility** — canonical URLs, social metadata, sitemap/robots files, semantic headings, and live clipboard feedback
- **Custom theme** — Tailwind v4 `@theme` block with a dark terminal-inspired palette (`bg`, `fg`, `muted`, `border`, `accent`)

## Prerequisites

- Node.js 22.12+ (`.nvmrc` is set to `22` — run `nvm use`)
- npm
- A [Cloudflare account](https://dash.cloudflare.com) (only required for deploys)

## Install

```sh
npm ci
```

## Develop

```sh
npm run dev
```

Starts the Astro dev server. Open the printed URL (default: <http://localhost:4321>).

## Build

```sh
npm run build
```

Runs Astro type checking before building the Worker bundle and static assets in `dist/`. GitHub metadata and optimized images are generated during the build. Sessions and Cloudflare Images bindings are not needed.

## Checks and tests

```sh
npm run check
npm test
```

Type checking covers Astro components and TypeScript. Tests cover GitHub loader validation/failures, the profile API representation, and clipboard feedback without making network requests. Content synchronization during `check` and `build` does contact GitHub.

## Branch workflow and protection

`develop` is the default development branch and allows direct commits. Promote a release by opening a PR from `develop` to `main` and merging with a **merge commit**, then tag the resulting `main` commit with a `v*` release tag to trigger the Cloudflare deploy hook. Merge commits preserve shared ancestry; squash and rebase merges are not used for this workflow.

A normal `develop` → `main` release does not require merging `main` back into `develop`. If fixes are made separately on a `release/*` or `hotfix/*` branch, merge that branch into both `main` and `develop` so development includes those fixes.

Importable GitHub branch rulesets are versioned in `.github/rulesets/`:

| Protection | `main.json` | `develop.json` |
|------------|-------------|----------------|
| Block branch deletion and force pushes | Yes | Yes |
| Require a pull request | Yes | No; direct commits allowed |
| Allowed PR merge methods | Merge commit only | Controlled by repository merge settings |
| Required CI check | `Tests and build` from GitHub Actions | None |
| Require resolved PR conversations | Yes | No |
| General required approvals | Zero (supports solo maintenance) | None |
| Require code-owner review | Yes | No; review requests only |
| Dismiss stale approvals after new changes | Yes | No |
| Require linear history | No | No |
| Bypass actors | None | None |

The CI workflow in `.github/workflows/ci.yml` runs tests and the production build (including type checking) on pushes to `develop` and PRs targeting `main` or `develop`. Failed CI does not block direct pushes to `develop`, but it blocks merging a PR into `main`. The required check does not demand that the source branch contain the latest `main` merge commit, so normal releases can remain one-way promotions. CI does not deploy the site.

`.github/CODEOWNERS` assigns every file to `@alexjustesen`, including the ownership file and workflows. GitHub automatically requests Alex's review on other authors' non-draft PRs, including fork contributions, using the CODEOWNERS file on the PR's target branch. PRs into `main` require code-owner approval, and new reviewable changes dismiss stale approvals. PRs into `develop` request review but do not enforce approval, preserving direct commits. This applies to contributors as well as outside contributors, not only first-time contributors. General required approvals remain zero; do not raise this to one for solo maintenance, since GitHub does not allow authors to approve their own PRs.

### Import into GitHub

1. Commit and push the rulesets, CODEOWNERS file, and CI workflow to `develop`. Keep `develop` as the default branch; these JSON files do not create branches or change the default.
2. Under **Settings → General → Pull Requests**, enable **Allow merge commits** and disable **Allow squash merging** and **Allow rebase merging**. Repository settings are separate from ruleset imports; leaving merge commits disabled would block all PR merges into `main`.
3. Under **Settings → Rules → Rulesets → New ruleset → Import a ruleset**, import `.github/rulesets/develop.json` and `.github/rulesets/main.json` separately. Both are active immediately and apply to explicit branch names, not whichever branch is currently the default. They have no bypass actors, including for administrators.
4. Open a release PR from `develop` to `main` and confirm that `Tests and build` runs and passes before merging. Do not import the required-check ruleset before the CI workflow is available, or PRs may be blocked waiting for a check that never runs. Code-owner review requests and enforcement on `main` start only once CODEOWNERS has been merged into `main`; the initial PR adding it uses the existing target-branch ownership configuration.

Committing a template does not apply it to GitHub. Subsequent template changes must also be applied to the existing GitHub ruleset; importing again creates another ruleset rather than updating the existing one. Keep the CI job name and the required status-check context in `main.json` in sync.

## Content

Add project repositories to `src/content/projects/repos.ts` using `owner/repo`, not full URLs. The project list is a build-time snapshot, including star counts.

No blog posts are included yet. Create `src/content/blog/` when adding your first Markdown post, with `title`, `pubDate`, and `description` frontmatter; `tags` is optional. Keep IDs/slugs to one path segment for the current `[slug].astro` route. Until posts exist, the blog intentionally shows an empty state and Astro may report empty-collection warnings.

Maintain the `/uses` page in `src/data/uses.ts`. Each category has a unique `id`, a `title`, and items with a `name`, `description`, and optional official `url`. Update `updated` manually using `YYYY-MM-DD` when the setup changes, then rebuild to publish. The date represents a content update, not the latest build.

## Preview (production build, locally)

```sh
npm run build
npm run preview
```

Runs the Cloudflare adapter's `astro preview` on the same `workerd` runtime that Cloudflare uses in production. To verify the static API header, run `curl -I http://localhost:4321/api/profile` (adjust the port to match the preview output).

## Deploy

### Option A — GitHub Actions deploy hook (preferred)

The workflow in `.github/workflows/deploy.yml` calls a Cloudflare deploy hook only when a release tag matching `v*` (for example, `v4.3.0`) is pushed. Branch pushes and manual workflow runs do not trigger it. Cloudflare handles the build and deployment; GitHub Actions only sends the request.

1. Go to **Workers & Pages → Create application → Import a repository**.
2. Authorize Cloudflare for this GitHub repo and select it.
3. Set the build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. Create a Cloudflare deploy hook targeting `main` and save its URL as the GitHub repository Actions secret **`DEPLOY_HOOK`**.
5. Disable Cloudflare's automatic push-based deployment trigger for `main` when using this workflow, so ordinary branch pushes do not deploy the site.

The deploy hook builds its configured branch (`main`), not the triggering tag's commit. Merge release changes into `main` before tagging, and be aware that later changes to `main` may be included if the hook builds after those changes land.

The workflow requires an HTTPS hook URL, fails on unsuccessful HTTP responses, and does not retry requests or log the hook URL/response body. Production hook calls are serialized. A successful workflow means Cloudflare accepted the request, not that the build finished successfully; check Cloudflare Builds for the final result.

> **Note:** For higher GitHub API rate limits, add `GITHUB_TOKEN` to the **Workers Builds build variables/secrets**, not only the deployed Worker's runtime secrets. The loader runs in the build process and reads `process.env.GITHUB_TOKEN`. Repository metadata is published publicly on the site, so only configure repositories you intend to display.

### Option B — Manual deploy from your machine

```sh
npx wrangler login   # one-time
npm run deploy
```

This builds and pushes the Worker (and its static assets) using the settings in `wrangler.jsonc`.

## Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start Astro dev server |
| `check` | Synchronize content and type-check Astro/TypeScript |
| `test` | Run isolated loader, profile API, and clipboard tests |
| `build` | Type-check and build for production |
| `preview` | Preview the production build locally with `astro preview` |
| `deploy` | Type-check, build, and deploy to Cloudflare Workers |
| `generate-types` | Generate `worker-configuration.d.ts` from `wrangler.jsonc` |

## Project layout

```
.
├── astro.config.mjs         # Astro + Cloudflare adapter + Tailwind Vite plugin + fonts
├── wrangler.jsonc           # Cloudflare Workers config (assets, observability)
├── public/                  # Static assets copied as-is
├── tests/                   # Vitest loader, API, and clipboard tests
└── src/
    ├── components/          # Reusable Astro components, including shared ProfileDetails
    ├── content/
    │   ├── blog/            # Create this directory when adding Markdown blog posts
    │   └── projects/
    │       └── repos.ts     # List of GitHub repo slugs for the custom loader
    ├── content.config.ts    # Astro content collections (blog + projects)
     ├── data/
     │   ├── profile.ts       # Shared profile details and social links
     │   └── uses.ts          # Uses categories, items, and manual update date
    ├── images/              # Image assets
    ├── layouts/             # Page layouts (Layout.astro)
    ├── lib/
    │   └── github-loader.ts # Custom Astro loader for GitHub repo metadata
    ├── pages/
    │   ├── api/
    │   │   └── profile.ts   # JSON:API profile endpoint
    │   ├── blog/            # Blog post routes
     │   ├── index.astro      # Homepage
     │   └── uses.astro       # Hardware, development setup, and tools
    ├── scripts/             # Browser behavior (clipboard feedback)
    └── styles/
        └── global.css       # `@import "tailwindcss";` + custom `@theme` block
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | Build-time GitHub token for higher API rate limits; configure it in the shell/CI environment or Workers Builds secrets |

For local builds, export `GITHUB_TOKEN` in your shell before running `npm run check`, `npm run build`, or `npm run dev`. The custom loader reads the process environment; a deployed Worker runtime secret or `.dev.vars` is not a substitute for a build variable. Never commit tokens, and use the least permissions needed to read the configured repositories.

## License

MIT
