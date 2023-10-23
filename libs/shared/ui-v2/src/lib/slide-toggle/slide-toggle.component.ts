import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  forwardRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigStatus, LabelPosition } from '@ui-coe/shared/types';

@Component({
  selector: 'ax-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SlideToggleComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideToggleComponent implements ControlValueAccessor {
  private _checked = false;
  private _disabled = false;
  @Input() label: string;
  @Input() readonly = false;
  @Input() subLabelConfig: ConfigStatus = {} as ConfigStatus;

  //  Toggle label position.
  @Input() labelPosition: LabelPosition = 'left';

  get statusText(): string {
    return this._checked ? this.subLabelConfig?.active : this.subLabelConfig?.inactive;
  }

  // Toggle checked
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: boolean) {
    this._checked = value;
  }

  // Controls input disabled state
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }

  //  Output when checked state is changed by a user
  @Output() checkedChange = new EventEmitter<boolean>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  // To make this control work with Form Controls for Reactive and template driven forms
  onChange: any = () => undefined;
  onTouched: any = () => undefined;

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(val: any) {
    this.checked = val;
    this.changeDetector.markForCheck();
  }

  updateValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.checkedChange.emit(this.checked);
    this.onChange(this.checked);
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.changeDetector.markForCheck();
  }

  onInputClick(event: Event) {
    event.stopPropagation();
  }
}
