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
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'ax-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() labelPosition: string;
  @Input() label: string;
  @Input() noText: boolean;
  @Input() checked: boolean;
  @Input() name: string;
  @Input() disabled: boolean;
  @Input() indeterminate: boolean;
  @Input() fixed = false;

  @Output() checkedChange = new EventEmitter<any>();
  @ViewChild('input', { read: ElementRef }) input: ElementRef<HTMLInputElement>;

  onChange: any = () => {};
  onTouched: any = () => {};
  constructor(private changeDetector: ChangeDetectorRef, protected renderer: Renderer2) {}

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(val: any) {
    this.checked = val;
    if (this.input) {
      if (val) {
        this.renderer.setProperty(this.input.nativeElement, 'checked', val);
      } else {
        this.renderer.setProperty(this.input.nativeElement, 'checked', false);
      }
    }
    this.changeDetector.markForCheck();
  }

  setDisabledState(val: boolean) {
    this.disabled = val;
    this.changeDetector.markForCheck();
  }

  setTouched() {
    this.onTouched();
  }

  updateValueAndIndeterminate(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    const emitVal = { checked: this.checked, originalEvent: event };
    this.checkedChange.emit(emitVal);
    this.onChange(emitVal);
    this.indeterminate = input.indeterminate;
  }

  _markForCheck() {
    this.changeDetector.markForCheck();
  }
}
