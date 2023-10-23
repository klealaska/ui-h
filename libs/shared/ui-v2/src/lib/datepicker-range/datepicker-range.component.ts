import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  selector: 'ax-datepicker-range',
  templateUrl: './datepicker-range.component.html',
  styleUrls: ['../datepicker/datepicker.component.scss'],
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
export class DatepickerRangeComponent extends InputDirective implements OnInit {
  @Input() startControl: FormControl = new FormControl<Date | null>(null);
  @Input() endControl: FormControl = new FormControl<Date | null>(null);
  @Output() startDataChange = new EventEmitter();
  @Output() startDateInput = new EventEmitter();
  @Output() endDataChange = new EventEmitter();
  @Output() endDateInput = new EventEmitter();

  datePickerForm: FormGroup = new FormGroup({});

  dateClass() {
    return 'ax-datepicker-date';
  }

  ngOnInit() {
    this.datePickerForm.addControl('start', this.startControl);
    this.datePickerForm.addControl('end', this.endControl);
    if (this.disabled) this.datePickerForm.disable();
  }

  startDataChangeFunc(data) {
    this.startDataChange.emit(data);
  }

  startDateInputFunc(data) {
    this.startDateInput.emit(data);
  }

  endDataChangeFunc(data) {
    this.endDataChange.emit(data);
  }

  endDateInputFunc(data) {
    this.endDateInput.emit(data);
  }
}
