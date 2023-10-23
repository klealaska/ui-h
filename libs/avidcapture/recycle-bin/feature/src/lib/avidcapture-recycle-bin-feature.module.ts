import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { IndexingPageState } from '@ui-coe/avidcapture/indexing/data-access';
import { AvidcaptureRecycleBinDataAccessModule } from '@ui-coe/avidcapture/recycle-bin/data-access';
import { AvidcaptureRecycleBinUiModule } from '@ui-coe/avidcapture/recycle-bin/ui';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';

import { RecycleBinPageComponent } from './containers/recycle-bin/recycle-bin.component';

const routes: Routes = [
  {
    path: '',
    component: RecycleBinPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    AvidcaptureSharedUiModule,
    AvidcaptureRecycleBinUiModule,
    AvidcaptureRecycleBinDataAccessModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([IndexingPageState]),
    TranslateModule,
  ],
  declarations: [RecycleBinPageComponent],
})
export class AvidcaptureRecycleBinFeatureModule {}
