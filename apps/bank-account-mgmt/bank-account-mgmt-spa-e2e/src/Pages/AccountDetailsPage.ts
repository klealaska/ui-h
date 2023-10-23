/* eslint-disable prettier/prettier */
class AccountDetailsPage {
  static hamburgerMenuButton() {
    return cy.get('mat-icon');
  }

  static detailsContainer() {
    return cy.get('ax-bank-account-detail');
  }
  static bankAccountCard() {
    return cy.get('ax-bank-account-card');
  }
  static bankAccountName() {
    return cy.get('.header__left-content');
  }
  static bankAccountStatus() {
    return cy.get('.status').find('span');
  }
  static deactivateButton() {
    return cy.get('button').contains('Deactivate');
  }
  static editButton() {
    return cy.get('.bam__edit-button').contains('Edit');
  }
  static editNameInput() {
    return cy.get('.edit-nickname__input-container');
  }
  static bankAccountDetailsSkeleton() {
    return cy.get('ax-bam-detail-container-skeleton');
  }
}

export default AccountDetailsPage;
