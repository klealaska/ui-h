import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { IndexingPageState } from '@ui-coe/avidcapture/indexing/data-access';
import { AvidcaptureMyUploadsDataAccessModule } from '@ui-coe/avidcapture/my-uploads/data-access';
import { AvidcaptureMyUploadsUiModule } from '@ui-coe/avidcapture/my-uploads/ui';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';
import { ButtonComponent, InputComponent } from '@ui-coe/shared/ui-v2';

import { UploadsQueuePageComponent } from './containers/uploads-queue-page/uploads-queue-page.component';

const routes: Routes = [
  {
    path: '',
    component: UploadsQueuePageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ButtonComponent,
    InputComponent,
    AvidcaptureSharedUiModule,
    AvidcaptureMyUploadsUiModule,
    AvidcaptureMyUploadsDataAccessModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([IndexingPageState]),
    TranslateModule,
    MatIconModule,
  ],
  declarations: [UploadsQueuePageComponent],
})
export class AvidcaptureMyUploadsFeatureModule {}
