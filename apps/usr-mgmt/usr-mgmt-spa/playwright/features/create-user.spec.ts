import { expect } from '@playwright/test';
import { test } from '../fixtures/baseFixture';
import { createUser, getUsers } from '../mock-data/user';
import { USER_ROUTE } from '../types/const/routes';

test('create user flow success', async ({ listPage }) => {
  //Create user flow
  await listPage.mockAPI(USER_ROUTE, '', {
    getAll: { data: getUsers() },
    post: { data: createUser() },
  });
  await listPage.visit();
  await listPage.createUserButton().click();
  await listPage.createUserFlow({ firstName: 'Jane', lastName: 'Smithy', email: 'js@mail.com' });

  //Assert
  await expect(listPage.getByText('User created')).toBeVisible();
  await expect(listPage.tableRows()).toHaveCount(3);
});

test('create user flow failure', async ({ listPage }) => {
  //Create user flow
  await listPage.mockAPI(USER_ROUTE, '', {
    getAll: { data: getUsers() },
  });
  await listPage.visit();
  // will wait for first API call to load users before we mock out next API call to create user
  await listPage.waitForResponse('/api/users', 200);
  await listPage.mockAPI(USER_ROUTE, '', {}, 500);
  await listPage.createUserButton().click();
  await listPage.createUserFlow({ firstName: 'Jane', lastName: 'Smithy', email: 'js@mail.com' });

  //Assert
  await expect(listPage.getByText('Failure')).toBeVisible();
  await expect(listPage.tableRows()).toHaveCount(2);
});
