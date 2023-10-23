/* eslint-disable prettier/prettier */
class ShellAppHomeScreen {
  static hamburgerMenuButton() {
    return cy.get('mat-icon');
  }

  static bamMenuOption() {
    return cy.get('span').contains('BAM');
  }
}

export default ShellAppHomeScreen;
