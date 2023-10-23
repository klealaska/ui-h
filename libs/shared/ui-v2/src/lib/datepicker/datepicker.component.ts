import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputDirective } from '../input/input.directive';
import { InputHeaderComponent } from '../input/input-header/input-header.component';
import { InputErrorComponent } from '../input/input-error/input-error.component';
import { InputHintComponent } from '../input/input-hint/input-hint.component';

@Component({
  selector: 'ax-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
})
export class DatepickerComponent extends InputDirective {
  @Output() dateChange = new EventEmitter();
  @Output() dateInput = new EventEmitter();

  dateClass() {
    return 'ax-datepicker-date';
  }

  dataChangeFunc(data) {
    this.dateChange.emit(data);
  }

  dateInputFunc(data) {
    this.dateInput.emit(data);
  }
}
