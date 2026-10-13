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

## Content

Add project repositories to `src/content/projects/repos.ts` using `owner/repo`, not full URLs. The project list is a build-time snapshot, including star counts.

No blog posts are included yet. Create `src/content/blog/` when adding your first Markdown post, with `title`, `pubDate`, and `description` frontmatter; `tags` is optional. Keep IDs/slugs to one path segment for the current `[slug].astro` route. Until posts exist, the blog intentionally shows an empty state and Astro may report empty-collection warnings.

## Preview (production build, locally)

```sh
npm run build
npm run preview
```

Runs the Cloudflare adapter's `astro preview` on the same `workerd` runtime that Cloudflare uses in production. To verify the static API header, run `curl -I http://localhost:4321/api/profile` (adjust the port to match the preview output).

## Deploy

### Option A — Cloudflare Git integration (preferred)

Connect the repo once in the Cloudflare dashboard and every push to `main` deploys automatically:

1. Go to **Workers & Pages → Create application → Import a repository**.
2. Authorize Cloudflare for this GitHub repo and select it.
3. Set the build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. Save. Cloudflare will run the first build and deploy on completion.

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
    │   └── profile.ts       # Shared profile details and social links
    ├── images/              # Image assets
    ├── layouts/             # Page layouts (Layout.astro)
    ├── lib/
    │   └── github-loader.ts # Custom Astro loader for GitHub repo metadata
    ├── pages/
    │   ├── api/
    │   │   └── profile.ts   # JSON:API profile endpoint
    │   ├── blog/            # Blog post routes
    │   └── index.astro      # Homepage
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
