import { Directive, HostBinding, Input, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputTooltip, FormFieldError } from '@ui-coe/shared/types';

@Directive({
  selector: '[axInput]',
  standalone: true,
})
export class InputDirective implements OnChanges {
  @Input() fixed = false;
  @Input() readonly: boolean;
  @Input() label: string;
  @Input() id: string;
  @Input() optional: boolean;
  @Input() tooltip: InputTooltip;
  @Input() placeholder: string;
  @Input() control: FormControl;
  @Input() hintMessage: string;
  @Input() error: FormFieldError;
  private _disabled = false;

  @Input() get disabled() {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this.updateControlState();
  }

  @HostBinding('class.ax-form-field-wrapper') private class = true;

  @HostBinding('class.ax-form-field-readonly') private get readOnly(): boolean {
    return this.readonly;
  }

  @HostBinding('class.fixed-width') private get fixedWidth(): boolean {
    return this.fixed;
  }

  ngOnChanges(data) {
    if (data.readonly?.currentValue) this.control?.disable();
  }

  private updateControlState() {
    if (this.control) {
      if (this._disabled) {
        this.control.disable();
      } else {
        this.control.enable();
      }
    }
  }
}
