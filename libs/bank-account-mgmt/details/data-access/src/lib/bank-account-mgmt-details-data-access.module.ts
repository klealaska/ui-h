import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  bankAccountDetailEffects,
  bankAccountDetailReducers,
  bankAccountDetailStateFeatureKey,
} from './bank-account-detail-state.model';
import { BankAccountDetailFacade } from './+state/bank-account-detail.facade';
import { BankAccountDetailsService } from './services/bank-account-details.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(bankAccountDetailStateFeatureKey, bankAccountDetailReducers),
    EffectsModule.forFeature(bankAccountDetailEffects),
  ],
  providers: [BankAccountDetailsService, BankAccountDetailFacade],
})
export class BankAccountMgmtDetailsDataAccessModule {}
