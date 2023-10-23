import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InputDirective } from '../input/input.directive';
import { InputHeaderComponent } from '../input/input-header/input-header.component';
import { InputErrorComponent } from '../input/input-error/input-error.component';
import { InputHintComponent } from '../input/input-hint/input-hint.component';

@Component({
  selector: 'ax-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  standalone: true,
  imports: [
    InputErrorComponent,
    InputHintComponent,
    InputHeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class TextareaComponent extends InputDirective {
  @Input() maxLength: number;
  @Output() textareaValueEvent = new EventEmitter();

  applyFilter(event): void {
    const value = (event?.target as HTMLInputElement)?.value;
    this.textareaValueEvent.emit(value);
  }
}
