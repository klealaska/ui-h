import { UntypedFormGroup } from '@angular/forms';
import {
  Field,
  FieldBase,
  InvoiceTypes,
  LookupCustomerAccount,
  LookupLoadingState,
  LookupOrderedBy,
  LookupProperty,
  LookupSupplier,
  LookupWorkflow,
  NonLookupErrorMessage,
} from '@ui-coe/avidcapture/shared/types';

export interface IndexingDocumentFieldsStateModel {
  formFields: Field[];
  formGroupInstance: UntypedFormGroup;
  fields: FieldBase<string>[];
  formattedFields: FieldBase<string>[];
  customerAccounts: LookupCustomerAccount[];
  properties: LookupProperty[];
  suppliers: LookupSupplier[];
  orderedBy: LookupOrderedBy[];
  workflow: LookupWorkflow[];
  selectedCustomerAccount: LookupCustomerAccount;
  selectedProperty: LookupProperty;
  selectedSupplier: LookupSupplier;
  selectedOrderedBy: LookupOrderedBy;
  selectedWorkflow: LookupWorkflow;
  lastLabelUpdated: string;
  accountingSystemId: number;
  isLookupLoading: boolean;
  customerAccountFieldValue: string;
  nonLookupErrorMessage: NonLookupErrorMessage;
  lookupLoadingState: LookupLoadingState;
  selectedInvoiceType: InvoiceTypes;
  utilityFields: string[];
  isDefaultShipToLoading: boolean;
}
