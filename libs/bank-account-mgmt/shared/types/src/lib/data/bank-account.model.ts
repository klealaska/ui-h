export interface IBankAccount {
  accountNumber: string;
  accountId: string;
  routingNumber: string;
  accountType: string;
  bankAccountStatus: string;
  verificationStatus: string;
  tenantId: string;
  nickName: string;
  externalBankReference: string;
  bankName: string;
  firstName: string;
  lastName: string;
  accountTypeName: string;
  businessName: string;
  createdTimestamp: string;
  lastModifiedTimestamp: string;
  createdByUser: string;
  lastModifiedByUser: string;
  statusDescription: string;
}

export interface IBankAccountMapped {
  accountNumber: string;
  accountId: string;
  routingNumber: string;
  accountType: string;
  bankAccountStatus: string;
  verificationStatus: string;
  tenantId: string;
  nickName: string;
  externalBankReference: string;
  bankName: string;
  firstName: string;
  lastName: string;
  accountTypeName: string;
  businessName: string;
  createdTimestamp: string;
  lastModifiedTimestamp: string;
  createdByUser: string;
  lastModifiedByUser: string;
  statusDescription: string;
  isNew: boolean;
  customer?: string;
}

export interface IPopListDataSource extends IBankAccountMapped {
  statusTagType: string;
}

export interface IAddBankAccountParams {
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  nickName: string;
  externalBankReference?: string;
  bankName: string;
}

export interface IEditBankAccountParams {
  accountId: string;
  nickName: string;
  externalBankReference?: string;
}

export interface IUnmaskedBankAccount {
  accountNumber: string;
  accountId: string;
}

export interface IUpdateStatusParams {
  accountId: string;
  status: string;
}
