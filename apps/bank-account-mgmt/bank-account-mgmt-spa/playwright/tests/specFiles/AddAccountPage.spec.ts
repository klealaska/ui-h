/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect } from '@playwright/test';
import { test } from '../fixtures/baseFixture';
import addAccountPage from '../support/pages/AddAccountPage.page';

test.beforeEach(async ({ bamHomePage }) => {
  await bamHomePage.goto();
  await bamHomePage.addAccountButton().click();
});
test('loads', async ({ addAccountPage }) => {
  await expect(addAccountPage.accountNameInput()).toBeVisible();
});
test('form fields when valid allow add and success message displays', async ({
  addAccountPage,
  bamHomePage,
}) => {
  await addAccountPage.accountNameInput().fill('test');
  await addAccountPage.routingNumberInput().fill('122105278');
  await addAccountPage.accountNumberInput().fill('123456789');
  await addAccountPage.accountTypeDropdown().click();
  await addAccountPage.accountDropdownBusinessCheckingOption().click();
  await addAccountPage.submitAccountButton().click();

  await expect(bamHomePage.bankAccountList()).toBeVisible();
});

test('Account Type drop down is visible', async ({ addAccountPage }) => {
  await expect(addAccountPage.accountTypeDropdown()).toBeVisible();
});

test('Account Type drop down options are visible', async ({ addAccountPage }) => {
  await addAccountPage.accountTypeDropdown().click();
  await expect(addAccountPage.accountDropdownBusinessCheckingOption()).toBeVisible();
  await expect(addAccountPage.accountDropdownBusinessSavingsOption()).toBeVisible();
  await expect(addAccountPage.accountDropdownConsumerCheckingOption()).toBeVisible();
  await expect(addAccountPage.accountDropdownConsumerSavingsOption()).toBeVisible();
});

test('does not allow add when routing number is invalid', async ({ addAccountPage }) => {
  await addAccountPage.accountNameInput().fill('test');
  await addAccountPage.routingNumberInput().fill('1234567893');
  await addAccountPage.accountNumberInput().fill('12345678901234567');
  await addAccountPage.accountTypeDropdown().click();
  await addAccountPage.accountDropdownBusinessCheckingOption().click();
  await expect(addAccountPage.submitAccountButton()).toBeDisabled();
});

test('does not allow add when account number is invalid', async ({ addAccountPage }) => {
  await addAccountPage.accountNameInput().fill('test');
  await addAccountPage.routingNumberInput().fill('123456789');
  await addAccountPage.accountNumberInput().fill('1');
  await addAccountPage.accountTypeDropdown().click();
  await addAccountPage.accountDropdownBusinessCheckingOption().click();
  await expect(addAccountPage.submitAccountButton()).toBeDisabled();
});
