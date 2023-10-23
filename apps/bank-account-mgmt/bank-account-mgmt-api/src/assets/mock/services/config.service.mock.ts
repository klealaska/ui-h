import { HttpConfigService } from '../../../services/http-config.service';

export const configServiceMock: Partial<HttpConfigService> = {
  getBankAccounts: jest.fn(() => '/bank-accounts'),
  getBankAccountById: jest.fn(() => '/bank-account-detail'),
  postBankAccount: jest.fn(() => '/bank-account-detail'),
  updateBankAccount: jest.fn(() => '/bank-account-detail'),
  updateStatus: jest.fn(() => '/bank-account-detail'),
};
