import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { IndexingPageState } from '@ui-coe/avidcapture/indexing/data-access';
import { AvidcaptureResearchDataAccessModule } from '@ui-coe/avidcapture/research/data-access';
import { AvidcaptureResearchUiModule } from '@ui-coe/avidcapture/research/ui';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';

import { ResearchQueuePageComponent } from './containers/research-queue-page/research-queue-page.component';

const routes: Routes = [
  {
    path: '',
    component: ResearchQueuePageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([IndexingPageState]),
    AvidcaptureSharedUiModule,
    AvidcaptureResearchDataAccessModule,
    AvidcaptureResearchUiModule,
    TranslateModule,
  ],
  declarations: [ResearchQueuePageComponent],
})
export class AvidcaptureResearchFeatureModule {}
