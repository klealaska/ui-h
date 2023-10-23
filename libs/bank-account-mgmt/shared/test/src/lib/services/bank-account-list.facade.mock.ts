import { bankAccountListMock } from '../data';
import { of } from 'rxjs';

export const bankAccountListFacadeMock = {
  bankAccounts$: of(bankAccountListMock),
  listLoading$: of(false),
  addLoading$: of(false),
  dispatchGetBankAccounts: jest.fn(),
  dispatchAddBankAccount: jest.fn(() => of({})),
};
