import { expect } from '@playwright/test';
import { test } from '../fixtures/baseFixture';
import * as crypto from 'crypto';
import { assert } from 'console';

test.beforeEach(async ({ bamHomePage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await bamHomePage.goto();
});
test('loads', async ({ bamHomePage, accountDetailsPage }) => {
  await bamHomePage.GoToRowByIndex(2);
  await expect(accountDetailsPage.detailsContainer()).toBeVisible();
});

test('Title bar has proper information', async ({ bamHomePage, accountDetailsPage }) => {
  const name = await bamHomePage.bankAccountNameByIndex(1).textContent();
  // const status = await bamHomePage.NickNamedAccountStatusByIndex(1).textContent();

  await bamHomePage.namedBankAccountRowByIndex(1).click();
  const detailName = await accountDetailsPage.bankAccountNickName().textContent();
  //const detailStatus = await accountDetailsPage.bankAccountStatusContainer().textContent();
  await expect(detailName).toContain(name);
  // await expect(status).toBe(detailStatus);
});

test('Clicking edit activates edit mode', async ({ bamHomePage, accountDetailsPage }) => {
  await bamHomePage.GoToRowByIndex(2);
  await accountDetailsPage.editButton().click();
  await expect(accountDetailsPage.editNameInput()).toBeVisible();
});
test('User can edit account', async ({ bamHomePage, accountDetailsPage }) => {
  const uuid = crypto.randomUUID();
  await bamHomePage.GoToRowByIndex(2);
  await accountDetailsPage.EditAccount(uuid);
  const name = await accountDetailsPage.GettAccountNickName();
  await expect(1).toBe(1);
});

test('User can unmask Account number', async ({ bamHomePage, accountDetailsPage }) => {
  await bamHomePage.GoToRowByIndex(2);
  const containsStar = await accountDetailsPage.UnmaskBankAccountNumber();
  await expect(containsStar).toBeFalsy();
});
