import { NetworkRequestKeys } from '../../network-request-keys';
import { getGuid } from '../indexing/helpers';
import {
  customerAccountInputSelector,
  autoCompleteOptionSelector,
  createNewAccountSelector,
  customerAccountNumberInputSelector,
  paymentTermsInputSelector,
  autoCompleteResultsSelector,
  customerAccountTextSelector,
  shipToInputSelector,
  supplierEditSelector,
  supplierInputSelector,
  customerAccountEditSelector,
  shipToEditSelector,
} from '../indexing/selectors';
import { MotherloadHelpers } from './motherload.helpers';

describe('The Motherload Test for a Customer', () => {
  const newGuid = getGuid();

  before(() => {
    cy.saveLocalStorage();
    MotherloadHelpers.retry = 0;
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
    cy.intercept('**/user/*').as(NetworkRequestKeys.getDocumentData.interceptAlias);
  });

  it('01-navigate to my uploads queue & upload document to api', () => {
    cy.visit('my-uploads');

    cy.get('[type="file"]').attachFile({
      filePath: 'motherload.pdf',
      fileName: `motherload-${newGuid}.pdf`,
    });
    cy.get('[data-cy=my-uploads-grid]').contains(`motherload-${newGuid}.pdf`).should('be.visible');
    cy.contains('Processing').should('be.visible');

    cy.then(() => cy.wrap(MotherloadHelpers.openDocument('uploads-queue', newGuid)));

    cy.get(supplierEditSelector).click();
    cy.get(supplierInputSelector).type('irene');
    cy.get(autoCompleteResultsSelector, { timeout: 10000 }).should('be.visible');
    cy.contains('00Irene', { timeout: 30000 }).click();

    cy.wait(200);

    const randomNum = Math.floor(100000 + Math.random() * 900000);

    cy.get(customerAccountEditSelector).click();
    cy.get(customerAccountInputSelector).type('{downarrow}');
    cy.get(autoCompleteOptionSelector).get(createNewAccountSelector).click();
    cy.get(customerAccountNumberInputSelector).type(`cy${randomNum}`);
    cy.get(paymentTermsInputSelector).type('{downarrow}');
    cy.get(autoCompleteResultsSelector).should('be.visible');
    cy.get(autoCompleteOptionSelector).first().click();
    cy.wait(200);
    cy.contains('Confirm').click();
    cy.wait(200);
    cy.get(customerAccountTextSelector).contains(`cy${randomNum}`);

    cy.get('body').click();
    cy.get(shipToEditSelector).click();
    cy.get(shipToInputSelector).type('AvidInbox');
    cy.get(autoCompleteResultsSelector).should('be.visible');
    cy.contains('AvidInbox Property', { timeout: 30000 }).click();
    cy.wait(200);

    cy.get('#edit-InvoiceNumber').click();
    cy.wait(200);
    cy.get('.text-input').type('motherload');
    cy.get('body').click();
    cy.get('#edit-InvoiceDate').click();
    cy.wait(200);
    cy.get('.text-input').type('01/22/22');
    cy.get('body').click();
    cy.get('#edit-InvoiceAmount').click();
    cy.wait(200);
    cy.get('.text-input').type('100');
    cy.get('body').click();

    cy.contains('Mark As').click();
    cy.wait(300);
    cy.contains('Supplier Research').click({ force: true });

    cy.get('#selection-comment').type('Cypress Customer Test');

    cy.contains('Done').click({ force: true });

    cy.get('.success');
  });

  it('02-navigate to research queue, advance search for document & open document, then mark as recycle bin escalation', () => {
    cy.visit('research');
    MotherloadHelpers.advanceFilter('research', newGuid);
    MotherloadHelpers.openDocument('research', newGuid);

    cy.contains('More actions').click();
    cy.wait(300);
    cy.contains('Delete document').click({ force: true });

    cy.get('.mat-mdc-option').contains('Other').click();

    cy.get('#selection-comment').type('Test');

    cy.contains('Done').click({ force: true });

    cy.get('.success');
  });

  it('03-navigate to recycle bin queue, advance search for document & open document, then change invoice # & submit', () => {
    cy.visit('recyclebin');
    MotherloadHelpers.advanceFilter('recycleBin', newGuid);
    MotherloadHelpers.openDocument('recyclebin', newGuid);

    cy.get('#edit-InvoiceNumber').click();
    cy.get('.text-input').type(`motherload-${newGuid}`);
    cy.wait(1000); // delay for submit button to enable
    cy.contains('Submit').should('not.be.disabled');
    cy.contains('Submit').click();
    cy.get('.success');
  });

  it('04-navigate to archive queue, advance search for document and then open up the archived document', () => {
    cy.visit('archive');
    MotherloadHelpers.advanceFilter('archive', newGuid);
    MotherloadHelpers.openDocument('archive', newGuid);
  });

  it('05-validate document exists in avidinvoice', () => {
    MotherloadHelpers.checkAvidInvoice(false, `motherload-${newGuid}`, 'RKYEDLPPA', 1);
  });
});
