import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { HotkeysDialogComponent } from './components/hotkeys-dialog/hotkeys-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  declarations: [HotkeysDialogComponent],
})
export class AvidcaptureIndexingUtilModule {}
