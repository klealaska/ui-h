import { LookupAddress } from './lookup-address';

export interface LookupSupplier extends LookupAddress {
  vendorID: number;
  vendorName: string;
  vendorExternalSystemID: string;
  vendorRegistrationCode: string;
  accountingSystemID: number;
  allowRetainage: boolean;
  aliases: string;
}

export interface LookupSupplierResponse {
  count: number;
  records: LookupSupplier[];
}
