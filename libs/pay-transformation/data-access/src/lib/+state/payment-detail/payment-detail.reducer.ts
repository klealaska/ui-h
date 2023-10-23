import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import {
  CancelPaymentActions,
  PaymentDetailActions,
  StopPaymentActions,
} from './payment-detail.actions';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';

export const paymentDetailFeatureKey = 'payTransformationDetail';

export interface IPaymentDetailState extends EntityState<IPaymentDetail> {
  selectedPaymentId: string | null;
  paymentCanceled: unknown | null;
  stopPaymentAlerts: string[];
}

export const adapter: EntityAdapter<IPaymentDetail> = createEntityAdapter<IPaymentDetail>();
export const initialState: IPaymentDetailState = adapter.getInitialState({
  selectedPaymentId: null,
  paymentCanceled: null,
  stopPaymentAlerts: [],
});

export const reducer = createReducer(
  initialState,
  on(PaymentDetailActions.getPaymentDetailSuccess, (state, { detail }) =>
    adapter.upsertOne(detail, { ...state, selectedPaymentId: detail.id })
  ),
  on(PaymentDetailActions.getPaymentDetailFailure, (state, { error }) => state),

  // Is this correct?
  on(CancelPaymentActions.cancelPaymentSuccess, (state, { response }) => {
    return adapter.upsertOne(response, { ...state, selectedPaymentId: response.id });
  }),
  on(CancelPaymentActions.cancelPaymentFailure, (state, { error }) => state),

  on(StopPaymentActions.stopPaymentSuccess, (state, { response, distributionId }) => {
    return adapter.upsertOne(response, {
      ...state,
      stopPaymentAlerts: [...state.stopPaymentAlerts, distributionId],
    });
  }),
  on(StopPaymentActions.stopPaymentFailure, (state, { error }) => state)
);

export const { selectIds, selectAll, selectEntities } = adapter.getSelectors();
