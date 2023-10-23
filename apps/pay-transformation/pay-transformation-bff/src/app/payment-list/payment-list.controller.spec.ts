import { PaymentListController } from './payment-list.controller';
import { PaymentListService } from './payment-list.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mockPaymentService } from '../../assets/mock/services/payment.service.mock';
import { of } from 'rxjs';
import { IPaymentDetail } from '../../../../../../libs/pay-transformation/shared/types/src';
import DoneCallback = jest.DoneCallback;

const mockPaymentId = 'TRE7183659';
const mockPaymentDetails: IPaymentDetail = {
  id: 'TRE7183659',
  amount: 2000,
  date: new Date('2022-08-22T19:19:36.971Z'),
  vendorName: 'JR Plumbing LLC',
  status: 'Status Example',
  batchId: '123',
  entityId: '123',
  fundingAccount: '1234567',
  vendorId: '123',
  remitAddress: '1 Canal St., New Orleans, LA 70131',
  lastUpdatedBy: 'jdoe@example.com',
  lastUpdatedOn: new Date('2022-08-22T19:19:36.971Z'),
  distributions: [],
};

describe('PaymentController', () => {
  let controller: PaymentListController;
  let service: PaymentListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentListController],
      providers: [{ provide: PaymentListService, useValue: mockPaymentService }],
    }).compile();

    controller = module.get<PaymentListController>(PaymentListController);
    service = module.get<PaymentListService>(PaymentListService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('payments', () => {
    it('should call getPayments', (done: jest.DoneCallback) => {
      const result: IPaymentDetail[] = [];
      jest.spyOn(service, 'getPayments').mockImplementation(() => of(result));

      controller.getPayments().subscribe(res => {
        expect(res).toEqual(result);
        done();
      });
      expect(service.getPayments).toHaveBeenCalledTimes(1);
    });
  });
});
