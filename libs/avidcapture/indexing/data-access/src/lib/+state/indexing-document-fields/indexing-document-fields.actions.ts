import {
  FieldBase,
  InvoiceTypes,
  LookupCustomerAccount,
  LookupCustomerAccountResponse,
  LookupLoadingState,
  LookupOrderedBy,
  LookupProperty,
  LookupSupplier,
  LookupWorkflow,
} from '@ui-coe/avidcapture/shared/types';

export class QueryDocumentFormFields {
  static readonly type = '[IndexingDocumentFieldsState] QueryDocumentFormFields';
}

export class ParseDocumentFormFields {
  static readonly type = '[IndexingDocumentFieldsState] ParseDocumentFormFields';
}

export class FormatFields {
  static readonly type = '[IndexingDocumentFieldsState] FormatFields';
}

export class QueryLookupCustomerAccounts {
  static readonly type = '[IndexingDocumentFieldsState] QueryLookupCustomerAccounts';
  constructor(public searchText: string) {}
}

export class QueryLookupProperties {
  static readonly type = '[IndexingDocumentFieldsState] QueryLookupProperties';
  constructor(public searchText: string) {}
}

export class QueryLookupSuppliers {
  static readonly type = '[IndexingDocumentFieldsState] QueryLookupSuppliers';
  constructor(public searchText: string) {}
}

export class QueryOrderedBy {
  static readonly type = '[IndexingDocumentFieldsState] QueryOrderedBy';
  constructor(public searchText: string) {}
}

export class QueryWorkflow {
  static readonly type = '[IndexingDocumentFieldsState] QueryWorkflow';
  constructor(public searchText: string) {}
}

export class LookupLoading {
  static readonly type = '[IndexingDocumentFieldsState] LookupLoading';
}

export class SetLookupLoading {
  static readonly type = '[IndexingDocumentFieldsState] SetLookupLoading';
  constructor(public lookupLoadingState: LookupLoadingState) {}
}

export class SetExistingSupplier {
  static readonly type = '[IndexingDocumentFieldsState] SetExistingSupplier';
}

export class SetExistingProperty {
  static readonly type = '[IndexingDocumentFieldsState] SetExistingProperty';
}

export class SetExistingCustomerAccountNumber {
  static readonly type = '[IndexingDocumentFieldsState] SetExistingCustomerAccountNumber';
}

export class SetExistingNewAccountNumber {
  static readonly type = '[IndexingDocumentFieldsState] SetExistingNewAccountNumber';
}

export class SetExistingOrderedBy {
  static readonly type = '[IndexingDocumentFieldsState] SetExistingOrderedBy';
}

export class SetExistingWorkflow {
  static readonly type = '[IndexingDocumentFieldsState] SetExistingWorkflow';
}

export class SetCustomerAccount {
  static readonly type = '[IndexingDocumentFieldsState] SetCustomerAccount';
  constructor(public lookupValue: LookupCustomerAccount) {}
}

export class SetLookupProperty {
  static readonly type = '[IndexingDocumentFieldsState] SetLookupProperty';
  constructor(public lookupValue: LookupProperty, public field: string) {}
}

export class SetLookupSupplier {
  static readonly type = '[IndexingDocumentFieldsState] SetLookupSupplier';
  constructor(public lookupValue: LookupSupplier, public field: string) {}
}

export class SetLookupOrderedBy {
  static readonly type = '[IndexingDocumentFieldsState] SetLookupOrderedBy';
  constructor(public lookupValue: LookupOrderedBy, public field: string) {}
}

export class SetLookupWorkflow {
  static readonly type = '[IndexingDocumentFieldsState] SetLookupWorkflow';
  constructor(public lookupValue: LookupWorkflow, public field: string) {}
}

export class PredetermineCustomerAccountNumber {
  static readonly type = '[IndexingDocumentFieldsState] PredetermineCustomerAccountNumber';
  constructor(public supplierId: number) {}
}

export class PredetermineShipTo {
  static readonly type = '[IndexingDocumentFieldsState] PredetermineShipTo';
  constructor(public customerAccount: LookupCustomerAccount) {}
}

export class ResetLookupDropdownData {
  static readonly type = '[IndexingDocumentFieldsState] ResetLookupDropdownData';
}

export class ResetLookupState {
  static readonly type = '[IndexingDocumentFieldsState] ResetLookupState';
}

export class UpdateNonLookupField {
  static readonly type = '[IndexingDocumentFieldsState] UpdateNonLookupField';
  constructor(public field: FieldBase<string>) {}
}

export class UpdateLookupFieldOnFieldAssociation {
  static readonly type = '[IndexingDocumentFieldsState] UpdateLookupFieldOnFieldAssociation';
  constructor(public field: FieldBase<string>) {}
}

export class UpdateLookupFieldOnNoSelection {
  static readonly type = '[IndexingDocumentFieldsState] UpdateLookupFieldOnNoSelection';
  constructor(public field: FieldBase<string>) {}
}

export class UpdateFormattedFields {
  static readonly type = '[IndexingDocumentFieldsState] UpdateFormattedFields';
  constructor(public field: FieldBase<string>, public setConfidence = true) {}
}

export class UpdateInvoiceType {
  static readonly type = '[IndexingDocumentFieldsState] UpdateInvoiceType';
  constructor(public selectedInvoiceType: InvoiceTypes) {}
}

export class UpdateUtilityFields {
  static readonly type = '[IndexingDocumentFieldsState] UpdateUtilityFields';
}

export class UpdateCustomerAccountResponse {
  static readonly type = '[IndexingDocumentFieldsState] UpdateCustomerAccountResponse';
  constructor(public customerAccountResponse: LookupCustomerAccountResponse) {}
}

export class LoadPrepSupplier {
  static readonly type = '[IndexingDocumentFieldsState] LoadPrepSupplier';
}

export class LoadPrepCustomerAccount {
  static readonly type = '[IndexingDocumentFieldsState] LoadPrepCustomerAccount';
  constructor(public supplierId: string) {}
}

export class LoadPrepProperty {
  static readonly type = '[IndexingDocumentFieldsState] LoadPrepProperty';
}

export class GetMaxInvoiceNumberLength {
  static readonly type = '[IndexingDocumentFieldsState] GetMaxInvoiceNumberLength';
  constructor(public supplierId: string) {}
}

export class SetDueDate {
  static readonly type = '[IndexingDocumentFieldsState] SetDueDate';
}

export class SetPredictedSupplierValue {
  static readonly type = '[IndexingDocumentFieldsState] Set Predicted Supplier Value';
}
