import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { repoSlugs } from '../content/projects/repos';

const githubRepoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  pushed_at: z.string(),
});

export function githubReposLoader(): Loader {
  return {
    name: 'github-repos-loader',
    schema: z.object({
      name: z.string(),
      fullName: z.string(),
      url: z.string().url(),
      description: z.string().nullable(),
      language: z.string().nullable(),
      stars: z.number().int().nonnegative(),
      forks: z.number().int().nonnegative(),
      pushedAt: z.coerce.date(),
    }),
    async load({ store, logger, parseData, generateDigest }) {
      for (const slug of repoSlugs) {
        if (!/^[a-z\d][a-z\d-]*\/[a-z\d_.-]+$/i.test(slug)) {
          throw new Error(`github-loader: expected owner/repo, received "${slug}"`);
        }
      }

      const headers: Record<string, string> = {
        'User-Agent': 'alexjustesen-com-build',
        Accept: 'application/vnd.github+json',
      };
      const token = process.env.GITHUB_TOKEN;
      if (token) headers.Authorization = `Bearer ${token}`;

      // Fail the build rather than deploy an incomplete project list. Keep the
      // previous store intact until every response has been fetched and parsed.
      const entries: Parameters<typeof store.set>[0][] = [];

      for (const slug of repoSlugs) {
        try {
          const res = await fetch(`https://api.github.com/repos/${slug}`, {
            headers,
            signal: AbortSignal.timeout(10_000),
          });
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          const repo = githubRepoSchema.parse(await res.json());
          const id = String(repo.id);
          const data = await parseData({
            id,
            data: {
              name: repo.name,
              fullName: repo.full_name,
              url: repo.html_url,
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              pushedAt: repo.pushed_at,
            },
          });
          entries.push({
            id,
            data,
            digest: generateDigest(data),
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          throw new Error(`github-loader: failed to load ${slug}: ${message}`, { cause: err });
        }
      }

      store.clear();
      for (const entry of entries) store.set(entry);
      logger.info(`Loaded ${entries.length} GitHub repositories.`);
    },
  };
}
