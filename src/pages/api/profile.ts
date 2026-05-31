import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () => {
  const body = {
    jsonapi: { version: '1.1' },
    links: { self: 'https://alexjustesen.com/api/profile' },
    data: {
      type: 'profile',
      id: 'alex-justesen',
      attributes: {
        name: 'alex justesen',
        role: 'software engineer',
        bio: 'I build things for the web, occasionally write about it, and drink good beer.',
        image: 'https://alexjustesen.com/images/profile.webp',
        socials: [
          { name: 'github', url: 'https://github.com/alexjustesen' },
          { name: 'linkedin', url: 'https://www.linkedin.com/in/alexander-justesen/' },
          { name: 'bluesky', url: 'https://bsky.app/profile/alexjustesen.com' },
          { name: 'x', url: 'https://x.com/alexjustesen' },
          { name: 'untappd', url: 'https://untappd.com/user/ajustesen' },
        ],
      },
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/vnd.api+json' },
  });
};
