import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';

import { UploaderComponent } from './uploader/uploader.component';
import { FileComponent } from './uploader/components/file/file.component';

@NgModule({
  imports: [
    CommonModule,
    MatDividerModule,
    NgxDropzoneModule,
    HttpClientModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  declarations: [UploaderComponent, FileComponent],
  exports: [UploaderComponent, FileComponent],
})
export class SharedUploaderFeatureModule {}
