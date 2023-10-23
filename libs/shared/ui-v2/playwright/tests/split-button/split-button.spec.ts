import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('splitbutton primary default', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-primary--default.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-primary-icon-button--default.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().click();
  await storybookPage.suggestionMenuItem().screenshot({
    path: storybookPage.componentSnapshotLocation('split-button', 'split-button-menu-item.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton primary critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=color:critical');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-primary--critical.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-primary-icon-button--critical.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton primary neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=color:neutral');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-primary--neutral.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-primary-icon-button--neutral.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton secondary default', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=type:secondary');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-secondary--default.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-secondary-icon-button--default.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton secondary critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=type:secondary;color:critical');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-secondary--critical.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-secondary-icon-button--critical.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton secondary neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=type:secondary;color:neutral');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-secondary--neutral.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-secondary-icon-button--neutral.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton tertiary default', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=type:tertiary');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-tertiary--default.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-tertiary-icon-button--default.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton tertiary critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=type:tertiary;color:critical');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-tertiary--critical.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-tertiary-icon-button--critical.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});

test('splitbutton tertiary neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('splitbutton--default&args=type:tertiary;color:neutral');
  await page.waitForTimeout(4000);

  await storybookPage.splitButton().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-tertiary--neutral.png'
    ),
  });
  await storybookPage.iconButtonWithAMenu().screenshot({
    path: storybookPage.componentSnapshotLocation(
      'split-button',
      'split-button-tertiary-icon-button--neutral.png'
    ),
  });
  await expect(page).toHaveScreenshot();
});
