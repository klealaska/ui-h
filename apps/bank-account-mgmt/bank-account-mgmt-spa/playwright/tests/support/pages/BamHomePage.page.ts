/* eslint-disable prettier/prettier */
import { test, Page } from '@playwright/test';

export default class BamHomePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public GoToRowByIndex = async (index: number) => {
    await test.step('Go To Card By Index.', async () => {
      await this.bankAccountRowByIndex(index).click();
    });
  };
  public goto = async () =>
    await this.page.goto('https://bank-account-mgmt-spa-qa-gxdecgcfejakhrd6.z01.azurefd.net/');

  // Locators
  addAccountButton = () => this.page.locator('//section//button[contains(text(),"Add account")]');
  bankAccountContainer = () => this.page.locator('//ui-coe-bank-account-container');
  bankAccountList = () => this.page.locator('//ax-bank-account-list');
  successMessage = () => this.page.locator('//span[contains(text(),"Account added")]');

  bankAccountRowByIndex = (index: number) => this.page.locator(`(//table//tbody//tr)[${index}]//a`);
  namedBankAccountRowByIndex = (index: number) =>
    this.page.locator(`(//table//tbody//tr)[${index}]//a`);

  bankAccountNameByIndex = (index: number) =>
    this.page.locator(
      `(//tr//td[contains(@class,'cdk-column-bankName') and string-length(text()) > 0])[${index}]`
    );
  searchInput = () => this.page.locator(`//input[@id='list__search']`);

  // NickNamedAccountStatusByIndex = (index: number) =>
  //   this.page.locator(
  //     `(//ax-bank-account-card//p[contains(@class,'nickname') and not(contains(text(),'x0'))])[${index}]//parent::div//following-sibling::ax-tag//span`
  //   );

  bankAccountStatusByIndex = (index: number) =>
    this.page.locator(`(//ax-tag[contains(@class,'status')])[${index}]//span`);
}
