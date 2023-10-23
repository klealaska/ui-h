import { createSelector } from '@ngrx/store';
import * as fromPaymentDetail from './payment-detail.reducer';
import { IPaymentDetailState } from './payment-detail.reducer';
import { IPaymentFeatureState } from '../../payment-state.model';
import { selectPaymentFeatureState } from '../payment-feature.selectors';
import { Dictionary } from '@ngrx/entity';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';

export const selectPaymentDetailFeatureState = createSelector(
  selectPaymentFeatureState,
  (featureState: IPaymentFeatureState) => featureState[fromPaymentDetail.paymentDetailFeatureKey]
);

export const getEntities = createSelector(
  selectPaymentDetailFeatureState,
  fromPaymentDetail.selectEntities
);

export const getSelectedId = createSelector(
  selectPaymentDetailFeatureState,
  (state: IPaymentDetailState) => state.selectedPaymentId
);

export const getSelectedDetail = createSelector(
  getSelectedId,
  getEntities,
  (id: string, entities: Dictionary<IPaymentDetail>) => entities[id]
);

export const getStopPaymentAlerts = createSelector(
  selectPaymentDetailFeatureState,
  (state: IPaymentDetailState) => state.stopPaymentAlerts
);
