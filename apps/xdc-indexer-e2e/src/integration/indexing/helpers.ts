/* eslint-disable @typescript-eslint/no-explicit-any */
import { NetworkRequestKeys } from '../../network-request-keys';
import {
  supplierEditSelector,
  autoCompleteResultsSelector,
  autoCompleteOptionSelector,
  shipToEditSelector,
  customerAccountEditSelector,
} from './selectors';

export function getGuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const newDocGuid: string = getGuid();

export function navigateToDocument(indexer = false): void {
  cy.visit('queue');
  const compositeDocument = indexer ? 'composite-document-indexer' : 'composite-document';
  cy.fixture(`${compositeDocument}`).then(fixture => {
    cy.intercept('**/user/*', fixture).as(NetworkRequestKeys.getDocumentData.interceptAlias);
  });

  cy.fixture('test-pdf.pdf').then(fixture => {
    cy.intercept('/api/file/*', fixture).as(NetworkRequestKeys.getDocumentPDF.interceptAlias);
  });

  cy.visit(`/indexing/${newDocGuid}`);
}

export function createDocument(): void {
  cy.fixture('indexingUnit').as('indexingUnit');

  cy.get('@indexingUnit').then((myFixture: any) => {
    myFixture.indexed.documentId = newDocGuid;
    myFixture.unindexed.documentId = newDocGuid;
    myFixture.indexed.dateReceived = new Date();
    myFixture.unindexed.dateReceived = new Date();
    myFixture.indexed.lastModified = new Date();
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_SERVER')}api/indexingunit`,
      body: myFixture,
    });
  });
}

export function setupLookupFixtures(getSingleCustAccount = false, newAccount = false): void {
  cy.fixture('suppliers').then(fixture => {
    cy.intercept('/api/avidbill/getvendors**', fixture).as(
      NetworkRequestKeys.getSuppliers.interceptAlias
    );
  });

  cy.fixture('properties').then(fixture =>
    cy
      .intercept('/api/avidbill/getproperties**', fixture)
      .as(NetworkRequestKeys.getProperties.interceptAlias)
  );

  cy.fixture('customer-accounts').then((fixture: any) => {
    if (getSingleCustAccount) {
      fixture.records = fixture.records.slice(2, 3);
      fixture.count = 1;
    } else if (newAccount) {
      fixture.records = [];
      fixture.count = 0;
    }
    cy.intercept('/api/avidbill/getvendoraccounts**', fixture).as(
      NetworkRequestKeys.getCustomerAccounts.interceptAlias
    );
  });
}

export function setLookupFieldData(): void {
  cy.get(supplierEditSelector).click();
  cy.get(autoCompleteResultsSelector).should('be.visible');
  cy.get(autoCompleteOptionSelector).first().click();

  cy.get(customerAccountEditSelector).click();
  cy.get(autoCompleteResultsSelector).should('be.visible');
  cy.get(autoCompleteOptionSelector).first().click();

  cy.get('body').click();
  cy.get(shipToEditSelector).click();
  cy.get(autoCompleteResultsSelector).should('be.visible');
  cy.get(autoCompleteOptionSelector).first().click();
}
