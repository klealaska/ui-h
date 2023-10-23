import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WinnerScreenComponent } from './components/winner-screen/winner-screen.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { DieComponent } from './components/die/die.component';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  declarations: [WinnerScreenComponent, DieComponent],
  exports: [WinnerScreenComponent, DieComponent],
})
export class DemoGameUiModule {}
