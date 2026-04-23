import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { expect, test } from 'vitest';

import { App } from './App';

/**
 * Real Chromium (Playwright via `@vitest/browser-playwright`). Global styles come from
 * `vitest.browser.setup.ts` so Tailwind utilities resolve in `getComputedStyle`.
 */
test('App shell: DOM, visibility, computed styles, screenshot', async () => {
  const view = await render(<App />);

  const title = view.getByRole('heading', { level: 1, name: /greenfield ui/i });
  await expect.element(title).toBeInTheDocument();
  await expect.element(title).toBeVisible();
  await expect.element(title).toBeInViewport();

  const h1Style = window.getComputedStyle(title.element());
  expect(parseFloat(h1Style.fontSize)).toBeGreaterThanOrEqual(20);
  expect(h1Style.fontWeight).toMatch(/600|700|bold/);

  const root = view.getByTestId('app-root').element();
  expect(window.getComputedStyle(root).display).toBe('block');
  expect(parseFloat(window.getComputedStyle(root).paddingTop)).toBeGreaterThanOrEqual(16);

  const shot = await page.screenshot({
    element: view.getByTestId('app-root'),
    base64: true,
    save: false,
  });
  const payload = typeof shot === 'string' ? shot : shot.base64;
  expect(payload.length).toBeGreaterThan(2000);
});
