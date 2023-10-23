import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('textarea default', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('textarea--default');
  await page.waitForTimeout(4000);

  await storybookPage.textarea().screenshot({
    path: storybookPage.componentSnapshotLocation('textarea', 'textarea--default.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('textarea disabled', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('textarea--disabled');
  await page.waitForTimeout(4000);

  await storybookPage.textarea().screenshot({
    path: storybookPage.componentSnapshotLocation('textarea', 'textarea--disabled.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('textarea error', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('textarea--error');
  await page.waitForTimeout(4000);

  await storybookPage.textarea().screenshot({
    path: storybookPage.componentSnapshotLocation('textarea', 'textarea--error.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('textarea readonly', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('textarea--read-only');
  await page.waitForTimeout(4000);

  await storybookPage.textarea().screenshot({
    path: storybookPage.componentSnapshotLocation('textarea', 'textarea--readonly.png'),
  });
  await expect(page).toHaveScreenshot();
});
