import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('spinner primary', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('spinner--primary');
  await page.waitForTimeout(4000);

  await storybookPage.spinner().screenshot({
    path: storybookPage.componentSnapshotLocation('spinner', 'spinner--primary.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('spinner inverse', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix(
    'spinner--primary&args=color:inverse&globals=backgrounds.value:!hex(333333)'
  );
  await page.waitForTimeout(4000);

  await storybookPage.spinner().screenshot({
    path: storybookPage.componentSnapshotLocation('spinner', 'spinner--inverse.png'),
  });
  await expect(page).toHaveScreenshot();
});
