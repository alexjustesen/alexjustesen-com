# Development guidance

These instructions apply throughout this repository. See [README.md](README.md)
for setup, content authoring, environment variables, and deployment details.

## Architecture

- Use Node.js 22.12+ and npm; preserve `package-lock.json` when changing dependencies.
- This is an Astro 7, TypeScript-strict application deployed to Cloudflare Workers.
- Keep rendering static-first (`output: 'static'`). Add on-demand routes only when needed.
- Sessions are disabled. Do not introduce KV or other bindings without a feature requirement.
- Tailwind CSS v4 uses its Vite plugin and CSS-first configuration in `src/styles/global.css`.
- Prefer Astro components and minimal browser JavaScript; do not add a client framework unnecessarily.
- Consult official Astro documentation (the Astro MCP server when available) before changing framework or adapter APIs.

## Code conventions

- Follow nearby formatting and naming; use single quotes in TypeScript and Astro frontmatter.
- Use explicit type imports and preserve inference with `satisfies` where appropriate.
- Import Zod from `astro/zod`; avoid deprecated Astro/Zod APIs.
- Keep shared profile details and social links in `src/data/profile.ts`.
- Reuse `ProfileDetails.astro` rather than duplicating profile markup.
- Keep browser behavior in `src/scripts/` when it benefits from isolated tests.

## Content and APIs

- Project repositories belong in `src/content/projects/repos.ts` as `owner/repo`, not URLs.
- GitHub metadata is loaded at build time; new data requires a rebuild.
- The custom loader must validate entries with `parseData()` before storing them.
- Preserve request timeouts and fail the build on fetch/validation errors, rather than publish partial results.
- Fetch and validate all entries before clearing the existing collection store.
- `GITHUB_TOKEN` is an optional build-process variable, not a Worker runtime secret.
- Blog Markdown belongs in `src/content/blog/`; schemas are defined in `src/content.config.ts`.
- Keep blog IDs/slugs to one path segment unless explicitly changing the `[slug].astro` routing design.
- Preserve the `/api/profile` JSON:API representation and `application/vnd.api+json` media type.
- Static response headers and API slash normalization depend on `public/_headers` and `public/_redirects`.

## UI, assets, and accessibility

- Preserve the terminal-inspired design and shared theme tokens.
- Provide one meaningful `<h1>` per page and semantic section headings.
- Keep links visibly underlined; do not rely on color alone to distinguish them.
- Preserve keyboard access, descriptive button labels, and live clipboard success/failure feedback.
- Supply page titles/descriptions and preserve canonical URLs, social metadata, and sitemap generation.
- Use `astro:assets` for responsive images and prioritize prominent above-the-fold images.
- Keep Cloudflare image optimization at build time (`imageService: 'compile'`).
- Preserve `/images/profile.webp` as a stable public URL for the API and social cards.
- Preload only essential fonts; configure actual font weights used by the UI.

## Validation

- Run `npm test` and `npm run build` after application changes.
- `npm run build` includes `npm run check`, but does not run tests.
- Tests use Vitest; clipboard tests use Happy DOM. Keep unit tests isolated from network services.
- Content synchronization during `check`, `build`, and development contacts GitHub.
- If GitHub access prevents validation, report the blocker; do not weaken the loader's failure policy.
- Missing/empty blog-content warnings are expected when no posts exist; do not invent posts to silence them.
- For rendering or hosting changes, build first, then use `npm run preview` to check Cloudflare behavior.
- Check mobile/desktop layout, accessibility, browser errors, and served headers when relevant.
- Avoid sending real analytics during automated browser tests, and stop preview servers afterward.

## Change safety

- Inspect the working tree before editing; preserve changes unrelated to the current task.
- Do not hand-edit generated `dist/`, `.astro/`, `.wrangler/`, or `worker-configuration.d.ts` files.
- Never commit secrets or expose tokens in logs, examples, or test fixtures.
- When asked to commit, stage only task-related files and keep distinct fixes in separate commits.
- Do not push or deploy without explicit permission; a push to `main` can trigger deployment.
- Update README guidance when commands, content conventions, or deployment requirements change.
