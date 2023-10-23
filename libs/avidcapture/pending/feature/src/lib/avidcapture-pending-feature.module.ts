import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { IndexingPageState } from '@ui-coe/avidcapture/indexing/data-access';
import { AvidcapturePendingDataAccessModule } from '@ui-coe/avidcapture/pending/data-access';
import { AvidcapturePendingUiModule } from '@ui-coe/avidcapture/pending/ui';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';

import { PendingPageComponent } from './containers/pending-page/pending-page.component';

const routes: Routes = [
  {
    path: '',
    component: PendingPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    AvidcaptureSharedUiModule,
    AvidcapturePendingDataAccessModule,
    AvidcapturePendingUiModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([IndexingPageState]),
    TranslateModule,
  ],
  declarations: [PendingPageComponent],
})
export class AvidcapturePendingFeatureModule {}
