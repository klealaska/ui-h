import { Component } from '@angular/core';
import { AddFormSkeletonComponent } from '../../../components/add/add-form/skeleton/add-form.skeleton.component';
import { BamPanelHeaderSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';

@Component({
  selector: 'ax-bank-account-add-skeleton',
  standalone: true,
  template: `
    <ui-coe-bam-panel-header-skeleton></ui-coe-bam-panel-header-skeleton>
    <div class="mt-8 px-8">
      <ax-add-form-skeleton></ax-add-form-skeleton>
    </div>
  `,
  imports: [BamPanelHeaderSkeletonComponent, AddFormSkeletonComponent],
})
export class BankAccountAddSkeletonComponent {}
