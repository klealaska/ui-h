import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputType } from '@ui-coe/shared/types';
import { InputDirective } from './input.directive';
import { InputHeaderComponent } from './input-header/input-header.component';
import { InputErrorComponent } from './input-error/input-error.component';
import { InputHintComponent } from './input-hint/input-hint.component';

@Component({
  selector: 'ax-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
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
    MatIconModule,
  ],
})
export class InputComponent extends InputDirective {
  @Input() leftIcon: string;
  @Input() rightIcon: string;
  @Input() leftIconButton: boolean;
  @Input() rightIconButton: boolean;
  @Input() maxLength: number;
  @Input() inputType: InputType = 'text';
  @Output() leftIconButtonEvent = new EventEmitter();
  @Output() rightIconButtonEvent = new EventEmitter();
  @Output() inputValueEvent = new EventEmitter();

  applyFilter(event) {
    const value = (event?.target as HTMLInputElement)?.value;
    this.inputValueEvent.emit(value);
  }
}
