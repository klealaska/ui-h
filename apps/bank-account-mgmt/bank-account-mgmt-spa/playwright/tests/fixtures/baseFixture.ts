import { test as base } from '@playwright/test';
import AccountDetailsPage from '../support/pages/AccountDetailsPage.page';
import BamHomePage from '../support/pages/BamHomePage.page';
import AddAccountPage from '../support/pages/AddAccountPage.page';

export const test = base.extend<{
  bamHomePage: BamHomePage;
  accountDetailsPage: AccountDetailsPage;
  addAccountPage: AddAccountPage;
}>({
  // Define a fixture
  bamHomePage: async ({ page }, use) => {
    await use(new BamHomePage(page));
  },
  accountDetailsPage: async ({ page }, use) => {
    await use(new AccountDetailsPage(page));
  },
  addAccountPage: async ({ page }, use) => {
    await use(new AddAccountPage(page));
  },
});
