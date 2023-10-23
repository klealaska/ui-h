import { expect } from '@playwright/test';
import { test } from '../fixtures/baseFixture';
import { deactivateUser, getUsers } from '../mock-data/user';
import { USER_LIFECYCLE_OPERATIONS, USER_ROUTE } from '../types/const/routes';

test.beforeEach(async ({ listPage }) => {
  await listPage.mockAPI(USER_ROUTE, '', {
    getAll: { data: getUsers() },
  });
  await listPage.visit();
  const deactivateMockData = {
    post: { data: deactivateUser() },
  };
  await listPage.mockAPI(USER_LIFECYCLE_OPERATIONS, '', deactivateMockData, 201);
});
test('check to see if Active user can be deactivated', async ({ listPage }) => {
  const deactivateMenuItem = listPage.getByText('Deactivate');
  const activeLabel = listPage.getByText('ACTIVE');

  listPage.getKabobButtonClick(1, 4);

  await expect(activeLabel).toBeVisible();
  await expect(deactivateMenuItem).toBeVisible();
});

test('check to see if Active has Deactivate menu item', async ({ listPage }) => {
  const successToast = listPage.getByText('User deactivated.');
  const inactiveLabel = listPage.getByText('INACTIVE');
  const reactivateMenuItem = listPage.getByText('Reactivate');
  const deactivateUserButton = listPage.getByText('Deactivate');
  const modalDeactivateButton = listPage.getByRole('button', 'Deactivate');

  listPage.getKabobButtonClick(1, 4);

  deactivateUserButton.click();
  modalDeactivateButton.click();

  await expect(successToast).toBeVisible();
  await expect(inactiveLabel).toBeVisible();
  await listPage.getKabobButtonClick(1, 4);
  await expect(reactivateMenuItem).toBeVisible();
});

test('negative network toaster error', async ({ listPage }) => {
  const deactivateUserButton = listPage.getByText('Deactivate');
  const modalDeactivateButton = listPage.getByRole('button', 'Deactivate');

  listPage.getKabobButtonClick(1, 4);

  deactivateUserButton.click();
  modalDeactivateButton.click();

  await listPage.mockAPI(USER_LIFECYCLE_OPERATIONS, '', {}, 500);
  await expect(listPage.getByText('Failed to deactivate.')).toBeVisible();
});
