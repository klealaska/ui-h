import { expect } from '@playwright/test';
import { test } from '../../fixtures/base-fixture';

test('Alert success', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default');
  await page.waitForTimeout(4000);

  await storybookPage.alert().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert--success.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Alert success action', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default');
  await page.waitForTimeout(4000);

  await storybookPage.alertAction().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert-action--success.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Alert error', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=type:error');
  await page.waitForTimeout(4000);

  await storybookPage.alert().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert--error.png'),
  });
  await expect(page).toHaveScreenshot();
});
test('Alert error action', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=type:error');
  await page.waitForTimeout(4000);

  await storybookPage.alertAction().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert-action--error.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Alert info', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=type:info');
  await page.waitForTimeout(4000);

  await storybookPage.alert().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert--info.png'),
  });
  await expect(page).toHaveScreenshot();
});
test('Alert info action', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=type:info');
  await page.waitForTimeout(4000);

  await storybookPage.alertAction().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert-action--info.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Alert warning', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=type:warning');
  await page.waitForTimeout(4000);

  await storybookPage.alert().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert--warning.png'),
  });
  await expect(page).toHaveScreenshot();
});
test('Alert warning action', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=type:warning');
  await page.waitForTimeout(4000);

  await storybookPage.alertAction().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert-action--warning.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Alert non closable', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=closable:false');
  await page.waitForTimeout(4000);

  await storybookPage.alert().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert-non-closable.png'),
  });
  await expect(page).toHaveScreenshot();
});

test('Alert no icon', async ({ page, storybookPage }) => {
  await storybookPage.goToBySuffix('alert--default&args=showIcon:false');
  await page.waitForTimeout(4000);

  await storybookPage.alert().screenshot({
    path: storybookPage.componentSnapshotLocation('alert', 'alert-no-icon.png'),
  });
  await expect(page).toHaveScreenshot();
});
