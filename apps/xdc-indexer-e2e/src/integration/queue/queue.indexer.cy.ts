import { NetworkRequestKeys } from '../../network-request-keys';

describe('Pending Queue Page - Indexer', () => {
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('suUsername'));
    cy.restoreLocalStorage();
    cy.fixture('composite-document').then(fixture => {
      fixture.userLock.indexer = Cypress.env('suUsername');
      cy.intercept('**/user/*', fixture).as(NetworkRequestKeys.getDocumentData.interceptAlias);
    });
    cy.fixture('queue-search').then(fixture => {
      cy.intercept('search', fixture).as(NetworkRequestKeys.search.interceptAlias);
    });
  });

  it('should display buyer selection modal', () => {
    cy.visit('queue');
    cy.get('xdc-buyer').contains('Buyer selection');
  });

  it('should be displaying the Pending Queue Page', () => {
    cy.visit('queue');
    cy.selectBuyer();
    cy.wait(NetworkRequestKeys.search.waitAlias);

    cy.get('.mat-mdc-chip').contains('AVIDXCHANGE');
    cy.url().should('include', '/queue');
    cy.saveLocalStorage();
  });

  it('should navigate to the indexing page when a grid link is clicked', () => {
    cy.visit('queue');
    cy.wait(NetworkRequestKeys.search.waitAlias);

    cy.get('.queue-container')
      .get('ax-table ax-link a', { timeout: 3000 })
      .not('.ax-link-disabled')
      .first()
      .click({ force: true });

    cy.url().should('include', '/indexing');
  });

  describe('Customer Search Filter', () => {
    const buyerSearchText = '2 qa';
    const buyerName = '2 QA TEST SITE';

    beforeEach(() => {
      cy.visit('queue');
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });

    it('should display buyer selection modal when removing all buyers from filter', () => {
      cy.get('.mat-mdc-chip').contains('AVIDXCHANGE');
      // Text and icon are both nested in different elements now
      cy.get('.mat-mdc-chip').within(() => {
        cy.get('.mat-icon').click();
      });

      cy.get('xdc-buyer').contains('Buyer selection');
    });

    it('should filter row data', () => {
      cy.get('[data-cy=buyer-filter-input]').find('input').type(buyerSearchText);
      cy.get('.mat-mdc-option').first().click();

      cy.get('.mat-mdc-chip').contains(buyerName);
    });

    it('should remove filter when "X" is clicked on filter tag', () => {
      cy.get('[data-cy=buyer-filter-input]').find('input').type(buyerSearchText);
      cy.get('.mat-mdc-option').first().click();
      cy.get('.mat-mdc-chip').contains(buyerName);

      // Text and icon are both nested in different elements now
      // for this exmaple buyerName is the one being closed but should be updated to add a data-cy to specify
      cy.get('.mat-mdc-chip')
        .last()
        .within(() => {
          cy.get('.mat-icon').click();
        });
      cy.get('.mat-mdc-chip').contains(buyerName).should('not.exist');
    });

    it('should add another buyer to filter', () => {
      cy.get('[data-cy=buyer-filter-input]').find('input').type(buyerSearchText);
      cy.get('.mat-mdc-option').first().click();
      cy.saveLocalStorage();
    });

    it('should keep new buyer in filter', () => {
      cy.get('.mat-mdc-chip').contains(buyerName);
    });
  });

  describe('Refresh Button', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });

    it('should be disabled after clicking', () => {
      cy.get('[data-cy=queue-refresh-button]').click();
      cy.get('[data-cy=queue-refresh-button] button').should('be.disabled');
    });

    it('should call the apis to reload all data', () => {
      cy.get('[data-cy=queue-refresh-button]').click();
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });
  });

  describe('Load More scroll', () => {
    before(() => cy.viewport(Cypress.config('viewportWidth'), 500));

    after(() => cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight')));

    beforeEach(() => {
      cy.visit('queue');
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });

    it('should load 5 more rows of data when scroll', () => {
      cy.get('[data-cy=queue-grid] ax-table').find('ax-link').should('have.length.greaterThan', 1);
      cy.scrollTo('bottom');
      cy.wait(NetworkRequestKeys.search.waitAlias);
      cy.get('[data-cy=queue-grid] ax-table').find('ax-link').should('have.length.greaterThan', 5);
    });
  });

  describe('Advanced Filters', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });

    it('should call search api after apply button has been clicked', () => {
      cy.get('[data-cy=queue-filter-button]').click();
      cy.get('[data-cy=filter-supplier-input]').type('mock');
      cy.get('[data-cy=filter-apply-button]').click();

      cy.get(NetworkRequestKeys.search.waitAlias)
        .its('response')
        .then(res => {
          expect(res.body.length, 'response body documents received are').to.equal(3);
        });
    });
  });
});
