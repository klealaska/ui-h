import { Component } from '@angular/core';
import { BamPanelHeaderSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';
import { BankAccountCardSkeletonComponent } from '../../../components/bank-account-card/skeleton/bank-account-card-skeleton.component';

@Component({
  selector: 'ax-bank-account-list-skeleton',
  standalone: true,
  template: `
    <ui-coe-bam-panel-header-skeleton></ui-coe-bam-panel-header-skeleton>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 mt-8 mx-8">
      <ax-bank-account-card-skeleton></ax-bank-account-card-skeleton>
      <ax-bank-account-card-skeleton></ax-bank-account-card-skeleton>
    </div>
  `,
  imports: [BamPanelHeaderSkeletonComponent, BankAccountCardSkeletonComponent],
})
export class BankAccountListSkeletonComponent {}
