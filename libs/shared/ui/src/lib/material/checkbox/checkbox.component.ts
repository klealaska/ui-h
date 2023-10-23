import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import type { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'ax-mat-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent {
  @Input() checked = false;
  @Input() color: ThemePalette = 'primary';
  @Input() disableRipple: boolean;
  @Input() disabled: any;
  @Input() id: string;
  @Input() indeterminate: boolean;
  @Input() labelPosition: 'before' | 'after' = 'after';
  @Input() name: string | null;
  @Input() required = false;
  @Input() value: string;
  @Input() checkboxLabel = '';

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change = new EventEmitter<MatCheckboxChange>();
  @Output() indeterminateChange = new EventEmitter<boolean>();
}
