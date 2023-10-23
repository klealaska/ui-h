import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AddBankAccountEffects } from './+state/add-bank-account.effects';
import { AddBankAccountFacade } from './+state/add-bank-account.facade';
import { AddAccountService } from './services/add-account.service';
import { bankAccountAddReducers, bankAccountAddStateFeatureKey } from './bank-account-state.model';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule, // TODO move notification trigger out of data access module
    StoreModule.forFeature(bankAccountAddStateFeatureKey, bankAccountAddReducers),
    EffectsModule.forFeature(AddBankAccountEffects),
  ],
  providers: [AddAccountService, AddBankAccountFacade],
})
export class BankAccountMgmtAddDataAccessModule {}
