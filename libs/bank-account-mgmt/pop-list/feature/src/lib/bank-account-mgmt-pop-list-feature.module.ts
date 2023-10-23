import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountPopListContainerComponent } from './containers/bank-account-list/bank-account-pop-list-container.component';
import { BankAccountsEmptyStateComponent, PopListComponent } from './components';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  ButtonToggleComponent,
  InputComponent,
  SharedUiV2Module,
  TagComponent,
  TableComponent,
} from '@ui-coe/shared/ui-v2';
import { BankAccountMgmtSharedUiModule } from '@ui-coe/bank-account-mgmt/shared/ui';
import { BankAccountMgmtListRoutingModule } from './bank-account-mgmt-pop-list.routes.module';
import { PopBamListDataAccessModule } from '@ui-coe/bank-account-mgmt/pop-list/data-access';
import { BankAccountMgmtSharedDataAccessModule } from '@ui-coe/bank-account-mgmt/shared/data-access';

@NgModule({
  declarations: [
    BankAccountPopListContainerComponent,
    BankAccountsEmptyStateComponent,
    PopListComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    SharedUiV2Module,
    ButtonComponent,
    TagComponent,
    TableComponent,
    InputComponent,
    ButtonToggleComponent,
    ReactiveFormsModule,
    BankAccountMgmtSharedUiModule,
    BankAccountMgmtListRoutingModule,
    PopBamListDataAccessModule,
    BankAccountMgmtSharedDataAccessModule,
  ],
  exports: [PopListComponent],
})
export class BankAccountMgmtPopListFeatureModule {}
