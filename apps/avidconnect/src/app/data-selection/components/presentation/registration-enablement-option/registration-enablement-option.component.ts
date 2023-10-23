import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RegistrationEnablement } from '../../../../models';

@Component({
  selector: 'avc-registration-enablement-option',
  templateUrl: './registration-enablement-option.component.html',
  styleUrls: ['./registration-enablement-option.component.scss'],
})
export class RegistrationEnablementOptionComponent {
  @Input() set enablement(val: RegistrationEnablement) {
    this.updatedEnablement = { ...val };
  }
  @Input() isOperationSelected: boolean;
  @Output() enablementChanged = new EventEmitter<RegistrationEnablement>();
  @Output() downloadButtonClicked = new EventEmitter();
  @Output() fileUploaded = new EventEmitter<File>();

  @ViewChild('fileInput') fileInput: ElementRef;

  file: File;
  updatedEnablement: RegistrationEnablement;

  processFile(file: File): void {
    this.file = file;
    this.fileUploaded.emit(file);
  }
}
