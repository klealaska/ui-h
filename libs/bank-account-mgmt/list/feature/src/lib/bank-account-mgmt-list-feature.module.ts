import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountListContainerComponent } from './containers/bank-account-list/bank-account-list-container.component';
import { BankAccountCardComponent, BankAccountsEmptyStateComponent } from './components';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  ButtonToggleComponent,
  InputComponent,
  SharedUiV2Module,
  TagComponent,
  TooltipDirective,
  TooltipComponent,
} from '@ui-coe/shared/ui-v2';
import { BankAccountMgmtSharedUiModule } from '@ui-coe/bank-account-mgmt/shared/ui';
import { BankAccountMgmtListRoutingModule } from './bank-account-mgmt-list.routes.module';
import { BankAccountMgmtListDataAccessModule } from '@ui-coe/bank-account-mgmt/list/data-access';
import { BankAccountMgmtSharedDataAccessModule } from '@ui-coe/bank-account-mgmt/shared/data-access';
import { BankAccountListSkeletonComponent } from './containers/bank-account-list/skeleton/bank-account-list-skeleton.component';

@NgModule({
  declarations: [
    BankAccountListContainerComponent,
    BankAccountsEmptyStateComponent,
    BankAccountCardComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    SharedUiV2Module,
    ButtonComponent,
    TagComponent,
    InputComponent,
    TooltipDirective,
    TooltipComponent,
    ButtonToggleComponent,
    ReactiveFormsModule,
    BankAccountMgmtSharedUiModule,
    BankAccountMgmtListRoutingModule,
    BankAccountMgmtListDataAccessModule,
    BankAccountMgmtSharedDataAccessModule,
    BankAccountListSkeletonComponent,
  ],
})
export class BankAccountMgmtListFeatureModule {}
