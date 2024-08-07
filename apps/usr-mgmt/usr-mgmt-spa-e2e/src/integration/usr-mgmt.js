/**
 * @file This file was generated by ax-app generator.
 * @copyright AvidXchange Inc.
 */
import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import UsrMgmtListPage from '../pages/usr-mgmt-list';

Given('that I am on the User Management List page', () => {
  UsrMgmtListPage.visit();
});

Then('the User Management title must be displayed', () => {
  UsrMgmtListPage.getListPageTitle().should('be.visible');
});

Then('the Import and Add buttons must be displayed', () => {
  UsrMgmtListPage.getAddUserBtn().should('be.visible');
});

Then('the table must be displayed', () => {
  UsrMgmtListPage.getUsrMgmtTable().should('be.visible');
});
