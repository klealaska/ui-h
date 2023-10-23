import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureSharedDataAccessModule } from '@ui-coe/avidcapture/shared/data-access';

import { RecycleBinPageState } from './+state/recycle-bin-page.state';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([RecycleBinPageState]),
    AvidcaptureSharedDataAccessModule,
  ],
})
export class AvidcaptureRecycleBinDataAccessModule {}
