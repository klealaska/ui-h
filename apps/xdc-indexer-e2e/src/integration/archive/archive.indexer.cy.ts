import { NetworkRequestKeys } from '../../network-request-keys';

describe('Archive Page - Indexer', () => {
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('suUsername'));
    cy.restoreLocalStorage();
  });

  it('should display buyer selection modal', () => {
    cy.visit('archive');
    cy.get('xdc-buyer').contains('Buyer selection');
  });

  it('should be displaying the Archive Page', () => {
    cy.visit('archive');
    cy.selectBuyer();

    cy.get('.mat-mdc-chip').contains('AVIDXCHANGE');
    cy.url().should('include', '/archive');
    cy.saveLocalStorage();
  });

  it('should navigate to the archived indexing page when a grid link is clicked', () => {
    cy.visit('archive');

    cy.get('[data-cy=archive-grid]')
      .get('ax-table ax-link a', { timeout: 3000 })
      .not('ax-link-disabled')
      .first()
      .click({ force: true });

    cy.url().should('include', '/archive');
  });

  describe('Customer Search Filter', () => {
    const buyerSearchText = '2 qa';
    const buyerName = '2 QA TEST SITE';

    beforeEach(() => {
      cy.visit('archive');
    });

    it('should display buyer selection modal when removing all buyers from filter', () => {
      // Text and icon are both nested in different elements now
      cy.get('.mat-mdc-chip').contains('AVIDXCHANGE');
      cy.get('.mat-mdc-chip').within(() => {
        cy.get('.mat-icon').click();
      });
      cy.get('xdc-buyer').contains('Buyer selection');
    });

    it('should filter row data', () => {
      cy.get('.mat-mdc-chip-input').click();
      cy.get('.mat-mdc-chip-input').type(buyerSearchText);
      cy.get('.mat-mdc-option').first().click();
      cy.get('.mat-mdc-chip').contains(buyerName);
    });

    it('should remove filter when "X" is clicked on filter tag', () => {
      cy.get('.mat-mdc-chip-input').click();
      cy.get('.mat-mdc-chip-input').type(buyerSearchText);
      cy.get('.mat-mdc-option').first().click();
      cy.get('[data-cy=buyer-filter-input]').first().type(buyerSearchText);
      cy.get('.mat-mdc-chip').contains(buyerName);

      // Text and icon are both nested in different elements now
      // for this exmaple buyerName is the one being closed but should be updated to add a data-cy to specify
      cy.get('.mat-mdc-chip')
        .last()
        .within(() => {
          cy.get('mat-icon').click();
        });

      cy.get('.mat-mdc-chip').contains(buyerName).should('not.exist');
    });

    it('should add another buyer to filter', () => {
      cy.get('.mat-mdc-chip-input').click();
      cy.get('.mat-mdc-chip-input').type(buyerSearchText);
      cy.get('.mat-mdc-option').first().click();
      cy.saveLocalStorage();
    });

    it('should keep new buyer in filter', () => {
      cy.get('.mat-mdc-chip').contains(buyerName);
    });
  });

  describe('Advance Filter', () => {
    beforeEach(() => {
      cy.visit('archive');
      cy.fixture('archive-search').then(fixture => {
        cy.intercept('**/search', fixture).as(NetworkRequestKeys.search.interceptAlias);
      });
      cy.wait(NetworkRequestKeys.search.waitAlias);
      cy.get('[data-cy=archive-filter-button]').click();
    });

    it('should open advance filter', () => {
      cy.get('ax-side-sheet-v2').should('be.visible');
    });

    it('should call search api after apply button has been clicked', () => {
      cy.get('[data-cy=filter-supplier-input]').type('mock');
      cy.get('[data-cy=filter-apply-button]').click();

      cy.get(NetworkRequestKeys.search.waitAlias)
        .its('response')
        .then(res => {
          expect(res.body.length, 'response body documents received are').to.equal(3);
        });
    });
  });

  describe('Load More scroll', () => {
    before(() => cy.viewport(Cypress.config('viewportWidth'), 500));

    after(() => cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight')));

    beforeEach(() => {
      cy.visit('archive');
    });

    it('should load 5 more rows of data when scroll', () => {
      cy.get('[data-cy=archive-grid] ax-table')
        .find('ax-link')
        .should('have.length.greaterThan', 1);
      cy.scrollTo('bottom');
      cy.get('[data-cy=archive-grid] ax-table')
        .find('ax-link')
        .should('have.length.greaterThan', 5);
    });
  });

  describe('Refresh Button', () => {
    beforeEach(() => {
      cy.visit('archive');
    });

    it('should be disabled after clicking', () => {
      cy.get('[data-cy=archive-refresh-button]').click();
      cy.get('[data-cy=archive-refresh-button] button').should('be.disabled');
    });

    it('should call the apis to reload all data', () => {
      cy.get('[data-cy=archive-refresh-button]').click();
    });
  });

  describe('Get Previous Document', () => {
    beforeEach(() => {
      cy.visit('archive');
    });
    describe('When the user open the first document on the list and clicks on get previous document', () => {
      it('should gets a warning toast message', () => {
        cy.get('[data-cy=archive-grid]')
          .get('ax-table ax-link a', { timeout: 3000 })
          .first()
          .click({ force: true });
        cy.contains('Previous document').click();
        cy.get('.warning');
      });
    });

    describe('When the user open a document of  middle of the list and clicks on get previous document', () => {
      it('should gets the previous document', () => {
        cy.get('[data-cy=archive-grid]')
          .get('ax-table ax-link a', { timeout: 3000 })
          .eq(1)
          .click({ force: true });
        cy.contains('Previous document').click();
        cy.location('pathname').should('contain', '/archive');
      });
    });
  });

  describe('Get Next Document', () => {
    beforeEach(() => {
      cy.visit('archive');
    });
    describe('When the user open the first document on the list and clicks on get next document', () => {
      it('should gets the next document', () => {
        cy.get('[data-cy=archive-grid]')
          .get('ax-table ax-link a', { timeout: 3000 })
          .first()
          .click({ force: true });
        cy.contains('Next document').click();
        cy.location('pathname').should('contain', '/archive');
      });
    });

    describe('When the user open the last document of the list and clicks on get next document', () => {
      it('should gets a warning toast message', () => {
        cy.get('[data-cy=archive-grid]')
          .get('ax-table ax-link a', { timeout: 3000 })
          .last()
          .click({ force: true });
        cy.contains('Next document').click();
        cy.location('pathname').should('contain', '/archive');
        cy.get('.warning');
      });
    });
  });
});
