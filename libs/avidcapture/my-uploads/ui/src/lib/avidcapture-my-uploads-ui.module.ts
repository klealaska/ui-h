import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';
import { AvidcaptureSharedUtilModule } from '@ui-coe/avidcapture/shared/util';
import {
  ButtonComponent,
  CheckboxComponent,
  DropdownComponent,
  DropzoneComponent,
  DropzoneDirective,
  LinkComponent,
  ProgressBarComponent,
  TableComponent,
} from '@ui-coe/shared/ui-v2';

import { UploadCompleteComponent } from './components/upload-complete/upload-complete.component';
import { UploadsDropZoneComponent } from './components/uploads-drop-zone/uploads-drop-zone.component';
import { UploadsQueueGridComponent } from './components/uploads-queue-grid/uploads-queue-grid.component';

@NgModule({
  imports: [
    CommonModule,
    AvidcaptureSharedUiModule,
    AvidcaptureSharedUtilModule,
    ButtonComponent,
    CheckboxComponent,
    DropdownComponent,
    DropzoneComponent,
    LinkComponent,
    ProgressBarComponent,
    TableComponent,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    TranslateModule,
    DropzoneDirective,
  ],
  declarations: [UploadsQueueGridComponent, UploadsDropZoneComponent, UploadCompleteComponent],
  exports: [UploadsQueueGridComponent, UploadsDropZoneComponent, UploadCompleteComponent],
})
export class AvidcaptureMyUploadsUiModule {}
