/* eslint-disable cypress/no-unnecessary-waiting */
import { Utility } from '../../support/utility';
// import ShellAppHomeScreen from '../../Pages/ShellAppHomeScreen';
import BamHomePage from '../../Pages/BamHomePage';

const url = new Utility().getBaseUrl();

describe('homepage', () => {
  beforeEach(() => {
    cy.visit(url);
    // cy.wait(2000);
    // ShellAppHomeScreen.hamburgerMenuButton().click();
    // cy.wait(2000);
    // ShellAppHomeScreen.bamMenuOption().click();
  });
  it('loads', () => {
    BamHomePage.bankAccountListSkeleton().should('be.visible');
    cy.wait(2000);
    BamHomePage.bankAccountContainer().should('be.visible');
  });
  it('Add Account page Loads', () => {
    cy.wait(2000);
    BamHomePage.bankAccountContainer().should('be.visible');
    BamHomePage.addAccountButton().click();
  });
});
