import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('checkbox', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('checkbox--default');
  await page.waitForTimeout(3000);

  await storybookPage.checkbox().screenshot({
    path: storybookPage.componentSnapshotLocation('checkbox', 'checkbox.png'),
  });

  await expect(page).toHaveScreenshot();
});

test('checkbox checked', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('checkbox--default');
  await page.waitForTimeout(3000);

  await storybookPage.checkbox().click();
  await page.waitForTimeout(3000);

  await storybookPage.checkbox().screenshot({
    path: storybookPage.componentSnapshotLocation('checkbox', 'checkbox-checked.png'),
  });

  await expect(page).toHaveScreenshot();
});

test('checkbox no label', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('checkbox--default');
  await page.waitForTimeout(3000);

  await storybookPage.checkbox().screenshot({
    path: storybookPage.componentSnapshotLocation('checkbox', 'checkbox-no-label.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('checkbox no label checked', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('checkbox--default');
  await page.waitForTimeout(3000);

  await storybookPage.checkbox().click();
  await page.waitForTimeout(3000);

  await storybookPage.checkboxNoLabel().screenshot({
    path: storybookPage.componentSnapshotLocation('checkbox', 'checkbox-no-label-checked.png'),
  });
  await expect(page).toHaveScreenshot();
});
