import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MarkAsteriskDirective } from '@ui-coe/shared/util/directives';

@Component({
  imports: [CommonModule, MarkAsteriskDirective],
  selector: 'ax-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent implements ControlValueAccessor {
  private _value: any;
  @Input() labelPosition: string;
  @Input() label: string;
  @Input() name: string;
  @Input() checked: boolean;
  @Input() disabled: boolean;
  @Input() fixed = false;
  @Input() noText: boolean;

  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this.change(value);
    }
  }

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('input', { read: ElementRef }) input: ElementRef<HTMLInputElement>;

  constructor(protected cd: ChangeDetectorRef, protected renderer: Renderer2) {}
  // To make this control work with Form Controls for Reactive and template driven forms
  onChange: any = () => undefined;
  onTouched: any = () => undefined;

  onInputChange(event: Event) {
    this.checked = true;
    const value = (event.target as HTMLInputElement).value;
    this.change(value);
    event.stopPropagation();
  }

  change(value: string | number | boolean) {
    this._value = value;
    this.onChange(value);
    this.onTouched(value);
    this.valueChange.emit(value);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    this.cd.markForCheck();
  }

  writeValue(val: any) {
    if (this.input) {
      if (val === this._value) {
        this.renderer.setProperty(this.input.nativeElement, 'checked', val);
      } else {
        this.renderer.setProperty(this.input.nativeElement, 'checked', false);
      }
    }
    this.cd.markForCheck();
  }

  /*
   * We use this method when setting radio inputs from radio group component.
   * Otherwise Angular won't detect changes in radio template as cached last rendered
   * value didn't updated.
   **/
  _markForCheck() {
    this.cd.markForCheck();
  }

  /*
   * Use this method when setting radio name from radio group component.
   * In case option 'name' isn't set on ax-radio-button component we need to set name
   * right away, so it won't overlap with options without names from other radio
   * groups. Otherwise they all would have same name and will be considered as
   * options from one group so only the last option will stay selected.
   **/
  _setName(name: string) {
    this.name = name;

    if (this.input) {
      this.renderer.setProperty(this.input.nativeElement, 'name', name);
    }
  }
}
