import { Page, test } from '@playwright/test';
import { IUser } from '../../types/models/user';
import { Method } from '../../types/enums/api-enum';
import { IAPIMockData } from '../../types/models/api-model';

export default class ListPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  public createUserFlow = async (user: IUser) => {
    await test.step('Create user form and submit', async () => {
      await this.getInputByPlaceholderText('First name').click();
      await this.getInputByPlaceholderText('First name').fill(user.firstName);

      await this.getInputByPlaceholderText('Last name').click();
      await this.getInputByPlaceholderText('Last name').fill(user.lastName);

      await this.getInputByPlaceholderText('This will be their username').click();
      await this.getInputByPlaceholderText('This will be their username').fill(user.email);

      await this.page.getByRole('button', { name: 'Save' }).click();
    });
  };

  public mockAPI = async (
    baseRoute: string,
    pathParam: string,
    data: IAPIMockData,
    status = 200
  ) => {
    return await this.page.route(
      !pathParam ? baseRoute : `${baseRoute}/${pathParam}`,
      async (route, request) => {
        switch (request.method()) {
          case Method.GET:
            await route.fulfill({ json: pathParam ? data.getById : data.getAll?.data, status });
            break;
          case Method.POST:
            await route.fulfill({ json: data.post?.data, status });
            break;
          case Method.PATCH:
            await route.fulfill({ json: data.patch?.data, status });
            break;
          case Method.PUT:
            await route.fulfill({ json: data.put?.data, status });
            break;
        }
      }
    );
  };

  public visit = async () => {
    return await this.page.goto('/', { waitUntil: 'load' });
  };

  // Locators
  createUserButton = () => this.page.getByRole('button', { name: 'Create User' });
  tableRows = () => this.page.getByRole('row');
  getTableRowDataByIndexAndColum = (index: number, column: number) =>
    this.page.locator(`tr:nth-child(${index}) > td.mat-mdc-cell:nth-child(${column})`);
  waitForResponse = (route: string, status: number) =>
    this.page.waitForResponse(resp => resp.url().includes(route) && resp.status() === status);
  getByText = (text: string) => this.page.getByText(text, { exact: true });
  getByRole = (role, name?: string) =>
    name ? this.page.getByRole(role, { name: name }) : this.page.getByRole(role);
  getKabobButtonClick = (index: number, column: number) =>
    this.page
      .locator(`tr:nth-child(${index}) > td.mat-mdc-cell:nth-child(${column}) > menu`)
      .getByRole('button')
      .click();

  private getInputByPlaceholderText = (text: string) =>
    this.page.locator('ax-input').filter({ hasText: text }).locator('[data-test="ax-input"]');
}
