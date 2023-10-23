import { NetworkRequestKeys } from '../../network-request-keys';

describe('Recycle Bin Page - Customer', () => {
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
    cy.fixture('recycleBin-search').then(fixture => {
      cy.intercept('search', fixture).as(NetworkRequestKeys.search.interceptAlias);
    });
    cy.fixture('composite-document').then(fixture => {
      fixture.userLock.indexer = Cypress.env('customerUsername');
      cy.intercept('**/user/*', fixture).as(NetworkRequestKeys.getDocumentData.interceptAlias);
    });
    cy.visit('recyclebin');
    cy.wait(NetworkRequestKeys.search.waitAlias);
  });

  it('should be displaying the RecycleBin page.', () => {
    cy.url().should('include', '/recyclebin');

    cy.saveLocalStorage();
  });

  it('should navigate to the indexing page when a grid link is clicked', () => {
    cy.get('[data-cy=recyclebin-grid]')
      .get('ax-table ax-link a', { timeout: 3000 })
      .not('.ax-link-disabled')
      .first()
      .click({ force: true });

    cy.url().should('include', '/indexing');
  });

  describe('Advance Filter', () => {
    beforeEach(() => {
      cy.get('[data-cy=recycleBin-filter-button]').click();
    });
    it('should open advance filter', () => {
      cy.get('ax-side-sheet-v2').should('be.visible');
    });

    it('should reset data fields', () => {
      cy.get('[data-cy=filter-supplier-input]').type('Supplier');
      cy.get('[data-cy=filter-shipto-input]').type('shipTo');
      cy.get('[data-cy=filter-invoicenumber-input]').type('invoiceNumber');

      cy.get('[data-cy=filter-reset-button]').click();
      cy.get('[data-cy=filter-supplier-input]').should('have.value', '');
      cy.get('[data-cy=filter-shipto-input]').should('have.value', '');
      cy.get('[data-cy=filter-invoicenumber-input]').should('have.value', '');
      cy.get('[data-cy=filter-filename-input]').should('have.value', '');
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

    it('should load 5 more rows of data when scroll', () => {
      cy.get('[data-cy=recyclebin-grid] ax-table')
        .find('ax-link')
        .should('have.length.greaterThan', 1);
      cy.scrollTo('bottom');
      cy.wait(NetworkRequestKeys.search.waitAlias);
      cy.get('[data-cy=recyclebin-grid] ax-table')
        .find('ax-link')
        .should('have.length.greaterThan', 5);
    });
  });

  describe('Refresh Button', () => {
    it('should be disabled after clicking', () => {
      cy.get('[data-cy=recyclebin-refresh-button]').click();
      cy.get('[data-cy=recyclebin-refresh-button] button').should('be.disabled');
    });

    it('should call the apis to reload all data', () => {
      cy.get('[data-cy=recyclebin-refresh-button]').click();
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });
  });
});
