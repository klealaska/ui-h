import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('Accordion', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('accordion--default');
  await page.waitForTimeout(4000);

  await storybookPage.accordion().screenshot({
    path: storybookPage.componentSnapshotLocation('accordion', 'accordion.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Accordion opened', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('accordion--default');
  await page.waitForTimeout(4000);

  await storybookPage.accordion().click();
  await storybookPage.accordionOpened().screenshot({
    path: storybookPage.componentSnapshotLocation('accordion', 'accordion-opened.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Accordion multiple', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('accordion--multiple');
  await page.waitForTimeout(4000);

  await storybookPage.accordionMultiple().screenshot({
    path: storybookPage.componentSnapshotLocation('accordion', 'accordion-multiple.png'),
  });
  await expect(page).toHaveScreenshot();
});
