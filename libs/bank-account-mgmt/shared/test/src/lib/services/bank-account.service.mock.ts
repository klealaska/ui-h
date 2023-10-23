import { IBankAccountMapped, IEditBankAccountParams } from '@ui-coe/bank-account-mgmt/shared/types';
import { bankAccountDetailMock, bankAccountListMock, unmaskedAccountNumberMock } from '../data';
import { of } from 'rxjs';

export const bankAccountServiceMock = {
  getBankAccounts: jest.fn(() => bankAccountListMock),
  getBankAccount: jest.fn(() => bankAccountDetailMock),
  addBankAccount: jest.fn((account: IBankAccountMapped) => account),
  editBankAccount: jest.fn((account: IEditBankAccountParams) => bankAccountDetailMock),
  activateBankAccount: jest.fn(() => of(bankAccountDetailMock)),
  deactivateBankAccount: jest.fn(() => of(bankAccountDetailMock)),
  unmaskAccountNumber: jest.fn(() => of(unmaskedAccountNumberMock)),
  updateStatus: jest.fn(() => of(bankAccountDetailMock)),
};
