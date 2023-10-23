/* eslint-disable prettier/prettier */
class BamHomePage {
  static bankAccountContainer() {
    return cy.get('ui-coe-bank-account-container');
  }
  static addAccountButton() {
    return cy.get('button').contains('Add account').first();
  }
  static bankAccountList() {
    return cy.get('ax-bank-account-list');
  }
  static successMessage() {
    return cy.get('span').contains('Account added');
  }
  static bankAccountNickName() {
    return cy.get('.header__left-content');
  }
  static bankAccountStatus() {
    return cy.get('ax-tag');
  }
  static bankAccountListSkeleton() {
    return cy.get('ax-bank-account-list-skeleton');
  }
}

export default BamHomePage;
