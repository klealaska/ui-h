import { navigateToDocument, setupLookupFixtures } from './helpers';
import {
  autoCompleteOptionSelector,
  autoCompleteResultsSelector,
  createNewAccountSelector,
  customerAccountEditSelector,
  customerAccountInputSelector,
  customerAccountNumberInputSelector,
  customerAccountTextSelector,
  paymentTermsInputSelector,
  shipToEditSelector,
  shipToInputSelector,
  shipToTextSelector,
  supplierEditSelector,
  supplierInputSelector,
  supplierTextSelector,
} from './selectors';

describe('Manual Lookup', () => {
  const blurField = (): void => {
    cy.wait(200); // wait for focus in field
    cy.get('.document-fields').click();
  };

  before(() => {
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.login(Cypress.env('customerUsername'));
    cy.restoreLocalStorage();
  });

  describe('General Interactions', () => {
    beforeEach(() => navigateToDocument());

    it('should focus field upon clicking edit', () => {
      cy.get(shipToEditSelector).click();
      cy.get(shipToInputSelector).should('have.focus');
    });

    it('should auto select all text in the field', () => {
      cy.get(supplierEditSelector).click();
      cy.get(supplierInputSelector).type('{downarrow}');
      cy.get(autoCompleteResultsSelector).should('be.visible');
      cy.get(autoCompleteOptionSelector).last().click();

      blurField();

      cy.get(supplierEditSelector).click();
      cy.get(supplierInputSelector).type('empty');
      cy.get(supplierInputSelector).should('have.value', 'empty');
    });
  });

  describe('Supplier', () => {
    beforeEach(() => navigateToDocument());

    const validate = (editSelector: string, inputSelector: string): void => {
      it('should load results with down arrow', () => {
        cy.get(editSelector).click();
        cy.get(inputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
      });

      it('should load results with 2 char search', () => {
        cy.get(editSelector).click();
        cy.get(inputSelector).type('al');
        cy.get(autoCompleteResultsSelector).should('be.visible');
      });

      // this is potentially going to fail if results ever change
      it('should select last option and populate fields', () => {
        cy.get(editSelector).click();
        cy.get(inputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();
        cy.get(supplierTextSelector).contains('p', 'amazon web services', { matchCase: false });
      });
    };

    describe('Supplier Name field', () => {
      validate(supplierEditSelector, supplierInputSelector);
    });
  });

  describe('Ship To', () => {
    beforeEach(() => navigateToDocument());

    const validate = (editSelector: string, inputSelector: string): void => {
      it('should load results with down arrow', () => {
        cy.get(editSelector).click();
        cy.get(inputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
      });

      it('should load results with 2 char search', () => {
        cy.get(editSelector).click();
        cy.get(inputSelector).type('al');
        cy.get(autoCompleteResultsSelector).should('be.visible');
      });

      // this is potentially going to fail if results ever change
      it('should select last option and populate fields', () => {
        cy.get(editSelector).click();
        cy.get(inputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();
        cy.get(shipToTextSelector).contains('Charlotte', { matchCase: false });
      });
    };

    describe('Ship-To Name field', () => {
      validate(shipToEditSelector, shipToInputSelector);
    });
  });

  describe('Customer Account', () => {
    beforeEach(() => navigateToDocument());

    describe('Validate Enabled/Disabled', () => {
      it('should be disabled on initial load', () => {
        cy.get(customerAccountEditSelector).should('not.exist');
      });

      it('should be visible after selecting supplier', () => {
        cy.get(supplierEditSelector).click();
        cy.get(supplierInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();

        blurField();

        cy.get(customerAccountEditSelector).should('be.visible');
      });
    });

    describe('Clear Account on Supplier Change', () => {
      it('should clear customer account', () => {
        cy.get(supplierEditSelector).click();
        cy.get(supplierInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();

        cy.get(customerAccountEditSelector).click();
        cy.get(customerAccountInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).first().click();

        cy.get(supplierEditSelector).click();
        cy.get(supplierInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).first().click();

        blurField();

        cy.get(customerAccountTextSelector).should('not.exist');
      });
    });

    describe('Search and Select', () => {
      const addSupplier = () => {
        cy.get(supplierEditSelector).click();
        cy.get(supplierInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();
      };

      it('should load results with 1 char search', () => {
        addSupplier();

        cy.get(customerAccountEditSelector).click();
        cy.get(customerAccountInputSelector).type('s');
        cy.get(autoCompleteResultsSelector).should('be.visible');
      });

      it('should load results with down arrow', () => {
        addSupplier();

        cy.get(customerAccountEditSelector).click();
        cy.get(customerAccountInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
      });

      // no inactive accounts
      // it('should not select an inactive account', () => {
      //   addSupplier();

      //   cy.get(customerAccountEditSelector).click();
      //   cy.get(customerAccountInputSelector).type('{downarrow}');
      //   cy.get(autoCompleteOptionSelector).eq(1).should('have.class', 'mat-mdc-option-disabled');
      // });
    });
  });

  describe('Supplier with Create Customer Account', () => {
    beforeEach(() => navigateToDocument());

    describe('when customer account already exists', () => {
      it('should fail to create new customer account', () => {
        cy.get(supplierEditSelector).click();
        cy.get(supplierInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();

        cy.get(customerAccountEditSelector).click();
        cy.get(customerAccountInputSelector).type('{downarrow}');
        cy.get(autoCompleteOptionSelector).get(createNewAccountSelector).click();
        cy.get(customerAccountNumberInputSelector).type(`none`);
        cy.get(paymentTermsInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();
        cy.contains('Confirm').click();
        cy.get('.notification-error').should('exist');
        cy.contains('Cancel').click();
      });
    });

    describe('when customer account created does NOT exist', () => {
      beforeEach(() => setupLookupFixtures(false, true));

      it('sets created customer account after supplier select', () => {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        cy.get(supplierEditSelector).click();
        cy.get(supplierInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();

        cy.get(customerAccountEditSelector).click();
        cy.get(customerAccountInputSelector).type('{downarrow}');
        cy.get(autoCompleteOptionSelector).get(createNewAccountSelector).click();
        cy.get(customerAccountNumberInputSelector).type(`cy${randomNum}`);
        cy.get(paymentTermsInputSelector).type('{downarrow}');
        cy.get(autoCompleteResultsSelector).should('be.visible');
        cy.get(autoCompleteOptionSelector).last().click();
        cy.contains('Confirm').click();
        cy.get(customerAccountTextSelector).contains(`cy${randomNum}`);
      });
    });
  });

  describe('Supplier First Auto-Edit Flow - Supplier -> CustAcct -> ShipTo', () => {
    beforeEach(() => navigateToDocument());

    describe('Single Customer Account Flow', () => {
      beforeEach(() => setupLookupFixtures(true));

      describe('Supplier Name field entry point', () => {
        it('should flow accordingly', () => {
          cy.get(supplierEditSelector).click();
          cy.get(supplierInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();

          cy.get(shipToEditSelector).click();
          cy.get(shipToInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();
        });
      });
    });

    describe('Multiple Customer Accounts Flow', () => {
      describe('Supplier Name field entry point', () => {
        it('should flow accordingly', () => {
          cy.get(supplierEditSelector).click();
          cy.get(supplierInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();

          cy.get(customerAccountEditSelector).click();
          cy.get(customerAccountInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).eq(2).click();

          cy.get(shipToEditSelector).click();
          cy.get(shipToInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();
        });
      });
    });
  });

  describe('Ship-To First Auto-Edit Flow - Ship-To -> Supplier -> CustAcct', () => {
    beforeEach(() => navigateToDocument());

    describe('Single Customer Account Flow', () => {
      beforeEach(() => setupLookupFixtures(true));

      describe('Ship-To Name field entry point', () => {
        it('should flow accordingly', () => {
          cy.get(shipToEditSelector).click();
          cy.get(shipToInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();

          cy.get(supplierEditSelector).click();
          cy.get(supplierInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();
        });
      });
    });

    describe('Multiple Customer Accounts Flow', () => {
      describe('Ship-To Name field entry point', () => {
        it('should flow accordingly', () => {
          cy.get(shipToEditSelector).click();
          cy.get(shipToInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();

          cy.get(supplierEditSelector).click();
          cy.get(supplierInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).last().click();

          cy.get(customerAccountEditSelector).click();
          cy.get(customerAccountInputSelector).type('{downarrow}');
          cy.get(autoCompleteResultsSelector).should('be.visible');
          cy.get(autoCompleteOptionSelector).first().click();
        });
      });
    });
  });

  // describe.only('Default Ship-To', () => {
  //   beforeEach(() => navigateToDocument());

  //   it('should auto select default ship-to', () => {
  //     cy.get(supplierEditSelector).click();
  //     cy.get(supplierInputSelector).type('{downarrow}');
  //     cy.get(autoCompleteResultsSelector).should('be.visible');
  //     cy.get(autoCompleteOptionSelector).first().click();

  //     cy.get(customerAccountEditSelector).click();
  //     cy.get(customerAccountInputSelector).type('{downarrow}');
  //     cy.get(autoCompleteResultsSelector).should('be.visible');
  //     cy.get(autoCompleteOptionSelector).first().click();

  //     cy.get(shipToTextSelector).contains('Pipe Test');
  //     cy.get(shipToTextSelector).contains('102 Franklin StApt BCharlotte, NC 28214');
  //   });
  // });
});
