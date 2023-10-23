import { createFeatureSelector } from '@ngrx/store';
import { IPaymentFeatureState, paymentStateFeatureKey } from '../payment-state.model';

export const selectPaymentFeatureState =
  createFeatureSelector<IPaymentFeatureState>(paymentStateFeatureKey);
