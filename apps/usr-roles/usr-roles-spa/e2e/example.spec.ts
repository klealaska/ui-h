import { test, expect } from '@playwright/test';

test('navigate landing', async ({ page }) => {
  const resp = await page.goto('/');

  expect(resp?.ok).toBeTruthy();
});
