import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownComponent } from '@ui-coe/shared/ui-v2';

import { DashboardFilterComponent } from './components/dashboard-filter/dashboard-filter.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownComponent,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    TranslateModule,
  ],
  declarations: [DashboardFilterComponent],
  exports: [DashboardFilterComponent],
})
export class AvidcaptureDashboardUiModule {}
