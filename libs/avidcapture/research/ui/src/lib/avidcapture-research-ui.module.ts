import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvidcaptureSharedUiModule } from '@ui-coe/avidcapture/shared/ui';
import { ResearchFilterComponent } from './components/research-filter/research-filter.component';
import { ResearchGridComponent } from './components/research-grid/research-grid.component';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AvidcaptureSharedUtilModule } from '@ui-coe/avidcapture/shared/util';
import {
  ButtonComponent,
  CheckboxComponent,
  LinkComponent,
  TableComponent,
  TooltipDirective,
} from '@ui-coe/shared/ui-v2';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    ButtonComponent,
    CheckboxComponent,
    LinkComponent,
    AvidcaptureSharedUiModule,
    AvidcaptureSharedUtilModule,
    MatButtonModule,
    MatChipsModule,
    TranslateModule,
    TableComponent,
    MatSortModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    TooltipDirective,
  ],
  declarations: [ResearchGridComponent, ResearchFilterComponent],
  exports: [ResearchGridComponent, ResearchFilterComponent],
})
export class AvidcaptureResearchUiModule {}
