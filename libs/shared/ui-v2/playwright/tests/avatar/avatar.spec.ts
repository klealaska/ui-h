import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('Avatar img', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('avatar--default');
  await page.waitForTimeout(4000);

  await storybookPage.avatar().screenshot({
    path: storybookPage.componentSnapshotLocation('avatar', 'avatar--img.png'),
  });
  await expect(page).toHaveScreenshot();
});
