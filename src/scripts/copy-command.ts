export function initializeCopyButtons(root: ParentNode = document) {
  const copyButtons = root.querySelectorAll<HTMLButtonElement>('[data-copy-command]');

  for (const button of copyButtons) {
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    button.addEventListener('click', async () => {
      const command = button.dataset.copyCommand;
      const status = button.closest('[data-copy-container]')
        ?.querySelector<HTMLElement>('[data-copy-status]');
      if (!command || !status) return;

      clearTimeout(resetTimer);
      button.disabled = true;
      status.textContent = 'Copying curl command.';

      try {
        await navigator.clipboard.writeText(command);
        button.textContent = 'copied';
        status.textContent = 'Curl command copied to clipboard.';
      } catch {
        button.textContent = 'failed';
        status.textContent = 'Could not copy the curl command. Select and copy it manually.';
      } finally {
        button.disabled = false;
      }

      resetTimer = setTimeout(() => {
        button.textContent = 'copy';
      }, 2000);
    });
  }
}
