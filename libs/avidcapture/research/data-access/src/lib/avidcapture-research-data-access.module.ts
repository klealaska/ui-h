import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AvidcaptureSharedDataAccessModule } from '@ui-coe/avidcapture/shared/data-access';

import { ResearchPageState } from './+state/research-page.state';

@NgModule({
  imports: [
    CommonModule,
    AvidcaptureSharedDataAccessModule,
    NgxsModule.forFeature([ResearchPageState]),
  ],
})
export class AvidcaptureResearchDataAccessModule {}
