import {
  bankAccountAddContentMock,
  bankAccountDetailsContentMock,
  bankAccountsEditContentMock,
  bankAccountsListContentMock,
  popBamListContent,
} from '../data';
import { of } from 'rxjs';

export const contentFacadeMock = {
  getHeaderContent: jest.fn(),
  getBankAccountsContent: jest.fn(() => of(bankAccountsListContentMock)),
  getBankAccountAddContent: jest.fn(() => of(bankAccountAddContentMock)),
  getBankAccountEditContent: jest.fn(() => of(bankAccountsEditContentMock)),
  getBankAccountDetailsContent: jest.fn(() => of(bankAccountDetailsContentMock)),
  getPopBankAccountsContent: jest.fn(() => of(popBamListContent)),
};
