import { test as base } from '@playwright/test';
import ListPage from './pages/list-page';

export const test = base.extend<{
  listPage: ListPage;
}>({
  // Define a fixture
  listPage: async ({ page }, use) => {
    await use(new ListPage(page));
  },
});
