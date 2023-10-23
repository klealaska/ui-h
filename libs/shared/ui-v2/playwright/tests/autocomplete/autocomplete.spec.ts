import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('autocomplete default', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('autocomplete--default');
  await page.waitForTimeout(4000);

  await storybookPage.autocomplete().screenshot({
    path: storybookPage.componentSnapshotLocation('autocomplete', 'autocomplete--default.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('autocomplete disabled', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('autocomplete--disabled');
  await page.waitForTimeout(4000);

  await storybookPage.autocomplete().screenshot({
    path: storybookPage.componentSnapshotLocation('autocomplete', 'autocomplete--disabled.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('autocomplete error', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('autocomplete--error');
  await page.waitForTimeout(4000);

  await storybookPage.autocomplete().screenshot({
    path: storybookPage.componentSnapshotLocation('autocomplete', 'autocomplete--error.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('autocomplete error clicked', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('autocomplete--error');
  await page.waitForTimeout(4000);

  await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .locator('[data-test="ax-autocomplete"]')
    .click();
  await page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('#root').click();
  await storybookPage.autocomplete().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'autocomplete',
      'autocomplete--error-clicked.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('autocomplete readonly', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('autocomplete--read-only');
  await page.waitForTimeout(4000);

  await storybookPage.autocomplete().screenshot({
    path: storybookPage.componentSnapshotLocation('autocomplete', 'autocomplete--readonly.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('autocomplete dropdown', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('autocomplete--default');
  await page.waitForTimeout(4000);

  await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .locator('[data-test="ax-autocomplete"]')
    .click();
  await page
    .frameLocator('iframe[title="storybook-preview-iframe"]')
    .getByRole('option', { name: 'Option 1' })
    .click();
  await storybookPage.autocomplete().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'autocomplete',
      'autocomplete-dropdown--default.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});
