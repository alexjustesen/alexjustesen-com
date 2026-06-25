# alexjustesen.com

Personal website built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## Stack

- **Astro 7** — server-rendered (`output: 'server'`) via the [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) adapter
- **Tailwind CSS v4** — installed as the [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/framework-guides/astro) plugin (CSS-first config)
- **TypeScript** — Astro's `strict` preset
- **Cloudflare Workers** — runtime in dev (via Astro's workerd integration) and in production
- **Cloudflare KV** — `SESSION` namespace for stateful data (see `wrangler.jsonc`)

## Features

- **Content collections** — Blog posts from local Markdown (`src/content/blog/`) and projects fetched live from the GitHub API (`src/content/projects/`) via a custom Astro loader
- **Custom GitHub loader** — `src/lib/github-loader.ts` pulls repo metadata (stars, language, description) at build time; optional `GITHUB_TOKEN` for higher rate limits
- **JSON:API profile endpoint** — `GET /api/profile` returns a JSON:API representation of the site author
- **Typography** — JetBrains Mono loaded via `fontProviders.fontsource()` in `astro.config.mjs`
- **Custom theme** — Tailwind v4 `@theme` block with a dark terminal-inspired palette (`bg`, `fg`, `muted`, `border`, `accent`)

## Prerequisites

- Node.js 22.12+ (`.nvmrc` is set to `22` — run `nvm use`)
- npm
- A [Cloudflare account](https://dash.cloudflare.com) (only required for deploys)

## Install

```sh
npm install
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

Outputs the Worker bundle and static assets to `dist/`.

## Preview (production build, locally)

```sh
npm run preview
```

Runs `wrangler dev` against `dist/`, serving the built Worker on the same `workerd` runtime that Cloudflare uses in production.

## Deploy

### Option A — Cloudflare Git integration (preferred)

Connect the repo once in the Cloudflare dashboard and every push to `main` deploys automatically:

1. Go to **Workers & Pages → Create application → Import a repository**.
2. Authorize Cloudflare for this GitHub repo and select it.
3. Set the build settings:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy`
4. Save. Cloudflare will run the first build and deploy on completion.

> **Note:** If you want the GitHub loader to fetch private repos or avoid rate limits, add a `GITHUB_TOKEN` secret in the Cloudflare dashboard (**Workers & Pages → Settings → Variables and Secrets**).

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
| `build` | Build for production |
| `preview` | Preview production build locally with `wrangler dev` |
| `deploy` | Build and deploy to Cloudflare Workers |
| `generate-types` | Generate `worker-configuration.d.ts` from `wrangler.jsonc` |

## Project layout

```
.
├── astro.config.mjs         # Astro + Cloudflare adapter + Tailwind Vite plugin + fonts
├── wrangler.jsonc           # Cloudflare Workers config (KV, assets, observability)
├── public/                  # Static assets copied as-is
└── src/
    ├── components/          # Reusable Astro components (ProfileCard, Terminal, Whoami)
    ├── content/
    │   ├── blog/            # Markdown blog posts
    │   └── projects/
    │       └── repos.ts     # List of GitHub repo slugs for the custom loader
    ├── content.config.ts    # Astro content collections (blog + projects)
    ├── images/              # Image assets
    ├── layouts/             # Page layouts (Layout.astro)
    ├── lib/
    │   └── github-loader.ts # Custom Astro loader for GitHub repo metadata
    ├── pages/
    │   ├── api/
    │   │   └── profile.ts   # JSON:API profile endpoint
    │   ├── blog/            # Blog post routes
    │   └── index.astro      # Homepage
    └── styles/
        └── global.css       # `@import "tailwindcss";` + custom `@theme` block
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub personal access token for higher rate limits when fetching repo metadata |

## License

MIT
