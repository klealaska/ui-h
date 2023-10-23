export interface ICreateBankAccountParams {
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  nickName: string;
  externalBankReference?: string;
  bankName: string;
}

export interface IUpdateBankAccountParams {
  accountId: string;
  externalBankReference?: string;
  nickName: string;
}

export interface IUpdateStatusParams {
  accountId: string;
  status: string;
}
