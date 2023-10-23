import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DropzoneContent } from '@ui-coe/shared/types';
import { DropzoneDirective } from './dropzone.directive';

@Component({
  selector: 'ax-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
  standalone: true,
  imports: [CommonModule, DropzoneDirective, MatIconModule],
})
export class DropzoneComponent {
  @Input() content: DropzoneContent;
  @Input() supportedFileTypes: string;
  @Input() maxFileSize: number;
  @Input() error: boolean;
  @Input() disabled: boolean;
  @Output() fileEvent = new EventEmitter();

  onFileUpload() {
    const inputNode: HTMLInputElement = document.querySelector('#fileUpload');
    const fileList = inputNode.files;
    if (fileList) {
      this.fileEvent.emit(fileList);
    }
  }

  onFileDropped(event: FileList) {
    if (event) {
      this.fileEvent.emit(event);
    }
  }
}
