import { test as base } from '@playwright/test';
import StorybookPage from '../pages/storybook-page';

export const test = base.extend<{
  storybookPage: StorybookPage;
}>({
  // Define a fixture
  storybookPage: async ({ page }, use) => {
    await use(new StorybookPage(page));
  },
});
