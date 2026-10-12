import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LoaderContext } from 'astro/loaders';
import { githubReposLoader } from '../src/lib/github-loader';
import { repoSlugs } from '../src/content/projects/repos';

const configuredSlugs = [...repoSlugs];
type DataEntry = Parameters<LoaderContext['store']['set']>[0];

function repository(id = 1) {
  return {
    id,
    name: `project-${id}`,
    full_name: `owner/project-${id}`,
    html_url: `https://github.com/owner/project-${id}`,
    description: null,
    language: null,
    stargazers_count: 42,
    forks_count: 7,
    pushed_at: '2026-05-27T12:00:00Z',
  };
}

function setup() {
  const loader = githubReposLoader();
  const previous: DataEntry = { id: 'previous', data: { name: 'Previous project' } };
  const entries = new Map([[previous.id, previous]]);
  const clear = vi.fn(() => entries.clear());
  const set = vi.fn((entry: DataEntry) => {
    entries.set(entry.id, entry);
    return true;
  });
  const parseData = vi.fn(async ({ data }: { data: Record<string, unknown> }) =>
    loader.schema.parse(data),
  );
  const generateDigest = vi.fn(() => 'content-digest');
  // Only the context methods used by this loader are needed in the test double.
  const context = {
    store: { clear, set },
    logger: { info: vi.fn() },
    parseData,
    generateDigest,
  } as unknown as LoaderContext;
  let id = 0;
  const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
    Response.json(repository(++id)),
  );
  vi.stubGlobal('fetch', fetchMock);

  return { loader, context, entries, clear, set, parseData, generateDigest, fetchMock };
}

beforeEach(() => {
  vi.stubEnv('GITHUB_TOKEN', '');
});

afterEach(() => {
  repoSlugs.splice(0, repoSlugs.length, ...configuredSlugs);
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('GitHub repository loader', () => {
  it('loads every configured owner/repo slug and replaces stale entries', async () => {
    const { loader, context, entries, clear, set, parseData, generateDigest, fetchMock } = setup();
    await loader.load(context);

    expect(repoSlugs).toContain('openbrewerydb/openbrewerydb');
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual(
      repoSlugs.map((slug) => `https://api.github.com/repos/${slug}`),
    );
    expect(clear).toHaveBeenCalledOnce();
    expect(set).toHaveBeenCalledTimes(repoSlugs.length);
    expect(parseData).toHaveBeenCalledTimes(repoSlugs.length);
    expect(generateDigest).toHaveBeenCalledTimes(repoSlugs.length);
    expect(entries.has('previous')).toBe(false);
    expect(entries.get('1')).toMatchObject({
      data: { stars: 42, pushedAt: new Date('2026-05-27T12:00:00Z') },
      digest: 'content-digest',
    });
    expect(entries.get('1')?.data.pushedAt).toBeInstanceOf(Date);
  });

  it('rejects full URLs before requesting data or clearing the store', async () => {
    const { loader, context, clear, fetchMock } = setup();
    repoSlugs.push('https://github.com/owner/repo');

    await expect(loader.load(context)).rejects.toThrow('expected owner/repo');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
  });

  it('sends GitHub headers without requiring a token', async () => {
    const { loader, context, fetchMock } = setup();
    await loader.load(context);

    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {
      headers: {
        'User-Agent': 'alexjustesen-com-build',
        Accept: 'application/vnd.github+json',
      },
      signal: expect.any(AbortSignal),
    });
  });

  it('uses the optional build-time token', async () => {
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
    const { loader, context, fetchMock } = setup();
    await loader.load(context);

    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
    }));
  });

  it.each([403, 404, 429, 500])('fails safely on HTTP %i', async (status) => {
    const { loader, context, entries, clear, set, fetchMock } = setup();
    fetchMock.mockResolvedValueOnce(new Response(null, { status }));

    await expect(loader.load(context)).rejects.toThrow(`HTTP ${status}`);
    expect(entries.has('previous')).toBe(true);
    expect(clear).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  it('does not write partial results when a later request fails', async () => {
    const { loader, context, entries, clear, set, fetchMock } = setup();
    fetchMock.mockResolvedValueOnce(Response.json(repository()));
    fetchMock.mockRejectedValueOnce(new Error('Network unavailable'));

    await expect(loader.load(context)).rejects.toThrow('Network unavailable');
    expect(entries.size).toBe(1);
    expect(clear).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  });

  it('bounds requests to ten seconds and reports timeout errors', async () => {
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    const { loader, context, clear, fetchMock } = setup();
    fetchMock.mockRejectedValueOnce(new DOMException('Request timed out', 'TimeoutError'));

    await expect(loader.load(context)).rejects.toThrow('Request timed out');
    expect(timeout).toHaveBeenCalledWith(10_000);
    expect(clear).not.toHaveBeenCalled();
  });

  it.each([
    { id: undefined },
    { stargazers_count: -1 },
    { html_url: 'not-a-url' },
    { pushed_at: 'not-a-date' },
  ])('rejects invalid remote data: %j', async (invalid) => {
    const { loader, context, clear, fetchMock } = setup();
    fetchMock.mockResolvedValueOnce(Response.json({ ...repository(), ...invalid }));

    await expect(loader.load(context)).rejects.toThrow('failed to load');
    expect(clear).not.toHaveBeenCalled();
  });

  it('fails safely on invalid JSON', async () => {
    const { loader, context, clear, fetchMock } = setup();
    fetchMock.mockResolvedValueOnce(new Response('not JSON'));

    await expect(loader.load(context)).rejects.toThrow('failed to load');
    expect(clear).not.toHaveBeenCalled();
  });
});
