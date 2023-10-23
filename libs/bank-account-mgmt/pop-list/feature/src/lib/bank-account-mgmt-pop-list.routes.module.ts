import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BankAccountPopListContainerComponent } from './containers/bank-account-list/bank-account-pop-list-container.component';

export const bankAccountMgmtPopListFeatureRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    component: BankAccountPopListContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(bankAccountMgmtPopListFeatureRoutes)],
  exports: [RouterModule],
})
export class BankAccountMgmtListRoutingModule {}
