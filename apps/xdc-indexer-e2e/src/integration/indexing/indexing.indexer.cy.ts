import { NetworkRequestKeys } from '../../network-request-keys';
import { getGuid, navigateToDocument, setLookupFieldData, setupLookupFixtures } from './helpers';

describe('Indexing Page Test for an Indexer', () => {
  const newGuid = getGuid();
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('suUsername'));
    cy.restoreLocalStorage();
    cy.fixture('composite-document-indexer').then(fixture => {
      fixture.userLock.indexer = Cypress.env('suUsername');
      cy.intercept('**/user/*', fixture).as(NetworkRequestKeys.getDocumentData.interceptAlias);
    });
    cy.fixture('queue-search').then(fixture => {
      cy.intercept('search', fixture).as(NetworkRequestKeys.search.interceptAlias);
    });
  });

  it('should navigate to the indexing page when a grid link is clicked', () => {
    cy.visit('queue');
    cy.selectBuyer();
    cy.wait(NetworkRequestKeys.search.waitAlias);

    cy.get('.queue-container')
      .get('ax-table ax-link a', { timeout: 3000 })
      .not('.ax-link-disabled')
      .first()
      .click({ force: true });

    cy.url().should('include', '/indexing');
  });

  describe('Data Association', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      setupLookupFixtures();
      navigateToDocument(true);
      // cy.wait(NetworkRequestKeys.getDocumentPDF.waitAlias);

      cy.wait(300);
    });

    it('should associate single data point from the canvas', () => {
      cy.get('.ol-unselectable', { timeout: 5000 }).trigger('pointerdown', {
        x: 350,
        y: 130,
        isPrimary: true,
      });

      cy.get('.xdc-textfield').contains('Invoice Number').click();
      cy.wait(300); // there's a slight delay for the data to populate the field
      cy.get('.xdc-textfield')
        .contains('Invoice Number')
        .parents('xdc-non-lookup-field')
        .find('.xdc-field-value')
        .contains('www.shi.com/W9');
    });

    it('should associate multiple data points from the canvas', () => {
      cy.get('.ol-unselectable', { timeout: 5000 }).trigger('pointerdown', {
        x: 350,
        y: 130,
        isPrimary: true,
      });
      cy.get('.ol-unselectable', { timeout: 5000 }).trigger('pointerdown', {
        x: 320,
        y: 130,
        isPrimary: true,
      });

      cy.get('.xdc-textfield').contains('Purchase Order Number').click();
      cy.wait(300); // there's a slight delay for the data to populate the field
      cy.get('.xdc-textfield')
        .contains('Purchase Order Number')
        .parents('xdc-non-lookup-field')
        .find('.xdc-field-value')
        .contains('Form, www.shi.com/W9');
    });
  });

  describe('Submit Action', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      setupLookupFixtures();
      navigateToDocument(true);
      setLookupFieldData();

      cy.get('#edit-InvoiceNumber').click();
      cy.get('.text-input').type(newGuid);

      cy.get('#edit-InvoiceDate').click();
      cy.get('.text-input').type('02/02/2022');

      cy.get('#edit-InvoiceAmount').click();
      cy.get('.text-input').type('365.00');
      cy.get('body').click();
    });

    it('should show success toast on submit success', () => {
      cy.intercept('PUT', `${Cypress.env('API_SERVER')}/v1/avidcaptureapi/api/indexed/submit`, {
        statusCode: 202,
      }).as(NetworkRequestKeys.submitAction.interceptAlias);
      cy.contains('Submit').click();
      cy.get('.success');
    });

    it('should show error toast on submit failure', () => {
      cy.intercept('PUT', `${Cypress.env('API_SERVER')}/v1/avidcaptureapi/api/indexed/submit`, {
        statusCode: 500,
      }).as(NetworkRequestKeys.submitAction.interceptAlias);
      cy.contains('Submit').click();

      cy.get('.critical');
    });
  });

  describe('Duplicate Detection ', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      setupLookupFixtures();
      navigateToDocument(true);
      setLookupFieldData();

      cy.get('#edit-InvoiceNumber').click();
      cy.get('.text-input').type(newGuid);

      cy.get('#edit-InvoiceDate').click();
      cy.get('.text-input').type('02/02/2022');

      cy.get('#edit-InvoiceAmount').click();
      cy.get('.text-input').type('365.00');
      cy.get('body').click();

      cy.intercept('PUT', `${Cypress.env('API_SERVER')}/v1/avidcaptureapi/api/indexed/submit`, {
        statusCode: 406,
        body: {
          documentId: 'document-id-mock',
          sourceDocumentId: null,
          reason: 'Duplicate detected',
          invoiceNumber: 'motherload',
        },
      }).as(NetworkRequestKeys.submitAction.interceptAlias);
    });

    it('should show duplicate detected on submit and go back', () => {
      cy.contains('Submit').click();
      cy.get('xdc-duplicate-detection').should('be.visible');
      cy.contains('Duplicate detected');
      cy.contains('Go back').click();
    });

    it('should mark as duplicate on submit and click on accept Duplicate', () => {
      cy.contains('Submit').click();
      cy.get('xdc-duplicate-detection').should('be.visible');
      cy.contains('Duplicate detected');
      cy.contains('Mark as duplicate').click();
      cy.get('.success');
    });
  });

  describe('Auto Load Next', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      setupLookupFixtures();
      navigateToDocument(true);
      setLookupFieldData();

      cy.get('#edit-InvoiceNumber').click();
      cy.get('.text-input').type(newGuid);

      cy.get('#edit-InvoiceDate').click();
      cy.get('.text-input').type('02/02/2022');

      cy.get('#edit-InvoiceAmount').click();
      cy.get('.text-input').type('365.00');
      cy.get('body').click();

      cy.intercept('PUT', `${Cypress.env('API_SERVER')}/v1/avidcaptureapi/api/indexed/submit`, {
        statusCode: 202,
      }).as(NetworkRequestKeys.submitAction.interceptAlias);
    });

    it('should navigate to next invoice in queue', () => {
      cy.intercept(
        'POST',
        `${Cypress.env(
          'API_SERVER'
        )}/v1/avidcaptureapi/api/search/document/next/e03ef969ce4bab1dc03eb88bfcdfa1c4-PERF`,
        {
          statusCode: 200,
          fixture: 'composite-document-indexer.json',
        }
      ).as(NetworkRequestKeys.getNextDocument.interceptAlias);

      cy.contains('Submit').click();
      cy.get('.success');
      cy.location('pathname').should('eq', '/indexing/93b38ff7-9509-471c-9153-12bcd7e4dbb5');
    });

    it('should navigate to queue when no invoices left', () => {
      cy.intercept(
        'POST',
        `${Cypress.env(
          'API_SERVER'
        )}/v1/avidcaptureapi/api/search/document/next/e03ef969ce4bab1dc03eb88bfcdfa1c4-PERF`,
        {
          statusCode: 404,
        }
      ).as(NetworkRequestKeys.getNextDocument.interceptAlias);

      cy.contains('Submit').click();

      cy.location('pathname').should('eq', '/queue');
      cy.get('.warning');
    });
  });

  describe('Mark As Action', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      setupLookupFixtures();
      navigateToDocument(true);
    });

    it('should mark as and save successfully', () => {
      cy.intercept('PUT', `${Cypress.env('API_SERVER')}v1/avidcaptureapi/api/indexed/escalation`, {
        statusCode: 202,
      }).as(NetworkRequestKeys.submitAction.interceptAlias);

      cy.contains('Mark As').click();
      cy.wait(300);
      cy.contains('Image Issue').click({ force: true });

      cy.get('.mat-mdc-option').contains('Other').click();

      cy.get('#selection-comment').type('Test');

      cy.contains('Done').click({ force: true });

      cy.get('.success');
    });

    it('should show indexer qa modal when indexer qa option selected and save invoice', () => {
      cy.intercept('PUT', `${Cypress.env('API_SERVER')}v1/avidcaptureapi/api/indexed/escalation`, {
        statusCode: 202,
      }).as(NetworkRequestKeys.submitAction.interceptAlias);
      cy.contains('Mark As').click();
      cy.wait(300);
      cy.contains('Indexer QA').click({ force: true });

      cy.get('.mat-mdc-option').contains('Supplier Field').click();

      cy.get('#selection-comment').type('Test');

      cy.contains('Done').click({ force: true });

      cy.get('.success');
    });
  });

  describe('Indexing Page', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      navigateToDocument(true);
      cy.wait(5000);
    });
    // disabling due to not working on build
    // it('should load pdf from fileservice', () => {
    //   cy.intercept('file').as(NetworkRequestKeys.getDocumentPDF.interceptAlias);

    //   navigateToDocument(true);

    //   cy.wait(NetworkRequestKeys.getDocumentPDF.waitAlias, { timeout: 10000 }).then(response => {
    //     expect(response.response.statusCode).to.equal(200);
    //   });
    // });

    it('should render a canvas', () => cy.get('canvas').should('be.visible'));

    it('should be displaying the Indexing page.', () => cy.url().should('include', '/indexing'));
  });

  describe('Form Fields', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      navigateToDocument(true);
    });

    it('should show additional utility fields when utility selected', () => {
      cy.get('mat-form-field mat-select').click();

      cy.get('.mat-mdc-option').contains('Utility').click();

      cy.get('.xdc-textfield').contains('Service Start Date').should('be.visible');
      cy.get('.xdc-textfield').contains('Service End Date').should('be.visible');
      cy.get('.xdc-textfield').contains('Previous Unpaid Balance').should('be.visible');
    });
  });

  describe('Indexing Command Bar', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      navigateToDocument(true);
    });

    it('should keep menu panel opened whe toggle  menu option is clicked and change toggle value', () => {
      cy.get('[data-cy=command-bar-menu]').click();

      cy.get('.mat-mdc-menu-panel').should('be.visible');

      cy.get('.mat-mdc-menu-panel ax-slide-toggle')
        .first()
        .find(' input')
        .should('not.have.attr', 'aria-checked');

      cy.get('.settings-container')
        .first()
        .get('ax-slide-toggle')
        .find('.switch')
        .should('exist')
        .invoke('click');

      cy.get('.mat-mdc-menu-panel').should('not.be.visible');

      cy.get('[data-cy=command-bar-menu]').click();

      cy.get('.mat-mdc-menu-panel ax-slide-toggle')
        .first()
        .find(' input')
        .should('have.attr', 'aria-checked', 'true');
    });
    it('should close once page is clicked', () => {
      cy.get('[data-cy=command-bar-menu]').click();
      cy.get('.mat-mdc-menu-panel').should('be.visible');
      cy.get('body').click();
      cy.get('.mat-mdc-menu-panel').should('not.be.visible');
    });
  });

  describe('Get Previous Document', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });
    describe('When the user open the first document on the list and clicks on get previous document', () => {
      it('should gets a warning toast message', () => {
        cy.get('.queue-container')
          .get('ax-table ax-link a', { timeout: 3000 })
          .first()
          .click({ force: true });
        cy.contains('Previous document').click();
        cy.get('.warning');
      });
    });

    describe('When the user open a document of  middle of the list and clicks on get previous document', () => {
      it('should gets the previous document', () => {
        cy.get('.queue-container')
          .get('ax-table ax-link a', { timeout: 3000 })
          .eq(1)
          .click({ force: true });
        cy.contains('Previous document').click();
        cy.location('pathname').should('contain', '/indexing');
      });
    });
  });

  describe('Get Next Document', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
    });
    describe('When the user open the first document on the list and clicks on get next document', () => {
      it('should gets the next document', () => {
        cy.get('.queue-container')
          .get('ax-table ax-link a', { timeout: 3000 })
          .first()
          .click({ force: true });
        cy.contains('Next document').click();
        cy.location('pathname').should('contain', '/indexing');
      });
    });

    describe('When the user open the last document of the list and clicks on get next document', () => {
      it('should gets a warning toast message', () => {
        cy.get('.queue-container')
          .get('ax-table ax-link a', { timeout: 3000 })
          .last()
          .click({ force: true });
        cy.contains('Next document').click();
        cy.location('pathname').should('contain', '/indexing');
      });
    });
  });

  describe('Swap document', () => {
    beforeEach(() => {
      cy.visit('queue');
      cy.selectBuyer();
      cy.wait(NetworkRequestKeys.search.waitAlias);
      cy.wait(1000);
      cy.get('.queue-container')
        .get('ax-table ax-link a', { timeout: 3000 })
        .first()
        .click({ force: true });
    });

    it('Should swap a document', () => {
      cy.contains('More actions').click();
      cy.contains('Swap document').click();
      cy.get('xdc-document-swap').should('be.visible');
      cy.get('[type="file"]').attachFile({
        filePath: 'motherload.pdf',
        fileName: `motherload-${newGuid}.pdf`,
      });
    });
  });
});
