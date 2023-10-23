describe('XDC Header', () => {
  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));

    cy.visit('/');
  });

  it('displays the AvidCapture header', () => {
    cy.location('pathname').should('eq', '/queue');
    cy.get('xdc-header').should('be.visible');
  });

  it('displays the Company app logo', () => {
    cy.get('xdc-header img').should('be.visible');
  });

  it('displays logout options from user menu list', () => {
    cy.get('[cy-data=menu-user]').click();
    cy.get('.mat-mdc-menu-panel').should('be.visible');

    cy.get('.mat-mdc-menu-panel').find('button:last-child').contains('Logout');
  });

  it('navigates to pending queue when page title clicked', () => {
    cy.visit('/research');

    cy.get('xdc-header img').click();

    cy.location('pathname').should('eq', '/queue');
  });

  it('redirects to customer guidelines when user select Customer Guidelines from user navigation menu ', () => {
    cy.window().then(win => {
      cy.spy(win, 'open');
    });

    cy.get('[cy-data=menu-user]').click();
    cy.get('.mat-mdc-menu-panel').should('be.visible');

    cy.get('.mat-mdc-menu-panel').find('button:first-child').click();

    cy.window().its('open').should('be.called');
  });
});
