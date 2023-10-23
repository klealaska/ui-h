import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BamExperienceRoutingModule } from './bam-experience.routes.module';
import { BamExperienceComponent } from './bam-experience.component';
import { BankAccountMgmtSharedDataAccessModule } from '@ui-coe/bank-account-mgmt/shared/data-access';
import { SideSheetV2Component } from '@ui-coe/shared/ui-v2';
import { BankAccountAddComponent } from '@ui-coe/bank-account-mgmt/add/feature';
import {
  BankAccountDetailContainerComponent,
  BankAccountEditContainerComponent,
} from '@ui-coe/bank-account-mgmt/details/feature';
import { BankAccountMgmtDetailsDataAccessModule } from '@ui-coe/bank-account-mgmt/details/data-access';

@NgModule({
  declarations: [BamExperienceComponent],
  imports: [
    CommonModule,
    BamExperienceRoutingModule,
    BankAccountMgmtSharedDataAccessModule,
    SideSheetV2Component,
    BankAccountDetailContainerComponent,
    BankAccountAddComponent,
    BankAccountEditContainerComponent,
    BankAccountMgmtDetailsDataAccessModule,
  ],
})
/** Bank Account Management Experience */
export class BamExperienceModule {}
