// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare({ prerenderEnvironment: 'node' }),

  fonts: [
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],

  vite: {
    plugins: [
      tailwindcss(),
      {
        name: 'debug-config',
        enforce: 'post',
        configResolved(config) {
          if (config.build?.ssr) {
            console.log('SSR config resolved. input:', config.build.rollupOptions?.input);
            console.log('SSR config resolved. ssr:', config.build.ssr);
            console.log('SSR config resolved. outDir:', config.build.outDir);
            console.log('SSR plugins:', config.plugins.map(p => p.name).filter(n => n.includes('cloudflare')));
          }
        }
      },
    ],
  },
});
