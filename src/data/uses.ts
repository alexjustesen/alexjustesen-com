interface UsesItem {
  name: string;
  description: string;
  url?: string;
}

interface UsesCategory {
  id: string;
  title: string;
  items: UsesItem[];
}

export const uses: { updated: string; categories: UsesCategory[] } = {
  updated: '2026-10-12',
  categories: [
    {
      id: 'hardware',
      title: 'Hardware',
      items: [
        {
          name: 'MacBook Pro M5',
          description: 'My computer for development and everyday work.',
          url: 'https://www.apple.com/macbook-pro/',
        },
        {
          name: 'LG Ergo 27-inch monitors',
          description: 'Two monitors in my desk setup.',
          url: 'https://www.lg.com/us/monitors',
        },
        {
          name: 'Stream Deck',
          description: 'For automations and controlling smart devices.',
          url: 'https://www.elgato.com/us/en/s/welcome-to-stream-deck',
        },
      ],
    },
    {
      id: 'development',
      title: 'Development',
      items: [
        {
          name: 'Laravel',
          description: 'A primary framework I use to ship applications.',
          url: 'https://laravel.com/',
        },
        {
          name: 'Astro',
          description: 'A primary framework I use to ship applications. It also powers this site.',
          url: 'https://astro.build/',
        },
        {
          name: 'VS Code',
          description: 'My code editor.',
          url: 'https://code.visualstudio.com/',
        },
        {
          name: 'Ghostty',
          description: 'My terminal.',
          url: 'https://ghostty.org/',
        },
        {
          name: 'Go',
          description: 'A language in my development toolkit.',
          url: 'https://go.dev/',
        },
      ],
    },
    {
      id: 'tools',
      title: 'Tools',
      items: [
        {
          name: 'OrbStack',
          description: 'Part of my local development setup.',
          url: 'https://orbstack.dev/',
        },
        {
          name: 'OpenCode',
          description: 'For AI-assisted coding.',
          url: 'https://opencode.ai/',
        },
      ],
    },
    {
      id: 'ai',
      title: 'AI agents',
      items: [
        {
          name: 'Claude',
          description: 'One of my AI agents of choice for coding.',
          url: 'https://claude.ai/',
        },
        {
          name: 'OpenAI',
          description: 'Another of my choices for AI-assisted coding.',
          url: 'https://openai.com/',
        },
        {
          name: 'Open-weight models',
          description: 'I also use open-weight models for AI-assisted coding.',
        },
      ],
    },
  ],
};
