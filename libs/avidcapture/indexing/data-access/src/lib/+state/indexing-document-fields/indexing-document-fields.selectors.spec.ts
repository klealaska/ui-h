import {
  confidenceThresholdStub,
  fieldBaseStub,
  getCompositeDataStub,
  getFieldBaseStub,
} from '@ui-coe/avidcapture/shared/test';
import { ControlTypes, DocumentLabelKeys, InvoiceTypes } from '@ui-coe/avidcapture/shared/types';

import { IndexingDocumentFieldsSelectors } from './indexing-document-fields.selectors';

describe('IndexingDocumentFieldsSelectors', () => {
  it('should select invoiceType from state using indexing page selectors composite data labels', () =>
    expect(IndexingDocumentFieldsSelectors.invoiceType(getCompositeDataStub())).toBe(
      InvoiceTypes.Standard
    ));

  it('should return empty string for invoiceType from indexing page selectors composite data labels when label is undefined', () => {
    const compositeDataStub = getCompositeDataStub();

    compositeDataStub.indexed.labels = [];

    expect(IndexingDocumentFieldsSelectors.invoiceType(compositeDataStub)).toBe('');
  });

  it('should return empty string for invoiceType when composite data is null', () => {
    expect(IndexingDocumentFieldsSelectors.invoiceType(null)).toBe('');
  });

  it('should select invoiceTypeConfidenceThreshold from state', () =>
    expect(
      IndexingDocumentFieldsSelectors.invoiceTypeConfidenceThreshold({
        formFields: [
          {
            key: DocumentLabelKeys.nonLookupLabels.InvoiceType,
            confidenceThreshold: confidenceThresholdStub,
          },
        ],
      } as any)
    ).toEqual(confidenceThresholdStub));

  it('should select invoiceTypeConfidenceThreshold from state when invoiceType is null', () =>
    expect(
      IndexingDocumentFieldsSelectors.invoiceTypeConfidenceThreshold({
        formFields: [
          {
            key: DocumentLabelKeys.nonLookupLabels.BillingAddress,
            confidenceThreshold: confidenceThresholdStub,
          },
        ],
      } as any)
    ).toEqual(null));

  it('should select fields from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.fields({ fields: getFieldBaseStub('mock') } as any)
    ).toEqual(getFieldBaseStub('mock'));
  });

  it('should select fields from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.utilityFields({ utilityFields: 'utilityFieldMock' } as any)
    ).toEqual('utilityFieldMock');
  });

  it('should select formGroupInstance from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.formGroupInstance({ formGroupInstance: null } as any)
    ).toBeNull();
  });

  it('should select internalEscalationChoices from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.internalEscalationChoices({
        formFields: fieldBaseStub,
      } as any)
    ).toEqual([{ name: fieldBaseStub[0].labelDisplayName, value: fieldBaseStub[0].key }]);
  });

  it('should select some fields from state for lookupLabels when meeting filter criteria', () => {
    const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);

    expect(
      IndexingDocumentFieldsSelectors.lookupFormFields({ formattedFields: [fieldBaseStub] } as any)
    ).toEqual([fieldBaseStub]);
  });

  it('should select no fields from state for lookupLabels when not meeting filter criteria', () => {
    const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress);

    expect(
      IndexingDocumentFieldsSelectors.lookupFormFields({ formattedFields: [fieldBaseStub] } as any)
    ).toEqual([]);
  });

  describe('when user can editWorkflow', () => {
    it('should include workflow field for lookupFormFieldsBottom from state', () => {
      const orderByField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const workflowField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
      const fieldsBaseStub = [];
      orderByField.order = 15;
      orderByField.controlType = ControlTypes.AutoComplete;
      workflowField.order = 16;
      workflowField.controlType = ControlTypes.AutoComplete;
      fieldsBaseStub.push(orderByField, workflowField);

      expect(
        IndexingDocumentFieldsSelectors.lookupFormFieldsBottom(
          {
            formattedFields: fieldsBaseStub,
          } as any,
          true
        )
      ).toEqual(fieldsBaseStub);
    });
  });

  describe('when user cannot editWorkflow', () => {
    it('should include workflow field for lookupFormFieldsBottom from state', () => {
      const orderByField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const workflowField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
      const fieldsBaseStub = [];
      const expectedResult = [orderByField];
      orderByField.order = 15;
      orderByField.controlType = ControlTypes.AutoComplete;
      workflowField.order = 16;
      workflowField.controlType = ControlTypes.AutoComplete;
      fieldsBaseStub.push(orderByField, workflowField);

      expect(
        IndexingDocumentFieldsSelectors.lookupFormFieldsBottom(
          {
            formattedFields: fieldsBaseStub,
          } as any,
          false
        )
      ).toEqual(expectedResult);
    });
  });

  describe('nonLookupFormFields:', () => {
    it('should include duedate field for nonlookup fields from state', () => {
      const dueDateField = getFieldBaseStub(
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
      );
      const invoiceAmtField = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      const fieldsBaseStub = [];
      dueDateField.order = 11;
      dueDateField.controlType = ControlTypes.TextArea;
      invoiceAmtField.order = 12;
      invoiceAmtField.controlType = ControlTypes.TextArea;
      fieldsBaseStub.push(dueDateField, invoiceAmtField);

      expect(
        IndexingDocumentFieldsSelectors.nonLookupFormFields({
          formattedFields: fieldsBaseStub,
        } as any)
      ).toEqual(fieldsBaseStub);
    });
  });

  it('should select nonLookupFormFieldsBottom from state', () => {
    const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.Memo);
    fieldBaseStub.order = 17;
    fieldBaseStub.controlType = ControlTypes.TextBox;
    expect(
      IndexingDocumentFieldsSelectors.nonLookupFormFieldsBottom({
        formattedFields: [fieldBaseStub],
      } as any)
    ).toEqual([fieldBaseStub]);
  });

  it('should select dropdownfields from state', () => {
    const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
    fieldBaseStub.order = 17;
    fieldBaseStub.controlType = ControlTypes.Dropdown;
    expect(
      IndexingDocumentFieldsSelectors.dropdownFields({
        formattedFields: [fieldBaseStub],
      } as any)
    ).toEqual([fieldBaseStub]);
  });

  it('should select customerAccounts from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.customerAccounts({ customerAccounts: [] } as any)
    ).toEqual([]);
  });

  it('should select properties from state', () => {
    expect(IndexingDocumentFieldsSelectors.properties({ properties: [] } as any)).toEqual([]);
  });

  it('should select suppliers from state', () => {
    expect(IndexingDocumentFieldsSelectors.suppliers({ suppliers: [] } as any)).toEqual([]);
  });

  it('should select orderedBy from state', () => {
    expect(IndexingDocumentFieldsSelectors.orderedBy({ orderedBy: [] } as any)).toEqual([]);
  });

  it('should select workflow from state', () => {
    expect(IndexingDocumentFieldsSelectors.workflow({ workflow: [] } as any)).toEqual([]);
  });

  it('should select isLookupLoading from state', () => {
    expect(IndexingDocumentFieldsSelectors.isLookupLoading({ isLookupLoading: true } as any)).toBe(
      true
    );
  });

  it('should select isDefaultShipToLoading from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.isDefaultShipToLoading({
        isDefaultShipToLoading: true,
      } as any)
    ).toBe(true);
  });

  it('should select lastLabelUpdated from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.lastLabelUpdated({ lastLabelUpdated: 'mock' } as any)
    ).toEqual('mock');
  });

  it('should select customerAccountFieldValue from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.customerAccountFieldValue({
        customerAccountFieldValue: 'mock',
      } as any)
    ).toBe('mock');
  });

  it('should select selectedSupplier from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.selectedSupplier({
        selectedSupplier: 'mock',
      } as any)
    ).toBe('mock');
  });

  it('should select selectedProperty from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.selectedProperty({
        selectedProperty: 'mock',
      } as any)
    ).toBe('mock');
  });

  it('should select selectedOrderedBy from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.selectedOrderedBy({
        selectedOrderedBy: 'mock',
      } as any)
    ).toBe('mock');
  });

  it('should select selectedWorkflow from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.selectedWorkflow({
        selectedWorkflow: 'mock',
      } as any)
    ).toBe('mock');
  });

  it('should select nonLookupErrorMessage from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.nonLookupErrorMessage({
        nonLookupErrorMessage: null,
      } as any)
    ).toBeNull();
  });

  it('should select fromFields from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.formFields({ formFields: getFieldBaseStub('mock') } as any)
    ).toEqual(getFieldBaseStub('mock'));
  });

  it('should select lookupLoadingState from state', () => {
    expect(
      IndexingDocumentFieldsSelectors.lookupLoadingState({
        lookupLoadingState: {
          customerAccountLoading: false,
        },
      } as any)
    ).toMatchObject({
      customerAccountLoading: false,
    });
  });
});
