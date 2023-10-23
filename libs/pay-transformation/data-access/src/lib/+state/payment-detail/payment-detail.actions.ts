import { createActionGroup, props } from '@ngrx/store';
import { IPaymentDetail, IStopPayment } from '@ui-coe/pay-transformation/shared/types';

export const PaymentDetailActions = createActionGroup({
  source: 'Payment Detail',
  events: {
    'Get Payment Detail': props<{ id: string }>(),
    'Get Payment Detail Success': props<{ detail: IPaymentDetail }>(),
    'Get Payment Detail Failure': props<{ error: unknown }>(),
  },
});

export const CancelPaymentActions = createActionGroup({
  source: 'Cancel Payment',
  events: {
    'Cancel Payment': props<{ id: string }>(),
    'Cancel Payment Success': props<{ response: IPaymentDetail }>(),
    'Cancel Payment Failure': props<{ error: unknown }>(),
  },
});

export const StopPaymentActions = createActionGroup({
  source: 'Stop Payment',
  events: {
    'Stop Payment': props<IStopPayment>(),
    'Stop Payment Success': props<{ response: IPaymentDetail; distributionId: string }>(),
    'Stop Payment Failure': props<{ error: unknown }>(),
  },
});
