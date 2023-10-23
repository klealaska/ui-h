import { expect } from '@playwright/test';
import { getUsers } from '../mock-data/user';
import { test } from '../fixtures/baseFixture';
import { USER_ROUTE } from '../types/const/routes';

test.beforeEach(async ({ listPage }) => {
  await listPage.mockAPI(USER_ROUTE, '', { getAll: { data: getUsers() } });
  await listPage.visit();
});

test('fetch users success', async ({ listPage }) => {
  const rows = listPage.tableRows();
  const username = listPage.getTableRowDataByIndexAndColum(1, 1);
  const email = listPage.getTableRowDataByIndexAndColum(1, 2);
  const status = listPage.getTableRowDataByIndexAndColum(1, 3);

  await expect(rows).toHaveCount(2);
  await expect(username).toHaveText('JD   John Doe');
  await expect(email).toHaveText('johndoe@example.com');
  await expect(status).toHaveText('ACTIVE');
});
