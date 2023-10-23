import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Buyer } from '@ui-coe/avidcapture/shared/types';
import { DropdownOptions, DropzoneContent } from '@ui-coe/shared/types';

@Component({
  selector: 'xdc-uploads-drop-zone',
  templateUrl: './uploads-drop-zone.component.html',
  styleUrls: ['./uploads-drop-zone.component.scss'],
})
export class UploadsDropZoneComponent implements OnInit {
  @Input() filteredBuyers: Buyer[];
  @Output() filesDropped = new EventEmitter<{ file: File; orgId: string; correlationId: string }>();
  @Output() uploadError = new EventEmitter<string>();

  content: DropzoneContent = {
    linkText: 'Select files',
    icon: 'description',
    message: 'or drop here',
  };
  progressValue = 0;
  fileName = '';
  errorMessage = '';
  orgIdSelected = '';
  disabled = false;
  dropdownOptions: DropdownOptions[] = [];

  ngOnInit(): void {
    this.orgIdSelected = this.filteredBuyers.length === 1 ? this.filteredBuyers[0].id : '';
    this.disabled = this.filteredBuyers.length > 1 ? true : false;

    this.dropdownOptions = this.filteredBuyers.map(buyer => ({
      text: buyer.name,
      value: buyer.id,
    }));
  }

  fileAdded(fileList: FileList): void {
    const files: File[] = Array.from(fileList);

    if (files.length > 50) {
      this.errorMessage = 'maxFiles';
      this.uploadError.emit('Only 50 files can be uploaded at one time.');
      return;
    }

    files.forEach((file: File) => {
      const isPdfFile = file.name.toLowerCase().includes('.pdf');
      this.errorMessage = '';

      if (file.size === 0) {
        this.errorMessage = 'noBytes';
        this.uploadError.emit('Oops! Your file is empty with 0KB. Please check and try again.');
        return;
      }

      if (isPdfFile) {
        const hasExceededSizeLimit = file.size / Math.pow(1024, 2) > 10;

        if (!hasExceededSizeLimit) {
          this.fileName = file.name;
          this.filesDropped.emit({
            file,
            orgId: this.orgIdSelected,
            correlationId: this.getGuidId(),
          });
        } else {
          this.errorMessage = 'maxSize';
          this.uploadError.emit('File exceeds 10MB limit.');
          return;
        }
      } else {
        this.errorMessage = 'format';
        this.uploadError.emit('File type not allowed.');
        return;
      }
    });
  }

  fileUploaded(): void {
    const inputNode: HTMLInputElement = document.querySelector('#fileUpload');
    const fileList = inputNode.files;
    if (fileList) {
      this.fileAdded(fileList);
      inputNode.value = null;
    }
  }

  optionSelected(value: string): void {
    this.orgIdSelected = value;
    this.disabled = false;
  }

  private getGuidId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
