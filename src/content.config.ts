import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { githubReposLoader } from './lib/github-loader';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  loader: githubReposLoader(),
});

export const collections = { blog, projects };
