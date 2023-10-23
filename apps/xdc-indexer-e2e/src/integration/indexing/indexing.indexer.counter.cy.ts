import { NetworkRequestKeys } from '../../network-request-keys';

describe('Indexing Page Test for an Indexer', () => {
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

  it('should be displaying 3 counters', () => {
    cy.visit('queue');
    cy.wait(2000);
    cy.get('mat-option').eq(0).click();
    cy.get('[data-cy=buyer-modal-view-btn]').click();
    cy.wait(2000);
    cy.get('xdc-document-card-set mat-card')
      .find('h4')
      .should('have.length', 3)
      .each(counter => {
        cy.wrap(counter)
          .should('be.visible')
          .invoke('text')
          .then(text => {
            const counter = parseInt(
              text.replace('Pending', '').replace('Research', '').replace('Customers', '').trim()
            );
            expect(counter).to.be.at.least(0);
          });
      });
  });

  it('should be displaying Pending, Research and Customers counter', () => {
    cy.visit('queue');
    cy.wait(2000);
    cy.get('mat-option').eq(0).click();
    cy.get('[data-cy=buyer-modal-view-btn]').click();
    cy.wait(200);

    cy.get('xdc-document-card-set mat-card')
      .find('p')
      .should('have.length', 3)
      .each(counter => {
        cy.wrap(counter)
          .should('be.visible')
          .invoke('text')
          .then(text => {
            cy.wrap(text).should(value => {
              expect(value).to.be.oneOf(['Pending', 'Research', 'Customers']);
            });
          });
      });
  });
});
