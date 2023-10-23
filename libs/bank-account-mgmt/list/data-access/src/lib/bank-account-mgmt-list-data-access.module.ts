import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  bankAccountListEffects,
  bankAccountListReducers,
  bankAccountStateListFeatureKey,
} from './bank-account-state-model';
import { BankAccountListFacade } from './+state/bank-account-list';
import { BankAccountService } from './services/bank-account.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(bankAccountStateListFeatureKey, bankAccountListReducers),
    EffectsModule.forFeature(bankAccountListEffects),
  ],
  providers: [BankAccountService, BankAccountListFacade],
})
export class BankAccountMgmtListDataAccessModule {}
