import { createSelector } from '@ngrx/store';
import * as fromPaymentList from './payment-list.reducer';
import { selectPaymentFeatureState } from './payment-feature.selectors';
import { IPaymentFeatureState } from '../../payment-state.model';

export const selectPaymentListFeatureState = createSelector(
  selectPaymentFeatureState,
  (featureState: IPaymentFeatureState) => featureState[fromPaymentList.paymentListFeatureKey]
);

export const selectAllPayments = createSelector(
  selectPaymentListFeatureState,
  fromPaymentList.selectAll
);
