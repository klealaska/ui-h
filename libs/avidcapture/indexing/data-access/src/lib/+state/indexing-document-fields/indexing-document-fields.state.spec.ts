import { FormBuilder } from '@angular/forms';
import {
  customerAccountsStub,
  fieldBaseStub,
  fieldControlStub,
  formGroupInstanceStub,
  getCompositeDataStub,
  getFieldBaseStub,
  getIndexedLabelStub,
  hasAllTheClaimsTokenStub,
  hasNoClaimsTokenStub,
  orderedByStub,
  propertiesStub,
  singleOrgTokenStub,
  suppliersStub,
  workflowStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  ControlTypes,
  DocumentLabelKeys,
  InputDataTypes,
  InvoiceTypes,
  LabelValue,
  LookupBodyRequest,
  LookupCustomerAccountResponse,
  LookupLoadingState,
} from '@ui-coe/avidcapture/shared/types';
import jwt_decode from 'jwt-decode';
import { of, throwError } from 'rxjs';

import {
  RemoveCustomerAccountActivity,
  UpdateOnManualIntervention,
  UpdateShipToAddressLabel,
  UpdateSupplierAddressLabel,
} from '../indexing-page/indexing-page.actions';
import {
  UpdateAdditionalLookupValue,
  UpdateOldBoundingBoxCoordinates,
} from '../indexing-utility/indexing-utility.actions';
import * as actions from './indexing-document-fields.actions';
import { IndexingDocumentFieldsState } from './indexing-document-fields.state';

jest.mock('jwt-decode', () => ({ default: jest.fn() }));

