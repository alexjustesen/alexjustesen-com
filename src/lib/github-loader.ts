import type { Loader } from 'astro/loaders';
import { z } from 'astro:content';
import { repoSlugs } from '../content/projects/repos';

interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
}

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
    async load({ store, logger }) {
      store.clear();

      const headers: Record<string, string> = {
        'User-Agent': 'alexjustesen-com-build',
        Accept: 'application/vnd.github+json',
      };
      const token = process.env.GITHUB_TOKEN;
      if (token) headers.Authorization = `Bearer ${token}`;

      for (const slug of repoSlugs) {
        try {
          const res = await fetch(`https://api.github.com/repos/${slug}`, { headers });
          if (!res.ok) {
            logger.warn(`github-loader: ${slug} -> HTTP ${res.status}, skipping`);
            continue;
          }
          const repo = (await res.json()) as GitHubRepoResponse;
          store.set({
            id: String(repo.id),
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
        } catch (err) {
          logger.warn(`github-loader: ${slug} threw ${(err as Error).message}, skipping`);
        }
      }
    },
  };
}
