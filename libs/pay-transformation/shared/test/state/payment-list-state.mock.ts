import { of } from 'rxjs';
import { mockPaymentList } from '../src';

export const mockPaymentListFacade = {
  payments$: of(mockPaymentList),
  dispatchLoadPayments: jest.fn(),
  getView: jest.fn(),
  onViewPaymentDetails: jest.fn(),
};