describe('IndexingDocumentFieldsState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const docFieldServiceStub = {
    getFormFieldMetaData: jest.fn(),
    parseFieldMetaData: jest.fn(),
  };
  const fieldControlServiceStub = {
    toFormGroup: jest.fn(),
  };
  const indexingHelperServiceStub = {
    assignValuesToFields: jest.fn(),
    getFieldValidationMessage: jest.fn(),
    handleLookupError: jest.fn(),
    handleInactiveShipTo: jest.fn(),
    hasNewAccountActivity: jest.fn(),
    getNewCustomerAccount: jest.fn(),
    getPredictedValue: jest.fn(),
  };
  const lookupApiServiceStub = {
    getCustomerAccounts: jest.fn(),
    getProperties: jest.fn(),
    getSuppliers: jest.fn(),
    getUsers: jest.fn(),
    getWorkflow: jest.fn(),
    getMaxInvoiceNumberLength: jest.fn(),
    getSupplier: jest.fn(),
  };
  const formatterServiceStub = {
    getSanitizedFieldValue: jest.fn(),
    getFormattedFieldValue: jest.fn(),
  };
  const validatorServiceStub = {
    lookupObjectValidator: jest.fn(),
    required: jest.fn(),
  };

  const paymentTermServiceStub = {
    getDueDate: jest.fn(),
  };

  const storeStub = {
    selectSnapshot: jest.fn(cb =>
      cb({
        indexingPage: {
          compositeData: getCompositeDataStub(),
          buyerId: '1',
          associatedLookupFieldValue: null,
        },
        indexingUtility: {
          labelColors: [],
        },
        core: {
          token: hasNoClaimsTokenStub,
        },
      })
    ),
    selectOnce: jest.fn(() => of(true)),
  };

  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };

  const actionsStub = of();

  const indexingDocumentFieldsState = new IndexingDocumentFieldsState(
    docFieldServiceStub as any,
    fieldControlServiceStub as any,
    indexingHelperServiceStub as any,
    lookupApiServiceStub as any,
    formatterServiceStub as any,
    retryServiceStub as any,
    validatorServiceStub as any,
    paymentTermServiceStub as any,
    storeStub as any,
    actionsStub as any
  );

  const baseFieldStub = {
    confidence: 99.99,
    confidenceThreshold: null,
    displayThreshold: {
      view: 75,
      readonly: 75,
    },
    controlType: 'textbox',
    headerBackgroundColor: 'none',
    headerTextColor: 'default',
    labelDisplayName: 'Base Stub',
    order: 1,
    regEx: null,
    required: true,
    type: 'text',
    value: '',
  };

  const lookupLoadingStateStub: LookupLoadingState = {
    customerAccountLoading: false,
    shipToLoading: false,
    supplierLoading: false,
    orderedByLoading: false,
    workflowLoading: false,
  };

  const supplierAddressFieldStub = {
    ...baseFieldStub,
    key: DocumentLabelKeys.lookupLabels.SupplierAddress,
  };
  const supplierRegistrationCodeFieldStub = {
    ...baseFieldStub,
    key: DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode,
  };
  const shipToAddressFieldStub = {
    ...baseFieldStub,
    key: DocumentLabelKeys.lookupLabels.ShipToAddress,
  };
  const shipToCodeFieldStub = {
    ...baseFieldStub,
    key: DocumentLabelKeys.nonLookupLabels.ShipToCode,
  };

  const shipToIdFieldStub = {
    ...baseFieldStub,
    key: DocumentLabelKeys.nonLookupLabels.ShipToId,
  };

  const shipToAliasFieldStub = {
    ...baseFieldStub,
    key: DocumentLabelKeys.nonLookupLabels.ShipToAlias,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () =>
      expect(
        IndexingDocumentFieldsState.data({ formattedFields: getFieldBaseStub('mock') } as any)
      ).toStrictEqual({
        formattedFields: getFieldBaseStub('mock'),
      }));
  });

  describe('Action: QueryDocumentFormFields', () => {
    describe('when formMetaData returns successfully', () => {
      beforeEach(() => {
        docFieldServiceStub.getFormFieldMetaData.mockReturnValue(
          of([{ fields: fieldControlStub }])
        );
        indexingDocumentFieldsState.queryDocumentFormFields(stateContextStub).subscribe();
      });

      it('should call docFieldService.getFormFieldMetaData function', () =>
        expect(docFieldServiceStub.getFormFieldMetaData).toHaveBeenCalled());

      it('should patchState for formFields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formFields: fieldControlStub,
          utilityFields: [],
        }));

      it('should dispatch ParseDocumentFormFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.ParseDocumentFormFields()
        ));
    });

    describe('when formMetaData returns fields that are utility', () => {
      const fieldStub = {
        key: DocumentLabelKeys.nonLookupLabels.ServiceStartDate,
        fieldType: InvoiceTypes.Utility,
      } as any;

      beforeEach(() => {
        docFieldServiceStub.getFormFieldMetaData.mockReturnValue(of([{ fields: [fieldStub] }]));
        indexingDocumentFieldsState.queryDocumentFormFields(stateContextStub).subscribe();
      });

      it('should call docFieldService.getFormFieldMetaData function', () =>
        expect(docFieldServiceStub.getFormFieldMetaData).toHaveBeenCalledTimes(1));

      it('should patchState for formFields & utilityFields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formFields: [fieldStub],
          utilityFields: [fieldStub.key],
        }));

      it('should dispatch ParseDocumentFormFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.ParseDocumentFormFields()
        ));
    });

    describe('when formMetaData returns an empty array', () => {
      beforeEach(() => {
        docFieldServiceStub.getFormFieldMetaData.mockReturnValue(of([]));
        indexingDocumentFieldsState.queryDocumentFormFields(stateContextStub).subscribe();
      });

      it('should call docFieldService.getFormFieldMetaData function', () =>
        expect(docFieldServiceStub.getFormFieldMetaData).toHaveBeenCalledTimes(1));

      it('should patchState undefined for formFields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formFields: undefined,
          utilityFields: [],
        }));

      it('should dispatch ParseDocumentFormFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.ParseDocumentFormFields()
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        docFieldServiceStub.getFormFieldMetaData.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState.queryDocumentFormFields(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 404 });
            done();
          },
        });
      });
    });
  });

  describe('Action: ParseDocumentFormFields', () => {
    const textBoxField = {
      controlType: ControlTypes.TextBox,
      confidence: 0.96,
      value: 'mock',
    } as any;

    const autocompleteField = {
      controlType: ControlTypes.AutoComplete,
      confidence: 0.96,
      value: 'mock',
    } as any;

    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({ formFields: fieldControlStub });
      docFieldServiceStub.parseFieldMetaData.mockReturnValue(of({}));
      indexingHelperServiceStub.assignValuesToFields.mockReturnValue([
        textBoxField,
        autocompleteField,
      ]);
      fieldControlServiceStub.toFormGroup.mockReturnValue(null);
      indexingDocumentFieldsState.parseDocumentFormFields(stateContextStub).subscribe();
    });

    it('should keep field value as current value', () => expect(textBoxField.value).toBe('mock'));

    it('should keep field value as current value', () =>
      expect(autocompleteField.value).toBe('mock'));

    it('should call docFieldService.parseFieldMetaData function', () =>
      expect(docFieldServiceStub.parseFieldMetaData).toHaveBeenCalled());

    it('should patchState for fields & formGroupInstance', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        fields: [textBoxField, autocompleteField],
        formGroupInstance: null,
      }));
  });

  describe('Action: FormatFields', () => {
    describe('When is a sponsor user', () => {
      const field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      const DueDatefield = getFieldBaseStub(
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
      );

      beforeEach(() => {
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'adm.su': ['all'] };
        });
        field.value = '200';
        stateContextStub.getState.mockReturnValue({ fields: [field, DueDatefield] });
        formatterServiceStub.getFormattedFieldValue.mockReturnValueOnce('$200.00');
        indexingDocumentFieldsState.formatFields(stateContextStub);
      });

      it('should call formatterService.getFormattedFieldValue function', () =>
        expect(formatterServiceStub.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          field,
          '200'
        ));

      it('should patchState only invoice amount field and remove due date from formattedFields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formattedFields: [field],
        }));
    });

    describe('When is a buyer user', () => {
      const fieldDueDate = getFieldBaseStub(
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
      );
      const field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      beforeEach(() => {
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { mock: ['all'] };
        });
        fieldDueDate.value = '200';
        fieldDueDate.key = DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride;
        stateContextStub.getState.mockReturnValue({ fields: [field, fieldDueDate] });
        formatterServiceStub.getFormattedFieldValue.mockReturnValueOnce('$200.00');
        indexingDocumentFieldsState.formatFields(stateContextStub);
      });

      it('should patch due date and invoice amount field', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formattedFields: [field, fieldDueDate],
        });
      });
    });
  });

  describe('Action: QueryLookupCustomerAccounts', () => {
    describe('when receiving data back from the API', () => {
      const responseStub = {
        count: 2,
        records: customerAccountsStub,
      };
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedSupplier: suppliersStub[0],
          formGroupInstance: formGroupInstanceStub,
          lookupLoadingState: lookupLoadingStateStub,
        });

        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData: getCompositeDataStub(),
              buyerId: '1',
              associatedLookupFieldValue: null,
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );

        stateContextStub.dispatch.mockReturnValue(of({}));
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
        validatorServiceStub.required.mockReturnValue(() => null);
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, {
            searchText: 'test',
          })
          .subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: true })
        ));

      it('should call lookupApiServiceStub.getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          'test',
          suppliersStub[0].vendorID
        ));

      it('should patchState for customerAccounts', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          customerAccounts: customerAccountsStub,
          formGroupInstance: formGroupInstanceStub,
          isDefaultShipToLoading: true,
        }));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: false })
        ));
    });

    describe('when selectedSupplier is NULL', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedSupplier: null,
          lookupLoadingState: lookupLoadingStateStub,
        });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should patchState with empty array', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
                1,
                new actions.SetLookupLoading({
                  ...lookupLoadingStateStub,
                  customerAccountLoading: true,
                })
              );
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                customerAccounts: customerAccountsStub,
              });
              done();
            },
          });
      });
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should patchState with empty array', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                customerAccounts: customerAccountsStub,
              });

              done();
            },
          });
      });
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryLookupProperties', () => {
    const responseStub = {
      count: 2,
      records: propertiesStub,
    };
    const propertyBodyRequest: LookupBodyRequest = {
      organizationId: '1' as any,
      accountingSystemId: 23,
      searchTerm: 'test',
      page: 1,
      pageSize: 50,
    };

    describe('when receiving data back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          accountingSystemId: 23,
          formGroupInstance: formGroupInstanceStub,
          lookupLoadingState: lookupLoadingStateStub,
        });
        lookupApiServiceStub.getProperties.mockReturnValue(of(responseStub));
        validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
        validatorServiceStub.required.mockReturnValue(() => null);
        indexingDocumentFieldsState
          .queryLookupProperties(stateContextStub, {
            searchText: 'test',
          })
          .subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
        ));

      it('should call lookupApiServiceStub.getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          propertyBodyRequest,
          'test',
          '1',
          23
        ));

      it('should patchState for properties', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          properties: propertiesStub,
          formGroupInstance: formGroupInstanceStub,
        }));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
        ));
    });

    describe('when receiving an error from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ accountingSystemId: 23 });
        lookupApiServiceStub.getProperties.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState with empty array', done => {
        indexingDocumentFieldsState
          .queryLookupProperties(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                properties: propertiesStub,
              });

              done();
            },
          });
      });
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });

    describe('isDefaultShipToLoading', () => {
      describe('when receiving ONE property from api and NO matching propertyAddressId', () => {
        const singleResponseStub = {
          count: 1,
          records: [propertiesStub[0]],
        };
        const propertyBodyRequest: LookupBodyRequest = {
          organizationId: '1' as any,
          accountingSystemId: 23,
          searchTerm: 'test',
          page: 1,
          pageSize: 50,
        };
        let previousPropertyAddressId = 0;

        beforeEach(() => {
          previousPropertyAddressId = customerAccountsStub[0].propertyAddress.propertyAddressID;
          customerAccountsStub[0].propertyAddress.propertyAddressID = 5345345;
          stateContextStub.getState.mockReturnValue({
            accountingSystemId: 23,
            formGroupInstance: formGroupInstanceStub,
            lookupLoadingState: lookupLoadingStateStub,
            isDefaultShipToLoading: true,
            selectedCustomerAccount: customerAccountsStub[0],
          });
          lookupApiServiceStub.getProperties.mockReturnValue(of(singleResponseStub));
          validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
          validatorServiceStub.required.mockReturnValue(() => null);
          indexingDocumentFieldsState
            .queryLookupProperties(stateContextStub, {
              searchText: 'test',
            })
            .subscribe();
        });

        afterAll(() => {
          customerAccountsStub[0].propertyAddress.propertyAddressID = previousPropertyAddressId;
        });

        it('should dispatch LookupLoading action with true', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            1,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
          ));

        it('should call lookupApiServiceStub.getProperties function', () =>
          expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
            1,
            expect.anything(),
            propertyBodyRequest,
            'test',
            '1',
            23
          ));

        it('should patchState for properties', () =>
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            properties: [propertiesStub[0]],
            formGroupInstance: formGroupInstanceStub,
          }));

        it('should dispatch LookupLoading action with false', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            2,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
          ));
      });

      describe('when receiving ONE property from api and matching propertyAddressId', () => {
        const singleResponseStub = {
          count: 1,
          records: [propertiesStub[0]],
        };
        const propertyBodyRequest: LookupBodyRequest = {
          organizationId: '1' as any,
          accountingSystemId: 23,
          searchTerm: 'test',
          page: 1,
          pageSize: 50,
        };

        beforeEach(() => {
          customerAccountsStub[0].propertyAddress.propertyAddressID =
            propertiesStub[0].propertyAddressID;
          stateContextStub.getState.mockReturnValue({
            accountingSystemId: 23,
            formGroupInstance: formGroupInstanceStub,
            lookupLoadingState: lookupLoadingStateStub,
            isDefaultShipToLoading: true,
            selectedCustomerAccount: customerAccountsStub[0],
          });
          lookupApiServiceStub.getProperties.mockReturnValue(of(singleResponseStub));
          validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
          validatorServiceStub.required.mockReturnValue(() => null);
          indexingDocumentFieldsState
            .queryLookupProperties(stateContextStub, {
              searchText: 'test',
            })
            .subscribe();
        });

        it('should dispatch LookupLoading action with true', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            1,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
          ));

        it('should call lookupApiServiceStub.getProperties function', () =>
          expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
            1,
            expect.anything(),
            propertyBodyRequest,
            'test',
            '1',
            23
          ));

        it('should dispatch SetLookupProperty', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            2,
            new actions.SetLookupProperty(
              propertiesStub[0],
              DocumentLabelKeys.lookupLabels.ShipToName
            )
          ));

        it('should patchState for properties', () =>
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            properties: [propertiesStub[0]],
            formGroupInstance: formGroupInstanceStub,
          }));

        it('should dispatch LookupLoading action with false', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            3,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
          ));
      });

      describe('when receiving ONE property from api and ship to is already set', () => {
        const singleResponseStub = {
          count: 1,
          records: [propertiesStub[0]],
        };
        const propertyBodyRequest: LookupBodyRequest = {
          organizationId: '1' as any,
          accountingSystemId: 23,
          searchTerm: 'test',
          page: 1,
          pageSize: 50,
        };

        beforeEach(() => {
          stateContextStub.getState.mockReturnValue({
            accountingSystemId: 23,
            formGroupInstance: formGroupInstanceStub,
            lookupLoadingState: lookupLoadingStateStub,
            isDefaultShipToLoading: true,
            selectedCustomerAccount: customerAccountsStub[0],
            selectedProperty: propertiesStub[0],
          });
          lookupApiServiceStub.getProperties.mockReturnValue(of(singleResponseStub));
          validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
          validatorServiceStub.required.mockReturnValue(() => null);
          indexingDocumentFieldsState
            .queryLookupProperties(stateContextStub, {
              searchText: 'test',
            })
            .subscribe();
        });

        it('should dispatch LookupLoading action with true', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            1,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
          ));

        it('should call lookupApiServiceStub.getProperties function', () =>
          expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
            1,
            expect.anything(),
            propertyBodyRequest,
            'test',
            '1',
            23
          ));

        it('should dispatch SetLookupProperty', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            2,
            new actions.SetLookupProperty(
              propertiesStub[0],
              DocumentLabelKeys.lookupLabels.ShipToName
            )
          ));

        it('should patchState for properties', () =>
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            properties: [propertiesStub[0]],
            formGroupInstance: formGroupInstanceStub,
          }));

        it('should dispatch LookupLoading action with false', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            3,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
          ));
      });

      describe('when selectedCustomerAccount has multiple propertyAddressCount and ONE property from api returns', () => {
        const singleResponseStub = {
          count: 1,
          records: [propertiesStub[0]],
        };
        const propertyBodyRequest: LookupBodyRequest = {
          organizationId: '1' as any,
          accountingSystemId: 23,
          searchTerm: 'test',
          page: 1,
          pageSize: 50,
        };

        beforeEach(() => {
          customerAccountsStub[0].propertyAddress.propertyAddressCount = 5;
          stateContextStub.getState.mockReturnValue({
            accountingSystemId: 23,
            formGroupInstance: formGroupInstanceStub,
            lookupLoadingState: lookupLoadingStateStub,
            isDefaultShipToLoading: true,
            selectedCustomerAccount: customerAccountsStub[0],
          });
          lookupApiServiceStub.getProperties.mockReturnValue(of(singleResponseStub));
          validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
          validatorServiceStub.required.mockReturnValue(() => null);
          indexingDocumentFieldsState
            .queryLookupProperties(stateContextStub, {
              searchText: 'test',
            })
            .subscribe();
        });

        afterAll(() => {
          customerAccountsStub[0].propertyAddress.propertyAddressCount = 1;
        });

        it('should dispatch LookupLoading action with true', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            1,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
          ));

        it('should call lookupApiServiceStub.getProperties function', () =>
          expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
            1,
            expect.anything(),
            propertyBodyRequest,
            'test',
            '1',
            23
          ));

        it('should dispatch SetLookupProperty', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            2,
            new actions.SetLookupProperty(
              propertiesStub[0],
              DocumentLabelKeys.lookupLabels.ShipToName
            )
          ));

        it('should patchState for properties', () =>
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            properties: [propertiesStub[0]],
            formGroupInstance: formGroupInstanceStub,
          }));

        it('should dispatch LookupLoading action with false', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            3,
            new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
          ));
      });
    });
  });

  describe('Action: QueryLookupSuppliers', () => {
    const responseStub = {
      count: 2,
      records: suppliersStub,
    };
    const supplierBodyRequest: LookupBodyRequest = {
      organizationId: '1' as any,
      accountingSystemId: 23,
      searchTerm: 'test',
      page: 1,
      pageSize: 50,
    };
    describe('when receiving data back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          accountingSystemId: 23,
          formGroupInstance: formGroupInstanceStub,
          lookupLoadingState: lookupLoadingStateStub,
        });
        lookupApiServiceStub.getSuppliers.mockReturnValue(of(responseStub));
        validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
        validatorServiceStub.required.mockReturnValue(() => null);
        indexingDocumentFieldsState
          .queryLookupSuppliers(stateContextStub, {
            searchText: 'test',
          })
          .subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: true })
        ));

      it('should call lookupApiServiceStub.getSuppliers function', () =>
        expect(lookupApiServiceStub.getSuppliers).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          supplierBodyRequest,
          'test',
          '1',
          23
        ));

      it('should patchState for suppliers', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          suppliers: suppliersStub,
          formGroupInstance: formGroupInstanceStub,
        }));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: false })
        ));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ accountingSystemId: 23 });
        lookupApiServiceStub.getSuppliers.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState with empty array', done => {
        indexingDocumentFieldsState
          .queryLookupSuppliers(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                suppliers: suppliersStub,
              });

              done();
            },
          });
      });
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryOrderedBy', () => {
    const responseStub = {
      count: 2,
      records: orderedByStub,
    };
    describe('when receiving data back from the API', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
        });

        lookupApiServiceStub.getUsers.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState
          .queryOrderedBy(stateContextStub, {
            searchText: 'test',
          })
          .subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: true })
        ));

      it('should call lookupApiServiceStub.getUsers function', () =>
        expect(lookupApiServiceStub.getUsers).toHaveBeenNthCalledWith(1, 'test', '1'));

      it('should patchState for orderedBy', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          orderedBy: orderedByStub,
        }));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: false })
        ));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              buyerId: '1',
            },
          })
        );

        lookupApiServiceStub.getUsers.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState with empty array', done => {
        indexingDocumentFieldsState
          .queryOrderedBy(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                orderedBy: orderedByStub,
              });

              done();
            },
          });
      });
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryWorkflow', () => {
    const responseStub = {
      count: 2,
      records: workflowStub,
    };
    describe('when receiving data back from the API', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
        });

        lookupApiServiceStub.getWorkflow.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState
          .queryWorkflow(stateContextStub, {
            searchText: 'test',
          })
          .subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: true })
        ));

      it('should call lookupApiServiceStub.getWorkflow function', () =>
        expect(lookupApiServiceStub.getWorkflow).toHaveBeenNthCalledWith(1, 'test', '1'));

      it('should patchState for workflow', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          workflow: workflowStub,
        }));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: false })
        ));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              buyerId: '1',
            },
          })
        );

        lookupApiServiceStub.getWorkflow.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState with empty array', done => {
        indexingDocumentFieldsState
          .queryWorkflow(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                orderedBy: orderedByStub,
              });

              done();
            },
          });
      });
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: SetExistingSupplier', () => {
    describe('when field is supplier & supplier record is found', () => {
      const supplierAddressValue = `${suppliersStub[2].line1} ${suppliersStub[2].line2} ${suppliersStub[2].city}, ${suppliersStub[2].state} ${suppliersStub[2].postalCode}`;
      const compositeData = getCompositeDataStub();
      const cstAcctNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const supplierLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const supplierAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.SupplierAddress
      );
      const registrationCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      const supplierIdLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      const supplierField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const formattedFieldsStub = [supplierField];

      supplierLabel.value.text = suppliersStub[2].vendorName;
      supplierLabel.value.confidence = 1;
      supplierAddressLabel.value.text = supplierAddressValue;
      supplierIdLabel.value.text = suppliersStub[2].vendorID.toString();
      compositeData.indexed.labels.push(
        cstAcctNumberLabel,
        supplierLabel,
        supplierAddressLabel,
        supplierIdLabel,
        registrationCodeLabel
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getSupplier.mockReturnValue(of(suppliersStub[2]));
        indexingDocumentFieldsState.setExistingSupplier(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: true })
        ));

      it('should call lookupApiService getSupplier function', () =>
        expect(lookupApiServiceStub.getSupplier).toHaveBeenNthCalledWith(1, expect.anything()));

      it('should patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedSupplier: suppliersStub[2],
          accountingSystemId: suppliersStub[2].accountingSystemID,
        }));

      it('should dispatch actions to update supplier form field & to set existing CAN field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(supplierField),
          new actions.SetExistingCustomerAccountNumber(),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: false })
        ));
    });

    describe('when field is supplier & supplier record is found & hasNewAccountActivity is TRUE', () => {
      const supplierAddressValue = `${suppliersStub[1].line1} ${suppliersStub[1].line2} ${suppliersStub[1].city}, ${suppliersStub[1].state} ${suppliersStub[1].postalCode}`;
      const compositeData = getCompositeDataStub();
      const cstAcctNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const supplierLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const supplierAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.SupplierAddress
      );
      const registrationCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      const supplierIdLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      const supplierField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const formattedFieldsStub = [supplierField];

      supplierLabel.value.text = suppliersStub[1].vendorName;
      supplierLabel.value.confidence = 1;
      supplierAddressLabel.value.text = supplierAddressValue;
      supplierIdLabel.value.text = suppliersStub[1].vendorID.toString();
      compositeData.indexed.labels.push(
        cstAcctNumberLabel,
        supplierLabel,
        supplierAddressLabel,
        supplierIdLabel,
        registrationCodeLabel
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        indexingHelperServiceStub.hasNewAccountActivity.mockReturnValue(true);
        lookupApiServiceStub.getSupplier.mockReturnValue(of(suppliersStub[1]));
        indexingDocumentFieldsState.setExistingSupplier(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: true })
        ));

      it('should call lookupApiService getSupplier function', () =>
        expect(lookupApiServiceStub.getSupplier).toHaveBeenNthCalledWith(1, expect.anything()));

      it('should patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedSupplier: suppliersStub[1],
          accountingSystemId: suppliersStub[1].accountingSystemID,
        }));

      it('should dispatch actions to update supplier form field & to set existing NEW Account Number', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(supplierField),
          new actions.SetExistingNewAccountNumber(),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: false })
        ));
    });

    describe('when field is supplier & supplier record is NOT found', () => {
      const responseStub = {
        count: 2,
        records: suppliersStub,
      };
      const compositeData = getCompositeDataStub();
      const cstAcctNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const supplierLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const supplierAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.SupplierAddress
      );
      const registrationCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      const supplierIdLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      const supplierField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const formattedFieldsStub = [supplierField];

      supplierLabel.value.text = suppliersStub[0].vendorName;
      supplierAddressLabel.value.text = '';
      supplierIdLabel.value.text = '';
      compositeData.indexed.labels.push(
        cstAcctNumberLabel,
        supplierLabel,
        supplierAddressLabel,
        supplierIdLabel,
        registrationCodeLabel
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getSupplier.mockReturnValue(of(suppliersStub[0]));
        indexingDocumentFieldsState.setExistingSupplier(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: true })
        ));

      it('should call lookupApiService getSupplier function', () =>
        expect(lookupApiServiceStub.getSupplier).toHaveBeenNthCalledWith(1, expect.anything()));

      it('should NOT patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
          selectedSupplier: suppliersStub[0],
          accountingSystemId: suppliersStub[0].accountingSystemID,
        }));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: false })
        ));
    });

    describe('when getting 0 results back from API', () => {
      const responseStub = {
        count: 0,
        records: [],
      };
      const compositeData = getCompositeDataStub();
      const cstAcctNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const supplierLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const supplierAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.SupplierAddress
      );
      const supplierField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const customerAccountField = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const registrationCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      const formattedFieldsStub = [supplierField, customerAccountField];

      supplierLabel.value.text = suppliersStub[0].vendorName;
      supplierAddressLabel.value.text = '';
      compositeData.indexed.labels.push(
        cstAcctNumberLabel,
        supplierLabel,
        supplierAddressLabel,
        registrationCodeLabel
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getSupplier.mockReturnValue(of(suppliersStub[0]));
        indexingDocumentFieldsState.setExistingSupplier(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: true })
        ));

      it('should call lookupApiService getSupplier function', () =>
        expect(lookupApiServiceStub.getSupplier).toHaveBeenNthCalledWith(1, expect.anything()));

      it('should dispatch 2 actions to update supplier and CAN field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(supplierField),
          new actions.UpdateFormattedFields(customerAccountField),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: false })
        ));
    });

    describe('when getting no response back from API', () => {
      const responseStub = null;
      const compositeData = getCompositeDataStub();
      const cstAcctNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const supplierLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const supplierAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.SupplierAddress
      );
      const supplierField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const customerAccountField = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const registrationCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      const formattedFieldsStub = [supplierField, customerAccountField];

      supplierLabel.value.text = suppliersStub[0].vendorName;
      supplierAddressLabel.value.text = '';
      compositeData.indexed.labels.push(
        cstAcctNumberLabel,
        supplierLabel,
        supplierAddressLabel,
        registrationCodeLabel
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getSupplier.mockReturnValue(of(suppliersStub[0]));
        indexingDocumentFieldsState.setExistingSupplier(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: true })
        ));

      it('should call lookupApiService getSupplier function', () =>
        expect(lookupApiServiceStub.getSupplier).toHaveBeenNthCalledWith(1, expect.anything()));

      it('should dispatch 2 actions to update supplier and CAN field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(supplierField),
          new actions.UpdateFormattedFields(customerAccountField),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, supplierLoading: false })
        ));
    });

    describe('when supplier field is NULL', () => {
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        indexingDocumentFieldsState.setExistingSupplier(stateContextStub);
      });

      it('should dispatch SetPredictedSupplierValue action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetPredictedSupplierValue()
        ));

      it('should NOT call lookupApiService getSupplier function', () =>
        expect(lookupApiServiceStub.getSupplier).not.toHaveBeenCalled());

      it('should NOT patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());
    });

    describe('when receiving an error status other than 404 back from the API', () => {
      const supplierAddressValue = `${suppliersStub[0].line1} ${suppliersStub[0].line2} ${suppliersStub[0].city}, ${suppliersStub[0].state} ${suppliersStub[0].postalCode}`;
      const compositeData = getCompositeDataStub();
      const cstAcctNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const supplierLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const supplierAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.SupplierAddress
      );
      const registrationCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      supplierLabel.value.text = suppliersStub[0].vendorName;
      supplierLabel.value.confidence = 1;
      supplierAddressLabel.value.text = supplierAddressValue;
      compositeData.indexed.labels.push(
        cstAcctNumberLabel,
        supplierLabel,
        supplierAddressLabel,
        registrationCodeLabel
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        lookupApiServiceStub.getSupplier.mockReturnValue(throwError(() => ({ status: 501 })));
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState.setExistingSupplier(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

            done();
          },
        });
      });
    });
  });

  describe('Action: SetExistingProperty', () => {
    describe('when field is shipto & shipto record is found', () => {
      const responseStub = {
        count: 2,
        records: propertiesStub,
      };
      const propertyAddressValue = `${propertiesStub[2].line1} ${propertiesStub[2].line2} ${propertiesStub[2].city}, ${propertiesStub[2].state} ${propertiesStub[2].postalCode}`;
      const compositeData = getCompositeDataStub();
      const propertyLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const propertyAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.ShipToAddress
      );
      const propertyIdLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToId);
      const propertyField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const formattedFieldsStub = [propertyField];
      const propertyBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: '102 Franklin',
        page: 1,
        pageSize: 50,
      };

      propertyLabel.value.text = propertiesStub[2].propertyName;
      propertyLabel.value.confidence = 1;
      propertyAddressLabel.value.text = propertyAddressValue;
      propertyIdLabel.value.text = propertiesStub[2].propertyAddressID.toString();
      compositeData.indexed.labels.pop();
      compositeData.indexed.labels.push(propertyLabel, propertyAddressLabel, propertyIdLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getProperties.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingProperty(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
        ));

      it('should call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          propertyBodyRequest,
          propertyLabel.value.text,
          '1',
          null
        ));

      it('should patchState for selectedProperty and accountingSystemId', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedProperty: propertiesStub[2],
          accountingSystemId: propertiesStub[2].accountingSystemID,
        }));

      it('should dispatch SetLookupProperty for ship to field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupProperty(propertiesStub[2], propertyField.key)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
        ));
    });

    describe('when field is shipto & shipto record is NOT found', () => {
      const responseStub = {
        count: 2,
        records: propertiesStub,
      };
      const compositeData = getCompositeDataStub();
      const propertyLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const propertyAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.ShipToAddress
      );
      const propertyField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const formattedFieldsStub = [propertyField];
      const propertyBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: '102 Franklin',
        page: 1,
        pageSize: 50,
      };

      propertyLabel.value.text = propertiesStub[0].propertyName;
      propertyAddressLabel.value.text = '';
      compositeData.indexed.labels.pop();
      compositeData.indexed.labels.push(propertyLabel, propertyAddressLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getProperties.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingProperty(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
        ));

      it('should call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          propertyBodyRequest,
          propertyLabel.value.text,
          '1',
          null
        ));

      it('should NOT patchState for selectedProperty and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
          selectedProperty: propertiesStub[0],
          accountingSystemId: propertiesStub[0].accountingSystemID,
        }));

      it('should dispatch UpdateFormattedFields for ship to field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(propertyField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
        ));
    });

    describe('when getting 0 results back from API', () => {
      const responseStub = {
        count: 0,
        records: [],
      };
      const compositeData = getCompositeDataStub();
      const propertyLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const propertyAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.ShipToAddress
      );
      const propertyField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const formattedFieldsStub = [propertyField];
      const propertyBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: '102 Franklin',
        page: 1,
        pageSize: 50,
      };

      propertyLabel.value.text = propertiesStub[0].propertyName;
      propertyAddressLabel.value.text = '';
      compositeData.indexed.labels.pop();
      compositeData.indexed.labels.push(propertyLabel, propertyAddressLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getProperties.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingProperty(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
        ));

      it('should call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          propertyBodyRequest,
          propertyLabel.value.text,
          '1',
          null
        ));

      it('should dispatch 1 action to update shipToName field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(propertyField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
        ));
    });

    describe('when getting no response back from API', () => {
      const responseStub = null;
      const compositeData = getCompositeDataStub();
      const propertyLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const propertyAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.ShipToAddress
      );
      const propertyField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const formattedFieldsStub = [propertyField];
      const propertyBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: '102 Franklin',
        page: 1,
        pageSize: 50,
      };

      propertyLabel.value.text = propertiesStub[0].propertyName;
      propertyAddressLabel.value.text = '';
      compositeData.indexed.labels.pop();
      compositeData.indexed.labels.push(propertyLabel, propertyAddressLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getProperties.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingProperty(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: true })
        ));

      it('should call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          propertyBodyRequest,
          propertyLabel.value.text,
          '1',
          null
        ));

      it('should dispatch 1 action to update shipToName field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(propertyField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, shipToLoading: false })
        ));
    });

    describe('when property field is NULL', () => {
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels.pop();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        indexingDocumentFieldsState.setExistingProperty(stateContextStub);
      });

      it('should NOT dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());

      it('should NOT call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).not.toHaveBeenCalled());

      it('should NOT patchState for selectedProperty and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());
    });

    describe('when receiving an error status other than 404 back from the API', () => {
      const compositeData = getCompositeDataStub();
      const propertyLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const propertyAddressLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.ShipToAddress
      );

      propertyLabel.value.text = propertiesStub[0].propertyName;
      propertyAddressLabel.value.text = '';
      compositeData.indexed.labels.pop();
      compositeData.indexed.labels.push(propertyLabel, propertyAddressLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        lookupApiServiceStub.getProperties.mockReturnValue(throwError(() => ({ status: 501 })));
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState.setExistingProperty(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(indexingHelperServiceStub.handleLookupError).toHaveBeenCalledTimes(1);

            done();
          },
        });
      });
    });
  });

  describe('Action: SetExistingCustomerAccountNumber', () => {
    describe('when field is customer account & customer account record is found', () => {
      const responseStub = {
        count: 2,
        records: customerAccountsStub,
      };
      const compositeData = getCompositeDataStub();
      const customerAcctLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const customerAcctIdLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.VendorAccountId
      );
      const customerAcctField = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );

      customerAcctField.value = 'sean test api';
      const formattedFieldsStub = [customerAcctField];

      customerAcctLabel.value.text = 'sean test api';
      customerAcctLabel.value.confidence = 1;
      customerAcctIdLabel.value.text = customerAccountsStub[3].vendorAccountId.toString();
      compositeData.indexed.labels.push(customerAcctLabel, customerAcctIdLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          selectedSupplier: { vendorID: '1' } as any,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingCustomerAccountNumber(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: true })
        ));

      it('should call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          customerAcctLabel.value.text,
          '1'
        ));

      it('should patchState for selectedCustomerAccount and customerAccountFieldValue', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedCustomerAccount: customerAccountsStub[3],
          customerAccountFieldValue: `${customerAccountsStub[3].accountNo}`,
        }));

      it('should dispatch UpdateFormattedFields for customer account field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(customerAcctField),
          new actions.SetDueDate(),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: false })
        ));
    });

    describe('when field is customer account & customer account record is NOT found', () => {
      const responseStub = {
        count: 2,
        records: customerAccountsStub,
      };
      const compositeData = getCompositeDataStub();
      const customerAcctLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const customerAcctField = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );

      customerAcctField.value = 'test';
      const formattedFieldsStub = [customerAcctField];

      customerAcctLabel.value.text = 'mock';
      customerAcctLabel.value.confidence = 1;
      compositeData.indexed.labels.push(customerAcctLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          selectedSupplier: { vendorID: '1' } as any,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingCustomerAccountNumber(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: true })
        ));

      it('should call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          customerAcctLabel.value.text,
          '1'
        ));

      it('should NOT patchState for selectedCustomerAccount and customerAccountFieldValue', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
          selectedCustomerAccount: customerAccountsStub[0],
          customerAccountFieldValue: `${customerAccountsStub[0].accountNo} ${customerAccountsStub[0].propertyName}`,
        }));

      it('should dispatch SetDueDate', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(customerAcctField),
          new actions.SetDueDate(),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: false })
        ));
    });

    describe('when field is customer account & customer account record is NOT active', () => {
      const responseStub = {
        count: 2,
        records: customerAccountsStub,
      };
      const compositeData = getCompositeDataStub();
      const customerAcctLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const customerAcctField = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );

      customerAcctField.value = 'none';
      const formattedFieldsStub = [customerAcctField];

      customerAcctLabel.value.text = 'none';
      customerAcctLabel.value.confidence = 1;
      compositeData.indexed.labels.push(customerAcctLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          selectedSupplier: { vendorID: '1' } as any,
          formattedFields: formattedFieldsStub,
        });
        responseStub.records[0].isActive = false;
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingCustomerAccountNumber(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: true })
        ));

      it('should call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          customerAcctLabel.value.text,
          '1'
        ));

      it('should NOT patchState for selectedCustomerAccount and customerAccountFieldValue', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(2, {
          selectedCustomerAccount: customerAccountsStub[0],
          customerAccountFieldValue: `${customerAccountsStub[0].accountNo} ${customerAccountsStub[0].propertyName}`,
        }));

      it('should dispatch SetDueDate', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(customerAcctField),
          new actions.SetDueDate(),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: false })
        ));
    });

    describe('when getting 0 results back from API', () => {
      const responseStub = {
        count: 0,
        records: [],
      };
      const compositeData = getCompositeDataStub();
      const customerAcctLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const customerAcctField = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const formattedFieldsStub = [customerAcctField];

      customerAcctLabel.value.text = 'mock';
      customerAcctLabel.value.confidence = 1;
      compositeData.indexed.labels.push(customerAcctLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          selectedSupplier: { vendorID: '1' } as any,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingCustomerAccountNumber(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: true })
        ));

      it('should call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          customerAcctLabel.value.text,
          '1'
        ));

      it('should dispatch 1 action to update customer account field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(customerAcctField),
          new actions.SetDueDate(),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: false })
        ));
    });

    describe('when getting no response back from API', () => {
      const responseStub = null;
      const compositeData = getCompositeDataStub();
      const customerAcctLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const customerAcctField = getFieldBaseStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const formattedFieldsStub = [customerAcctField];

      customerAcctLabel.value.text = 'mock';
      customerAcctLabel.value.confidence = 1;
      compositeData.indexed.labels.push(customerAcctLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          selectedSupplier: { vendorID: '1' } as any,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingCustomerAccountNumber(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: true })
        ));

      it('should call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          customerAcctLabel.value.text,
          '1'
        ));

      it('should dispatch 1 action to update customer account field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new actions.UpdateFormattedFields(customerAcctField),
          new actions.SetDueDate(),
        ]));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, customerAccountLoading: false })
        ));
    });

    describe('when customer account field is NULL', () => {
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels.pop();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        indexingDocumentFieldsState.setExistingCustomerAccountNumber(stateContextStub);
      });

      it('should NOT dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());

      it('should NOT call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).not.toHaveBeenCalled());

      it('should NOT patchState for selectedCustomerAccount and customerAccountFieldValue', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());
    });

    describe('when receiving an error status other than 404 back from the API', () => {
      const compositeData = getCompositeDataStub();
      const customerAcctLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );

      customerAcctLabel.value.text = 'mock';
      compositeData.indexed.labels.push(customerAcctLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState.setExistingCustomerAccountNumber(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(indexingHelperServiceStub.handleLookupError).toHaveBeenCalledTimes(1);

            done();
          },
        });
      });
    });
  });

  describe('Action: SetExistingNewAccountNumber', () => {
    const compositeData = getCompositeDataStub();
    const customerAcctLabel = getIndexedLabelStub(
      DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );
    const customerAcctField = getFieldBaseStub(
      DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );
    const formattedFieldsStub = [customerAcctField];

    customerAcctLabel.value.text = 'mock';
    compositeData.indexed.labels.push(customerAcctLabel);

    beforeEach(() => {
      storeStub.selectSnapshot.mockImplementation(cb =>
        cb({
          indexingPage: {
            compositeData,
            buyerId: '1',
          },
        })
      );
      stateContextStub.getState.mockReturnValue({
        formattedFields: formattedFieldsStub,
      });
      indexingDocumentFieldsState.setExistingNewAccountNumber(stateContextStub);
    });

    it('should patchState for selectedCustomerAccount using label value & for customerAccountFieldValue', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        selectedCustomerAccount: {
          accountNo: customerAcctLabel.value.text,
          vendorAccountId: 0,
          propertyId: null,
          propertyName: '',
          termTypeId: null,
          allowRetainage: null,
          isActive: null,
        },
        customerAccountFieldValue: customerAcctLabel.value.text,
      }));

    it('should dispatch UpdateFormattedFields for customer account field', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
        1,
        new actions.UpdateFormattedFields(customerAcctField)
      ));
  });

  describe('Action: SetExistingOrderedBy', () => {
    describe('when field orderedBy is found', () => {
      const responseStub = {
        count: 2,
        records: orderedByStub,
      };
      const compositeData = getCompositeDataStub();
      const orderedByName = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.OrderedByName);
      const orderedById = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const orderedByField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const formattedFieldsStub = [orderedByField];

      orderedByName.value.text = 'text';
      orderedByName.value.confidence = 1;
      orderedById.value.text = '1234';
      orderedById.value.confidence = 1;
      compositeData.indexed.labels.push(orderedByName);
      compositeData.indexed.labels.push(orderedById);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getUsers.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingOrderedBy(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: true })
        ));

      it('should call lookupApiService getUsers function', () =>
        expect(lookupApiServiceStub.getUsers).toHaveBeenNthCalledWith(
          1,
          orderedByName.value.text,
          '1'
        ));

      it('should patchState for selectedOrderedBy', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedOrderedBy: orderedByStub[0],
        }));

      it('should dispatch UpdateFormattedFields for order by field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(orderedByField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: false })
        ));
    });

    describe('when field is orderedBy & orderedBy record is NOT found', () => {
      const compositeData = getCompositeDataStub();
      const orderedByName = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.OrderedByName);
      const orderedByIdLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const orderedByField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const formattedFieldsStub = [orderedByField];

      orderedByName.value.text = 'text';
      orderedByName.value.confidence = 1;
      orderedByIdLabel.value.text = '1234';
      orderedByIdLabel.value.confidence = 1;
      compositeData.indexed.labels.push(orderedByName);
      compositeData.indexed.labels.push(orderedByIdLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getUsers.mockReturnValue(throwError(() => ({ status: 500 })));
        indexingDocumentFieldsState.setExistingOrderedBy(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: true })
        ));

      it('should call lookupApiService getUsers function', () =>
        expect(lookupApiServiceStub.getUsers).toHaveBeenNthCalledWith(
          1,
          orderedByName.value.text,
          '1'
        ));

      it('should NOT patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: false })
        ));
    });

    describe('when getting 0 results back from API', () => {
      const responseStub = {
        count: 0,
        records: [],
      };
      const compositeData = getCompositeDataStub();
      const orderedByName = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.OrderedByName);
      const orderedByIdLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const orderedByField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const formattedFieldsStub = [orderedByField];

      orderedByName.value.text = 'text';
      orderedByName.value.confidence = 1;
      orderedByIdLabel.value.text = '1234';
      orderedByIdLabel.value.confidence = 1;
      compositeData.indexed.labels.push(orderedByName);
      compositeData.indexed.labels.push(orderedByIdLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getUsers.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingOrderedBy(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: true })
        ));

      it('should call lookupApiService getUsers function', () =>
        expect(lookupApiServiceStub.getUsers).toHaveBeenNthCalledWith(
          1,
          orderedByName.value.text,
          '1'
        ));

      it('should dispatch UpdateFormattedFields for order by field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(orderedByField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: false })
        ));
    });

    describe('when getting no response back from API', () => {
      const responseStub = null;
      const compositeData = getCompositeDataStub();
      const orderedByName = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.OrderedByName);
      const orderedByIdLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const orderedByField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy);
      const formattedFieldsStub = [orderedByField];

      orderedByName.value.text = 'text';
      orderedByName.value.confidence = 1;
      orderedByIdLabel.value.text = '1234';
      orderedByIdLabel.value.confidence = 1;
      compositeData.indexed.labels.push(orderedByName);
      compositeData.indexed.labels.push(orderedByIdLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getUsers.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingOrderedBy(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: true })
        ));

      it('should call lookupApiService getUsers function', () =>
        expect(lookupApiServiceStub.getUsers).toHaveBeenNthCalledWith(
          1,
          orderedByName.value.text,
          '1'
        ));

      it('should dispatch UpdateFormattedFields for order by field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(orderedByField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, orderedByLoading: false })
        ));
    });

    describe('when orderedBy field is NULL', () => {
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        indexingDocumentFieldsState.setExistingOrderedBy(stateContextStub);
      });

      it('should NOT dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());

      it('should NOT call lookupApiService getUsers function', () =>
        expect(lookupApiServiceStub.getUsers).not.toHaveBeenCalled());

      it('should NOT patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: SetExistingWorkflow', () => {
    describe('when field workflow is found', () => {
      const responseStub = {
        count: 2,
        records: workflowStub,
      };
      const compositeData = getCompositeDataStub();
      const workflowName = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.WorkflowName);
      const workflowId = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Workflow);
      const workFlowField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
      const formattedFieldsStub = [workFlowField];

      workflowName.value.text = 'text';
      workflowName.value.confidence = 1;
      workflowId.value.text = '1234';
      workflowId.value.confidence = 1;
      compositeData.indexed.labels.push(workflowName);
      compositeData.indexed.labels.push(workflowId);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getWorkflow.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingWorkflow(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: true })
        ));

      it('should call lookupApiService getWorkflow function', () =>
        expect(lookupApiServiceStub.getWorkflow).toHaveBeenNthCalledWith(
          1,
          workflowName.value.text,
          '1'
        ));

      it('should patchState for selectedWorkflow', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedWorkflow: workflowStub[0],
        }));

      it('should dispatch UpdateFormattedFields action for workflow field', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(workFlowField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: false })
        ));
    });

    describe('when field is workflow & workflowId record is NOT found', () => {
      const compositeData = getCompositeDataStub();
      const workflowNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.WorkflowName);
      const workflowLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Workflow);
      workflowLabel.value.text = 'text';
      workflowLabel.value.confidence = 1;
      workflowNameLabel.value.text = '1234';
      workflowNameLabel.value.confidence = 1;
      compositeData.indexed.labels.push(workflowLabel);
      compositeData.indexed.labels.push(workflowNameLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
        });
        lookupApiServiceStub.getWorkflow.mockReturnValue(throwError(() => ({ status: 500 })));
        indexingDocumentFieldsState.setExistingWorkflow(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: true })
        ));

      it('should call lookupApiService getWorkflow function', () =>
        expect(lookupApiServiceStub.getWorkflow).toHaveBeenNthCalledWith(
          1,
          workflowNameLabel.value.text,
          '1'
        ));

      it('should NOT patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: false })
        ));
    });

    describe('when getting 0 results back from API', () => {
      const responseStub = {
        count: 0,
        records: [],
      };
      const compositeData = getCompositeDataStub();
      const workflowName = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.WorkflowName);
      const workflowId = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Workflow);
      const workFlowField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
      const formattedFieldsStub = [workFlowField];

      workflowName.value.text = 'text';
      workflowName.value.confidence = 1;
      workflowId.value.text = '1234';
      workflowId.value.confidence = 1;
      compositeData.indexed.labels.push(workflowName);
      compositeData.indexed.labels.push(workflowId);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getWorkflow.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingWorkflow(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: true })
        ));

      it('should call lookupApiService getWorkflow function', () =>
        expect(lookupApiServiceStub.getWorkflow).toHaveBeenNthCalledWith(
          1,
          workflowName.value.text,
          '1'
        ));

      it('should dispatch 1 action to update workFlow field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(workFlowField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: false })
        ));
    });

    describe('when getting no response back from API', () => {
      const responseStub = null;
      const compositeData = getCompositeDataStub();
      const workflowName = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.WorkflowName);
      const workflowId = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Workflow);
      const workFlowField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow);
      const formattedFieldsStub = [workFlowField];

      workflowName.value.text = 'text';
      workflowName.value.confidence = 1;
      workflowId.value.text = '1234';
      workflowId.value.confidence = 1;
      compositeData.indexed.labels.push(workflowName);
      compositeData.indexed.labels.push(workflowId);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          lookupLoadingState: lookupLoadingStateStub,
          formattedFields: formattedFieldsStub,
        });
        lookupApiServiceStub.getWorkflow.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.setExistingWorkflow(stateContextStub).subscribe();
      });

      it('should dispatch LookupLoading action with true', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: true })
        ));

      it('should call lookupApiService getWorkflow function', () =>
        expect(lookupApiServiceStub.getWorkflow).toHaveBeenNthCalledWith(
          1,
          workflowName.value.text,
          '1'
        ));

      it('should dispatch 1 action to update workFlow field values', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.UpdateFormattedFields(workFlowField)
        ));

      it('should dispatch LookupLoading action with false', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          3,
          new actions.SetLookupLoading({ ...lookupLoadingStateStub, workflowLoading: false })
        ));
    });

    describe('when workflow field is NULL', () => {
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        indexingDocumentFieldsState.setExistingWorkflow(stateContextStub);
      });

      it('should NOT dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());

      it('should NOT call lookupApiService getWorkflow function', () =>
        expect(lookupApiServiceStub.getWorkflow).not.toHaveBeenCalled());

      it('should NOT patchState for selectedSupplier and accountingSystemId', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: SetCustomerAccount', () => {
    describe('when lookupValue is NOT null', () => {
      const lookupFieldsStub = fieldBaseStub;

      beforeEach(() => {
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.CustomerAccountNumber;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setCustomerAccount(stateContextStub, {
          lookupValue: customerAccountsStub[0],
        });
      });

      it('should patchState for formGroupInstance & lastLabelUpdated & customerAccount', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          customerAccounts: null,
          customerAccountFieldValue: `${customerAccountsStub[0].accountNo} (${customerAccountsStub[0].propertyName})`,
          selectedCustomerAccount: customerAccountsStub[0],
        }));

      it('should dispatch UpdateOnManualIntervention action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new actions.PredetermineShipTo(customerAccountsStub[0]),
          new UpdateAdditionalLookupValue(
            undefined,
            customerAccountsStub[0].vendorAccountId.toString(),
            DocumentLabelKeys.nonLookupLabels.VendorAccountId
          ),
          new actions.SetDueDate(),
        ]));
    });

    describe('when lookupValue is null', () => {
      const lookupFieldsStub = fieldBaseStub;

      beforeEach(() => {
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.CustomerAccountNumber;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setCustomerAccount(stateContextStub, {
          lookupValue: null,
        });
      });

      it('should patchState for formGroupInstance & lastLabelUpdated & customerAccount', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          customerAccounts: null,
          customerAccountFieldValue: '',
          selectedCustomerAccount: null,
        }));

      it('should dispatch UpdateOnManualIntervention action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new actions.PredetermineShipTo(null),
          new UpdateAdditionalLookupValue(undefined, '0', 'VendorAccountId'),
          new actions.SetDueDate(),
        ]));
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: SetLookupProperty', () => {
    describe('when lookupValue is NOT null', () => {
      const lookupFieldsStub = fieldBaseStub;
      beforeEach(() => {
        lookupFieldsStub.push(shipToAddressFieldStub);
        lookupFieldsStub.push(shipToCodeFieldStub);
        lookupFieldsStub.push(shipToIdFieldStub);
        lookupFieldsStub.push(shipToAliasFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.ShipToName;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupProperty(stateContextStub, {
          lookupValue: propertiesStub[0],
          field: DocumentLabelKeys.lookupLabels.ShipToName,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for ship-to attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.ShipToName,
          selectedProperty: propertiesStub[0],
          accountingSystemId: propertiesStub[0].accountingSystemID,
          properties: null,
          isDefaultShipToLoading: false,
        }));

      it('should dispatch UpdateOnManualIntervention action for ShipToField & ShipToAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[1]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateShipToAddressLabel(lookupFieldsStub[1], []),
          new UpdateAdditionalLookupValue(
            undefined,
            propertiesStub[0].propertyCode,
            DocumentLabelKeys.nonLookupLabels.ShipToCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            propertiesStub[0].propertyAddressID.toString(),
            DocumentLabelKeys.nonLookupLabels.ShipToId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            propertiesStub[0].alias,
            DocumentLabelKeys.nonLookupLabels.ShipToAlias
          ),
        ]));
    });

    describe('when ShipToCode label exists', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();
      const shipToCodeLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToCode);
      const shipToId = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToId);
      const shipToAlias = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToAlias);
      compositeData.indexed.labels.push(shipToCodeLabel);
      compositeData.indexed.labels.push(shipToId);
      compositeData.indexed.labels.push(shipToAlias);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData, associatedLookupFieldValue: null } })
        );
        lookupFieldsStub.push(shipToAddressFieldStub);
        lookupFieldsStub.push(shipToCodeFieldStub);
        lookupFieldsStub.push(shipToIdFieldStub);
        lookupFieldsStub.push(shipToAliasFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.ShipToName;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupProperty(stateContextStub, {
          lookupValue: propertiesStub[0],
          field: DocumentLabelKeys.lookupLabels.ShipToName,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for ship-to attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.ShipToName,
          selectedProperty: propertiesStub[0],
          accountingSystemId: propertiesStub[0].accountingSystemID,
          properties: null,
          isDefaultShipToLoading: false,
        }));

      it('should dispatch UpdateOnManualIntervention action for ShipToField & ShipToAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[1]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateShipToAddressLabel(lookupFieldsStub[1], []),
          new UpdateAdditionalLookupValue(
            shipToCodeLabel,
            propertiesStub[0].propertyCode,
            DocumentLabelKeys.nonLookupLabels.ShipToCode
          ),
          new UpdateAdditionalLookupValue(
            shipToId,
            propertiesStub[0].propertyAddressID.toString(),
            DocumentLabelKeys.nonLookupLabels.ShipToId
          ),
          new UpdateAdditionalLookupValue(
            shipToAlias,
            propertiesStub[0].alias,
            DocumentLabelKeys.nonLookupLabels.ShipToAlias
          ),
        ]));
    });

    describe('when ShipToCode label exists but lookupValue is NULL', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();
      const shipToCodeLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToCode);
      const shipToId = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToId);
      const shipToAlias = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToAlias);
      compositeData.indexed.labels.push(shipToCodeLabel);
      compositeData.indexed.labels.push(shipToId);
      compositeData.indexed.labels.push(shipToAlias);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData, associatedLookupFieldValue: null } })
        );
        lookupFieldsStub.push(shipToAddressFieldStub);
        lookupFieldsStub.push(shipToCodeFieldStub);
        lookupFieldsStub.push(shipToIdFieldStub);
        lookupFieldsStub.push(shipToAliasFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.ShipToName;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupProperty(stateContextStub, {
          lookupValue: null,
          field: DocumentLabelKeys.lookupLabels.ShipToName,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for ship-to attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.ShipToName,
          selectedProperty: null,
          properties: null,
          isDefaultShipToLoading: false,
        }));

      it('should dispatch UpdateOnManualIntervention action for ShipToField & ShipToAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[1]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateShipToAddressLabel(lookupFieldsStub[1], []),
          new UpdateAdditionalLookupValue(
            shipToCodeLabel,
            undefined,
            DocumentLabelKeys.nonLookupLabels.ShipToCode
          ),
          new UpdateAdditionalLookupValue(
            shipToId,
            undefined,
            DocumentLabelKeys.nonLookupLabels.ShipToId
          ),
          new UpdateAdditionalLookupValue(
            shipToAlias,
            undefined,
            DocumentLabelKeys.nonLookupLabels.ShipToAlias
          ),
        ]));
    });

    describe('when associatedLookupFieldValue is NOT NULL', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({ indexingPage: { compositeData, associatedLookupValue: {} as any } })
        );
        lookupFieldsStub.push(shipToAddressFieldStub);
        lookupFieldsStub.push(shipToCodeFieldStub);
        lookupFieldsStub.push(shipToIdFieldStub);
        lookupFieldsStub.push(shipToAliasFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.ShipToName;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupProperty(stateContextStub, {
          lookupValue: null,
          field: DocumentLabelKeys.lookupLabels.ShipToName,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should dispatch UpdateOnManualIntervention action for ShipToField. UpdateShipToAddressLabel with ship to names bounding box info. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[1]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateShipToAddressLabel(
            lookupFieldsStub[1],
            compositeData.indexed.labels[1].value.boundingBox
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.ShipToCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.ShipToId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.ShipToAlias
          ),
        ]));
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: SetLookupSupplier', () => {
    describe('when lookupValue is NOT null', () => {
      const lookupFieldsStub = fieldBaseStub;

      beforeEach(() => {
        lookupFieldsStub.push(supplierAddressFieldStub);
        lookupFieldsStub.push(supplierRegistrationCodeFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.Supplier;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupSupplier(stateContextStub, {
          lookupValue: suppliersStub[0],
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Supplier,
          selectedSupplier: suppliersStub[0],
          accountingSystemId: suppliersStub[0].accountingSystemID,
          suppliers: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for Supplier & SupplierAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[15]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateSupplierAddressLabel(lookupFieldsStub[15], []),
          new RemoveCustomerAccountActivity(),
          new actions.SetCustomerAccount(null),
          new actions.PredetermineCustomerAccountNumber(7678846),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorRegistrationCode,
            DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorID.toString(),
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].aliases,
            DocumentLabelKeys.nonLookupLabels.SupplierAlias
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorExternalSystemID,
            DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          ),
        ]));
    });

    describe('when SupplierCode label exists', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();
      const supplierCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      compositeData.indexed.labels.push(supplierCodeLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData, associatedLookupFieldValue: null } })
        );
        lookupFieldsStub.push(supplierAddressFieldStub);
        lookupFieldsStub.push(supplierRegistrationCodeFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.Supplier;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupSupplier(stateContextStub, {
          lookupValue: suppliersStub[0],
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Supplier,
          selectedSupplier: suppliersStub[0],
          accountingSystemId: suppliersStub[0].accountingSystemID,
          suppliers: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for Supplier & SupplierAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[15]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateSupplierAddressLabel(lookupFieldsStub[15], []),
          new RemoveCustomerAccountActivity(),
          new actions.SetCustomerAccount(null),
          new actions.PredetermineCustomerAccountNumber(7678846),
          new UpdateAdditionalLookupValue(
            supplierCodeLabel,
            suppliersStub[0].vendorRegistrationCode,
            DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorID.toString(),
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].aliases,
            DocumentLabelKeys.nonLookupLabels.SupplierAlias
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorExternalSystemID,
            DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          ),
        ]));
    });

    describe('when SupplierId label exists', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();
      const supplierIdLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      compositeData.indexed.labels.push(supplierIdLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData, associatedLookupFieldValue: null } })
        );
        lookupFieldsStub.push(supplierAddressFieldStub);
        lookupFieldsStub.push(supplierRegistrationCodeFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.Supplier;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupSupplier(stateContextStub, {
          lookupValue: suppliersStub[0],
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Supplier,
          selectedSupplier: suppliersStub[0],
          accountingSystemId: suppliersStub[0].accountingSystemID,
          suppliers: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for Supplier & SupplierAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[15]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateSupplierAddressLabel(lookupFieldsStub[15], []),
          new RemoveCustomerAccountActivity(),
          new actions.SetCustomerAccount(null),
          new actions.PredetermineCustomerAccountNumber(7678846),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorRegistrationCode,
            DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
          ),
          new UpdateAdditionalLookupValue(
            supplierIdLabel,
            suppliersStub[0].vendorID.toString(),
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].aliases,
            DocumentLabelKeys.nonLookupLabels.SupplierAlias
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorExternalSystemID,
            DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          ),
        ]));
    });

    describe('when SupplierAlias label exists', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();
      const supplierAliasLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierAlias
      );
      compositeData.indexed.labels.push(supplierAliasLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData, associatedLookupFieldValue: null } })
        );
        lookupFieldsStub.push(supplierAddressFieldStub);
        lookupFieldsStub.push(supplierRegistrationCodeFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.Supplier;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupSupplier(stateContextStub, {
          lookupValue: suppliersStub[0],
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Supplier,
          selectedSupplier: suppliersStub[0],
          accountingSystemId: suppliersStub[0].accountingSystemID,
          suppliers: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for Supplier & SupplierAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[15]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateSupplierAddressLabel(lookupFieldsStub[15], []),
          new RemoveCustomerAccountActivity(),
          new actions.SetCustomerAccount(null),
          new actions.PredetermineCustomerAccountNumber(7678846),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorRegistrationCode,
            DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorID.toString(),
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new UpdateAdditionalLookupValue(
            supplierAliasLabel,
            suppliersStub[0].aliases,
            DocumentLabelKeys.nonLookupLabels.SupplierAlias
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorExternalSystemID,
            DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          ),
        ]));
    });

    describe('when SupplierCode label exists but lookupValue is NULL', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();
      const supplierCodeLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      );
      compositeData.indexed.labels.push(supplierCodeLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData, associatedLookupFieldValue: null } })
        );
        lookupFieldsStub.push(supplierAddressFieldStub);
        lookupFieldsStub.push(supplierRegistrationCodeFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.Supplier;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupSupplier(stateContextStub, {
          lookupValue: null,
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Supplier,
          selectedSupplier: null,
          suppliers: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for Supplier & SupplierAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[15]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateSupplierAddressLabel(lookupFieldsStub[15], []),
          new RemoveCustomerAccountActivity(),
          new actions.SetCustomerAccount(null),
          new actions.PredetermineCustomerAccountNumber(undefined),
          new UpdateAdditionalLookupValue(
            supplierCodeLabel,
            undefined,
            DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.SupplierAlias
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          ),
        ]));
    });

    describe('when lookupValue is null', () => {
      const lookupFieldsStub = fieldBaseStub;

      beforeEach(() => {
        lookupFieldsStub.push(supplierAddressFieldStub);
        lookupFieldsStub.push(supplierRegistrationCodeFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.Supplier;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupSupplier(stateContextStub, {
          lookupValue: null,
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Supplier,
          selectedSupplier: null,
          accountingSystemId: undefined,
          suppliers: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for Supplier & SupplierAddress. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[15]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateSupplierAddressLabel(lookupFieldsStub[15], []),
          new RemoveCustomerAccountActivity(),
          new actions.SetCustomerAccount(null),
          new actions.PredetermineCustomerAccountNumber(undefined),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.SupplierAlias
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            undefined,
            DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          ),
        ]));
    });

    describe('when associatedLookupFieldValue is NOT NULL', () => {
      const lookupFieldsStub = fieldBaseStub;
      const compositeData = getCompositeDataStub();
      const supplierLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      compositeData.indexed.labels.push(supplierLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              associatedLookupValue: {} as any,
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        lookupFieldsStub.push(supplierAddressFieldStub);
        lookupFieldsStub.push(supplierRegistrationCodeFieldStub);
        lookupFieldsStub[0].key = DocumentLabelKeys.lookupLabels.Supplier;

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupSupplier(stateContextStub, {
          lookupValue: suppliersStub[0],
          field: DocumentLabelKeys.lookupLabels.Supplier,
        });
      });

      afterEach(() => {
        lookupFieldsStub.pop();
        lookupFieldsStub.pop();
      });

      it('should dispatch UpdateOnManualIntervention action for Supplier. UpdateSupplierAddressLabel with supplier bounding box info. Also dispatch UpdateAdditionalLookupValue', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new actions.UpdateFormattedFields(lookupFieldsStub[15]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateSupplierAddressLabel(lookupFieldsStub[15], []),
          new RemoveCustomerAccountActivity(),
          new actions.SetCustomerAccount(null),
          new actions.PredetermineCustomerAccountNumber(7678846),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorRegistrationCode,
            DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorID.toString(),
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].aliases,
            DocumentLabelKeys.nonLookupLabels.SupplierAlias
          ),
          new UpdateAdditionalLookupValue(
            undefined,
            suppliersStub[0].vendorExternalSystemID,
            DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          ),
        ]));
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: SetLookupOrderedBy', () => {
    describe('when lookupValue is NOT null', () => {
      const compositeData = getCompositeDataStub();
      const lookupFieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy)];
      const orderedByNameLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.OrderedByName
      );
      orderedByNameLabel.value.confidence = 1;
      orderedByNameLabel.value.text = '1234';
      compositeData.indexed.labels.push(orderedByNameLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData } })
        );

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupOrderedBy(stateContextStub, {
          lookupValue: orderedByStub[0],
          field: DocumentLabelKeys.lookupLabels.OrderedBy,
        });
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.OrderedBy,
          orderedBy: null,
          selectedOrderedBy: orderedByStub[0],
        }));

      it('should dispatch UpdateOnManualIntervention action for OrderedBy and also dispatch UpdateAdditionalLookupvalue to orderedByName.', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            orderedByNameLabel,
            `${orderedByStub[0].firstName} ${orderedByStub[0].lastName}`,
            DocumentLabelKeys.nonLookupLabels.OrderedByName
          ),
        ]));
    });

    describe('when lookupValue is NULL', () => {
      const compositeData = getCompositeDataStub();
      const lookupFieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy)];
      const orderedByNameLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.OrderedByName
      );
      orderedByNameLabel.value.confidence = 1;
      orderedByNameLabel.value.text = '1234';
      compositeData.indexed.labels.push(orderedByNameLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData } })
        );

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupOrderedBy(stateContextStub, {
          lookupValue: null,
          field: DocumentLabelKeys.lookupLabels.OrderedBy,
        });
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.OrderedBy,
          orderedBy: null,
          selectedOrderedBy: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for OrderedBy and also dispatch UpdateAdditionalLookupvalue to orderedByName.', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            orderedByNameLabel,
            '',
            DocumentLabelKeys.nonLookupLabels.OrderedByName
          ),
        ]));
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: SetLookupWorkflow', () => {
    describe('when lookupValue is NOT null', () => {
      const compositeData = getCompositeDataStub();
      const lookupFieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow)];
      const workflowNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.WorkflowName);

      workflowNameLabel.value.confidence = 1;
      workflowNameLabel.value.text = '1234';
      compositeData.indexed.labels.push(workflowNameLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData } })
        );

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupWorkflow(stateContextStub, {
          lookupValue: workflowStub[0],
          field: DocumentLabelKeys.lookupLabels.Workflow,
        });
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Workflow,
          workflow: null,
          selectedWorkflow: workflowStub[0],
        }));

      it('should dispatch UpdateOnManualIntervention action for workflow and also dispatch UpdateAdditionalLookupvalue to workflowName.', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            workflowNameLabel,
            workflowStub[0].name,
            DocumentLabelKeys.nonLookupLabels.WorkflowName
          ),
        ]));
    });

    describe('when lookupValue is NULL', () => {
      const compositeData = getCompositeDataStub();
      const lookupFieldsStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow)];
      const workflowNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.WorkflowName);
      workflowNameLabel.value.confidence = 1;
      workflowNameLabel.value.text = '1234';
      compositeData.indexed.labels.push(workflowNameLabel);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData } })
        );

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          fields: lookupFieldsStub,
        });
        indexingDocumentFieldsState.setLookupWorkflow(stateContextStub, {
          lookupValue: null,
          field: DocumentLabelKeys.lookupLabels.Workflow,
        });
      });

      it('should patchState for property attributes', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          lastLabelUpdated: DocumentLabelKeys.lookupLabels.Workflow,
          workflow: null,
          selectedWorkflow: null,
        }));

      it('should dispatch UpdateOnManualIntervention action for workflow and also dispatch UpdateAdditionalLookupvalue to workflowName.', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            workflowNameLabel,
            '',
            DocumentLabelKeys.nonLookupLabels.WorkflowName
          ),
        ]));
    });

    describe('when receiving a different 404 error back from the API', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ selectedSupplier: suppliersStub[0] });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 501 }))
        );
      });

      it('should throw an error toast', done => {
        indexingDocumentFieldsState
          .queryLookupCustomerAccounts(stateContextStub, { searchText: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleLookupError).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: PredetermineCustomerAccountNumber', () => {
    describe('when customeraccounts returned is greater than 1', () => {
      const responseStub = {
        count: 2,
        records: customerAccountsStub,
      };
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
        });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
        validatorServiceStub.required.mockReturnValue(() => null);
        indexingDocumentFieldsState
          .predetermineCustomerAccountNumber(stateContextStub, {
            supplierId: 44,
          })
          .subscribe();
      });

      it('should not dispatch SetCustomerAccount action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new actions.SetCustomerAccount(responseStub.records[0])
        ));

      it('should patchState for customerAccounts', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          customerAccounts: customerAccountsStub,
          isDefaultShipToLoading: true,
        }));
    });

    describe('when customeraccounts returned is only 1', () => {
      const responseStub = {
        count: 1,
        records: [customerAccountsStub[0]],
      };

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
        });
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        validatorServiceStub.lookupObjectValidator.mockReturnValue(() => null);
        validatorServiceStub.required.mockReturnValue(() => null);
        indexingDocumentFieldsState
          .predetermineCustomerAccountNumber(stateContextStub, {
            supplierId: 44,
          })
          .subscribe();
      });

      it('should dispatch SetCustomerAccount action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new actions.SetCustomerAccount(responseStub.records[0])
        ));

      it('should patchState for customerAccounts', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          customerAccounts: [customerAccountsStub[0]],
          isDefaultShipToLoading: true,
        }));
    });

    describe('when supplierId is null', () => {
      const responseStub = {
        count: 1,
        records: customerAccountsStub[0],
      };
      beforeEach(() => {
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.predetermineCustomerAccountNumber(stateContextStub, {
          supplierId: null,
        });
      });

      it('should dispatch SetCustomerAccount action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.SetCustomerAccount(null)
        ));

      it('should NOT patchState for customerAccounts', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
          customerAccounts: customerAccountsStub[0],
        }));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should not patchState at all or dispatch any actions', done => {
        indexingDocumentFieldsState
          .predetermineCustomerAccountNumber(stateContextStub, {
            supplierId: 44,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                customerAccounts: customerAccountsStub,
              });

              expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
                1,
                new actions.SetCustomerAccount([] as any)
              );

              done();
            },
          });
      });
    });
  });

  describe('Action: PredetermineShipTo', () => {
    describe('when customerAccount that is passed in is NULL', () => {
      beforeEach(() => {
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: null,
        });
      });

      it('should not dispatch any action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());

      it('should patchState with defaultShipToLoading false', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          isDefaultShipToLoading: false,
        }));
    });

    describe('when customerAccount that is passed in is NOT NULL and no property association', () => {
      beforeEach(() => {
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[2],
        });
      });

      it('should patchState with defaultShipToLoading false', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          isDefaultShipToLoading: false,
        }));
    });

    describe('when shipToFormValue has a value', () => {
      const formBuilder = new FormBuilder();
      const formGroup = formBuilder.group({
        [DocumentLabelKeys.lookupLabels.ShipToName]: 'mock',
      });

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: null,
          formGroupInstance: formGroup,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[2],
        });
      });

      it('should not dispatch any action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());

      it('should patchState with defaultShipToLoading false', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          isDefaultShipToLoading: false,
        }));
    });

    describe('when default ship to scenario property address is null', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: null,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[2],
        });
      });

      it('should not dispatch any action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());
    });

    describe('when default ship to scenario propertyid is null', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: null,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: <any>{ propertyAddress: { propertyId: null } },
        });
      });

      it('should not dispatch QueryLookupProperties action', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new actions.QueryLookupProperties(customerAccountsStub[1].propertyName)
        );
      });
    });

    describe('when default ship to scenario gets a -1 from propertyId', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: null,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[1],
        });
      });

      it('should not dispatch QueryLookupProperties action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new actions.QueryLookupProperties(customerAccountsStub[1].propertyName)
        ));
    });

    describe('when default ship to scenario already has a selectedProperty', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: propertiesStub[0],
          accountingSystemId: propertiesStub[0].accountingSystemID,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[0],
        });
      });

      it('should dispatch QueryLookupProperties action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.QueryLookupProperties(customerAccountsStub[0].propertyName)
        ));
    });

    describe('when default ship to scenario already has a selectedProperty and different accounting system', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: propertiesStub[0],
          accountingSystemId: 345345345,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[1],
        });
      });

      it('should not dispatch QueryLookupProperties action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new actions.QueryLookupProperties(customerAccountsStub[1].propertyName)
        ));
    });

    describe('when default ship to scenario does not have a selectedProperty', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: null,
          accountingSystemId: propertiesStub[0].accountingSystemID,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[0],
        });
      });

      it('should dispatch QueryLookupProperties action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.QueryLookupProperties(customerAccountsStub[0].propertyName)
        ));
    });

    describe('when default ship to scenario does not have a selectedProperty and different accounting system', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: null,
          accountingSystemId: propertiesStub[0].accountingSystemID,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[1],
        });
      });

      it('should not dispatch QueryLookupProperties action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new actions.QueryLookupProperties(customerAccountsStub[1].propertyName)
        ));
    });

    describe('when default ship to is inactive', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          selectedProperty: null,
          accountingSystemId: propertiesStub[0].accountingSystemID,
          formGroupInstance: formGroupInstanceStub,
        });
        const inactivePropertyCustAccount = customerAccountsStub[0];
        inactivePropertyCustAccount.propertyAddress.propertyIsActive = false;
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: inactivePropertyCustAccount,
        });
      });

      it('should call to show a warning toast', () =>
        expect(indexingHelperServiceStub.handleInactiveShipTo).toHaveBeenNthCalledWith(1));
    });

    describe('when default ship to scenario has multiple propertyaddresses', () => {
      beforeEach(() => {
        customerAccountsStub[0].propertyAddress.propertyAddressCount = 2;
        customerAccountsStub[0].propertyAddress.propertyIsActive = true;
        stateContextStub.getState.mockReturnValue({
          accountingSystemId: customerAccountsStub[0].propertyAddress.accountingSystemID,
          formGroupInstance: formGroupInstanceStub,
        });
        indexingDocumentFieldsState.predetermineShipTo(stateContextStub, {
          customerAccount: customerAccountsStub[0],
        });
      });

      it('should dispatch SetLookupProperty action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.QueryLookupProperties(customerAccountsStub[0].propertyAddress.propertyName)
        ));
    });
  });

  describe('Action: ResetLookupDropdownData', () => {
    beforeEach(() => {
      indexingDocumentFieldsState.resetLookupDropdownData(stateContextStub);
    });

    it('should patchState empty data for lookup dropdowns', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        customerAccounts: null,
        properties: null,
        suppliers: null,
        orderedBy: null,
        workflow: null,
        lastLabelUpdated: '',
      });
    });
  });

  describe('Action: ResetLookupState', () => {
    beforeEach(() => {
      indexingDocumentFieldsState.resetLookupState(stateContextStub);
    });

    it('should set all lookup state to default values', () => {
      expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
        formFields: [],
        formGroupInstance: null,
        fields: [],
        formattedFields: [],
        customerAccounts: null,
        properties: null,
        suppliers: null,
        orderedBy: null,
        workflow: null,
        selectedCustomerAccount: null,
        selectedProperty: null,
        selectedSupplier: null,
        selectedOrderedBy: null,
        selectedWorkflow: null,
        lastLabelUpdated: '',
        accountingSystemId: null,
        isLookupLoading: false,
        customerAccountFieldValue: '',
        nonLookupErrorMessage: null,
        lookupLoadingState: lookupLoadingStateStub,
        selectedInvoiceType: InvoiceTypes.Standard,
        utilityFields: [],
        isDefaultShipToLoading: false,
      });
    });
  });

  describe('Action: LookupLoading', () => {
    it('should be false when nothing is loading', () => {
      stateContextStub.getState.mockReturnValue({
        lookupLoadingState: lookupLoadingStateStub,
      });

      indexingDocumentFieldsState.lookupLoading(stateContextStub);

      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLookupLoading: false,
      });
    });

    it('should be true when customerAccount is loading', () => {
      stateContextStub.getState.mockReturnValue({
        lookupLoadingState: { ...lookupLoadingStateStub, customerAccountLoading: true },
      });

      indexingDocumentFieldsState.lookupLoading(stateContextStub);

      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLookupLoading: true,
      });
    });

    it('should be true when supplier is loading', () => {
      stateContextStub.getState.mockReturnValue({
        lookupLoadingState: { ...lookupLoadingStateStub, supplierLoading: true },
      });

      indexingDocumentFieldsState.lookupLoading(stateContextStub);

      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLookupLoading: true,
      });
    });

    it('should be true when shipto is loading', () => {
      stateContextStub.getState.mockReturnValue({
        lookupLoadingState: { ...lookupLoadingStateStub, shipToLoading: true },
      });

      indexingDocumentFieldsState.lookupLoading(stateContextStub);

      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLookupLoading: true,
      });
    });

    it('should be true when workflow is loading', () => {
      stateContextStub.getState.mockReturnValue({
        lookupLoadingState: { ...lookupLoadingStateStub, workflowLoading: true },
      });

      indexingDocumentFieldsState.lookupLoading(stateContextStub);

      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLookupLoading: true,
      });
    });

    it('should be true when orderedBy is loading', () => {
      stateContextStub.getState.mockReturnValue({
        lookupLoadingState: { ...lookupLoadingStateStub, orderedByLoading: true },
      });

      indexingDocumentFieldsState.lookupLoading(stateContextStub);

      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLookupLoading: true,
      });
    });
  });

  describe('Action: SetLookupLoading', () => {
    beforeEach(() => {
      indexingDocumentFieldsState.setLookupLoading(stateContextStub, {
        lookupLoadingState: {
          customerAccountLoading: false,
          supplierLoading: false,
          shipToLoading: false,
          orderedByLoading: false,
          workflowLoading: false,
        },
      });
    });

    it('should patchState with passed in lookup loading state', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        lookupLoadingState: {
          customerAccountLoading: false,
          supplierLoading: false,
          shipToLoading: false,
          orderedByLoading: false,
          workflowLoading: false,
        },
      }));

    it('should dispatch LookupLoading action', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new actions.LookupLoading()));
  });

  describe('Action: UpdateNonLookupField', () => {
    describe('when a message is returned from validation check', () => {
      const field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        indexingHelperServiceStub.getFieldValidationMessage.mockReturnValueOnce(
          'Invalid format. Currency only'
        );
        field.value = 'abc';
        indexingDocumentFieldsState.updateNonLookupField(stateContextStub, {
          field,
        });
      });

      it('should call indexingHelperService getFieldValidationMessage method', () => {
        field.value = null;
        expect(indexingHelperServiceStub.getFieldValidationMessage).toHaveBeenNthCalledWith(
          1,
          field
        );
      });

      it('should set field.value to blank', () => expect(field.value).toBe(''));

      it('should set nonLookupErrorMessage to error message', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          nonLookupErrorMessage: {
            field,
            message: 'Invalid format. Currency only',
          },
        }));

      it('should dispatch UpdateFormattedFields & UpdateOnManualIntervention actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new UpdateOnManualIntervention(field),
          new actions.UpdateFormattedFields(field),
        ]));
    });

    describe('when NO message is returned from validation check', () => {
      const field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        indexingHelperServiceStub.getFieldValidationMessage.mockReturnValueOnce('');
        field.value = '200';
        indexingDocumentFieldsState.updateNonLookupField(stateContextStub, {
          field,
        });
      });

      it('should call indexingHelperService getFieldValidationMessage method', () => {
        field.value = '$200.00';
        expect(indexingHelperServiceStub.getFieldValidationMessage).toHaveBeenNthCalledWith(
          1,
          field
        );
      });

      it('should set nonLookupErrorMessage to null', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          nonLookupErrorMessage: null,
        }));

      it('should dispatch UpdateFormattedFields & UpdateOnManualIntervention actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new UpdateOnManualIntervention(field),
          new actions.UpdateFormattedFields(field),
        ]));
    });
  });

  describe('Action: UpdateLookupFieldOnNoSelection', () => {
    describe('when labels is NULL', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const compositeDataStub = getCompositeDataStub();

      compositeDataStub.indexed.labels = null;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: { compositeData: compositeDataStub },
            indexingUtility: { oldBoundingBoxCoordinates: [] },
          })
        );
        stateContextStub.getState.mockReturnValue({ selectedCustomerAccount: null });
        indexingDocumentFieldsState.updateLookupFieldOnNoSelection(stateContextStub, {
          field: fieldStub,
        });
      });

      it('should NOT dispatch any actions', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when label is found', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const indexedLabelStub = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const compositeDataStub = getCompositeDataStub();

      compositeDataStub.indexed.labels.push(indexedLabelStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: { compositeData: compositeDataStub },
            indexingUtility: { oldBoundingBoxCoordinates: [] },
          })
        );
        stateContextStub.getState.mockReturnValue({ selectedCustomerAccount: null });
        indexingDocumentFieldsState.updateLookupFieldOnNoSelection(stateContextStub, {
          field: fieldStub,
        });
      });

      it('should dispatch UpdateFormattedFields & UpdateOldBoundingBoxCoordinates actions', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(fieldStub),
          new UpdateOldBoundingBoxCoordinates(indexedLabelStub.value.boundingBox),
        ]);
      });
    });
  });

  describe('Action: UpdateFormattedFields', () => {
    describe('when control type is auto complete && NOT Supplier field', () => {
      const canField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      canField.value = 'sillyAccountNumber';
      canField.confidence = 1;
      canField.controlType = ControlTypes.AutoComplete;
      const formattedFieldsStub = [canField];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          formattedFields: formattedFieldsStub,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('sillyAccountNumber');
        formatterServiceStub.getFormattedFieldValue.mockReturnValueOnce('sillyAccountNumber');
        indexingDocumentFieldsState.updateFormattedFields(stateContextStub, {
          field: canField,
          setConfidence: true,
        });
      });

      it('should call formatterService getSantizedFieldValue method', () =>
        expect(formatterServiceStub.getSanitizedFieldValue).toHaveBeenNthCalledWith(
          1,
          canField,
          'sillyAccountNumber'
        ));

      it('should call formatterService getFormattedFieldValue method', () =>
        expect(formatterServiceStub.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          canField,
          'sillyAccountNumber'
        ));

      it('should set field.value to formatted value', () =>
        expect(canField.value).toBe('sillyAccountNumber'));

      it('should set field.confidence to 1', () => expect(canField.confidence).toBe(1));

      it('should set formControl value to field', () =>
        expect(formGroupInstanceStub.get(canField.key).value).toEqual(canField));

      it('should patchState with updated field & formGroupInstance', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formattedFields: formattedFieldsStub,
          formGroupInstance: formGroupInstanceStub,
        }));
    });

    describe('when field is Supplier && field has a value', () => {
      const canField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      canField.value = 'sillyAccountNumber';
      canField.confidence = 1;
      canField.controlType = ControlTypes.AutoComplete;
      const formattedFieldsStub = [canField];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          formattedFields: formattedFieldsStub,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('sillyAccountNumber');
        formatterServiceStub.getFormattedFieldValue.mockReturnValueOnce('sillyAccountNumber');
        indexingDocumentFieldsState.updateFormattedFields(stateContextStub, {
          field: canField,
          setConfidence: true,
        });
      });

      it('should call formatterService getSantizedFieldValue method', () =>
        expect(formatterServiceStub.getSanitizedFieldValue).toHaveBeenNthCalledWith(
          1,
          canField,
          'sillyAccountNumber'
        ));

      it('should call formatterService getFormattedFieldValue method', () =>
        expect(formatterServiceStub.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          canField,
          'sillyAccountNumber'
        ));

      it('should set field.value to formatted value', () =>
        expect(canField.value).toBe('sillyAccountNumber'));

      it('should set field.confidence to 1', () => expect(canField.confidence).toBe(1));

      it('should set formControl value to field', () =>
        expect(formGroupInstanceStub.get(canField.key).value).toEqual(canField));

      it('should patchState with updated field & formGroupInstance', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formattedFields: formattedFieldsStub,
          formGroupInstance: formGroupInstanceStub,
        }));
    });

    describe('when field is Supplier BUT field has no value', () => {
      const amountField = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const dateField = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
      amountField.controlType = ControlTypes.AutoComplete;
      amountField.type = InputDataTypes.Currency;
      amountField.value = '';
      amountField.confidence = 1;
      dateField.type = InputDataTypes.Date;
      const formattedFieldsStub = [amountField, dateField];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          formattedFields: formattedFieldsStub,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('');
        formatterServiceStub.getFormattedFieldValue.mockReturnValueOnce('');
        indexingDocumentFieldsState.updateFormattedFields(stateContextStub, {
          field: amountField,
          setConfidence: true,
        });
      });

      it('should call formatterService getSantizedFieldValue method', () =>
        expect(formatterServiceStub.getSanitizedFieldValue).toHaveBeenNthCalledWith(
          1,
          amountField,
          ''
        ));

      it('should call formatterService getFormattedFieldValue method', () =>
        expect(formatterServiceStub.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          amountField,
          ''
        ));

      it('should set field.value to formatted value', () => expect(amountField.value).toBe(''));

      it('should set field.confidence to 1', () => expect(amountField.confidence).toBe(1));

      it('should set formControl value to field.value', () =>
        expect(formGroupInstanceStub.get(amountField.key).value).toBe(amountField.value));

      it('should patchState with updated field & formGroupInstance', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formattedFields: formattedFieldsStub,
          formGroupInstance: formGroupInstanceStub,
        }));
    });

    describe('when control type is NOT auto complete', () => {
      const amountField = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);
      const dateField = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
      amountField.type = InputDataTypes.Currency;
      amountField.value = '$200.00';
      amountField.confidence = 1;
      dateField.type = InputDataTypes.Date;
      const formattedFieldsStub = [amountField, dateField];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          formattedFields: formattedFieldsStub,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('200.00');
        formatterServiceStub.getFormattedFieldValue.mockReturnValueOnce('$200.00');
        indexingDocumentFieldsState.updateFormattedFields(stateContextStub, {
          field: amountField,
          setConfidence: true,
        });
      });

      it('should call formatterService getSantizedFieldValue method', () =>
        expect(formatterServiceStub.getSanitizedFieldValue).toHaveBeenNthCalledWith(
          1,
          amountField,
          '$200.00'
        ));

      it('should call formatterService getFormattedFieldValue method', () =>
        expect(formatterServiceStub.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          amountField,
          '200.00'
        ));

      it('should set field.value to formatted value', () =>
        expect(amountField.value).toBe('$200.00'));

      it('should set field.confidence to 1', () => expect(amountField.confidence).toBe(1));

      it('should set formControl value to field.value', () =>
        expect(formGroupInstanceStub.get(amountField.key).value).toBe(amountField.value));

      it('should patchState with updated field & formGroupInstance', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formattedFields: formattedFieldsStub,
          formGroupInstance: formGroupInstanceStub,
        }));
    });

    describe('when field is ServiceEndDate && field has a value && setConfidence is false', () => {
      const dateField = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.ServiceEndDate);
      dateField.type = InputDataTypes.Date;
      dateField.value = '12/02/2022';
      dateField.confidence = 95;
      const formattedFieldsStub = [dateField];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
          formattedFields: formattedFieldsStub,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce(dateField.value);
        formatterServiceStub.getFormattedFieldValue.mockReturnValueOnce(dateField.value);
        indexingDocumentFieldsState.updateFormattedFields(stateContextStub, {
          field: dateField,
          setConfidence: false,
        });
      });

      it('should call formatterService getSantizedFieldValue method', () =>
        expect(formatterServiceStub.getSanitizedFieldValue).toHaveBeenNthCalledWith(
          1,
          dateField,
          dateField.value
        ));

      it('should call formatterService getFormattedFieldValue method', () =>
        expect(formatterServiceStub.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          dateField,
          dateField.value
        ));

      it('should set field.value to formatted value', () =>
        expect(dateField.value).toBe(dateField.value));

      it('should set field.confidence to 1', () => expect(dateField.confidence).toBe(95));

      it('should set formControl value to field.value', () =>
        expect(formGroupInstanceStub.get(dateField.key).value).toBe(dateField.value));

      it('should patchState with updated field & formGroupInstance', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formattedFields: formattedFieldsStub,
          formGroupInstance: formGroupInstanceStub,
        }));
    });
  });

  describe('Action: UpdateInvoiceType', () => {
    beforeEach(() => {
      indexingDocumentFieldsState.updateInvoiceType(stateContextStub, {
        selectedInvoiceType: InvoiceTypes.Standard,
      });
    });

    it('should patchState with selectedInvoiceType', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        selectedInvoiceType: InvoiceTypes.Standard,
      }));
  });

  describe('Action: UpdateUtilityFields', () => {
    describe('when selectedInvoiceType is Standard', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.ServiceStartDate);
      const formattedFieldsStub = [fieldStub];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
          utilityFields: [DocumentLabelKeys.nonLookupLabels.ServiceStartDate],
          selectedInvoiceType: InvoiceTypes.Standard,
        });
        indexingDocumentFieldsState.updateUtilityFields(stateContextStub);
      });

      it('should set the utility fields value to an empty value', () =>
        expect(fieldStub.value).toBe(''));

      it('should dispatch UpdateFormattedFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.UpdateFormattedFields(fieldStub, false)
        ));
    });

    describe('when selectedInvoiceType is Standard  is an utility field but confidence is 1', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.ServiceStartDate);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ServiceStartDate);
      compositeData.indexed.labels.push(labelStub);
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
          })
        );

        fieldStub.confidence = 1;
        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
          utilityFields: [DocumentLabelKeys.nonLookupLabels.ServiceStartDate],
          selectedInvoiceType: InvoiceTypes.Standard,
        });
        indexingDocumentFieldsState.updateUtilityFields(stateContextStub);
      });

      it('should set the utility fields value to the found label value', () =>
        expect(fieldStub.value).toBe(labelStub.value.text));

      it('should dispatch UpdateFormattedFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.UpdateFormattedFields(fieldStub, false)
        ));
    });

    describe('when selectedInvoiceType is Utility', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.ServiceStartDate);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ServiceStartDate);

      compositeData.indexed.labels.push(labelStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            indexingPage: {
              compositeData,
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
          utilityFields: [DocumentLabelKeys.nonLookupLabels.ServiceStartDate],
          selectedInvoiceType: InvoiceTypes.Utility,
        });
        indexingDocumentFieldsState.updateUtilityFields(stateContextStub);
      });

      it('should set the utility fields value to the found label value', () =>
        expect(fieldStub.value).toBe(labelStub.value.text));

      it('should dispatch UpdateFormattedFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.UpdateFormattedFields(fieldStub, false)
        ));
    });
  });

  describe('Action: LoadPrepSupplier', () => {
    describe('when prepopulated supplier exists', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelSupplierStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const labelSupplierIdStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      const responseStub = {
        count: 2,
        records: suppliersStub,
      };
      const supplierBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: 'mockSupplier',
        page: 1,
        pageSize: 50,
      };

      labelSupplierStub.value.text = 'mockSupplier';
      labelSupplierIdStub.value.text = 'mockSupplierId';
      compositeData.indexed.labels.push(labelSupplierStub);
      compositeData.indexed.labels.push(labelSupplierIdStub);

      const supplierIdLabel = compositeData.indexed.labels.find(
        lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierId
      );

      responseStub.records[0].vendorRegistrationCode = 'mockSupplier';

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        lookupApiServiceStub.getSuppliers.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.loadPrepSupplier(stateContextStub).subscribe();
      });

      it('should call lookupApiService getSuppliers function', () =>
        expect(lookupApiServiceStub.getSuppliers).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          supplierBodyRequest,
          'mockSupplier',
          '1',
          null
        ));

      it('should dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupSupplier and LoadPrepCustomerAccount', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(formattedFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            supplierIdLabel,
            '7678846',
            DocumentLabelKeys.nonLookupLabels.SupplierId
          ),
          new actions.SetLookupSupplier(
            responseStub.records[0],
            DocumentLabelKeys.lookupLabels.Supplier
          ),
          new actions.LoadPrepCustomerAccount('7678846'),
        ]);
      });
    });

    describe('when a prepopulated supplier does not exist', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelSupplierStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const labelSupplierIdStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);

      labelSupplierStub.value.text = '';
      labelSupplierIdStub.value.text = 'mockSupplierId';
      compositeData.indexed.labels.push(labelSupplierStub);
      compositeData.indexed.labels.push(labelSupplierIdStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        indexingDocumentFieldsState.loadPrepSupplier(stateContextStub);
      });

      it('should not call lookupApiService getSuppliers function', () =>
        expect(lookupApiServiceStub.getSuppliers).not.toHaveBeenCalled());

      it('should dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupSupplier and LoadPrepCustomerAccount', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when getSupplier returns 0 records', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelSupplierStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const labelSupplierIdStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      const responseStub = {
        count: 0,
        records: [],
      };
      const supplierBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: 'mockSupplier',
        page: 1,
        pageSize: 50,
      };

      labelSupplierStub.value.text = 'mockSupplier';
      labelSupplierIdStub.value.text = 'mockSupplierId';
      compositeData.indexed.labels.push(labelSupplierStub);
      compositeData.indexed.labels.push(labelSupplierIdStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        lookupApiServiceStub.getSuppliers.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.loadPrepSupplier(stateContextStub);
      });

      it('should call lookupApiService getSuppliers function', () =>
        expect(lookupApiServiceStub.getSuppliers).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          supplierBodyRequest,
          'mockSupplier',
          '1',
          null
        ));

      it('should do not dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupSupplier and LoadPrepCustomerAccount', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('Action: LoadPrepCustomerAccount', () => {
    describe('When exist prepolulated supplier and customer account number', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelCustomerAccountNumberStub = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const labelVendorAccountIdStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.VendorAccountId
      );
      const responseStub = {
        count: 2,
        records: customerAccountsStub,
      };
      labelCustomerAccountNumberStub.value.text = '12345';
      labelVendorAccountIdStub.value.text = 'mockVendorAccountId';
      compositeData.indexed.labels.push(labelCustomerAccountNumberStub);
      compositeData.indexed.labels.push(labelVendorAccountIdStub);

      const customerIdLabel = compositeData.indexed.labels.find(
        lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.VendorAccountId
      );

      responseStub.records[0].vendorAccountId = 12345;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState
          .loadPrepCustomerAccount(stateContextStub, { supplierId: '1' })
          .subscribe();
      });

      it('should call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          '12345',
          1,
          false
        ));

      it('should dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetCustomerAccount', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(formattedFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            customerIdLabel,
            '12345',
            DocumentLabelKeys.nonLookupLabels.VendorAccountId
          ),
          new actions.SetCustomerAccount(responseStub.records[0]),
        ]);
      });
    });

    describe('When does not exist a prepolulated supplier', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);

      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelCustomerAccountNumberStub = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const labelVendorAccountIdStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.VendorAccountId
      );

      labelCustomerAccountNumberStub.value.text = '';
      labelVendorAccountIdStub.value.text = 'mockVendorAccountId';
      compositeData.indexed.labels.push(labelCustomerAccountNumberStub);
      compositeData.indexed.labels.push(labelVendorAccountIdStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        indexingDocumentFieldsState.loadPrepCustomerAccount(stateContextStub, { supplierId: '1' });
      });

      it('should not call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).not.toHaveBeenCalled());

      it('should not dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupSupplier and LoadPrepCustomerAccount', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('When getSupplier returns 0 records', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);

      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelCustomerAccountNumberStub = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const labelVendorAccountIdStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.VendorAccountId
      );
      const responseStub = {
        count: 0,
        records: [],
      };
      labelCustomerAccountNumberStub.value.text = 'mockCustomerAccountNumber';
      labelVendorAccountIdStub.value.text = 'mockVendorAccountId';
      compositeData.indexed.labels.push(labelCustomerAccountNumberStub);
      compositeData.indexed.labels.push(labelVendorAccountIdStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.loadPrepCustomerAccount(stateContextStub, { supplierId: '1' });
      });

      it('should call lookupApiService getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          'mockCustomerAccountNumber',
          1,
          false
        ));

      it('should not dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupSupplier and LoadPrepCustomerAccount', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('Action: LoadPrepProperty', () => {
    describe('when a prepopulated ShipTo exists', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelShipToStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const labelShipToIdStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToId);
      const responseStub = {
        count: 2,
        records: propertiesStub,
      };
      const propertyBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: '12345',
        page: 1,
        pageSize: 50,
      };

      labelShipToStub.value.text = '12345';
      labelShipToIdStub.value.text = 'mockShipTpId';
      compositeData.indexed.labels = [];
      compositeData.indexed.labels.push(labelShipToStub);
      compositeData.indexed.labels.push(labelShipToIdStub);

      const shipToIdLabel = compositeData.indexed.labels.find(
        lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.ShipToId
      );

      responseStub.records[0].propertyId = 12345;
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        lookupApiServiceStub.getProperties.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.loadPrepProperty(stateContextStub).subscribe();
      });

      it('should call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          propertyBodyRequest,
          '12345',
          '1'
        ));

      it('should dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupSupplier and LoadPrepCustomerAccount', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(formattedFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            shipToIdLabel,
            '102 Franklin',
            DocumentLabelKeys.nonLookupLabels.ShipToId
          ),
          new actions.SetLookupProperty(
            responseStub.records[0],
            DocumentLabelKeys.lookupLabels.ShipToName
          ),
        ]);
      });
    });

    describe('when a prepopulated ShipTo does not exist', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelShipToStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const labelShipToIdStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToId);
      labelShipToStub.value.text = '';
      labelShipToIdStub.value.text = 'mockShipTpId';
      compositeData.indexed.labels = [];
      compositeData.indexed.labels.push(labelShipToStub);
      compositeData.indexed.labels.push(labelShipToIdStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        indexingDocumentFieldsState.loadPrepProperty(stateContextStub);
      });

      it('should not call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).not.toHaveBeenCalled());

      it('should dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupProperty', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when getProperties returns 0 records', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const formattedFieldsStub = [fieldStub];
      const compositeData = getCompositeDataStub();
      const labelShipToStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const labelShipToIdStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToId);
      const responseStub = {
        count: 0,
        records: [],
      };
      const propertyBodyRequest: LookupBodyRequest = {
        organizationId: '1' as any,
        accountingSystemId: null,
        searchTerm: 'mockShipTo',
        page: 1,
        pageSize: 50,
      };

      labelShipToStub.value.text = 'mockShipTo';
      labelShipToIdStub.value.text = 'mockShipTpId';
      compositeData.indexed.labels = [];
      compositeData.indexed.labels.push(labelShipToStub);
      compositeData.indexed.labels.push(labelShipToIdStub);

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          formattedFields: formattedFieldsStub,
        });

        lookupApiServiceStub.getProperties.mockReturnValue(of(responseStub));
        indexingDocumentFieldsState.loadPrepProperty(stateContextStub);
      });

      it('should call lookupApiService getProperties function', () =>
        expect(lookupApiServiceStub.getProperties).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          propertyBodyRequest,
          'mockShipTo',
          '1'
        ));

      it('should do not dispatch UpdateFormattedFields,UpdateAdditionalLookupValue , SetLookupProperty', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('Action: UpdateCustomerAccountResponse', () => {
    const customerAccountResponseStub = {
      records: customerAccountsStub,
      count: customerAccountsStub.length,
    } as LookupCustomerAccountResponse;

    beforeEach(() => {
      storeStub.selectSnapshot.mockImplementation(cb =>
        cb({
          indexingPage: {
            compositeData: getCompositeDataStub(),
            buyerId: '1',
          },
        })
      );
    });

    it('should patchState with the same customerAccountResponse', () => {
      const total = customerAccountResponseStub.count;

      indexingHelperServiceStub.getNewCustomerAccount.mockReturnValue(null);
      indexingDocumentFieldsState.updateCustomerAccountResponse(null, {
        customerAccountResponse: customerAccountResponseStub,
      });
      expect(customerAccountResponseStub.count).toEqual(total);
    });

    it('should patchState with the new customerAccountResponse', () => {
      const total = customerAccountResponseStub.count;
      indexingHelperServiceStub.getNewCustomerAccount.mockReturnValue({
        vendorAccountId: 100,
        accountNo: 'test',
        isActive: true,
        propertyId: 0,
        propertyName: null,
        propertyAddress: null,
        termTypeId: 1,
        allowRetainage: false,
      });
      indexingDocumentFieldsState.updateCustomerAccountResponse(null, {
        customerAccountResponse: customerAccountResponseStub,
      });

      expect(customerAccountResponseStub.count).toEqual(total + 1);
    });
  });

  describe('Action: getMaxInvoiceNumberLength', () => {
    describe('When has supplierId', () => {
      beforeEach(() => {
        lookupApiServiceStub.getMaxInvoiceNumberLength.mockReturnValue(of(50));

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
        });

        indexingDocumentFieldsState
          .getMaxInvoiceNumberLength(stateContextStub, {
            supplierId: '1',
          })
          .subscribe();
      });

      it('should patch formGroupInstance with maxLength validator', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formGroupInstance: formGroupInstanceStub,
        });
      });
    });

    describe('When do not has supplierId', () => {
      beforeEach(() => {
        lookupApiServiceStub.getMaxInvoiceNumberLength.mockReturnValue(of(50));

        stateContextStub.getState.mockReturnValue({
          formGroupInstance: formGroupInstanceStub,
        });

        indexingDocumentFieldsState.getMaxInvoiceNumberLength(stateContextStub, {
          supplierId: '',
        });
      });

      it('should patch formGroupInstance with no validators', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formGroupInstance: formGroupInstanceStub,
        });
      });
    });
  });

  describe('Action: setDueDate', () => {
    describe('when dueDate does not have a previous value saved', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride),
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
      ];
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceDate;
      compositeData.indexed.labels[0].value.text = '05/06/2023';

      compositeData.indexed.labels[1].label =
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride;
      compositeData.indexed.labels[1].value.text = '05/06/2023';
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              token: singleOrgTokenStub,
            },
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        paymentTermServiceStub.getDueDate.mockReturnValue('05/06/2023');

        stateContextStub.getState.mockReturnValue({
          selectedCustomerAccount: { termTypeId: 1 },
          fields: lookupFieldsStub,
        });

        indexingDocumentFieldsState.setDueDate(stateContextStub);
      });

      it('should dispatch UpdateOnManualIntervention, UpdateFormattedFields UpdateAdditionalLookupValue with same date value', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            compositeData.indexed.labels[1],
            '05/06/2023',
            DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
          ),
        ]);
      });
    });

    describe('when dueDate does not have a previous value saved & create new account scenario', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride),
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
      ];
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceDate;
      compositeData.indexed.labels[0].value.text = '05/06/2023';

      compositeData.indexed.labels[1].label =
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride;
      compositeData.indexed.labels[1].value.text = '05/06/2023';

      compositeData.indexed.labels.push({
        id: '00000000-0000-0000-0000-000000000000',
        label: DocumentLabelKeys.nonLookupLabels.Terms,
        page: 1,
        value: {
          text: 'test',
          confidence: 99.99,
          boundingBox: [],
          required: false,
          verificationState: '',
        } as LabelValue,
      });

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              token: singleOrgTokenStub,
            },
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        paymentTermServiceStub.getDueDate.mockReturnValue('05/06/2023');

        stateContextStub.getState.mockReturnValue({
          selectedCustomerAccount: { termTypeId: 0 },
          fields: lookupFieldsStub,
        });

        indexingDocumentFieldsState.setDueDate(stateContextStub);
      });

      it('should dispatch UpdateOnManualIntervention, UpdateFormattedFields UpdateAdditionalLookupValue with same date value', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            compositeData.indexed.labels[1],
            '05/06/2023',
            DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
          ),
        ]);
      });
    });

    describe('sponsor user - when dueDate does not have a previous value saved', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDueDate),
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
      ];
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceDate;
      compositeData.indexed.labels[0].value.text = '05/06/2023';

      compositeData.indexed.labels[1].label = DocumentLabelKeys.nonLookupLabels.InvoiceDueDate;
      compositeData.indexed.labels[1].value.text = '05/06/2023';
      beforeEach(() => {
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'adm.su': ['all'] };
        });
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              token: hasAllTheClaimsTokenStub,
            },
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        paymentTermServiceStub.getDueDate.mockReturnValue('05/06/2023');

        stateContextStub.getState.mockReturnValue({
          selectedCustomerAccount: { termTypeId: 1 },
          fields: lookupFieldsStub,
        });

        indexingDocumentFieldsState.setDueDate(stateContextStub);
      });

      it('should dispatch UpdateAdditionalLookupValue with same date value', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new UpdateAdditionalLookupValue(
            compositeData.indexed.labels[1],
            '05/06/2023',
            DocumentLabelKeys.nonLookupLabels.InvoiceDueDate
          ),
        ]);
      });
    });

    describe('when dueDate does not have customerAccountNumber selected', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride),
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
      ];
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceDate;
      compositeData.indexed.labels[0].value.text = '05/06/2023';

      compositeData.indexed.labels[1].label =
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride;
      compositeData.indexed.labels[1].value.text = '05/06/2023';
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              token: singleOrgTokenStub,
            },
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          fields: lookupFieldsStub,
        });

        indexingDocumentFieldsState.setDueDate(stateContextStub);
      });

      it('should dispatch UpdateOnManualIntervention, UpdateFormattedFields UpdateAdditionalLookupValue', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            compositeData.indexed.labels[1],
            null,
            DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
          ),
        ]);
      });
    });

    describe('when dueDate does not have invoiceDate', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride),
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
      ];
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceDate;
      compositeData.indexed.labels[0].value.text = null;

      compositeData.indexed.labels[1].label =
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride;
      compositeData.indexed.labels[1].value.text = '05/06/2023';
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              token: singleOrgTokenStub,
            },
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          selectedCustomerAccount: { termTypeId: 1 },
          fields: lookupFieldsStub,
        });

        indexingDocumentFieldsState.setDueDate(stateContextStub);
      });

      it('should dispatch UpdateOnManualIntervention, UpdateFormattedFields UpdateAdditionalLookupValue with empty value', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new actions.UpdateFormattedFields(lookupFieldsStub[0]),
          new UpdateOnManualIntervention(lookupFieldsStub[0]),
          new UpdateAdditionalLookupValue(
            compositeData.indexed.labels[1],
            null,
            DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
          ),
        ]);
      });
    });

    describe('when dueDate has a previous value saved', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride),
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate),
      ];
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceDate;
      compositeData.indexed.labels[0].value.text = '05/06/2023';

      compositeData.indexed.labels[1].label =
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride;
      compositeData.indexed.labels[1].value.text = '05/06/2023';
      compositeData.indexed.activities[0].activity = 'save';
      compositeData.indexed.activities[0].labels[0].label =
        DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride;
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              token: singleOrgTokenStub,
            },
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
          })
        );

        stateContextStub.getState.mockReturnValue({
          selectedCustomerAccount: { termTypeId: 1 },
          fields: lookupFieldsStub,
        });

        indexingDocumentFieldsState.setDueDate(stateContextStub);
      });

      it('should not dispatch any update value', () => {
        expect(stateContextStub.dispatch).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('Action: SetPredictedSupplierValue', () => {
    describe('when parseAddress is successful', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier),
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
      ];
      const supplierIdLblStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      const accountingSystemIdLblStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.AccountingSystemId
      );
      const vendorExternalSystemIdLblStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
      );
      const compositeData = getCompositeDataStub();

      supplierIdLblStub.value.text = '418915';
      accountingSystemIdLblStub.value.text = '323';
      vendorExternalSystemIdLblStub.value.text = '1111';
      compositeData.indexed.labels.push(
        supplierIdLblStub,
        accountingSystemIdLblStub,
        vendorExternalSystemIdLblStub
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'adm.su': ['all'] };
        });

        stateContextStub.getState.mockReturnValue({
          fields: lookupFieldsStub,
          selectedSupplier: {},
        });

        indexingHelperServiceStub.getPredictedValue
          .mockReturnValueOnce('Mock Supplier Name')
          .mockReturnValueOnce('PO Box 24990    Oklahoma City OK 73124');
        indexingDocumentFieldsState.setPredictedSupplierValue(stateContextStub).subscribe();
      });

      it('should patchState for selectedSupplier & accountingSystemId', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedSupplier: {
            vendorName: 'Mock Supplier Name',
            vendorID: 418915,
            accountingSystemID: 323,
            vendorExternalSystemID: '1111',
            line1: 'PO Box 24990',
            city: 'Oklahoma City',
            state: 'OK',
            postalCode: '73124',
          },
          accountingSystemId: 323,
        });
      });
    });

    describe('when parseAddress is successful but the ID labels are NULL', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier),
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
      ];
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'adm.su': ['all'] };
        });

        stateContextStub.getState.mockReturnValue({
          fields: lookupFieldsStub,
          selectedSupplier: {},
        });

        indexingHelperServiceStub.getPredictedValue
          .mockReturnValueOnce('Mock Supplier Name')
          .mockReturnValueOnce('PO Box 24990    Oklahoma City OK 73124');
        indexingDocumentFieldsState.setPredictedSupplierValue(stateContextStub).subscribe();
      });

      it('should patchState for selectedSupplier & accountingSystemId', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedSupplier: {
            vendorName: 'Mock Supplier Name',
            vendorID: null,
            accountingSystemID: null,
            vendorExternalSystemID: null,
            line1: 'PO Box 24990',
            city: 'Oklahoma City',
            state: 'OK',
            postalCode: '73124',
          },
          accountingSystemId: null,
        });
      });
    });

    describe('when parseAddress FAILS to parse the address given', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier),
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
      ];
      const supplierIdLblStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SupplierId);
      const accountingSystemIdLblStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.AccountingSystemId
      );
      const vendorExternalSystemIdLblStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
      );
      const compositeData = getCompositeDataStub();

      supplierIdLblStub.value.text = '441891';
      accountingSystemIdLblStub.value.text = '323';
      vendorExternalSystemIdLblStub.value.text = '1111';
      compositeData.indexed.labels.push(
        supplierIdLblStub,
        accountingSystemIdLblStub,
        vendorExternalSystemIdLblStub
      );

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'adm.su': ['all'] };
        });

        stateContextStub.getState.mockReturnValue({
          fields: lookupFieldsStub,
          selectedSupplier: {},
        });

        indexingHelperServiceStub.getPredictedValue
          .mockReturnValueOnce('Mock Supplier Name')
          .mockReturnValueOnce('General Mail Facility    Miami FL 33188');
        indexingDocumentFieldsState.setPredictedSupplierValue(stateContextStub).subscribe();
      });

      it('should patchState for selectedSupplier using supplier address for line1 & accountingSystemId', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedSupplier: {
            vendorName: 'Mock Supplier Name',
            vendorID: 441891,
            accountingSystemID: 323,
            vendorExternalSystemID: '1111',
            line1: 'General Mail Facility    Miami FL 33188',
          },
          accountingSystemId: 323,
        });
      });
    });

    describe('when parseAddress FAILS to parse the address given & ID labels are NULL', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier),
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
      ];
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'adm.su': ['all'] };
        });

        stateContextStub.getState.mockReturnValue({
          fields: lookupFieldsStub,
          selectedSupplier: {},
        });

        indexingHelperServiceStub.getPredictedValue
          .mockReturnValueOnce('Mock Supplier Name')
          .mockReturnValueOnce('General Mail Facility    Miami FL 33188');
        indexingDocumentFieldsState.setPredictedSupplierValue(stateContextStub).subscribe();
      });

      it('should patchState for selectedSupplier using supplier address for line1 & accountingSystemId', () => {
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedSupplier: {
            vendorName: 'Mock Supplier Name',
            vendorID: null,
            accountingSystemID: null,
            vendorExternalSystemID: null,
            line1: 'General Mail Facility    Miami FL 33188',
          },
          accountingSystemId: null,
        });
      });
    });

    describe('when user is not a sponsor user', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier),
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
      ];
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'none.su': ['all'] };
        });

        stateContextStub.getState.mockReturnValue({
          fields: lookupFieldsStub,
          selectedSupplier: {},
        });

        indexingHelperServiceStub.getPredictedValue
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        indexingDocumentFieldsState.setPredictedSupplierValue(stateContextStub).subscribe();
      });

      it('should NOT patchState for selectedSupplier', () => {
        expect(stateContextStub.patchState).not.toHaveBeenCalled();
      });
    });

    describe('when supplierPredictionIsActive FF is OFF', () => {
      const lookupFieldsStub = [
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier),
        getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress),
      ];
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData,
              buyerId: '1',
            },
            core: {
              token: hasAllTheClaimsTokenStub,
            },
          })
        );
        storeStub.selectOnce.mockImplementation(() => of(false));
        (jwt_decode as jest.Mock).mockImplementationOnce(() => {
          return { 'adm.su': ['all'] };
        });

        stateContextStub.getState.mockReturnValue({
          fields: lookupFieldsStub,
          selectedSupplier: {},
        });

        indexingHelperServiceStub.getPredictedValue
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        indexingDocumentFieldsState.setPredictedSupplierValue(stateContextStub).subscribe();
      });

      it('should NOT patchState for selectedSupplier', () => {
        expect(stateContextStub.patchState).not.toHaveBeenCalled();
      });
    });
  });
});
