import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Action, Actions, ofAction, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  FeatureFlagTargetQueries,
  RetryStrategyService,
} from '@ui-coe/avidcapture/core/data-access';
import { FormatterService, ValidatorService } from '@ui-coe/avidcapture/core/util';
import {
  FieldControlService,
  FieldService,
  IndexingHelperService,
  LookupApiService,
  PaymentTermService,
} from '@ui-coe/avidcapture/indexing/util';
import {
  CompositeDocument,
  ControlTypes,
  DocumentLabelKeys,
  Field,
  FieldBase,
  Fields,
  FieldTypes,
  IndexedData,
  IndexedLabel,
  IndexingPageAction,
  InvoiceTypes,
  LookupBodyRequest,
  LookupCustomerAccountResponse,
  LookupOrderedByResponse,
  LookupPropertyResponse,
  LookupSupplier,
  LookupSupplierResponse,
  LookupWorkflowResponse,
  UserPermissions,
} from '@ui-coe/avidcapture/shared/types';
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, filter, finalize, retry, takeUntil, tap } from 'rxjs/operators';
import { parseAddress } from 'addresser';

import * as pageActions from '../indexing-page/indexing-page.actions';
import * as utilityActions from '../indexing-utility/indexing-utility.actions';
import * as actions from './indexing-document-fields.actions';
import { IndexingDocumentFieldsStateModel } from './indexing-document-fields.model';

const defaults: IndexingDocumentFieldsStateModel = {
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
  lookupLoadingState: {
    customerAccountLoading: false,
    shipToLoading: false,
    supplierLoading: false,
    orderedByLoading: false,
    workflowLoading: false,
  },
  selectedInvoiceType: InvoiceTypes.Standard,
  utilityFields: [],
  isDefaultShipToLoading: false,
};

@State<IndexingDocumentFieldsStateModel>({
  name: 'indexingDocumentFields',
  defaults,
})
@Injectable()
export class IndexingDocumentFieldsState {
  constructor(
    private docFieldService: FieldService,
    private fieldControlService: FieldControlService,
    private indexingHelperService: IndexingHelperService,
    private lookupApiService: LookupApiService,
    private formatterService: FormatterService,
    private retryStrategyService: RetryStrategyService,
    private validatorsService: ValidatorService,
    private paymentTermService: PaymentTermService,
    private store: Store,
    private actions$: Actions
  ) {}

  @Selector()
  static data(state: IndexingDocumentFieldsStateModel): IndexingDocumentFieldsStateModel {
    return state;
  }

