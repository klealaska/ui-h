import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountHeaderContainerComponent } from './bank-account-header/bank-account-header-container.component';
import { BamPanelHeaderSkeletonComponent } from './skeleton-loaders/side-panel/bam-panel-header-skeleton.component';
import { BamlistSkeletonComponent } from './skeleton-loaders/list/bam-list-skeleton.component';

@NgModule({
  declarations: [BankAccountHeaderContainerComponent],
  imports: [CommonModule, BamPanelHeaderSkeletonComponent, BamlistSkeletonComponent],
  exports: [
    BankAccountHeaderContainerComponent,
    BamPanelHeaderSkeletonComponent,
    BamlistSkeletonComponent,
  ],
})
export class BankAccountMgmtSharedUiModule {}
