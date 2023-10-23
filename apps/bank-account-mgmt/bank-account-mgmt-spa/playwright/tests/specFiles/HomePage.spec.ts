import { expect } from '@playwright/test';
import { test } from '../fixtures/baseFixture';

test('loads', async ({ page, bamHomePage }) => {
  await bamHomePage.goto();
  await delay(10000);
  await bamHomePage.bankAccountContainer().isVisible();
  // Expect a title "to contain" a substring.
  await expect(bamHomePage.bankAccountContainer()).toBeVisible();
});
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
test('Search input is visible', async ({ page, bamHomePage }) => {
  await bamHomePage.goto();
  await delay(10000);
  await bamHomePage.bankAccountContainer().isVisible();
  // Expect a title "to contain" a substring.
  await expect(bamHomePage.searchInput()).toBeVisible();
});
