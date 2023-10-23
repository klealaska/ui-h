import { LookupAddress } from './lookup-address';

export interface LookupProperty extends LookupAddress {
  propertyAddressID: number;
  propertyId: number;
  propertyName: string;
  alias: string;
  propertyCode: string;
  propertyAddressCount: number;
  accountingSystemID: number;
  addressIsActive: boolean;
  propertyIsActive: boolean;
}

export interface LookupPropertyResponse {
  count: number;
  records: LookupProperty[];
}
