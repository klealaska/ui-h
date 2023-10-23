import { test, expect } from '@playwright/test';
import { editUser, getUsers } from '../mock-data/user';
import { USER_ROUTE, USER_ROUTE_PARAMS } from '../types/const/routes';
//TODO upda this file to use listpage fixture
test.beforeEach(async ({ page }) => {
  await page.route(USER_ROUTE, async route => {
    const json = getUsers();
    await route.fulfill({ json, status: 200 });
  });

  await page.route(USER_ROUTE_PARAMS, async route => {
    const json = editUser();
    await route.fulfill({ json, status: 200 });
  });

  await page.goto('/');

  const kabobButton = page
    .locator('tr:nth-child(1) > td.mat-mdc-cell:nth-child(4) > menu')
    .getByRole('button');
  const editUserButton = page.getByRole('menuitem', { name: 'Edit' });

  kabobButton.click();
  editUserButton.click();
});

test('Edit User', async ({ page }) => {
  const username = page.locator('tr:nth-child(1) > td.mat-mdc-cell:nth-child(1) > span');
  const firstNameInput = page
    .locator('ax-input')
    .filter({ hasText: 'First name' })
    .locator('[data-test="ax-input"]');
  const lastNameInput = page
    .locator('ax-input')
    .filter({ hasText: 'Last name' })
    .locator('[data-test="ax-input"]');
  const emailInput = page
    .locator('mat-form-field')
    .filter({ hasText: 'This will be their username' })
    .locator('[data-test="ax-input"]');
  const sidesheetSaveButton = page.getByRole('button', { name: 'Save' });
  const toastSuccessText = page.locator('ax-toast > div > span.toast-container__title');
  const toastCloseButton = page.locator('#close');

  await expect(username).toHaveText('John Doe');
  await expect(username).not.toHaveText('Updated');

  await firstNameInput.fill('Foo');
  await lastNameInput.fill('Bar');
  await emailInput.fill('foo@bar.com');
  sidesheetSaveButton.click();

  await expect(toastSuccessText).toHaveText('Changes saved');

  await toastCloseButton.click();

  await expect(username).toHaveText('Foo Bar');
});

test('Validations', async ({ page }) => {
  const firstNameInput = page
    .locator('ax-input')
    .filter({ hasText: 'First name' })
    .locator('[data-test="ax-input"]');
  const lastNameInput = page
    .locator('ax-input')
    .filter({ hasText: 'Last name' })
    .locator('[data-test="ax-input"]');
  const emailInput = page
    .locator('mat-form-field')
    .filter({ hasText: 'This will be their username' })
    .locator('[data-test="ax-input"]');
  const firstNameInputError = page.getByText('warningEnter first name');
  const lastNameInputError = page.getByText('warningEnter last name');
  const emailInputError = page.getByText('warningEnter email address');

  await firstNameInput.clear();
  await firstNameInput.blur();

  await expect(firstNameInputError).toBeVisible();

  await lastNameInput.clear();
  await lastNameInput.blur();

  await expect(lastNameInputError).toBeVisible();

  await emailInput.clear();
  await emailInput.blur();

  await expect(emailInputError).toBeVisible();

  // TODO: add test for email format validation once error message is determined
});

test('Closing the sidesheet with close button', async ({ page }) => {
  const sidesheetCloseButton = page.locator('[data-test="side-sheet-close"]').getByRole('button');
  const editSideSheet = page.getByText(
    'Edit usercloseFirst nameLast nameEmailThis will be their usernameCancelSave'
  );

  await sidesheetCloseButton.click();
  await expect(editSideSheet).toBeHidden();
});

test('Closing the sidesheet with cancel button', async ({ page }) => {
  const sidesheetCancelButton = page.getByRole('button', { name: 'Cancel' });
  const editSideSheet = page.getByText(
    'Edit usercloseFirst nameLast nameEmailThis will be their usernameCancelSave'
  );

  await sidesheetCancelButton.click();
  await expect(editSideSheet).toBeHidden();
});
