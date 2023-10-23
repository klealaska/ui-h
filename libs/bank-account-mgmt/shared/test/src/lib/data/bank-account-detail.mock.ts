import {
  IBankAccountMapped,
  IEditBankAccountParams,
  IUnmaskedBankAccount,
  IUpdateStatusParams,
} from '@ui-coe/bank-account-mgmt/shared/types';

export const bankAccountDetailMock: IBankAccountMapped = {
  accountNumber: '******2789',
  accountId: 'gxtsepgsuqjqgyxxfmls',
  routingNumber: '122105278',
  accountType: 'Consumer Checking',
  verificationStatus: 'Active',
  bankAccountStatus: 'Active',
  tenantId: 'avidxchange123456789',
  nickName: null,
  externalBankReference: 'DD8',
  bankName: 'JPM Chase',
  firstName: 'Tooty',
  lastName: 'Fruity',
  accountTypeName: 'Consumer Checking',
  businessName: null,
  createdTimestamp: '0001-01-01T00:00:00',
  lastModifiedTimestamp: '0001-01-01T00:00:00',
  createdByUser: null,
  lastModifiedByUser: null,
  statusDescription: null,
  isNew: true,
};

export const bankAccountCardMock: IBankAccountMapped = {
  accountNumber: '******2789',
  accountId: 'gxtsepgsuqjqgyxxfmls',
  routingNumber: '122105278',
  accountType: 'Consumer Checking',
  verificationStatus: 'Active',
  bankAccountStatus: 'Active',
  tenantId: 'avidxchange123456789',
  nickName: 'Some nickname',
  externalBankReference: 'DD8',
  bankName: 'JPM Chase',
  firstName: 'Tooty',
  lastName: 'Fruity',
  accountTypeName: 'Consumer Checking',
  businessName: null,
  createdTimestamp: '0001-01-01T00:00:00',
  lastModifiedTimestamp: '0001-01-01T00:00:00',
  createdByUser: null,
  lastModifiedByUser: null,
  statusDescription: null,
  isNew: true,
};

export const editBankAccountParamsMock: IEditBankAccountParams = {
  accountId: '1',
  nickName: 'my account',
};

export const unmaskedAccountNumberMock: IUnmaskedBankAccount = {
  accountId: '1',
  accountNumber: '123456789',
};

export const updateStatusParamsMock: IUpdateStatusParams = {
  accountId: '1',
  status: 'failed',
};
