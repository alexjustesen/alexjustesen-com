---
title: "Hello, world (again)"
pubDate: 2026-05-20
description: "A short note kicking off the new version of this site."
tags: ["meta"]
---

I rebuilt this site from scratch — again. The previous version was Astro 4 on
Cloudflare Pages and the integration story for SSR was creaky enough that every
change felt like a yak shave. This rebuild is on Astro 6 + the first-class
Workers runtime, which means `astro dev` and production run the same `workerd`
binary. No more "works locally, breaks in prod."

The visual direction is intentional restraint: monospace, dark, one accent
color. The goal is to make writing easy and reading fast. Everything else can
follow.

## What's next

- Move the existing posts over.
- Wire up RSS.
- Decide whether the projects list should track pinned repos automatically or
  stay manually curated.
