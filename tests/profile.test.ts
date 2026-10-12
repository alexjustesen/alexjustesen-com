import { describe, expect, it } from 'vitest';
import type { APIContext } from 'astro';
import { profile } from '../src/data/profile';
import { GET } from '../src/pages/api/profile';

describe('profile endpoint', () => {
  it('uses shared profile data while preserving the JSON:API representation', async () => {
    const context = { site: new URL('https://alexjustesen.com') } as APIContext;
    const response = await GET(context);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/vnd.api+json');
    expect(await response.json()).toEqual({
      jsonapi: { version: '1.1' },
      links: { self: 'https://alexjustesen.com/api/profile' },
      data: {
        type: 'profile',
        id: profile.id,
        attributes: {
          name: profile.name,
          role: profile.role,
          bio: profile.bio,
          image: 'https://alexjustesen.com/images/profile.webp',
          socials: profile.socials.map(({ name, url }) => ({ name, url })),
        },
      },
    });
  });
});
