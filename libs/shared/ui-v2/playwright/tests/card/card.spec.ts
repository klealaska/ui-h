import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('Card', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('card--default');
  await page.waitForTimeout(4000);

  await storybookPage.card().screenshot({
    path: storybookPage.componentSnapshotLocation('card', 'card.png'),
  });
  await expect(page).toHaveScreenshot();
});
