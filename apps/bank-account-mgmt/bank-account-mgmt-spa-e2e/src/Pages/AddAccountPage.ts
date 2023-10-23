/* eslint-disable prettier/prettier */
class AddAccountPage {
  static accountNameInput() {
    return cy.get('[id="nickname"]');
  }
  static routingNumberInput() {
    return cy.get('[id="routingNumber"]');
  }
  static accountNumberInput() {
    return cy.get('[id="accountNumber"]');
  }
  static accountOwnerInput() {
    return cy.get('[id="accountOwner"]');
  }
  static accountTypeDropdown() {
    return cy.get('mat-select');
  }
  static accountDropdownBusinessCheckingOption() {
    return cy.get('.mdc-list-item__primary-text').contains('Business Checking');
  }
  static accountDropdownBusinessSavingsOption() {
    return cy.get('.mdc-list-item__primary-text').contains('Business Savings');
  }
  static accountDropdownConsumerCheckingOption() {
    return cy.get('.mdc-list-item__primary-text').contains('Consumer Checking');
  }
  static accountDropdownConsumerSavingsOption() {
    return cy.get('.mdc-list-item__primary-text').contains('Consumer Savings');
  }
  static submitAccountButton() {
    return cy.get('[id="addAccountSubmitBtn"]');
  }
  static addBankAccountSkeleton() {
    return cy.get('ax-bank-account-add-skeleton');
  }
}

export default AddAccountPage;
