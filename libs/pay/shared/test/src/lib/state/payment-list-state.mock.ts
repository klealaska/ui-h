import { of } from 'rxjs';
import { mockPaymentList } from '../data/payment/payment-list.mock';

export const mockPaymentListFacade = {
  payments$: of(mockPaymentList),
  dispatchLoadPayments: jest.fn(),
  getView: jest.fn(),
  onViewPaymentDetails: jest.fn(),
};
