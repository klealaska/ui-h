import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRoutingModule } from './pay-transformation-routing.module';
import { MatTableModule } from '@angular/material/table';
import { PaymentContainerComponent } from './containers/payment-container/payment-container.component';
import { PaymentListContainerComponent } from './containers/payment-list-container/payment-list-container.component';
import { PayTransformationSharedDataAccessModule } from '@ui-coe/pay-transformation/shared/data-access';
import { InputComponent, SharedUiV2Module } from '@ui-coe/shared/ui-v2';
import { PayTransformationDataAccessModule } from '@ui-coe/pay-transformation/data-access';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import { PayTransformationSharedUiModule } from '@ui-coe/pay-transformation/shared/ui';

@NgModule({
  imports: [
    CommonModule,
    PaymentRoutingModule,
    PayTransformationDataAccessModule,
    PayTransformationSharedDataAccessModule,
    MatTableModule,
    InputComponent,
    SharedUiV2Module,
    PayTransformationSharedUiModule,
  ],
  declarations: [PaymentContainerComponent, PaymentListContainerComponent, PaymentListComponent],
  exports: [SharedUiV2Module],
})
export class PayTransformationFeatureModule {}
