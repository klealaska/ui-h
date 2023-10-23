import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PaymentListContainerComponent } from './containers/payment-list-container/payment-list-container.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentListContainerComponent,
    children: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
