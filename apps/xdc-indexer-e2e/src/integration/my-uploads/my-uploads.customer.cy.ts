import { NetworkRequestKeys } from '../../network-request-keys';

describe('My Uploads Page', () => {
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
    cy.visit('my-uploads');
    cy.wait(NetworkRequestKeys.search.waitAlias);
  });

  it('should be displaying the My Uploads page.', () => {
    cy.url().should('include', '/my-uploads');
    cy.saveLocalStorage();
  });

  it('should navigate to the indexing page when a grid link is clicked', () => {
    cy.get('[data-cy=my-uploads-grid]')
      .get('ax-table ax-link a', { timeout: 3000 })
      .not('.ax-link-disabled')
      .first()
      .click({ force: true });

    cy.url().should('include', '/indexing');
  });

  describe('Refresh Button', () => {
    it('should be disabled after clicking', () => {
      cy.get('[data-cy=uploads-queue-refresh-button]').click();
      cy.get('[data-cy=uploads-queue-refresh-button] button').should('be.disabled');
    });

    it('should call the apis to reload all data', () => {
      cy.get('[data-cy=uploads-queue-refresh-button]').click();
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });
  });

  describe('Load More scroll', () => {
    before(() => cy.viewport(Cypress.config('viewportWidth'), 500));

    after(() => cy.viewport(Cypress.config('viewportWidth'), Cypress.config('viewportHeight')));

    it('should load 5 more rows of data when scroll', () => {
      cy.get('[data-cy=my-uploads-grid] ax-table')
        .find('ax-link')
        .should('have.length.greaterThan', 1);
      cy.scrollTo('bottom');
      cy.wait(NetworkRequestKeys.search.waitAlias);
      cy.get('[data-cy=my-uploads-grid] ax-table')
        .find('ax-link')
        .should('have.length.greaterThan', 5);
    });
  });

  describe('Upload New Document', () => {
    it('should successfully upload after file is selected', () => {
      cy.get('[type="file"]').attachFile('test-pdf.pdf');
      cy.wait(2000);
      cy.get('td:contains(Processing)').should('have.length', 1);
    });

    it('should successfully upload multiple after files are selected', () => {
      cy.get('[type="file"]').attachFile(['test-pdf.pdf', 'test-pdf.pdf']);
      cy.contains(
        'Files are available in My uploads after processing is complete. Larger files can take a few minutes to process'
      ).should('be.visible');
      cy.wait(2000);
      cy.get('td:contains(Processing)').should('have.length', 2);
    });
  });
});
