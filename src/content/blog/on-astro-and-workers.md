---
title: "Notes on Astro 6 + Cloudflare Workers"
pubDate: 2026-05-22
description: "The shape of the new stack, and why dev/prod parity matters."
tags: ["astro", "cloudflare"]
---

Astro 6 made one change that, for me, justifies the whole upgrade: the dev
server runs on `workerd`, the same JavaScript runtime Cloudflare uses in
production. That means an entire class of "works in dev, breaks in prod" bugs
just disappears — `crypto.subtle` behaves the same way, `Request`/`Response`
implementations match, and environment bindings are wired identically.

A few smaller details that are nice in practice:

- The `@astrojs/cloudflare` adapter auto-enables a KV-backed session store and
  Cloudflare Images bindings on the production build. You can opt out if you
  don't want them.
- `wrangler.jsonc` is the canonical config format now; `wrangler.toml` still
  works but the schema is less expressive.
- Static and SSR coexist cleanly: opt a route into prerendering with
  `export const prerender = true;` and Astro emits HTML at build time, with the
  Worker only handling the dynamic routes.

I'll write about the GitHub-repos custom loader once I've shaken out the build
caching behavior. The short version: it's faster than I expected, and there's
no need to reach for Cloudflare KV unless you're caching across builds.
