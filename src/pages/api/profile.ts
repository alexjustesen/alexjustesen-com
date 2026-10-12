import type { APIRoute } from 'astro';
import { profile } from '../../data/profile';

// Cloudflare's static response header is configured in public/_headers.
export const GET: APIRoute = ({ site }) => {
  const body = {
    jsonapi: { version: '1.1' },
    links: { self: new URL('/api/profile', site).href },
    data: {
      type: 'profile',
      id: profile.id,
      attributes: {
        name: profile.name,
        role: profile.role,
        bio: profile.bio,
        image: new URL(profile.image, site).href,
        socials: profile.socials.map(({ name, url }) => ({ name, url })),
      },
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/vnd.api+json' },
  });
};
