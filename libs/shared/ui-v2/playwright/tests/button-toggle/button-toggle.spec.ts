import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('button-toggle', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button-toggle--docs');
  await page.waitForTimeout(3000);

  await storybookPage.buttonToggle().screenshot({
    path: storybookPage.componentSnapshotLocation('button-toggle', 'button-toggle.png'),
  });
  await expect(page).toHaveScreenshot();
});
