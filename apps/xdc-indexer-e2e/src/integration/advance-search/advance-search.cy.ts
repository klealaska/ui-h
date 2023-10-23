import { getGuid } from '../indexing/helpers';
import { MotherloadHelpers } from '../e2e/motherload.helpers';
import { NetworkRequestKeys } from '../../network-request-keys';
import {
  supplierEditSelector,
  customerAccountEditSelector,
  shipToEditSelector,
} from '../indexing/selectors';

describe('Advance Search validation test', () => {
  const newGuid = getGuid();
  let supplier;
  let customerAccount;
  let shipTo;
  const invoiceNumber = 'motherload';
  before(() => {
    cy.saveLocalStorage();
    MotherloadHelpers.retry = 0;
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
    cy.intercept('**/user/*').as(NetworkRequestKeys.getDocumentData.interceptAlias);
  });

  it('01- Navigate to my uploads queue & upload document to api', () => {
    cy.visit('my-uploads');

    cy.get('[type="file"]').attachFile({
      filePath: 'motherload.pdf',
      fileName: `motherload-${newGuid}.pdf`,
    });
    cy.wait(2000);
    cy.get('[data-cy=my-uploads-grid]').contains(`motherload-${newGuid}.pdf`).should('be.visible');

    cy.then(() => cy.wrap(MotherloadHelpers.openDocument('uploads-queue', newGuid)));

    cy.wait(200);

    cy.get(supplierEditSelector).click();
    cy.wait(2000);
    cy.get('mat-option').eq(0).click();
    cy.get(supplierEditSelector).click();
    cy.get('input[type="text"]')
      .invoke('val')
      .then(value => {
        supplier = value;
      });
    cy.get('body').click();

    cy.get(customerAccountEditSelector).click();
    cy.wait(2000);
    cy.get('mat-option').eq(0).click();
    cy.get(customerAccountEditSelector).click();
    cy.get('input[type="text"]')
      .invoke('val')
      .then(value => {
        customerAccount = value;
      });
    cy.get('body').click();

    cy.get(shipToEditSelector).click();
    cy.wait(2000);
    cy.get('mat-option').eq(0).click();
    cy.get(shipToEditSelector).click();
    cy.get('input[type="text"]')
      .invoke('val')
      .then(value => {
        shipTo = value;
      });
    cy.get('body').click();

    cy.get('#edit-InvoiceNumber').click();
    cy.get('.text-input').type(invoiceNumber);

    cy.contains('Mark As').click();
    cy.wait(300);
    cy.contains('Supplier Research').click({ force: true });
    cy.get('#selection-comment').type('Cypress Customer Test');
    cy.contains('Done').click({ force: true });
    cy.get('.success');
  });

  it('03- Navigate to research queue, and filter by all the data filled out before ', () => {
    cy.visit('research');
    cy.contains('Delivery date').click();
    cy.get('[data-cy=research-filter-button]').click();

    cy.get('[data-cy=filter-supplier-input]').type(supplier);
    cy.get('[data-cy=filter-shipto-input]').type(shipTo);
    cy.get('[data-cy=filter-invoicenumber-input]').type(invoiceNumber);
    cy.get('[data-cy=filter-filename-input]').type(`motherload-${newGuid}`);
    cy.get('[data-cy=exception-type-list]').click();
    cy.get('mat-option').eq(4).click();
    cy.get('body').click();

    cy.get('[data-cy=filter-apply-button]').click();
    cy.wait(2000);
    cy.get('[data-cy=research-queue-grid]')
      .get('ax-table ax-link a', { timeout: 3000 })
      .should('have.length.at.least', 1);
  });

  it('04- Navigate to research queue, fill out all the filters and reset the filters ', () => {
    cy.visit('research');
    cy.contains('Delivery date').click();
    cy.get('[data-cy=research-filter-button]').click();

    cy.get('[data-cy=filter-supplier-input]').type(supplier);
    cy.get('[data-cy=filter-shipto-input]').type(shipTo);
    cy.get('[data-cy=filter-invoicenumber-input]').type(invoiceNumber);
    cy.get('[data-cy=filter-filename-input]').type(`motherload-${newGuid}`);
    cy.get('[data-cy=filter-senderemail-input]').type(`senderEmail`);
    cy.get('[data-cy=exception-type-list]').click();
    cy.get('mat-option').eq(0).click();
    cy.get('mat-option').eq(1).click();
    cy.get('mat-option').eq(2).click();
    cy.get('body').click();

    cy.get('[data-cy=filter-apply-button]').click();

    cy.get('[data-cy=research-filter-button]').click();
    cy.get('[data-cy=filter-reset-button]').click();
    cy.get('[data-cy=filter-supplier-input]').should('have.value', '');
    cy.get('[data-cy=filter-shipto-input]').should('have.value', '');
    cy.get('[data-cy=filter-invoicenumber-input]').should('have.value', '');
    cy.get('[data-cy=filter-filename-input]').should('have.value', '');
    cy.get('[data-cy=exception-type-list]').should('have.value', '');
  });
});
