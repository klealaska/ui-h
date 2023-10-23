import {
  LookupOrderedBy,
  LookupSupplier,
  LookupProperty,
  LookupCustomerAccount,
  LookupWorkflow,
} from '../models';

export type LookupValue = LookupSupplier &
  LookupProperty &
  LookupCustomerAccount &
  LookupOrderedBy &
  LookupWorkflow;
