import { PaymentListService } from '../../../app/payment-list/payment-list.service';

export const mockPaymentService: Partial<PaymentListService> = {
  getPayments: jest.fn(),
  //getPaymentDetails: jest.fn(),
  //stopPayment: jest.fn(),
};
