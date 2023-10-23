import { expect, Page } from '@playwright/test';

export default class AddAAccountPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public goto = async () =>
    await this.page.goto('https://bank-account-mgmt-spa-qa-gxdecgcfejakhrd6.z01.azurefd.net/add');

  // Locators
  accountNameInput = () => this.page.locator('//input[@id="nickname"]');
  routingNumberInput = () => this.page.locator('//input[@id="routingNumber"]');
  accountNumberInput = () => this.page.locator('//input[@id="accountNumber"]');
  accountOwnerInput = () => this.page.locator('//input[@id="accountOwner"]');
  accountTypeDropdown = () => this.page.locator('//mat-select');
  accountDropdownBusinessCheckingOption = () =>
    this.page.locator('//mat-option//span[contains(text(),"Business Checking")]');
  accountDropdownBusinessSavingsOption = () =>
    this.page.locator('//mat-option//span[contains(text(),"Business Savings")]');
  accountDropdownConsumerCheckingOption = () =>
    this.page.locator('//mat-option//span[contains(text(),"Consumer Checking")]');
  accountDropdownConsumerSavingsOption = () =>
    this.page.locator('//mat-option//span[contains(text(),"Consumer Savings")]');
  submitAccountButton = () => this.page.locator('//span[contains(text(),"Add account")]');

  // Actions
  // public clickAddNewComputer = async () => await this.addComputerButton().click();
  // public assertNewComputerAdded = async () => await expect(this.computerAddedLabel()).toBeVisible();
}
