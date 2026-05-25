# alexjustesen.com

Personal website built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and deployed to [Cloudflare Workers](https://developers.cloudflare.com/workers/).

## Stack

- **Astro 6** — server-rendered (`output: 'server'`) via the [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) adapter
- **Tailwind CSS v4** — installed as the [`@tailwindcss/vite`](https://tailwindcss.com/docs/installation/framework-guides/astro) plugin (CSS-first config)
- **TypeScript** — Astro's `strict` preset
- **Cloudflare Workers** — runtime in dev (via Astro 6's workerd integration) and in production

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

### Option B — Manual deploy from your machine

```sh
npx wrangler login   # one-time
npm run deploy
```

This builds and pushes the Worker (and its static assets) using the settings in `wrangler.jsonc`.

## Project layout

```
.
├── astro.config.mjs    # Astro + Cloudflare adapter + Tailwind Vite plugin
├── wrangler.jsonc      # Cloudflare Workers config
├── public/             # Static assets copied as-is
└── src/
    ├── pages/          # Routes (file-based)
    └── styles/
        └── global.css  # `@import "tailwindcss";` — extend with `@theme` here
```
