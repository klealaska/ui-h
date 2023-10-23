import { NetworkRequestKeys } from '../../network-request-keys';

export class MotherloadHelpers {
  static retry = 0;
  static avidInvoiceRetry = 0;

  // TODO : try to search off of every field
  static advanceFilter = (queueName: string, newGuid: string) => {
    cy.get(`[data-cy=${queueName}-filter-button]`).click();

    cy.get('[data-cy=filter-filename-input]').type(`motherload-${newGuid}`);

    cy.get('[data-cy=filter-apply-button]').click();
  };

  static openDocument = (queueName: string, newGuid: string) => {
    if (
      MotherloadHelpers.retry < 15 &&
      Cypress.$(`a:contains('motherload-${newGuid}.pdf')`).length === 0
    ) {
      MotherloadHelpers.retry++;

      cy.wait(10000);

      if (queueName !== 'uploads-queue') {
        cy.get(`[data-cy=${queueName}-refresh-button]`).click();
      }

      cy.then(() => {
        cy.wrap(MotherloadHelpers.openDocument(queueName, newGuid));
      });
    } else if (
      MotherloadHelpers.retry < 15 &&
      Cypress.$(`a:contains('motherload-${newGuid}.pdf')`).length === 1
    ) {
      cy.contains(`motherload-${newGuid}.pdf`).click({ force: true });
      if (queueName !== 'archive') {
        cy.wait(NetworkRequestKeys.getDocumentData.waitAlias);
      }
      MotherloadHelpers.retry = 0;
    }
  };

  static checkAvidInvoice = (
    result: boolean,
    invoiceNumber: string,
    registrationCode: string,
    buyerId: number
  ) => {
    const accessToken = JSON.parse(window.sessionStorage.getItem('tokens')).access_token;

    if (MotherloadHelpers.avidInvoiceRetry < 15 && !result) {
      MotherloadHelpers.avidInvoiceRetry++;

      cy.wait(15000);

      cy.request({
        method: 'GET',
        url: `${Cypress.env(
          'avidbillproxyurl'
        )}/GetDuplicateInvoiceGuid?invoiceNo=${invoiceNumber}&registrationCode=${registrationCode}&buyerId=${buyerId}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(response => {
        MotherloadHelpers.checkAvidInvoice(
          response.status === 200,
          invoiceNumber,
          registrationCode,
          buyerId
        );
      });
    } else if (MotherloadHelpers.avidInvoiceRetry < 15 && result) {
      MotherloadHelpers.avidInvoiceRetry = 0;
    }
    return;
  };

  static batchSelectRow = (newGuid: string) => {
    if (MotherloadHelpers.retry < 15 && Cypress.$(`td:contains('Processing')`).length === 1) {
      MotherloadHelpers.retry++;

      cy.wait(10000);

      cy.then(() => {
        cy.wrap(MotherloadHelpers.batchSelectRow(newGuid));
      });
    } else if (
      MotherloadHelpers.retry < 15 &&
      Cypress.$(`td:contains('Processing')`).length === 0
    ) {
      cy.get('[data-cy=uploads-queue-search-bar]').type(`motherload-${newGuid}.pdf`);
      cy.wait(5000);

      cy.get('[data-cy=uploads-queue-header-checkbox]')
        .get('[type="checkbox"]')
        .check({ force: true });

      MotherloadHelpers.retry = 0;
    }
  };

  static batchSelectAllRows = () => {
    if (MotherloadHelpers.retry < 15 && Cypress.$(`td:contains('Processing')`).length > 0) {
      MotherloadHelpers.retry++;

      cy.wait(10000);

      cy.then(() => {
        cy.wrap(MotherloadHelpers.batchSelectAllRows());
      });
    } else if (
      MotherloadHelpers.retry < 15 &&
      Cypress.$(`td:contains('Processing')`).length === 0
    ) {
      cy.get('[data-cy=uploads-queue-header-checkbox]')
        .get('[type="checkbox"]')
        .check({ force: true });

      MotherloadHelpers.retry = 0;
    }
  };
}
