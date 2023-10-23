describe('XDC Sidebar', () => {
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();

    cy.visit('/');
  });

  it('confirm sidebar displays', () => {
    cy.get('.page-sidebar').should('be.visible');
  });

  it('should show navigation links', () => {
    cy.get('.page-sidebar')
      .should('contain', 'Dashboard')
      .should('contain', 'Pending')
      .should('contain', 'My uploads')
      .should('contain', 'Research')
      .should('contain', 'Archive')
      .should('contain', 'Recycle bin')
      .should('contain', 'Reports');
  });

  it('should display 4 counts on sidebar', () => {
    cy.get('.page-sidebar')
      .get('.invoice-count')
      .should('have.length', 4)
      .each(counter => {
        cy.wrap(counter)
          .should('be.visible')
          .invoke('text')
          .then(text => {
            const count = parseInt(text.match(/\d+/)[0]);
            expect(count).to.be.at.least(0);
          });
      });
  });

  it('should show pending count', () => {
    cy.get('.page-sidebar')
      .should('contain', 'Pending')
      .contains('Pending')
      .then(element => {
        const text = Cypress.$(element).text().replace('description', '');
        const value = parseInt(text.replace('Pending', '').trim().match(/\d+/)[0]);
        expect(value).to.be.at.least(0);
      });
  });

  it('should show my uploads count', () => {
    cy.get('.page-sidebar')
      .should('contain', 'My uploads')
      .contains('My uploads')
      .then(element => {
        const text = Cypress.$(element).text().replace('description', '');
        const value = parseInt(text.replace('My uploads', '').trim().match(/\d+/)[0]);
        expect(value).to.be.at.least(0);
      });
  });

  it('should show pending count', () => {
    cy.get('.page-sidebar')
      .should('contain', 'Research')
      .contains('Research')
      .then(element => {
        const text = Cypress.$(element).text().replace('description', '');
        const value = parseInt(text.replace('Research', '').trim().match(/\d+/)[0]);
        expect(value).to.be.at.least(0);
      });
  });

  it('should show Recycle Bin count', () => {
    cy.get('.page-sidebar')
      .should('contain', 'Recycle bin')
      .contains('Recycle bin')
      .then(element => {
        const text = Cypress.$(element).text().replace('description', '');
        const value = parseInt(text.replace('Recycle bin', '').trim().match(/\d+/)[0]);
        expect(value).to.be.at.least(0);
      });
  });

  it('clicks queue link and navigates', () => {
    cy.contains('Pending queue').click();

    cy.location('pathname').should('eq', '/queue');
  });

  it('clicks dashboard link and navigates', () => {
    cy.contains('Dashboard').click();

    cy.location('pathname').should('eq', '/dashboard');
  });

  it('clicks research link and navigates', () => {
    cy.contains('Research').click();

    cy.location('pathname').should('eq', '/research');
  });

  it('clicks archive link and navigates', () => {
    cy.contains('Archive').click();

    cy.location('pathname').should('eq', '/archive');
  });

  it('clicks recycle bin link and navigates', () => {
    cy.contains('Recycle bin').click();

    cy.location('pathname').should('eq', '/recyclebin');
  });
});
