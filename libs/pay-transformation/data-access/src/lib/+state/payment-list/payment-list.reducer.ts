import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { PaymentListActions } from './payment-list.actions';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';

export const paymentListFeatureKey = 'payTransformationList';

export interface IPaymentListState extends EntityState<IPaymentDetail> {
  selectedPaymentId: string | null;
}

export const adapter: EntityAdapter<IPaymentDetail> = createEntityAdapter<IPaymentDetail>();
export const initialState: IPaymentListState = adapter.getInitialState({
  selectedPaymentId: null,
});

export const reducer = createReducer(
  initialState,
  on(PaymentListActions.getPaymentsSuccess, (state, { payments }) =>
    adapter.setAll(payments, state)
  ),
  on(PaymentListActions.getPaymentsFailure, (state, { error }) => state)
);

export const { selectAll, selectTotal } = adapter.getSelectors();
