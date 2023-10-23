describe('Dashboard Page', () => {
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
    cy.visit('dashboard');
  });

  it('should be displaying the Dashboard page.', () => {
    cy.url().should('include', '/dashboard');
    cy.saveLocalStorage();
  });
});
