import { HttpModule, HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { MOCK_ENV, MOCK_FILE_PATH } from '../shared';
import DoneCallback = jest.DoneCallback;
import { configServiceMock } from '../../assets/mock/services/config.service.mock';
import { HttpConfigService } from '../../services/http-config.service';
import * as mockPaymentList from '../../assets/mock/json/payment-list.json';
import { PaymentListService } from './payment-list.service';
import { IPaymentDetail } from '../../../../../../libs/pay-transformation/shared/types/src';
import { MockHttpService, defaultSortFilterConfig } from '@ui-coe/shared/bff/data-access';

describe('paymentListService', () => {
  let service: PaymentListService;
  let mockHttpService: MockHttpService;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        PaymentListService,
        MockHttpService,
        { provide: HttpConfigService, useValue: configServiceMock },
        { provide: MOCK_ENV, useValue: true },
        { provide: MOCK_FILE_PATH, useValue: '' },
        { provide: 'SORT_FILTER_CONFIG', useValue: defaultSortFilterConfig },
      ],
    }).compile();

    service = moduleRef.get<PaymentListService>(PaymentListService);
    mockHttpService = moduleRef.get<MockHttpService>(MockHttpService);
    httpService = moduleRef.get<HttpService>(HttpService);
  });

  describe('getPayments()', () => {
    it('should getPayments() -- success', (done: DoneCallback) => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of({ data: mockPaymentList } as AxiosResponse));
      service.getPayments().subscribe((response: IPaymentDetail[]) => {
        expect(httpService.get).toHaveBeenCalledWith(configServiceMock.getPayments());
        expect(response).toEqual(mockPaymentList);
        done();
      });
    });
  });
});
