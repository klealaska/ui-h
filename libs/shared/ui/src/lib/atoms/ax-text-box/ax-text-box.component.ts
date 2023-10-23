/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'ax-text-box',
  templateUrl: './ax-text-box.component.html',
  styleUrls: ['./ax-text-box.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AxTextBoxComponent implements OnInit, AfterViewInit {
  @Input() formGroupInstance: UntypedFormGroup;
  @Input() value: string;
  @Input() hasFocus = false;
  @Input() type: string;
  @Input() width: number;
  @Input() disabled = false;
  @Input() required: boolean;
  @Input() pattern: string;
  @Input() placeholder: string;
  @Input() fieldModel: any;
  @Input() id: string;

  @Output() onBlur = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<string>();
  @Output() onKeyUp = new EventEmitter<string>();
  @Output() isValid = new EventEmitter<boolean>();

  @ViewChild('textInput') textInput: ElementRef;

  ngOnInit(): void {
    this.id = this.id ?? `ax-text-box-${new Date().getTime()}`;
    if (this.fieldModel && this.formGroupInstance) {
      this.enableDisableField();
    }
  }

  ngAfterViewInit(): void {
    if (this.hasFocus && this.textInput) {
      this.textInput.nativeElement.focus();
    }
  }

  enableDisableField(): void {
    if (this.disabled) {
      this.formGroupInstance?.controls[this.fieldModel.key].disable();
    } else {
      this.formGroupInstance?.controls[this.fieldModel.key].enable();
    }
  }

  onblur(value: string): void {
    if (this.fieldModel) {
      this.isValid.emit(this.formGroupInstance?.controls[this.fieldModel.key].valid);
    }
    this.onBlur.emit(value);
  }

  onfocus(event: MouseEvent): void {
    (event.target as HTMLInputElement).select();
    this.onFocus.emit((event.target as HTMLInputElement).value);
  }

  handleOnKeyUp(value: string): void {
    if (this.fieldModel) {
      this.isValid.emit(this.formGroupInstance?.controls[this.fieldModel.key].valid);
    }
    this.onKeyUp.emit(value);
  }
}
