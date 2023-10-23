import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureSharedDataAccessModule } from '@ui-coe/avidcapture/shared/data-access';

import { UploadsQueuePageState } from './+state/uploads-queue-page.state';

@NgModule({
  imports: [
    CommonModule,
    AvidcaptureSharedDataAccessModule,
    NgxsModule.forFeature([UploadsQueuePageState]),
  ],
})
export class AvidcaptureMyUploadsDataAccessModule {}
