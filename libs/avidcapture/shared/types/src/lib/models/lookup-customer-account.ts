import { LookupProperty } from './lookup-property';

export interface LookupCustomerAccount {
  vendorAccountId: number;
  accountNo: string;
  propertyId: number;
  propertyName: string;
  termTypeId: number;
  allowRetainage: boolean;
  isActive: boolean;
  propertyAddress?: LookupProperty;
}

export interface LookupCustomerAccountResponse {
  count: number;
  records: LookupCustomerAccount[];
}
