/* eslint-disable cypress/no-unnecessary-waiting */
import { Utility } from '../../support/utility';
// import ShellAppHomeScreen from '../../Pages/ShellAppHomeScreen';
import AddAccountPage from '../../Pages/AddAccountPage';
import BamHomePage from '../../Pages/BamHomePage';

const url = new Utility().getBaseUrl();

describe('AddAccountPage', () => {
  beforeEach(() => {
    cy.visit(url);
    BamHomePage.addAccountButton().should('be.visible');
    BamHomePage.addAccountButton().click();
    // cy.wait(2000);
    // ShellAppHomeScreen.hamburgerMenuButton().click();
    // cy.wait(2000);
    // ShellAppHomeScreen.bamMenuOption().click();
  });
  // it('creates a new bank account', function () {
  //   cy.request('POST', `${Cypress.config('baseUrl')}/api/bank-accounts/add`, {
  //     routingNumber: `122105278`,
  //     accountNumber: '123456789',
  //     tenantId: '1',
  //     bankName: 'Chase',
  //     externalBankReference: '1',
  //     accountType: 'Checking',
  //     nickName: 'test',
  //     owner: 'test',
  //   }).then(response => {
  //     expect(response.status).to.eq(201);
  //     expect(response.body.RoutingNumber).to.equal('122105278');
  //     expect(response.body.Status).to.equal('Pass');
  //   });
  // });
  it('Add Account page Loads', () => {
    AddAccountPage.accountNameInput().should('be.visible');
  });
  it('form fields when valid allow add and success message displays', () => {
    AddAccountPage.accountNameInput().should('be.visible');
    AddAccountPage.accountNameInput().eq(1).type('test');
    AddAccountPage.routingNumberInput().eq(1).type('122105278');
    AddAccountPage.accountNumberInput().eq(1).type('123456789');
    AddAccountPage.accountTypeDropdown().click();
    AddAccountPage.accountDropdownBusinessCheckingOption().click();

    AddAccountPage.submitAccountButton().click();
    BamHomePage.bankAccountList().should('exist');
    cy.wait(2000);
    BamHomePage.addAccountButton().should('exist');
  });
  it('Account Type drop down is visible', () => {
    AddAccountPage.accountTypeDropdown().should('exist');
  });
  it('Account Type drop down options are visible', () => {
    AddAccountPage.accountTypeDropdown().click();
    AddAccountPage.accountDropdownBusinessCheckingOption().should('exist');
    AddAccountPage.accountDropdownBusinessSavingsOption().should('exist');
    AddAccountPage.accountDropdownConsumerCheckingOption().should('exist');
    AddAccountPage.accountDropdownConsumerSavingsOption().should('exist');
  });
  it('does not allow add when routing number is invalid', () => {
    AddAccountPage.accountNameInput().eq(1).type('test');
    AddAccountPage.routingNumberInput().eq(1).type('12345678');
    AddAccountPage.accountNumberInput().eq(1).type('12345678901234567');
    AddAccountPage.accountTypeDropdown().click();
    AddAccountPage.accountDropdownBusinessCheckingOption().click();
    AddAccountPage.submitAccountButton().children('button').should('be.disabled');
  });
  it('does not allow add when account number is invalid', () => {
    AddAccountPage.accountNameInput().eq(1).type('test');
    AddAccountPage.routingNumberInput().eq(1).type('1234567893');
    AddAccountPage.accountNumberInput().eq(1).type('1234567890123456');
    AddAccountPage.accountTypeDropdown().click();
    AddAccountPage.accountDropdownBusinessCheckingOption().click();
    AddAccountPage.submitAccountButton().children('button').should('be.disabled');
  });
});
