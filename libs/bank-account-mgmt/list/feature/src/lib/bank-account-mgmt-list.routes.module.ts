import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BankAccountListContainerComponent } from './containers/bank-account-list/bank-account-list-container.component';

export const bankAccountMgmtListFeatureRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: BankAccountListContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(bankAccountMgmtListFeatureRoutes)],
  exports: [RouterModule],
})
export class BankAccountMgmtListRoutingModule {}
