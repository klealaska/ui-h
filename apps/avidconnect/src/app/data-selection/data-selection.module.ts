import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSelectionComponent } from './components/container/data-selection/data-selection.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { DataSelectionState } from './data-selection.state';
import { RegistrationEnablementOptionComponent } from './components/presentation/registration-enablement-option/registration-enablement-option.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: DataSelectionComponent,
  },
];

@NgModule({
  declarations: [DataSelectionComponent, RegistrationEnablementOptionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([DataSelectionState]),
    SharedModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
})
export class DataSelectionModule {}
