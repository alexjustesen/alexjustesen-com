export const profile = {
  id: 'alex-justesen',
  name: 'alex justesen',
  displayName: 'Alex Justesen',
  role: 'software engineer',
  bio: 'I build things for the web, occasionally write about it, and drink good beer.',
  image: '/images/profile.webp',
  socials: [
    { name: 'github', label: 'GitHub', url: 'https://github.com/alexjustesen' },
    { name: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/alexander-justesen/' },
    { name: 'bluesky', label: 'Bluesky', url: 'https://bsky.app/profile/alexjustesen.com' },
    { name: 'x', label: 'X', url: 'https://x.com/alexjustesen' },
    { name: 'untappd', label: 'Untappd', url: 'https://untappd.com/user/ajustesen' },
  ],
} as const;
