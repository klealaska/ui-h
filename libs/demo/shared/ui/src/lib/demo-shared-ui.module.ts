import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, SharedUiV2Module, TextareaComponent } from '@ui-coe/shared/ui-v2';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
    MatIconModule,
    ReactiveFormsModule,
    ButtonComponent,
    TextareaComponent,
    SharedUiV2Module,
  ],
  declarations: [ChatboxComponent],
  exports: [ChatboxComponent],
})
export class DemoSharedUiModule {}
