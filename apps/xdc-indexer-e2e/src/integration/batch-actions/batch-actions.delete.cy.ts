import { NetworkRequestKeys } from '../../network-request-keys';
import { MotherloadHelpers } from '../e2e/motherload.helpers';
import { getGuid } from '../indexing/helpers';

describe('Batch delete', () => {
  const newGuid = getGuid();
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
    cy.intercept('**/user/*').as(NetworkRequestKeys.getDocumentData.interceptAlias);
  });

  it('01-navigate to my uploads queue & upload document to api & delete it using batch delete', () => {
    cy.visit('my-uploads');
    cy.get('[type="file"]').attachFile({
      filePath: 'motherload.pdf',
      fileName: `motherload-${newGuid}.pdf`,
    });
    cy.get('[data-cy=my-uploads-grid]').contains(`motherload-${newGuid}.pdf`).should('be.visible');
    cy.contains('Processing').should('be.visible');

    cy.then(() => cy.wrap(MotherloadHelpers.batchSelectRow(newGuid)));

    cy.get('[data-cy=batch-delete-button]').click({ force: true });

    cy.contains('Delete this item?').should('be.visible');
    cy.get('[data-cy=confirm-button]').click({ force: true });

    cy.get('.success');
  });

  it('02-navigate to recycle bin queue, advance search for document, & verify that the document was deleted by mass deletion', () => {
    cy.visit('recyclebin');
    MotherloadHelpers.advanceFilter('recycleBin', newGuid);
    MotherloadHelpers.openDocument('recyclebin', newGuid);

    cy.contains('Activity log', { matchCase: false }).click();
    cy.contains('Exception').should('be.visible');
    cy.get('[data-cy=escalation-reason]').contains('Recycle Bin').should('be.visible');
    cy.contains('span', 'Document deleted via mass deletion.').should('be.visible');
  });
});
