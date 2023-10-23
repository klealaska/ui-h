/* eslint-disable @angular-eslint/no-output-on-prefix */
import { ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { AfterViewInit, Component, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import type { FloatLabelType, MatFormFieldAppearance } from '@angular/material/form-field';

@Component({
  selector: 'ax-mat-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements OnInit, AfterViewInit {
  @Input() formGroupInstance: UntypedFormGroup;
  @Input() value: string = null;
  @Input() hasFocus = false;
  @Input() type = 'textfield';
  @Input() width = 100;
  @Input() disabled = false;
  @Input() required: boolean;
  @Input() pattern: string;
  @Input() placeholder: string;
  @Input() fieldModel: any;
  @Input() id: string;
  @Input() fieldAppearance: MatFormFieldAppearance = 'outline';
  @Input() floatLabel: FloatLabelType = 'auto';
  @Input() resize = false;
  @Input() labelText: string;

  // TextArea
  @Input() matAutosizeMaxRows = 0;
  @Input() matAutosizeMinRows = 0;
  @Input() matTextareaAutosize = true;

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

  onfocus(value: string): void {
    this.onFocus.emit(value);
  }

  handleOnKeyUp(value: string): void {
    if (this.fieldModel) {
      this.isValid.emit(this.formGroupInstance?.controls[this.fieldModel.key].valid);
    }
    this.onKeyUp.emit(value);
  }
}
