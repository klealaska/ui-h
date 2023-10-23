import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '@ui-coe/avidcapture/core/util';
import { DropzoneContent } from '@ui-coe/shared/types';

@Component({
  selector: 'xdc-document-swap',
  templateUrl: './document-swap.component.html',
  styleUrls: ['./document-swap.component.scss'],
})
export class DocumentSwapComponent {
  content: DropzoneContent = {
    linkText: 'Select files',
    icon: 'description',
    message: 'or drop here',
  };

  constructor(
    private dialogRef: MatDialogRef<DocumentSwapComponent>,
    private toastService: ToastService
  ) {}

  fileUploaded(fileList: FileList): void {
    const files: File[] = Array.from(fileList);

    if (this.fileIsAllowed(files)) {
      this.dialogRef.close(files[0]);
    }
  }

  close(): void {
    this.dialogRef.close(null);
  }

  private fileIsAllowed(files: File[]): boolean {
    if (files.length > 1) {
      this.toastService.error('Only one file can be chosen to swap.');
      return false;
    }

    if (files[0].size === 0) {
      this.toastService.error('Oops! Your file is empty with 0KB. Please check and try again.');
      return false;
    }

    if (files[0].size / Math.pow(1024, 2) > 10) {
      this.toastService.error('File exceeds 10MB limit.');
      return false;
    }

    if (!files[0].name.toLowerCase().includes('.pdf')) {
      this.toastService.error('File type not allowed.');
      return false;
    }

    return true;
  }
}
