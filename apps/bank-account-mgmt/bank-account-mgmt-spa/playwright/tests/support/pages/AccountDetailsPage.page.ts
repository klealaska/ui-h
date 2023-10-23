/* eslint-disable prettier/prettier */
import { test, Page } from '@playwright/test';

export default class AccountDetailsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public EditAccount = async (uuid: string) => {
    await test.step('Edit account.', async () => {
      await this.editButton().click();
      await this.editNameInput().fill(uuid);
      await this.saveButton().click();
      await this.page.waitForResponse(url => url.url().includes('api/bank-accounts'));
    });
  };

  public GettAccountNickName = async () => {
    return await this.bankAccountNickName().textContent();
  };

  public UnmaskBankAccountNumber = async () => {
    await test.step('Click show account number button.', async () => {
      await this.showBankAccountNumberButton().click();
      const accountNumber = await this.accountNumberContainer().textContent();
      return accountNumber?.includes('*');
    });
  };
  //public goto = async () => await this.page.goto('https://bank-account-mgmt-spa-qa-gxdecgcfejakhrd6.z01.azurefd.net/');

  // Locators
  bankAccountNickName = () => this.page.locator('//span[contains(@class,"header__left-content")]');
  bankAccountStatusContainer = () => this.page.locator('//ax-tag//div//span');
  detailsContainer = () => this.page.locator('//ax-tag[@class="status"]//span');
  bankAccountCard = () => this.page.locator('//ax-bank-account-detail');
  deactivateButton = () =>
    this.page.locator(
      '//ui-coe-bank-account-header-container//button[contains(text(),"Deactivate")]'
    );
  editButton = () =>
    this.page.locator('//ui-coe-bank-account-header-container//button[contains(text(),"Edit")]');
  editNameInput = () =>
    this.page.locator(
      '//div[contains(@class,"edit-nickname__container")]//input[@data-test="ax-input"]'
    );
  saveButton = () =>
    this.page.locator(
      '//ui-coe-bank-account-header-container//button//span[contains(text(),"Save")]'
    );
  showBankAccountNumberButton = () => this.page.locator('//button[contains(text(),"SHOW")]');
  hideBankAccountNumberButton = () => this.page.locator('//button[contains(text(),"HIDE")]');
  accountNumberContainer = () => this.page.locator('//ax-bank-account-detail//span');
}
