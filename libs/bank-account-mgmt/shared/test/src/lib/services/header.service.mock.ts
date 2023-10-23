import { of } from 'rxjs';
import { bankAccountsHeaderContentMock } from '../data';

export const headerServiceMock = {
  getHeaderLabel: jest.fn(() => of(bankAccountsHeaderContentMock)),
  setHeaderLabel: jest.fn(),
};
