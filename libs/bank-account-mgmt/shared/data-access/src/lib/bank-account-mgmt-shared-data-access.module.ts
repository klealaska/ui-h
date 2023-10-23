import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentFacade } from './content';
import { HeaderService } from './services';
import { StoreModule } from '@ngrx/store';
import * as fromBankAccountShared from './+state/bank-account-shared.reducer';
import { BankAccountSharedFacade } from './+state';
import { EffectsModule } from '@ngrx/effects';
import { BankAccountSharedEffects } from './+state/bank-account-shared.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromBankAccountShared.sharedStateFeatureKey,
      fromBankAccountShared.reducer
    ),
    EffectsModule.forFeature([BankAccountSharedEffects]),
  ],
  providers: [ContentFacade, HeaderService, BankAccountSharedFacade],
})
export class BankAccountMgmtSharedDataAccessModule {}
