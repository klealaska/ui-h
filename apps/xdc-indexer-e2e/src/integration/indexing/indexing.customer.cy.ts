import { NetworkRequestKeys } from '../../network-request-keys';
import { getGuid, navigateToDocument, setLookupFieldData, setupLookupFixtures } from './helpers';

describe('Indexing Page Test for a Customer', () => {
  const newGuid = getGuid();
  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
  });

  // describe('Data Association', () => {
  //   beforeEach(() => {
  //     navigateToDocument();
  //     cy.wait(NetworkRequestKeys.getDocumentPDF.waitAlias);
  //     cy.wait(300);
  //   });

  //   it('should associate single data point from the canvas', () => {
  //     cy.get('.ol-unselectable', { timeout: 5000 }).trigger('pointerdown', {
  //       x: 350,
  //       y: 130,
  //       isPrimary: true,
  //     });

  //     cy.get('.xdc-textfield').contains('Invoice Number');
  //     cy.get('.xdc-textfield').contains('Invoice Number').click();
  //     cy.wait(300); // there's a slight delay for the data to populate the field
  //     cy.get('.xdc-textfield')
  //       .contains('Invoice Number')
  //       .parents('xdc-non-lookup-field')
  //       .find('.xdc-field-value')
  //       .contains('www.shi.com/W9');
  //   });

  //   it('should associate multiple data points from the canvas', () => {
  //     cy.get('.ol-unselectable', { timeout: 5000 })
  //       .trigger('pointerdown', {
  //         x: 350,
  //         y: 130,
  //         isPrimary: true,
  //       })
  //       .trigger('pointerdown', {
  //         x: 320,
  //         y: 130,
  //         isPrimary: true,
  //       });

  //     cy.get('.xdc-textfield').contains('Purchase Order Number').click();
  //     cy.wait(300); // there's a slight delay for the data to populate the field
  //     cy.get('.xdc-textfield')
  //       .contains('Purchase Order Number')
  //       .parents('xdc-non-lookup-field')
  //       .find('.xdc-field-value')
  //       .contains('Form, www.shi.com/W9');
  //   });
  // });

  // describe('Submit Action', () => {
  //   beforeEach(() => {
  //     setupLookupFixtures();
  //     navigateToDocument();
  //     setLookupFieldData();
  //   });

  //   it('should show success toast on submit success', () => {
  //     cy.intercept('PUT', '/api/indexed/submit', { statusCode: 202 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Submit').click();
  //     cy.get('.toast-success');
  //   });

  //   it('should show error toast on submit failure', () => {
  //     cy.intercept('PUT', '/api/indexed/submit', { statusCode: 500 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Submit').click();
  //     // hack, for some reason the error toast only shows when the mouse is hovered over or active on the page
  //     //  weird that save doesn't also have this issue
  //     cy.get('body').click();

  //     cy.get('.toast-error');
  //   });
  // });

  // describe('Duplicate Detection', () => {
  //   beforeEach(() => {
  //     setupLookupFixtures();
  //     navigateToDocument();
  //     setLookupFieldData();
  //   });

  //   it('should show duplicate detected on submit', () => {
  //     cy.intercept('POST', '/api/indexed/submit', { statusCode: 400 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Submit').click();
  //     cy.contains('Duplicate Detected');
  //   });

  //   it('should close modal when go back is clicked', () => {
  //     cy.intercept('POST', '/api/indexed/submit', { statusCode: 400 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Submit').click();
  //     cy.contains('Go Back').click();
  //     cy.get('[data-cy=duplicate-detection-modal]').should('not.exist');
  //   });

  //   it('should mark as duplicate', () => {
  //     cy.intercept('POST', '/api/indexed/submit', { statusCode: 400 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Submit').click();

  //     cy.intercept('PUT', '/api/indexed/escalation', { statusCode: 202 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Mark As Duplicate').click();
  //     cy.get('.toast-success');
  //   });
  // });

  // describe('Auto Load Next', () => {
  //   beforeEach(() => {
  //     cy.intercept('PUT', '/api/indexed/submit', { statusCode: 202 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     setupLookupFixtures();
  //     navigateToDocument();
  //     setLookupFieldData();
  //   });

  //   it('should navigate to next invoice in queue', () => {
  //     cy.intercept('POST', '/api/search/document/next/TestXDCClerk', {
  //       statusCode: 200,
  //       fixture: 'composite-document.json',
  //     }).as(NetworkRequestKeys.getNextDocument.interceptAlias);

  //     cy.contains('Submit').click();

  //     cy.location('pathname').should('eq', '/indexing/682219b6-9e67-4705-8fb3-62e63b668b23');
  //   });

  //   it('should navigate to queue when no invoices left', () => {
  //     cy.intercept('POST', '/api/search/document/next/TestXDCClerk', { statusCode: 404 }).as(
  //       NetworkRequestKeys.getNextDocument.interceptAlias
  //     );

  //     cy.contains('Submit').click();

  //     cy.location('pathname').should('eq', '/queue');
  //     cy.get('.toast-warning');
  //     cy.get('.toast-warning').should('contain.text', 'There are no more invoices to index.');
  //   });
  // });

  // describe('Mark As Action', () => {
  //   it('should mark as and save successfully', () => {
  //     setupLookupFixtures();
  //     navigateToDocument();
  //     setLookupFieldData();

  //     cy.intercept('PUT', '/api/indexed/escalation', { statusCode: 202 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Mark As').click();
  //     cy.wait(300);
  //     cy.contains('Image Issue').click({ force: true });

  //     cy.get('.mat-mdc-option').contains('Other').click();

  //     cy.get('#selection-comment').type('Test');

  //     cy.contains('Done').click({ force: true });

  //     cy.get('.toast-success');
  //   });

  //   it('should show indexer qa modal when indexer qa option selected and save invoice', () => {
  //     navigateToDocument();

  //     cy.intercept('PUT', '/api/indexed/escalation', { statusCode: 202 }).as(
  //       NetworkRequestKeys.submitAction.interceptAlias
  //     );

  //     cy.contains('Mark As').click();
  //     cy.wait(300);
  //     cy.contains('Indexer QA').click({ force: true });

  //     cy.get('.mat-mdc-option').contains('Supplier Field').click();

  //     cy.get('#selection-comment').type('Test');

  //     cy.contains('Done').click({ force: true });

  //     cy.get('.toast-success');
  //   });
  // });

  // describe('Indexing Page', () => {
  //   beforeEach(() => navigateToDocument());
  //   // disabling due to not working on build
  //   // it('should load pdf from fileservice', () => {
  //   //   cy.intercept('file').as(NetworkRequestKeys.getDocumentPDF.interceptAlias);

  //   //   navigateToDocument();

  //   //   cy.wait(NetworkRequestKeys.getDocumentPDF.waitAlias, { timeout: 10000 }).then(response => {
  //   //     expect(response.response.statusCode).to.equal(200);
  //   //   });
  //   // });

  //   it('should render a canvas', () => cy.get('canvas').should('be.visible'));

  //   it('should be displaying the Indexing page.', () => cy.url().should('include', '/indexing'));
  // });

  // describe('Form Fields', () => {
  //   beforeEach(() => navigateToDocument());

  //   it('should show additional utility fields when utility selected', () => {
  //     cy.get('mat-form-field mat-select').click();

  //     cy.get('.mat-mdc-option').contains('Utility').click();

  //     cy.get('.xdc-textfield').contains('Service Start Date').should('be.visible');
  //     cy.get('.xdc-textfield').contains('Service End Date').should('be.visible');
  //     cy.get('.xdc-textfield').contains('Previous Unpaid Balance').should('be.visible');
  //   });
  // });

  // describe('Indexing Command Bar', () => {
  //   before(() => navigateToDocument());

  //   it('should keep menu panel opened whe toggle  menu option is clicked and change toggle value', () => {
  //     cy.get('[data-cy=command-bar-menu]').click();
  //     // toggle should be false by default
  //     cy.get('.mat-menu-panel').should('be.visible');
  //     cy.get('.mat-menu-panel')
  //       .find('button:first-child')
  //       .find('.mat-slide-toggle-label input')
  //       .should('not.have.attr', 'checked');

  //     cy.get('.mat-menu-panel').find('button:first-child').find('.mat-slide-toggle-label').click();

  //     // toggle should be checked once slide-toggle is clicked
  //     cy.get('.mat-menu-panel')
  //       .find('button:first-child')
  //       .find('.mat-slide-toggle-label input')
  //       .should('have.checked');
  //     cy.get('.mat-menu-panel').should('be.visible');
  //   });

  //   it('should close once page is clicked', () => {
  //     cy.get('body').click();

  //     cy.get('.mat-menu-panel').should('not.be.visible');
  //   });
  // });

  describe('Save', () => {
    beforeEach(() => {
      setupLookupFixtures();
      navigateToDocument();
      setLookupFieldData();
    });

    it('should show success toast on save success', () => {
      cy.intercept('PUT', '/api/indexed', { statusCode: 202 }).as(
        NetworkRequestKeys.saveAction.interceptAlias
      );

      cy.contains('Save').click();
      cy.get('.success');
    });
  });

  describe('Get Previous document', () => {
    beforeEach(() => {
      cy.visit('my-uploads');
    });

    describe('When the user open the first document on the list and clicks on get previous document', () => {
      it('should gets a warning toast message', () => {
        cy.get('[data-cy=my-uploads-grid] ax-table ax-link')
          .find('a')
          .first()
          .click({ force: true });
        cy.contains('Previous document').click();
        cy.get('.warning');
      });
    });

    describe('When the user open a document of  middle of the list and clicks on get previous document', () => {
      it('should gets the previous document', () => {
        cy.get('[data-cy=my-uploads-grid] ax-table ax-link').find('a').eq(1).click({ force: true });
        cy.contains('Previous document').click();
        cy.location('pathname').should('contain', '/indexing');
      });
    });
  });

  describe('Get Next Document', () => {
    beforeEach(() => {
      cy.visit('my-uploads');

      cy.intercept(
        'POST',
        `${Cypress.env('API_SERVER')}/v1/avidcaptureapi/api/search/bulkaggregate`,
        req => {
          req.continue(res => {
            const modifiedResponse = [
              {
                isSubmitted: '0',
                queue: '422',
              },
              {
                isSubmitted: '0',
                research: '32',
              },
              {
                isSubmitted: '0',
                recyclebin: '1',
              },
              {
                isSubmitted: '0',
                'my-uploads': '2',
              },
            ];
            res.send(modifiedResponse);
          });
        }
      );

      cy.intercept('POST', `${Cypress.env('API_SERVER')}/v1/avidcaptureapi/api/search`, req => {
        req.continue(res => {
          const originalResponse = res.body;
          const modifiedResponse = [originalResponse[0], originalResponse[1]];
          res.send(modifiedResponse);
        });
      });
    });

    describe('When the user open the first document on the list and clicks on get next document', () => {
      it('should gets the next document', () => {
        cy.get('[data-cy=my-uploads-grid] ax-table ax-link')
          .find('a')
          .first()
          .click({ force: true });
        cy.contains('Next document').click();
        cy.location('pathname').should('contain', '/indexing');
      });
    });

    describe('When the user open the last document of the list and clicks on get next document', () => {
      it('should gets a warning toast message', () => {
        cy.get('[data-cy=my-uploads-grid] ax-table ax-link')
          .find('a')
          .last()
          .click({ force: true });
        cy.contains('Next document').click();
        cy.get('.warning');
      });
    });
  });

  describe('Duplicate Detection Override', () => {
    beforeEach(() => {
      cy.visit('my-uploads');
      cy.get('[data-cy=my-uploads-grid] ax-table ax-link').find('a').first().click({ force: true });

      cy.wait(2000);
      setLookupFieldData();

      cy.get('#edit-InvoiceNumber').click();
      cy.get('.text-input').type('motherload');

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
    });
  });

  describe('Swap document', () => {
    beforeEach(() => {
      cy.visit('my-uploads');
      cy.get('[data-cy=my-uploads-grid] ax-table ax-link').find('a').first().click({ force: true });
    });

    it('Should swap a document', () => {
      cy.contains('More actions').click();
      cy.contains('Swap document').click();
      cy.get('xdc-document-swap').should('be.visible');
      cy.get('[type="file"]').attachFile({
        filePath: 'motherload.pdf',
        fileName: `motherload-${newGuid}.pdf`,
      });
      cy.wait(2000);
      cy.get('xdc-document-swap').should('not.exist');
    });
  });
});
