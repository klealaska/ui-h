export interface LookupPaymentTerms {
  termTypeId: number;
  termTypeName: string;
  numberDaysUntilDue: number;
  isEndOfMonth: boolean;
}
