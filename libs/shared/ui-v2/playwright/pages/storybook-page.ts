/* eslint-disable prettier/prettier */
import { Page } from '@playwright/test';

export default class StorybookPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public goToBySuffix = async (suffix: string) =>
    await this.page.goto(
      `https://uicoestorybook.z13.web.core.windows.net/?path=/story/components-${suffix}`
    );

  public componentSnapshotLocation = (component: string, fileName: string) =>
    `libs/shared/ui-v2/playwright/tests/${component}/${component}.spec.ts-snapshots/${fileName}`;

  public rootLocator = () =>
    this.page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('#root');

  // Locators

  // SplitButton
  splitButton = () =>
    this.page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .getByRole('button', { name: 'Split button' });
  iconButtonWithAMenu = () =>
    this.page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .getByLabel('icon button with a menu')
      .getByRole('button');
  suggestionMenuItem = () =>
    this.page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .getByRole('menuitem', { name: 'Suggestion' })
      .first();

  // tag
  tag = () =>
    this.page.frameLocator('iframe[title="storybook-preview-iframe"]').getByText('successcheck');

  // textarea
  textarea = () => this.rootLocator();

  // spinner
  spinner = () => this.rootLocator();

  // avatar
  avatar = () => this.rootLocator();

  // card
  card = () => this.rootLocator();

  // autocomplete
  autocomplete = () => this.rootLocator();

  // accordion
  accordion = () =>
    this.page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .getByRole('button', { name: 'Accordion Title' });
  accordionOpened = () =>
    this.page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('body');
  accordionMultiple = () =>
    this.page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('body');

  // alert
  alert = () =>
    this.page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .getByText('do_not_disturb_on Alert Title Some Alert Description close');
  alertAction = () =>
    this.page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .getByText('do_not_disturb_on Alert Title Some Alert Description Buttonclose');

  // button
  button = () => this.rootLocator();

  // button-toggle
  buttonToggle = () =>
    this.page
      .frameLocator('iframe[title="storybook-preview-iframe"]')
      .locator('.innerZoomElementWrapper > div');
  // checkbox
  checkbox = () =>
    this.page.frameLocator('iframe[title="storybook-preview-iframe"]').locator('label');
  checkboxNoLabel = () => this.page.getByRole('link', { name: 'No Label Checkbox' });
}
