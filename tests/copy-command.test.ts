// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeCopyButtons } from '../src/scripts/copy-command';

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = `
    <div data-copy-container>
      <button data-copy-command="curl https://alexjustesen.com/api/profile"
        aria-label="Copy curl command for /api/profile">copy</button>
      <span data-copy-status role="status" aria-live="polite" aria-atomic="true"></span>
    </div>
  `;
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
});

function setup(writeText = vi.fn().mockResolvedValue(undefined)) {
  vi.stubGlobal('navigator', { clipboard: { writeText } });
  initializeCopyButtons();
  return {
    writeText,
    button: document.querySelector('button')!,
    status: document.querySelector('[data-copy-status]')!,
  };
}

describe('copy command feedback', () => {
  it('announces success and resets the visible label without clearing the status', async () => {
    const { button, status, writeText } = setup();
    button.click();
    expect(button.disabled).toBe(true);
    await vi.advanceTimersByTimeAsync(0);

    expect(writeText).toHaveBeenCalledWith('curl https://alexjustesen.com/api/profile');
    expect(button.textContent).toBe('copied');
    expect(button.disabled).toBe(false);
    expect(status.textContent).toBe('Curl command copied to clipboard.');
    expect(button.getAttribute('aria-label')).toBe('Copy curl command for /api/profile');

    await vi.advanceTimersByTimeAsync(2000);
    expect(button.textContent).toBe('copy');
    expect(status.textContent).toBe('Curl command copied to clipboard.');
  });

  it('announces an actionable error if clipboard access is rejected', async () => {
    const { button, status } = setup(vi.fn().mockRejectedValue(new Error('Permission denied')));
    button.click();
    await vi.advanceTimersByTimeAsync(0);

    expect(button.textContent).toBe('failed');
    expect(button.disabled).toBe(false);
    expect(status.textContent).toContain('Select and copy it manually.');
  });

  it('handles unavailable clipboard APIs', async () => {
    const { button, status } = setup();
    vi.stubGlobal('navigator', {});
    button.click();
    await vi.advanceTimersByTimeAsync(0);

    expect(button.textContent).toBe('failed');
    expect(status.textContent).toContain('Could not copy');
  });

  it('cancels an earlier reset when copying again', async () => {
    const { button } = setup();
    button.click();
    await vi.advanceTimersByTimeAsync(1000);
    button.click();
    await vi.advanceTimersByTimeAsync(1000);

    expect(button.textContent).toBe('copied');
    await vi.advanceTimersByTimeAsync(1000);
    expect(button.textContent).toBe('copy');
  });
});
