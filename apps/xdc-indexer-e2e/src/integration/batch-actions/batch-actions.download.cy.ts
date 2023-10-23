import path = require('path');
import { NetworkRequestKeys } from '../../network-request-keys';
import { MotherloadHelpers } from '../e2e/motherload.helpers';
import { getGuid } from '../indexing/helpers';

const validateZip = () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  const downloadedFilename = path.join(downloadsFolder, 'batchDownload.zip');

  cy.readFile(downloadedFilename, 'binary', { timeout: 5000 });
};

describe('Batch download', () => {
  const newGuid = getGuid();

  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
    cy.intercept('**/user/*').as(NetworkRequestKeys.getDocumentData.interceptAlias);
  });

  it('download a doc using the batch option', () => {
    cy.visit('my-uploads');
    cy.get('[type="file"]').attachFile({
      filePath: 'motherload.pdf',
      fileName: `motherload-${newGuid}.pdf`,
    });
    cy.get('[data-cy=my-uploads-grid]').contains(`motherload-${newGuid}.pdf`).should('be.visible');
    cy.contains('Processing').should('be.visible');

    cy.then(() => cy.wrap(MotherloadHelpers.batchSelectRow(newGuid)));

    cy.get('[data-cy=batch-download-button]').click({ force: true });

    cy.get('[data-cy=confirm-button]').click({ force: true });

    validateZip();
  });

  it('download should not be allowed when more than 10 rows are selected', () => {
    const files = [];

    for (let i = 0; i < 10; i++) {
      files.push({
        filePath: 'motherload.pdf',
        fileName: `motherload-${newGuid}.pdf`,
      });
    }
    cy.visit('my-uploads');
    cy.get('[type="file"]').attachFile(files);
    cy.get('[data-cy=my-uploads-grid]').contains(`motherload-${newGuid}.pdf`).should('be.visible');
    cy.contains('Processing').should('be.visible');

    cy.then(() => cy.wrap(MotherloadHelpers.batchSelectAllRows()));

    cy.get('[data-cy=batch-download-button]').should('be.disabled');
  });
});
