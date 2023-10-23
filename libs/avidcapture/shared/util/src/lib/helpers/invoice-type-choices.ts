import { InvoiceTypes } from '@ui-coe/avidcapture/shared/types';
import { DropdownOptions } from '@ui-coe/shared/types';

export const invoiceTypeChoices: DropdownOptions[] = [
  {
    text: InvoiceTypes.Standard,
    value: InvoiceTypes.Standard,
  },
  {
    text: InvoiceTypes.Utility,
    value: InvoiceTypes.Utility,
  },
];
