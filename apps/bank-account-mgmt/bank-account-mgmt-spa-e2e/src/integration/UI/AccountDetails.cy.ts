/* eslint-disable cypress/no-unnecessary-waiting */
import { Utility } from '../../support/utility';
import BamHomePage from '../../Pages/BamHomePage';
import AccountDetailsPage from '../../Pages/AccountDetailsPage';

const url = new Utility().getBaseUrl();

describe('Account Details', () => {
  beforeEach(() => {
    cy.visit(url);
    AccountDetailsPage.bankAccountCard().should('be.visible');
    AccountDetailsPage.bankAccountCard().eq(1).click();
    // cy.wait(2000);
    // ShellAppHomeScreen.hamburgerMenuButton().click();
    // cy.wait(2000);
    // ShellAppHomeScreen.bamMenuOption().click();
  });
  it('loads', () => {
    AccountDetailsPage.bankAccountDetailsSkeleton().should('be.visible');
    AccountDetailsPage.detailsContainer().should('be.visible');
  });
  it('title bar has proper information', () => {
    BamHomePage.bankAccountNickName().eq(0).invoke('text').as('name');
    BamHomePage.bankAccountStatus().eq(0).find('span').invoke('text').as('status');
    AccountDetailsPage.bankAccountName().invoke('text').as('name2');
    AccountDetailsPage.bankAccountStatus().invoke('text').as('status2');

    cy.get('@status').then(status => {
      cy.get('@status2').then(status2 => {
        expect(status2).contains(status);
      });
    });

    cy.get('@name').then(name => {
      cy.get('@name2').then(name2 => {
        expect(name2).contains(name);
      });
      AccountDetailsPage.editButton().should('be.visible');
      // ** COMMENTED OUT UNTIL WE GET STATUS TO DRIVE THIS **
      // AccountDetailsPage.deactivateButton().should('be.visible');
    });
  });
  it('clicking edit activates edit mode', () => {
    AccountDetailsPage.editButton().click();
    AccountDetailsPage.editNameInput().should('be.visible');
  });
});
