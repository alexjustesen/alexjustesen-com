import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import robotsTxt from "astro-robots-txt";
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://alexjustesen.com',
  integrations: [mdx(), sitemap(), tailwind(), robotsTxt()]
});
