import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('tag default filled', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:default');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-filled--default.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag success filled', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:success');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-filled--success.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag warning filled', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:warning');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-filled--warning.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag critical filled', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:critical');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-filled--critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag informational filled', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:informational');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-filled--informational.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag default border', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:default;style:border');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-border--default.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag success border', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:success;style:border');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-border--success.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag warning border', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:warning;style:border');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-border--warning.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag critical border', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:critical;style:border');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-border--critical.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('tag informational border', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('tag--default&args=size:sm;type:informational;style:border');
  await page.waitForTimeout(4000);

  await storybookPage.tag().screenshot({
    path: storybookPage.componentSnapshotLocation('tag', 'tag-border--informational.png'),
  });
  await expect(page).toHaveScreenshot();
});
