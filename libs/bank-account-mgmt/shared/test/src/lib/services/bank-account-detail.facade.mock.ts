import { of } from 'rxjs';
import { bankAccountDetailMock } from '../data';

export const bankAccountDetailFacadeMock = {
  bankAccount$: of(bankAccountDetailMock),
  dispatchGetBankAccount: jest.fn(),
  dispatchEditBankAccount: jest.fn(() => of({})),
  dispatchDeactivateAccount: jest.fn(),
  dispatchActivateAccount: jest.fn(),
  dispatchGetUnmaskedAccountNumber: jest.fn(),
  dispatchResetDetails: jest.fn(),
  dispatchStatusUpdate: jest.fn(),
};
