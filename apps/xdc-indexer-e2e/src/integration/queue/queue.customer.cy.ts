import { NetworkRequestKeys } from '../../network-request-keys';

describe('Pending Queue Page - Customer', () => {
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
    cy.fixture('composite-document').then(fixture => {
      fixture.userLock.indexer = Cypress.env('customerUsername');
      cy.intercept('**/user/*', fixture).as(NetworkRequestKeys.getDocumentData.interceptAlias);
    });
    cy.fixture('queue-search').then(fixture => {
      cy.intercept('search', fixture).as(NetworkRequestKeys.search.interceptAlias);
    });
    cy.visit('queue');
    cy.wait(NetworkRequestKeys.search.waitAlias);
  });

  it('should be displaying the Queue page.', () => {
    cy.url().should('include', '/queue');
    cy.saveLocalStorage();
  });

  it('should navigate to the indexing page when a grid link is clicked', () => {
    cy.get('.queue-container')
      .get('ax-table ax-link a', { timeout: 3000 })
      .not('.ax-link-disabled')
      .first()
      .click({ force: true });

    cy.url().should('include', '/indexing');
  });

  describe('Refresh Button', () => {
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

    it('should load 5 more rows of data when scroll', () => {
      cy.get('[data-cy=queue-grid] table').find('ax-link').should('have.length.greaterThan', 1);
      cy.scrollTo('bottom');
      cy.wait(NetworkRequestKeys.search.waitAlias);
      cy.get('[data-cy=queue-grid] table').find('ax-link').should('have.length.greaterThan', 5);
    });
  });

  describe('Advanced Filters', () => {
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
