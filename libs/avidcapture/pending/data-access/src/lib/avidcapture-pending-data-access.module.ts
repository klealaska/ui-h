import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureSharedDataAccessModule } from '@ui-coe/avidcapture/shared/data-access';

import { PendingPageState } from './+state/pending-page.state';

@NgModule({
  imports: [
    CommonModule,
    AvidcaptureSharedDataAccessModule,
    NgxsModule.forFeature([PendingPageState]),
  ],
})
export class AvidcapturePendingDataAccessModule {}
