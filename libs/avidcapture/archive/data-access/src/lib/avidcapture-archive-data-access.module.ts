import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureSharedDataAccessModule } from '@ui-coe/avidcapture/shared/data-access';

import { ArchiveInvoicePageState } from './+state/archive-invoice-page/archive-invoice-page.state';
import { ArchivePageState } from './+state/archive-page/archive-page.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([ArchivePageState, ArchiveInvoicePageState]),
    AvidcaptureSharedDataAccessModule,
  ],
})
export class AvidcaptureArchiveDataAccessModule {}
