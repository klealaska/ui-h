import {
  ICreateBankAccountParams,
  IUpdateBankAccountParams,
  IUpdateStatusParams,
} from '../../../app/models/bank-account.model';

export const addBankAccountParamsMock: ICreateBankAccountParams = {
  nickName: 'Account 1',
  routingNumber: '938422189',
  accountNumber: '1023300',
  firstName: 'John',
  lastName: 'Smith',
  businessName: '',
  bankName: 'JPMorgan Chase Bank N.A.',
  externalBankReference: 'bank 1',
  accountType: 'checking',
};

export const updateBankAccountParamsMock: IUpdateBankAccountParams = {
  accountId: 'somebankaccountid',
  nickName: 'Account 1',
};

export const updateStatusParamsMock: IUpdateStatusParams = {
  accountId: 'somebankaccountid',
  status: 'failed',
};
