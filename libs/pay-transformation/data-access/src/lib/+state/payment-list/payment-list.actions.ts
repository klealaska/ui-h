import { createActionGroup, props } from '@ngrx/store';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';

export const PaymentListActions = createActionGroup({
  source: 'Payment List',
  events: {
    'Get Payments': props<{ vendorName?: string }>(),
    'Get Payments Success': props<{ payments: IPaymentDetail[] }>(),
    'Get Payments Failure': props<{ error: unknown }>(),
  },
});
