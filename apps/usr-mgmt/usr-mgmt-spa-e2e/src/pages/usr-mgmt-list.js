const assets = '/assets/i18n/en.json';
const loadusers = '/api/users';
const listPageTitle = '[data-cy=list-page-title]';
const addUserBtn = '[data-cy=add-user-btn]';
const usrMgmtTable = '[data-cy=usr-mgmt-table]';

export default class UsrMgmtListPage {
  static visit() {
    cy.intercept(assets).as('getAssets');
    cy.intercept(loadusers);
    cy.visit('/');
  }

  static getListPageTitle() {
    return cy.get(listPageTitle);
  }

  static getAddUserBtn() {
    return cy.get(addUserBtn);
  }

  static getUsrMgmtTable() {
    return cy.get(usrMgmtTable);
  }
}
