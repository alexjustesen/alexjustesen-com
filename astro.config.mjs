// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [sitemap()],
  output: 'server',
  site: 'https://alexjustesen.com',
  vite: {
    plugins: [tailwindcss()]
  },
});
