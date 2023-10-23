import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DropdownOptions } from '@ui-coe/shared/types';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InputDirective } from '../input/input.directive';
import { InputHeaderComponent } from '../input/input-header/input-header.component';
import { InputErrorComponent } from '../input/input-error/input-error.component';
import { InputHintComponent } from '../input/input-hint/input-hint.component';

@Component({
  selector: 'ax-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  standalone: true,
  imports: [
    InputErrorComponent,
    InputHintComponent,
    InputHeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
})
export class DropdownComponent extends InputDirective {
  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() options: DropdownOptions[];
  @Input() multiple = false;
  @Output() selectEvent = new EventEmitter();
}
