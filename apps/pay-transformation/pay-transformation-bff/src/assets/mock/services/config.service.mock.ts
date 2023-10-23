import { HttpConfigService } from '../../../services/http-config.service';

export const configServiceMock: Partial<HttpConfigService> = {
  getPayments: jest.fn(() => '/payment-list'),
};