  @Action(actions.QueryDocumentFormFields)
  queryDocumentFormFields({
    dispatch,
    patchState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<Fields[]> {
    return this.docFieldService.getFormFieldMetaData().pipe(
      tap((fields: Fields[]) => {
        const utilityFields: Field[] =
          fields[0]?.fields?.filter(field => field.fieldType === FieldTypes.Utility) || [];

        patchState({
          formFields: fields[0]?.fields,
          utilityFields: utilityFields.map(fld => fld.key),
        });
        dispatch(new actions.ParseDocumentFormFields());
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.ParseDocumentFormFields)
  parseDocumentFormFields({
    dispatch,
    getState,
    patchState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<FieldBase<string>[]> {
    const indexedDocument = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed
    );
    return this.docFieldService
      .parseFieldMetaData(getState().selectedInvoiceType, getState().formFields)
      .pipe(
        tap(parsedFields => {
          const fields = this.indexingHelperService.assignValuesToFields(
            parsedFields,
            indexedDocument
          );

          patchState({
            fields,
            formGroupInstance: this.fieldControlService.toFormGroup(fields),
          });

          dispatch(new actions.FormatFields());
        })
      );
  }

  @Action(actions.FormatFields)
  formatFields({
    dispatch,
    getState,
    patchState,
  }: StateContext<IndexingDocumentFieldsStateModel>): void {
    const decodedToken = jwt_decode(this.store.selectSnapshot(state => state.core.token));

    let formattedFields = getState().fields.map(field => {
      field.value = this.formatterService.getFormattedFieldValue(field, field.value);
      return field;
    });

    if (decodedToken?.hasOwnProperty(UserPermissions.SponsorUser)) {
      formattedFields = formattedFields.filter(
        field => field.key !== DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
      );
    }

    patchState({
      formattedFields,
    });

    dispatch(new actions.UpdateUtilityFields());
  }

  @Action(actions.QueryLookupCustomerAccounts, { cancelUncompleted: true })
  queryLookupCustomerAccounts(
    { getState, patchState, dispatch }: StateContext<IndexingDocumentFieldsStateModel>,
    { searchText }: actions.QueryLookupCustomerAccounts
  ): Observable<LookupCustomerAccountResponse> {
    const supplierId = getState().selectedSupplier?.vendorID;
    dispatch(
      new actions.SetLookupLoading({
        ...getState().lookupLoadingState,
        customerAccountLoading: true,
      })
    );

    return this.lookupApiService.getCustomerAccounts(searchText, supplierId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((response: LookupCustomerAccountResponse) => {
        const formGroupInstance = getState().formGroupInstance;

        dispatch(new actions.UpdateCustomerAccountResponse(response));

        formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
          .clearValidators();

        formGroupInstance.get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber).setValidators([
          Validators.required,
          this.validatorsService.required(),
          this.validatorsService.lookupObjectValidator(
            response.records.map(record => ({
              id: record.vendorAccountId.toString(),
              name: record.accountNo,
            }))
          ),
        ]);
        formGroupInstance
          .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
          .updateValueAndValidity();

        patchState({
          customerAccounts: response.records,
          formGroupInstance,
          isDefaultShipToLoading: true,
        });
      }),
      takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupDropdownData))),
      catchError((err: HttpErrorResponse) => {
        if (err.status != 404) {
          this.indexingHelperService.handleLookupError();
        }
        throw err;
      }),
      finalize(() =>
        dispatch(
          new actions.SetLookupLoading({
            ...getState().lookupLoadingState,
            customerAccountLoading: false,
          })
        )
      )
    );
  }

  @Action(actions.QueryLookupProperties, { cancelUncompleted: true })
  queryLookupProperties(
    { getState, patchState, dispatch }: StateContext<IndexingDocumentFieldsStateModel>,
    { searchText }: actions.QueryLookupProperties
  ): Observable<LookupPropertyResponse> {
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    const avidBillProxyV2PropertyIsActive$ = this.store.selectOnce(
      FeatureFlagTargetQueries.avidBillProxyV2PropertyIsActive
    );
    const propertyBodyRequest: LookupBodyRequest = {
      organizationId: buyerId,
      accountingSystemId: getState().accountingSystemId,
      searchTerm: searchText,
      page: 1,
      pageSize: 50,
    };

    dispatch(
      new actions.SetLookupLoading({
        ...getState().lookupLoadingState,
        shipToLoading: true,
      })
    );
    return this.lookupApiService
      .getProperties(
        avidBillProxyV2PropertyIsActive$,
        propertyBodyRequest,
        searchText,
        buyerId,
        getState().accountingSystemId
      )
      .pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((response: LookupPropertyResponse) => {
          const formGroupInstance = getState().formGroupInstance;

          formGroupInstance.get(DocumentLabelKeys.lookupLabels.ShipToName).clearValidators();

          formGroupInstance.get(DocumentLabelKeys.lookupLabels.ShipToName).setValidators([
            Validators.required,
            this.validatorsService.required(),
            this.validatorsService.lookupObjectValidator(
              response.records.map(record => ({
                id: record.accountingSystemID.toString(),
                name: record.propertyName,
              }))
            ),
          ]);
          formGroupInstance.get(DocumentLabelKeys.lookupLabels.ShipToName).updateValueAndValidity();

          if (
            getState().isDefaultShipToLoading &&
            response.records?.length > 0 &&
            getState().selectedCustomerAccount?.propertyId !== -1 &&
            (getState().selectedCustomerAccount?.propertyAddress?.propertyAddressCount === 1 ||
              response?.records?.length === 1)
          ) {
            const matchedProperty = response.records.find(
              record =>
                record.propertyAddressID ===
                getState().selectedCustomerAccount.propertyAddress?.propertyAddressID
            );
            if (matchedProperty) {
              dispatch(
                new actions.SetLookupProperty(
                  matchedProperty,
                  DocumentLabelKeys.lookupLabels.ShipToName
                )
              );
            }
          }

          patchState({
            properties: response.records,
            formGroupInstance,
          });
        }),
        takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupDropdownData))),
        catchError((err: HttpErrorResponse) => {
          if (err.status != 404) {
            this.indexingHelperService.handleLookupError();
          }
          throw err;
        }),
        finalize(() =>
          dispatch(
            new actions.SetLookupLoading({
              ...getState().lookupLoadingState,
              shipToLoading: false,
            })
          )
        )
      );
  }

  @Action(actions.QueryLookupSuppliers, { cancelUncompleted: true })
  queryLookupSuppliers(
    { getState, patchState, dispatch }: StateContext<IndexingDocumentFieldsStateModel>,
    { searchText }: actions.QueryLookupSuppliers
  ): Observable<LookupSupplierResponse> {
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    const avidBillProxyV2SupplierIsActive$ = this.store.selectOnce(
      FeatureFlagTargetQueries.avidBillProxyV2SupplierIsActive
    );
    const supplierBodyRequest: LookupBodyRequest = {
      organizationId: buyerId,
      accountingSystemId: getState().accountingSystemId,
      searchTerm: searchText,
      page: 1,
      pageSize: 50,
    };

    dispatch(
      new actions.SetLookupLoading({
        ...getState().lookupLoadingState,
        supplierLoading: true,
      })
    );
    return this.lookupApiService
      .getSuppliers(
        avidBillProxyV2SupplierIsActive$,
        supplierBodyRequest,
        searchText,
        buyerId,
        getState().accountingSystemId
      )
      .pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((response: LookupSupplierResponse) => {
          const formGroupInstance = getState().formGroupInstance;

          formGroupInstance.get(DocumentLabelKeys.lookupLabels.Supplier).clearValidators();

          formGroupInstance.get(DocumentLabelKeys.lookupLabels.Supplier).setValidators([
            Validators.required,
            this.validatorsService.required(),
            this.validatorsService.lookupObjectValidator(
              response.records.map(record => ({
                id: record.vendorExternalSystemID,
                name: record.vendorName,
              }))
            ),
          ]);
          formGroupInstance.get(DocumentLabelKeys.lookupLabels.Supplier).updateValueAndValidity();

          patchState({ suppliers: response.records, formGroupInstance });
        }),
        takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupDropdownData))),
        catchError((err: HttpErrorResponse) => {
          if (err.status != 404) {
            this.indexingHelperService.handleLookupError();
          }
          throw err;
        }),
        finalize(() =>
          dispatch(
            new actions.SetLookupLoading({
              ...getState().lookupLoadingState,
              supplierLoading: false,
            })
          )
        )
      );
  }

  @Action(actions.QueryOrderedBy, { cancelUncompleted: true })
  queryOrderedBy(
    { patchState, dispatch, getState }: StateContext<IndexingDocumentFieldsStateModel>,
    { searchText }: actions.QueryOrderedBy
  ): Observable<LookupOrderedByResponse> {
    searchText = !searchText ? '' : searchText;
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);

    dispatch(
      new actions.SetLookupLoading({
        ...getState().lookupLoadingState,
        orderedByLoading: true,
      })
    );
    return this.lookupApiService.getUsers(searchText, buyerId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((response: LookupOrderedByResponse) => {
        patchState({ orderedBy: response.records });
      }),
      takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupDropdownData))),
      catchError((err: HttpErrorResponse) => {
        if (err.status != 404) {
          this.indexingHelperService.handleLookupError();
        }
        throw err;
      }),
      finalize(() =>
        dispatch(
          new actions.SetLookupLoading({
            ...getState().lookupLoadingState,
            orderedByLoading: false,
          })
        )
      )
    );
  }

  @Action(actions.QueryWorkflow, { cancelUncompleted: true })
  queryWorkflow(
    { patchState, dispatch, getState }: StateContext<IndexingDocumentFieldsStateModel>,
    { searchText }: actions.QueryWorkflow
  ): Observable<LookupWorkflowResponse> {
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    searchText = !searchText ? '' : searchText;
    dispatch(
      new actions.SetLookupLoading({
        ...getState().lookupLoadingState,
        workflowLoading: true,
      })
    );
    return this.lookupApiService.getWorkflow(searchText, buyerId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((response: LookupWorkflowResponse) => {
        patchState({ workflow: response.records });
      }),
      takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupDropdownData))),
      catchError((err: HttpErrorResponse) => {
        if (err.status != 404) {
          this.indexingHelperService.handleLookupError();
        }
        throw err;
      }),
      finalize(() =>
        dispatch(
          new actions.SetLookupLoading({
            ...getState().lookupLoadingState,
            workflowLoading: false,
          })
        )
      )
    );
  }

  @Action(actions.LookupLoading)
  lookupLoading({ patchState, getState }: StateContext<IndexingDocumentFieldsStateModel>): void {
    patchState({
      isLookupLoading:
        getState().lookupLoadingState?.customerAccountLoading ||
        getState().lookupLoadingState?.supplierLoading ||
        getState().lookupLoadingState?.shipToLoading ||
        getState().lookupLoadingState?.workflowLoading ||
        getState().lookupLoadingState?.orderedByLoading,
    });
  }

  @Action(actions.SetLookupLoading)
  setLookupLoading(
    { patchState, dispatch }: StateContext<IndexingDocumentFieldsStateModel>,
    { lookupLoadingState }: actions.SetLookupLoading
  ): void {
    patchState({ lookupLoadingState });
    dispatch(new actions.LookupLoading());
  }

  @Action(actions.SetExistingSupplier, { cancelUncompleted: true })
  setExistingSupplier({
    dispatch,
    patchState,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<LookupSupplier> {
    const indexedData: IndexedData = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed
    );
    const supplier = indexedData.labels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.Supplier
    );
    const supplierId = indexedData.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierId
    );
    const registrationCode = indexedData.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
    );
    const hasNewAccountActivity = this.indexingHelperService.hasNewAccountActivity(
      indexedData.activities
    );

    if (supplier?.value.text && registrationCode?.value?.text && supplier.value.confidence >= 1) {
      dispatch(
        new actions.SetLookupLoading({
          ...getState().lookupLoadingState,
          supplierLoading: true,
        })
      );
      return this.lookupApiService.getSupplier(registrationCode.value.text).pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((response: LookupSupplier) => {
          if (response?.vendorID.toString() === supplierId?.value?.text) {
            const selectedSupplier = response;
            const supplierField = getState().formattedFields.find(
              fld => fld.key === DocumentLabelKeys.lookupLabels.Supplier
            );

            patchState({
              selectedSupplier,
              accountingSystemId: selectedSupplier ? selectedSupplier.accountingSystemID : null,
            });

            dispatch([
              new actions.UpdateFormattedFields(supplierField),
              hasNewAccountActivity
                ? new actions.SetExistingNewAccountNumber()
                : new actions.SetExistingCustomerAccountNumber(),
            ]);
          } else {
            const supplierField = getState().formattedFields.find(
              fld => fld.key === DocumentLabelKeys.lookupLabels.Supplier
            );
            const customerAccountNoField = getState().formattedFields.find(
              fld => fld.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
            );
            supplierField.value = '';
            customerAccountNoField.value = '';

            dispatch([
              new actions.UpdateFormattedFields(supplierField),
              new actions.UpdateFormattedFields(customerAccountNoField),
            ]);
          }
        }),
        takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupState))),
        catchError((err: HttpErrorResponse) => {
          if (err.status != 404) {
            this.indexingHelperService.handleLookupError();
          }
          throw err;
        }),
        finalize(() =>
          dispatch(
            new actions.SetLookupLoading({
              ...getState().lookupLoadingState,
              supplierLoading: false,
            })
          )
        )
      );
    } else {
      dispatch(new actions.SetPredictedSupplierValue());
    }
  }

  @Action(actions.SetExistingProperty, { cancelUncompleted: true })
  setExistingProperty({
    dispatch,
    patchState,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<LookupPropertyResponse> {
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    const indexedLabels = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed.labels
    );
    const property = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.ShipToName
    );
    const propertyId = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.ShipToId
    );

    if (property?.value.text && property.value.confidence >= 1) {
      const avidBillProxyV2PropertyIsActive$ = this.store.selectOnce(
        FeatureFlagTargetQueries.avidBillProxyV2PropertyIsActive
      );
      const propertyBodyRequest: LookupBodyRequest = {
        organizationId: buyerId,
        accountingSystemId: null,
        searchTerm: property.value.text,
        page: 1,
        pageSize: 50,
      };

      dispatch(
        new actions.SetLookupLoading({
          ...getState().lookupLoadingState,
          shipToLoading: true,
        })
      );
      return this.lookupApiService
        .getProperties(
          avidBillProxyV2PropertyIsActive$,
          propertyBodyRequest,
          property.value.text,
          buyerId,
          null
        )
        .pipe(
          retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
          tap((response: LookupPropertyResponse) => {
            const shipToAccountIndex = response?.records?.findIndex(
              record => record.propertyAddressID.toString() === propertyId?.value.text
            );

            if (shipToAccountIndex > -1) {
              const selectedProperty = response.records.at(shipToAccountIndex);
              const propertyField = getState().formattedFields.find(
                fld => fld.key === DocumentLabelKeys.lookupLabels.ShipToName
              );

              patchState({
                selectedProperty,
                accountingSystemId: selectedProperty ? selectedProperty.accountingSystemID : null,
              });

              dispatch(new actions.SetLookupProperty(selectedProperty, propertyField.key));
            } else {
              const propertyField = getState().formattedFields.find(
                fld => fld.key === DocumentLabelKeys.lookupLabels.ShipToName
              );
              propertyField.value = '';

              dispatch(new actions.UpdateFormattedFields(propertyField));
            }
          }),
          takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupState))),
          catchError((err: HttpErrorResponse) => {
            if (err.status != 404) {
              this.indexingHelperService.handleLookupError();
            }
            throw err;
          }),
          finalize(() =>
            dispatch(
              new actions.SetLookupLoading({
                ...getState().lookupLoadingState,
                shipToLoading: false,
              })
            )
          )
        );
    }
  }

  @Action(actions.SetExistingCustomerAccountNumber, { cancelUncompleted: true })
  setExistingCustomerAccountNumber({
    dispatch,
    patchState,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<LookupCustomerAccountResponse> {
    const supplierId = getState().selectedSupplier?.vendorID;
    const indexedData: IndexedData = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed
    );
    const customerAccountNumber = indexedData.labels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );
    const customerAccountId = indexedData.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.VendorAccountId
    );

    if (customerAccountNumber?.value.text && customerAccountNumber.value.confidence >= 1) {
      dispatch(
        new actions.SetLookupLoading({
          ...getState().lookupLoadingState,
          customerAccountLoading: true,
        })
      );
      return this.lookupApiService
        .getCustomerAccounts(customerAccountNumber.value.text, supplierId)
        .pipe(
          retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
          tap((response: LookupCustomerAccountResponse) => {
            const customerAccountIndex = response?.records?.findIndex(
              record =>
                record.vendorAccountId.toString() === customerAccountId?.value.text &&
                record.isActive
            );

            if (customerAccountIndex > -1) {
              const selectedCustomerAccountNo = response?.records?.at(customerAccountIndex);

              const customerAcctNoField = getState().formattedFields.find(
                fld => fld.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
              );

              patchState({
                selectedCustomerAccount: selectedCustomerAccountNo,
                customerAccountFieldValue:
                  `${selectedCustomerAccountNo.accountNo} ${selectedCustomerAccountNo.propertyName}`.trim(),
              });

              dispatch([
                new actions.UpdateFormattedFields(customerAcctNoField),
                new actions.SetDueDate(),
              ]);
            } else {
              const customerAccountNoField = getState().formattedFields.find(
                fld => fld.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
              );
              customerAccountNoField.value = '';

              dispatch([
                new actions.UpdateFormattedFields(customerAccountNoField),
                new actions.SetDueDate(),
              ]);
            }
          }),
          takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupState))),
          catchError((err: HttpErrorResponse) => {
            if (err.status != 404) {
              this.indexingHelperService.handleLookupError();
            }
            throw err;
          }),
          finalize(() =>
            dispatch(
              new actions.SetLookupLoading({
                ...getState().lookupLoadingState,
                customerAccountLoading: false,
              })
            )
          )
        );
    }
  }

  @Action(actions.SetExistingNewAccountNumber, { cancelUncompleted: true })
  setExistingNewAccountNumber({
    dispatch,
    patchState,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): void {
    const indexedData: IndexedData = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed
    );
    const customerAccountNumber = indexedData.labels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );
    const customerAcctNoField = getState().formattedFields.find(
      fld => fld.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );

    customerAcctNoField.value = customerAccountNumber.value.text;

    patchState({
      selectedCustomerAccount: {
        accountNo: customerAccountNumber.value.text,
        vendorAccountId: 0,
        propertyId: null,
        propertyName: '',
        termTypeId: null,
        allowRetainage: null,
        isActive: null,
      },
      customerAccountFieldValue: customerAccountNumber.value.text,
    });

    dispatch(new actions.UpdateFormattedFields(customerAcctNoField));
  }

  @Action(actions.SetExistingOrderedBy, { cancelUncompleted: true })
  setExistingOrderedBy({
    dispatch,
    patchState,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<LookupOrderedByResponse> {
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    const indexedLabels = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed.labels
    );
    const orderedByName = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.OrderedByName
    );

    const orderedId = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.OrderedBy
    );

    if (orderedId?.value.text && orderedId.value.confidence >= 1) {
      dispatch(
        new actions.SetLookupLoading({
          ...getState().lookupLoadingState,
          orderedByLoading: true,
        })
      );
      return this.lookupApiService
        .getUsers(orderedByName.value.text?.split(' ')[0] ?? '', buyerId)
        .pipe(
          retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
          tap((response: LookupOrderedByResponse) => {
            const orderedByAccountExists = response?.records?.findIndex(
              record => record.id.toString() === orderedId?.value.text
            );

            if (orderedByAccountExists > -1) {
              const selectedOrderedBy = response.records.find(
                record => record.id.toString() === orderedId.value.text
              );
              const orderedByNameField = getState().formattedFields.find(
                fld => fld.key === DocumentLabelKeys.lookupLabels.OrderedBy
              );

              patchState({ selectedOrderedBy });

              dispatch(new actions.UpdateFormattedFields(orderedByNameField));
            } else {
              const orderedByNameField = getState().formattedFields.find(
                fld => fld.key === DocumentLabelKeys.lookupLabels.OrderedBy
              );
              orderedByNameField.value = '';

              dispatch(new actions.UpdateFormattedFields(orderedByNameField));
            }
          }),
          takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupState))),
          catchError((err: HttpErrorResponse) => {
            if (err.status != 404) {
              this.indexingHelperService.handleLookupError();
            }
            throw err;
          }),
          finalize(() =>
            dispatch(
              new actions.SetLookupLoading({
                ...getState().lookupLoadingState,
                orderedByLoading: false,
              })
            )
          )
        );
    }
  }

  @Action(actions.SetExistingWorkflow, { cancelUncompleted: true })
  setExistingWorkflow({
    dispatch,
    patchState,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<LookupWorkflowResponse> {
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);
    const indexedLabels = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed.labels
    );
    const workflowId = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.Workflow
    );

    const workflowName = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.WorkflowName
    );

    if (workflowName?.value.text && workflowName.value.confidence >= 1) {
      dispatch(
        new actions.SetLookupLoading({
          ...getState().lookupLoadingState,
          workflowLoading: true,
        })
      );
      return this.lookupApiService.getWorkflow(workflowName.value.text, buyerId).pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((response: LookupWorkflowResponse) => {
          const workflowAccountExists = response?.records?.findIndex(
            record => record.id.toString() === workflowId?.value.text
          );

          if (workflowAccountExists > -1) {
            const selectedWorkflow = response.records.find(
              record => record.id.toString() === workflowId.value.text
            );
            const workFlowField = getState().formattedFields.find(
              fld => fld.key === DocumentLabelKeys.lookupLabels.Workflow
            );

            patchState({ selectedWorkflow });

            dispatch(new actions.UpdateFormattedFields(workFlowField));
          } else {
            const workFlowField = getState().formattedFields.find(
              fld => fld.key === DocumentLabelKeys.lookupLabels.Workflow
            );
            workFlowField.value = '';

            dispatch(new actions.UpdateFormattedFields(workFlowField));
          }
        }),
        takeUntil(this.actions$.pipe(ofAction(actions.ResetLookupState))),
        catchError((err: HttpErrorResponse) => {
          if (err.status != 404) {
            this.indexingHelperService.handleLookupError();
          }
          throw err;
        }),
        finalize(() =>
          dispatch(
            new actions.SetLookupLoading({
              ...getState().lookupLoadingState,
              workflowLoading: false,
            })
          )
        )
      );
    }
  }

  @Action(actions.SetCustomerAccount)
  setCustomerAccount(
    { dispatch, getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { lookupValue }: actions.SetCustomerAccount
  ): void {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const accountNo = lookupValue?.accountNo ?? '';
    const propertyName =
      lookupValue?.propertyName && lookupValue.propertyId > 0
        ? `(${lookupValue.propertyName})`
        : '';
    const customerAccountFieldValue = `${accountNo} ${propertyName}`.trim();
    const lastLabelUpdated = DocumentLabelKeys.lookupLabels.CustomerAccountNumber;
    const customerAccountNoField = getState().fields.find(
      field => field.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );
    const vendorAccountId = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.VendorAccountId
    );

    customerAccountNoField.value = accountNo;

    patchState({
      lastLabelUpdated,
      customerAccounts: null,
      customerAccountFieldValue,
      selectedCustomerAccount: lookupValue,
    });

    dispatch([
      new actions.UpdateFormattedFields(customerAccountNoField),
      new pageActions.UpdateOnManualIntervention(customerAccountNoField),
      new actions.PredetermineShipTo(lookupValue),
      new utilityActions.UpdateAdditionalLookupValue(
        vendorAccountId,
        lookupValue?.vendorAccountId.toString() || '0',
        DocumentLabelKeys.nonLookupLabels.VendorAccountId
      ),
      new actions.SetDueDate(),
    ]);
  }

  @Action(actions.SetLookupProperty)
  setLookupProperty(
    { dispatch, getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { lookupValue, field }: actions.SetLookupProperty
  ): void {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const propertyName = lookupValue?.propertyName ?? '';
    const addressValue =
      lookupValue !== null
        ? `${lookupValue.line1} ${lookupValue.line2} ${lookupValue.city}, ${lookupValue.state} ${lookupValue.postalCode}`
        : '';
    const lastLabelUpdated = field;
    const shipToNameField = getState().fields.find(
      field => field.key === DocumentLabelKeys.lookupLabels.ShipToName
    );
    const shipToAddressField = getState().fields.find(
      field => field.key === DocumentLabelKeys.lookupLabels.ShipToAddress
    );
    const shipToCodeLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.ShipToCode
    );

    const shipToId = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.ShipToId
    );

    const shipToAlias = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.ShipToAlias
    );
    const associatedLookupFieldValue = this.store.selectSnapshot(
      state => state.indexingPage.associatedLookupFieldValue
    );
    const shipToBoundingBoxCoords =
      associatedLookupFieldValue != null
        ? compositeData.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.lookupLabels.ShipToName
          )?.value.boundingBox
        : [];

    shipToNameField.value = propertyName;
    shipToAddressField.value = addressValue;

    patchState({
      lastLabelUpdated,
      selectedProperty: lookupValue,
      accountingSystemId:
        lookupValue || (!lookupValue && !getState().selectedSupplier)
          ? lookupValue?.accountingSystemID
          : getState().accountingSystemId,
      properties: null,
      isDefaultShipToLoading: false,
    });

    dispatch([
      new actions.UpdateFormattedFields(shipToNameField),
      new actions.UpdateFormattedFields(shipToAddressField),
      new pageActions.UpdateOnManualIntervention(shipToNameField),
      new pageActions.UpdateShipToAddressLabel(shipToAddressField, shipToBoundingBoxCoords),
      new utilityActions.UpdateAdditionalLookupValue(
        shipToCodeLabel,
        lookupValue?.propertyCode,
        DocumentLabelKeys.nonLookupLabels.ShipToCode
      ),
      new utilityActions.UpdateAdditionalLookupValue(
        shipToId,
        lookupValue?.propertyAddressID.toString(),
        DocumentLabelKeys.nonLookupLabels.ShipToId
      ),
      new utilityActions.UpdateAdditionalLookupValue(
        shipToAlias,
        lookupValue?.alias,
        DocumentLabelKeys.nonLookupLabels.ShipToAlias
      ),
    ]);
  }

  @Action(actions.SetLookupSupplier)
  setLookupSupplier(
    { dispatch, getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { lookupValue, field }: actions.SetLookupSupplier
  ): void {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const vendorName = lookupValue?.vendorName ?? '';
    const addressValue =
      lookupValue !== null
        ? `${lookupValue.line1} ${lookupValue.line2} ${lookupValue.city}, ${lookupValue.state} ${lookupValue.postalCode}`
        : '';
    const lastLabelUpdated = field;
    const supplierField = getState().fields.find(
      field => field.key === DocumentLabelKeys.lookupLabels.Supplier
    );
    const supplierAddressField = getState().fields.find(
      field => field.key === DocumentLabelKeys.lookupLabels.SupplierAddress
    );
    const supplierRegCodeLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
    );
    const supplierIdLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierId
    );
    const supplierAliasLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierAlias
    );
    const associatedLookupFieldValue = this.store.selectSnapshot(
      state => state.indexingPage.associatedLookupFieldValue
    );
    const supplierBoundingBoxCoords =
      associatedLookupFieldValue != null
        ? compositeData.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.lookupLabels.Supplier
          )?.value.boundingBox
        : [];

    const vendorExternalSystemIDLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
    );

    supplierField.value = vendorName;
    supplierAddressField.value = addressValue;

    patchState({
      lastLabelUpdated,
      selectedSupplier: lookupValue,
      accountingSystemId:
        lookupValue || (!lookupValue && !getState().selectedProperty)
          ? lookupValue?.accountingSystemID
          : getState().accountingSystemId,
      suppliers: null,
    });

    dispatch([
      new actions.UpdateFormattedFields(supplierField),
      new actions.UpdateFormattedFields(supplierAddressField),
      new pageActions.UpdateOnManualIntervention(supplierField),
      new pageActions.UpdateSupplierAddressLabel(supplierAddressField, supplierBoundingBoxCoords),
      new pageActions.RemoveCustomerAccountActivity(),
      new actions.SetCustomerAccount(null),
      new actions.PredetermineCustomerAccountNumber(lookupValue?.vendorID),
      new utilityActions.UpdateAdditionalLookupValue(
        supplierRegCodeLabel,
        lookupValue?.vendorRegistrationCode,
        DocumentLabelKeys.nonLookupLabels.SupplierRegistrationCode
      ),
      new utilityActions.UpdateAdditionalLookupValue(
        supplierIdLabel,
        lookupValue?.vendorID.toString(),
        DocumentLabelKeys.nonLookupLabels.SupplierId
      ),
      new utilityActions.UpdateAdditionalLookupValue(
        supplierAliasLabel,
        lookupValue?.aliases,
        DocumentLabelKeys.nonLookupLabels.SupplierAlias
      ),
      new utilityActions.UpdateAdditionalLookupValue(
        vendorExternalSystemIDLabel,
        lookupValue?.vendorExternalSystemID,
        DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
      ),
    ]);
  }

  @Action(actions.SetLookupOrderedBy)
  setLookupOrderedBy(
    { dispatch, getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { lookupValue, field }: actions.SetLookupOrderedBy
  ): void {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const orderedNameValue =
      lookupValue?.firstName && lookupValue?.lastName
        ? `${lookupValue.firstName} ${lookupValue.lastName}`
        : '';
    const orderedByField = getState().fields.find(
      field => field.key === DocumentLabelKeys.lookupLabels.OrderedBy
    );
    const orderedByLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.OrderedByName
    );

    orderedByField.value = lookupValue?.id;

    patchState({
      lastLabelUpdated: field,
      orderedBy: null,
      selectedOrderedBy: lookupValue,
    });

    dispatch([
      new actions.UpdateFormattedFields(orderedByField),
      new pageActions.UpdateOnManualIntervention(orderedByField),
      new utilityActions.UpdateAdditionalLookupValue(
        orderedByLabel,
        orderedNameValue,
        DocumentLabelKeys.nonLookupLabels.OrderedByName
      ),
    ]);
  }

  @Action(actions.SetLookupWorkflow)
  setLookupWorkflow(
    { dispatch, getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { lookupValue, field }: actions.SetLookupWorkflow
  ): void {
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const workflowValue = lookupValue !== null ? lookupValue.name : '';
    const lastLabelUpdated = field;
    const workflowField = getState().fields.find(
      field => field.key === DocumentLabelKeys.lookupLabels.Workflow
    );
    const workflowLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.WorkflowName
    );

    workflowField.value = lookupValue?.id;

    patchState({
      lastLabelUpdated,
      workflow: null,
      selectedWorkflow: lookupValue,
    });

    dispatch([
      new actions.UpdateFormattedFields(workflowField),
      new pageActions.UpdateOnManualIntervention(workflowField),
      new utilityActions.UpdateAdditionalLookupValue(
        workflowLabel,
        workflowValue,
        DocumentLabelKeys.nonLookupLabels.WorkflowName
      ),
    ]);
  }

  @Action(actions.PredetermineCustomerAccountNumber)
  predetermineCustomerAccountNumber(
    { dispatch, getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { supplierId }: actions.PredetermineCustomerAccountNumber
  ): Observable<LookupCustomerAccountResponse> {
    if (supplierId) {
      return this.lookupApiService.getCustomerAccounts('', supplierId).pipe(
        tap((response: LookupCustomerAccountResponse) => {
          const formGroupInstance = getState().formGroupInstance;

          formGroupInstance
            .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
            .clearValidators();

          dispatch(new actions.UpdateCustomerAccountResponse(response));

          formGroupInstance
            .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
            .setValidators([
              Validators.required,
              this.validatorsService.required(),
              this.validatorsService.lookupObjectValidator(
                response.records.map(record => ({
                  id: record.vendorAccountId.toString(),
                  name: record.accountNo,
                }))
              ),
            ]);
          formGroupInstance
            .get(DocumentLabelKeys.lookupLabels.CustomerAccountNumber)
            .updateValueAndValidity();

          if (response.count === 1) {
            dispatch(new actions.SetCustomerAccount(response.records[0]));
          }

          patchState({
            customerAccounts: response.records,
            isDefaultShipToLoading: true,
          });
        }),
        catchError((err: HttpErrorResponse) => {
          throw err;
        })
      );
    } else {
      dispatch(new actions.SetCustomerAccount(null));
    }
  }

  @Action(actions.PredetermineShipTo)
  predetermineShipTo(
    { dispatch, getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { customerAccount }: actions.PredetermineShipTo
  ): void {
    if (
      customerAccount?.propertyAddress?.propertyId &&
      customerAccount.propertyAddress.propertyId !== -1 &&
      getState().accountingSystemId === customerAccount.propertyAddress.accountingSystemID
    ) {
      if (
        !customerAccount.propertyAddress.propertyIsActive &&
        customerAccount.propertyAddress.propertyAddressCount === 1
      ) {
        patchState({ isDefaultShipToLoading: false });
        this.indexingHelperService.handleInactiveShipTo();
      } else {
        dispatch(new actions.QueryLookupProperties(customerAccount.propertyAddress.propertyName));
      }
    } else {
      patchState({ isDefaultShipToLoading: false });
    }
  }

  @Action(actions.ResetLookupDropdownData)
  resetLookupDropdownData({ patchState }: StateContext<IndexingDocumentFieldsStateModel>): void {
    patchState({
      customerAccounts: null,
      properties: null,
      suppliers: null,
      workflow: null,
      orderedBy: null,
      lastLabelUpdated: '',
    });
  }

  @Action(actions.ResetLookupState)
  resetLookupState({ setState }: StateContext<IndexingDocumentFieldsStateModel>): void {
    setState({
      ...defaults,
    });
  }

  @Action(actions.UpdateNonLookupField)
  updateNonLookupField(
    { dispatch, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { field }: actions.UpdateNonLookupField
  ): void {
    const message = this.indexingHelperService.getFieldValidationMessage(field);

    if (message) {
      field.value = '';

      patchState({
        nonLookupErrorMessage: {
          field,
          message,
        },
      });
    } else {
      patchState({
        nonLookupErrorMessage: null,
      });
    }

    dispatch([
      new pageActions.UpdateOnManualIntervention(field),
      new actions.UpdateFormattedFields(field),
    ]);
    if (field.key === DocumentLabelKeys.nonLookupLabels.InvoiceDate) {
      setTimeout(() => {
        dispatch(new actions.SetDueDate());
      }, 200);
    }
  }

  @Action(actions.UpdateLookupFieldOnNoSelection)
  updateLookupFieldOnNoSelection(
    { dispatch }: StateContext<IndexingDocumentFieldsStateModel>,
    { field }: actions.UpdateLookupFieldOnNoSelection
  ): void {
    const compositeData: CompositeDocument = this.store.selectSnapshot(
      state => state.indexingPage.compositeData
    );

    const label: IndexedLabel = compositeData.indexed.labels?.find(lbl => lbl.label === field.key);

    if (!label) {
      return;
    }

    dispatch([
      new actions.UpdateFormattedFields(field),
      new utilityActions.UpdateOldBoundingBoxCoordinates(label.value.boundingBox),
    ]);
  }

  @Action(actions.UpdateFormattedFields)
  updateFormattedFields(
    { getState, patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { field, setConfidence }: actions.UpdateFormattedFields
  ): void {
    const fieldFormatted = { ...field };
    const formGroupInstance = getState().formGroupInstance;
    const fieldIndex = getState().formattedFields.findIndex(fld => fld.key === field.key);
    const sanitizedValue = this.formatterService.getSanitizedFieldValue(field, field.value);

    fieldFormatted.value = this.formatterService.getFormattedFieldValue(field, sanitizedValue);

    if (setConfidence) {
      fieldFormatted.confidence = 1;
    }

    if (
      field.controlType === ControlTypes.AutoComplete &&
      field.key !== DocumentLabelKeys.lookupLabels.Supplier
    ) {
      formGroupInstance.get(field.key).setValue(fieldFormatted, { emitEvent: false });
    } else if (field.key === DocumentLabelKeys.lookupLabels.Supplier && field.value) {
      formGroupInstance.get(field.key).setValue(fieldFormatted, { emitEvent: false });
    } else {
      formGroupInstance.get(field.key).setValue(fieldFormatted.value, { emitEvent: false });
    }
    patchState({
      ...getState(),
      formattedFields: [
        ...getState().formattedFields.slice(0, fieldIndex),
        Object.assign({}, getState().formattedFields[fieldIndex], fieldFormatted),
        ...getState().formattedFields.slice(fieldIndex + 1),
      ],
      formGroupInstance,
    });
  }

  @Action(actions.UpdateInvoiceType)
  updateInvoiceType(
    { patchState }: StateContext<IndexingDocumentFieldsStateModel>,
    { selectedInvoiceType }: actions.UpdateInvoiceType
  ): void {
    patchState({
      selectedInvoiceType,
    });
  }

  @Action(actions.UpdateUtilityFields)
  updateUtilityFields({
    dispatch,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): void {
    getState().formattedFields.forEach(field => {
      if (getState().utilityFields.includes(field.key)) {
        const indexedLabels: IndexedLabel[] = this.store.selectSnapshot(
          state => state.indexingPage.compositeData
        ).indexed.labels;
        const label = indexedLabels.find(lbl => lbl.label === field.key);
        getState().selectedInvoiceType === InvoiceTypes.Standard && field.confidence !== 1
          ? (field.value = '')
          : (field.value = label?.value.text);
        dispatch(new actions.UpdateFormattedFields(field, false));
      }
    });
  }

  @Action(actions.LoadPrepSupplier)
  loadPrepSupplier({
    dispatch,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<LookupSupplierResponse> {
    const indexedLabels = this.store.selectSnapshot(state => state.indexingPage.compositeData)
      .indexed.labels;

    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);

    const supplier = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.Supplier
    );

    const supplierIdLabel = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierId
    );

    const supplierField = getState().formattedFields.find(
      fld => fld.key === DocumentLabelKeys.lookupLabels.Supplier
    );
    const avidBillProxyV2SupplierIsActive$ = this.store.selectOnce(
      FeatureFlagTargetQueries.avidBillProxyV2SupplierIsActive
    );
    const supplierBodyRequest: LookupBodyRequest = {
      organizationId: buyerId,
      accountingSystemId: null,
      searchTerm: supplier.value.text,
      page: 1,
      pageSize: 50,
    };

    if (supplier.value.text !== '') {
      return this.lookupApiService
        .getSuppliers(
          avidBillProxyV2SupplierIsActive$,
          supplierBodyRequest,
          supplier.value.text,
          buyerId,
          null
        )
        .pipe(
          tap((response: LookupSupplierResponse) => {
            const supplierAccount = response?.records?.find(
              record => record.vendorRegistrationCode === supplier.value.text
            );
            if (supplierAccount) {
              dispatch([
                new actions.UpdateFormattedFields(supplierField),
                new utilityActions.UpdateAdditionalLookupValue(
                  supplierIdLabel,
                  supplierAccount.vendorID.toString(),
                  DocumentLabelKeys.nonLookupLabels.SupplierId
                ),
                new actions.SetLookupSupplier(
                  supplierAccount,
                  DocumentLabelKeys.lookupLabels.Supplier
                ),
                new actions.LoadPrepCustomerAccount(supplierAccount.vendorID.toString()),
              ]);
            }
          })
        );
    }
  }

  @Action(actions.LoadPrepCustomerAccount)
  loadPrepCustomerAccount(
    { dispatch, getState }: StateContext<IndexingDocumentFieldsStateModel>,
    { supplierId }: actions.LoadPrepCustomerAccount
  ): Observable<LookupCustomerAccountResponse> {
    const indexedLabels = this.store.selectSnapshot(state => state.indexingPage.compositeData)
      .indexed.labels;

    const customerAccountNumber = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );

    const customerIdLabel = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.VendorAccountId
    );

    const customerField = getState().formattedFields.find(
      fld => fld.key === DocumentLabelKeys.lookupLabels.CustomerAccountNumber
    );

    if (customerAccountNumber.value.text.length > 0 && supplierId.length > 0) {
      return this.lookupApiService
        .getCustomerAccounts(customerAccountNumber.value.text, Number(supplierId), false)
        .pipe(
          tap((response: LookupCustomerAccountResponse) => {
            const customerAccount = response?.records?.find(
              record => record.vendorAccountId.toString() === customerAccountNumber.value.text
            );

            if (customerAccount) {
              dispatch([
                new actions.UpdateFormattedFields(customerField),
                new utilityActions.UpdateAdditionalLookupValue(
                  customerIdLabel,
                  customerAccount.vendorAccountId.toString(),
                  DocumentLabelKeys.nonLookupLabels.VendorAccountId
                ),
                new actions.SetCustomerAccount(customerAccount),
              ]);
            }
          })
        );
    }
  }

  @Action(actions.LoadPrepProperty)
  loadPrepProperty({
    dispatch,
    getState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<LookupPropertyResponse> {
    const indexedLabels = this.store.selectSnapshot(state => state.indexingPage.compositeData)
      .indexed.labels;
    const buyerId = this.store.selectSnapshot(state => state.indexingPage.buyerId);

    const shipTo = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.lookupLabels.ShipToName
    );

    const shipToIdLabel = indexedLabels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.ShipToId
    );

    const shipToNameField = getState().formattedFields.find(
      fld => fld.key === DocumentLabelKeys.lookupLabels.ShipToName
    );
    const avidBillProxyV2PropertyIsActive$ = this.store.selectOnce(
      FeatureFlagTargetQueries.avidBillProxyV2PropertyIsActive
    );
    const propertyBodyRequest: LookupBodyRequest = {
      organizationId: buyerId,
      accountingSystemId: null,
      searchTerm: shipTo.value.text,
      page: 1,
      pageSize: 50,
    };

    if (shipTo.value.text !== '') {
      return this.lookupApiService
        .getProperties(
          avidBillProxyV2PropertyIsActive$,
          propertyBodyRequest,
          shipTo.value.text,
          buyerId
        )
        .pipe(
          tap((response: LookupPropertyResponse) => {
            const shipToAccount = response?.records?.find(
              record => record.propertyId.toString() === shipTo.value.text
            );

            if (shipToAccount) {
              dispatch([
                new actions.UpdateFormattedFields(shipToNameField),
                // TODO : This may cause or be a bug with pre-pop Ship-To
                new utilityActions.UpdateAdditionalLookupValue(
                  shipToIdLabel,
                  shipToAccount.propertyName.toString(),
                  DocumentLabelKeys.nonLookupLabels.ShipToId
                ),
                new actions.SetLookupProperty(
                  shipToAccount,
                  DocumentLabelKeys.lookupLabels.ShipToName
                ),
              ]);
            }
          })
        );
    }
  }

  @Action(actions.UpdateCustomerAccountResponse)
  updateCustomerAccountResponse(
    _: StateContext<IndexingDocumentFieldsStateModel>,
    { customerAccountResponse }: actions.UpdateCustomerAccountResponse
  ): void {
    const indexedData = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed
    );

    const newCustomerAccount = this.indexingHelperService.getNewCustomerAccount(
      indexedData,
      customerAccountResponse.records
    );

    if (newCustomerAccount) {
      customerAccountResponse.records = !customerAccountResponse.records
        ? []
        : customerAccountResponse.records;

      customerAccountResponse.records.push(newCustomerAccount);
      customerAccountResponse.count++;
    }
  }
  @Action(actions.GetMaxInvoiceNumberLength)
  getMaxInvoiceNumberLength(
    { patchState, getState }: StateContext<IndexingDocumentFieldsStateModel>,
    { supplierId }: actions.GetMaxInvoiceNumberLength
  ): Observable<number> {
    if (supplierId?.length > 0) {
      return this.lookupApiService.getMaxInvoiceNumberLength(supplierId).pipe(
        tap((maxLength: number) => {
          const formGroupInstance = getState().formGroupInstance;
          formGroupInstance.get(DocumentLabelKeys.nonLookupLabels.InvoiceNumber).clearValidators();
          formGroupInstance
            .get(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)
            .addValidators([Validators.maxLength(maxLength)]);
          formGroupInstance
            .get(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)
            .updateValueAndValidity();

          patchState({ formGroupInstance });
        })
      );
    } else {
      const formGroupInstance = getState().formGroupInstance;
      formGroupInstance.get(DocumentLabelKeys.nonLookupLabels.InvoiceNumber).clearValidators();
      formGroupInstance
        .get(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)
        .updateValueAndValidity();
      patchState({ formGroupInstance });
    }
  }

  @Action(actions.SetDueDate)
  setDueDate({ dispatch, getState }: StateContext<IndexingDocumentFieldsStateModel>): void {
    let hasPreviousActivity = false;
    const decodedToken = jwt_decode(this.store.selectSnapshot(state => state.core.token));
    const compositeData = this.store.selectSnapshot(state => state.indexingPage.compositeData);
    const invoiceDateLabel = compositeData.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceDate
    );

    compositeData.indexed.activities
      .filter(act => act.activity.toLowerCase() !== IndexingPageAction.Create)
      .forEach(act => {
        if (
          act.labels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
          )
        ) {
          hasPreviousActivity = true;
        }
      });

    const paymentTermId = getState().selectedCustomerAccount?.termTypeId ?? null;
    let paymentTermName = null;

    if (!paymentTermId) {
      paymentTermName = compositeData.indexed.labels.find(
        lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.Terms
      )?.value?.text;
    }

    let dueDateValue = null;
    if (!hasPreviousActivity) {
      if (invoiceDateLabel?.value?.text && (paymentTermId || paymentTermName)) {
        dueDateValue = this.paymentTermService.getDueDate(
          getState().fields.find(
            field => field.key === DocumentLabelKeys.nonLookupLabels.InvoiceDate
          ),
          invoiceDateLabel?.value?.text,
          {
            termTypeId: paymentTermId,
            termTypeName: paymentTermName,
            numberDaysUntilDue: 0,
            isEndOfMonth: false,
          }
        );
      }

      // Sponsor Users do not get DueDate Override exposed to them, so we need to
      // exclude updateFormattedFields from occurring because this causes a
      // bug that will duplicate the form fields
      if (!decodedToken?.hasOwnProperty(UserPermissions.SponsorUser)) {
        const dueDateOverrideLabel = compositeData.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
        );
        const dueDateOverrideField = getState().fields.find(
          field => field.key === DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
        );

        if (dueDateOverrideField) {
          dueDateOverrideField.value = dueDateValue;
        }

        dispatch([
          new actions.UpdateFormattedFields(dueDateOverrideField),
          new pageActions.UpdateOnManualIntervention(dueDateOverrideField),
          new utilityActions.UpdateAdditionalLookupValue(
            dueDateOverrideLabel,
            dueDateValue,
            DocumentLabelKeys.nonLookupLabels.InvoiceDueDateOverride
          ),
        ]);
      } else {
        const dueDateLabel = compositeData.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceDueDate
        );

        dispatch([
          new utilityActions.UpdateAdditionalLookupValue(
            dueDateLabel,
            dueDateValue,
            DocumentLabelKeys.nonLookupLabels.InvoiceDueDate
          ),
        ]);
      }
    }
  }

  @Action(actions.SetPredictedSupplierValue)
  setPredictedSupplierValue({
    getState,
    patchState,
  }: StateContext<IndexingDocumentFieldsStateModel>): Observable<boolean> {
    const supplierPredictionIsActive$ = this.store.selectOnce(
      FeatureFlagTargetQueries.supplierPredictionIsActive
    );
    const indexedLabels = this.store.selectSnapshot(
      state => state.indexingPage.compositeData.indexed.labels
    );
    const token = this.store.selectSnapshot(state => state.core.token);
    const isSponsorUser = jwt_decode(token)[UserPermissions.SponsorUser] ? true : false;

    const supplierLblValue = this.indexingHelperService.getPredictedValue(
      getState().fields,
      indexedLabels,
      DocumentLabelKeys.lookupLabels.Supplier,
      isSponsorUser
    );
    const supplierAddressLblValue = this.indexingHelperService.getPredictedValue(
      getState().fields,
      indexedLabels,
      DocumentLabelKeys.lookupLabels.SupplierAddress,
      isSponsorUser
    );

    return supplierPredictionIsActive$.pipe(
      filter(x => x != null),
      tap(supplierPredictionIsActive => {
        if (supplierLblValue && supplierAddressLblValue && supplierPredictionIsActive) {
          const accountingSystemIdLbl: IndexedLabel = indexedLabels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.AccountingSystemId
          );
          const supplierIdLbl: IndexedLabel = indexedLabels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.SupplierId
          );
          const vendorExternalSystemIdLbl: IndexedLabel = indexedLabels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.VendorExternalSystemID
          );
          let selectedSupplier: LookupSupplier;

          try {
            const parsedAddressValue = parseAddress(supplierAddressLblValue);

            selectedSupplier = {
              ...getState().selectedSupplier,
              vendorName: supplierLblValue,
              vendorID: supplierIdLbl ? Number(supplierIdLbl.value.text) : null,
              accountingSystemID: accountingSystemIdLbl
                ? Number(accountingSystemIdLbl.value.text)
                : null,
              vendorExternalSystemID: vendorExternalSystemIdLbl
                ? vendorExternalSystemIdLbl.value.text
                : null,
              line1: parsedAddressValue.addressLine1,
              city: parsedAddressValue.placeName,
              state: parsedAddressValue.stateAbbreviation,
              postalCode: parsedAddressValue.zipCode,
            };
          } catch {
            selectedSupplier = {
              ...getState().selectedSupplier,
              vendorName: supplierLblValue,
              vendorID: supplierIdLbl ? Number(supplierIdLbl.value.text) : null,
              accountingSystemID: accountingSystemIdLbl
                ? Number(accountingSystemIdLbl.value.text)
                : null,
              vendorExternalSystemID: vendorExternalSystemIdLbl
                ? vendorExternalSystemIdLbl.value.text
                : null,
              line1: supplierAddressLblValue,
            };
          }

          patchState({
            selectedSupplier,
            accountingSystemId: accountingSystemIdLbl
              ? Number(accountingSystemIdLbl.value.text)
              : null,
          });
        }
      })
    );
  }
}
