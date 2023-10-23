import { ActionReducerMap } from '@ngrx/store';
import * as fromPaymentList from './+state/payment-list/payment-list.reducer';
import * as fromPaymentDetail from './+state/payment-detail/payment-detail.reducer';
import { PaymentDetailEffects } from './+state/payment-detail/payment-detail.effects';
import { PaymentListEffects } from './+state/payment-list/payment-list.effects';
import { EntityState } from '@ngrx/entity';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';

export const paymentStateFeatureKey = 'payTransformation';
export const payTransformationReducers: ActionReducerMap<IPaymentFeatureState> = {
  [fromPaymentList.paymentListFeatureKey]: fromPaymentList.reducer,
  [fromPaymentDetail.paymentDetailFeatureKey]: fromPaymentDetail.reducer,
};
export const payTransformationEffects = [PaymentDetailEffects, PaymentListEffects];

export interface IPaymentFeatureState {
  [fromPaymentList.paymentListFeatureKey]: EntityState<IPaymentDetail>;
  [fromPaymentDetail.paymentDetailFeatureKey]: EntityState<IPaymentDetail>;
}
