import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  payTransformationEffects,
  payTransformationReducers,
  paymentStateFeatureKey,
} from './payment-state.model';
import { PaymentListService } from './services/payment-list/payment-list.service';
import { PaymentDetailService } from './services/payment-detail/payment-detail.service';
import { PaymentDetailFacade, PaymentListFacade } from './+state';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(paymentStateFeatureKey, payTransformationReducers),
    EffectsModule.forFeature(payTransformationEffects),
  ],
  providers: [PaymentDetailService, PaymentDetailFacade, PaymentListService, PaymentListFacade],
})
export class PayTransformationDataAccessModule {}
