import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('button', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button&args=color:critical');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button secondary', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button&args=type:secondary');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-secondary.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button secondary critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button&args=type:secondary;color:critical');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-secondary-critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button secondary neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button&args=type:secondary;color:neutral');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-secondary-neutral.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button tertiary', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button&args=type:tertiary');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-tertiary.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button tertiary critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button&args=type:tertiary;color:critical');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-tertiary-critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button tertiary neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button&args=type:tertiary;color:neutral');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-tertiary-neutral.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button secondary', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=type:secondary');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-secondary.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button tertiary', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=type:tertiary');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-tertiary.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=color:critical');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-secondary-critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=color:neutral');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-secondary-neutral.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button secondary critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=type:secondary;color:critical');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-secondary-critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button secondary neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=type:secondary;color:neutral');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-secondary-neutral.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button tertiary neutral', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=type:tertiary;color:neutral');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-tertiary-neutral.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('icon button tertiary critical', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--icon-button&args=type:tertiary;color:critical');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'icon-button-tertiary-critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button with icon', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button-with-icon');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-with-icon.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button with icon secondary', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button-with-icon&args=type:secondary');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-with-secondary.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('button with icon tertiary', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('button--button-with-icon&args=type:tertiary');
  await page.waitForTimeout(3000);

  await storybookPage.button().screenshot({
    path: storybookPage.componentSnapshotLocation('button', 'button-with-tertiary.png'),
  });
  await expect(page).toHaveScreenshot();
});
