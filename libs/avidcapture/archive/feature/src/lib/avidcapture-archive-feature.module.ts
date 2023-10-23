import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureArchiveDataAccessModule } from '@ui-coe/avidcapture/archive/data-access';
import { AvidcaptureArchiveUiModule } from '@ui-coe/avidcapture/archive/ui';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';

import { ArchiveInvoicePageComponent } from './containers/archive-invoice-page/archive-invoice-page.component';
import { ArchivePageComponent } from './containers/archive-page/archive-page.component';

const routes: Routes = [
  {
    path: '',
    component: ArchivePageComponent,
  },
  {
    path: ':docId',
    component: ArchiveInvoicePageComponent,
  },
];

@NgModule({
  declarations: [ArchivePageComponent, ArchiveInvoicePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AvidcaptureSharedUiModule,
    AvidcaptureArchiveDataAccessModule,
    AvidcaptureArchiveUiModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
  ],
})
export class AvidcaptureArchiveFeatureModule {}
