import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxDropzonePreviewComponent } from 'ngx-dropzone';
import { DomSanitizer } from '@angular/platform-browser';
import { fileTypesIconMap } from '../../models/file-types';

@Component({
  selector: 'ax-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
})
export class FileComponent extends NgxDropzonePreviewComponent implements OnInit {
  @Input() isEditable: boolean;

  get file(): File {
    return super.file;
  }
  @Input() override set file(file: File) {
    super.file = file;
  }
  @Input() hideIcons = false;
  @Output() openFileEvent = new EventEmitter();
  @Output() downloadFileEvent = new EventEmitter();

  actualFile: any;

  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }

  ngOnInit(): void {
    this.actualFile = this.file;
  }

  getFileIcon(): string {
    const type: string = this.isImage(this.file.type) ? 'image' : this.file.type;
    return fileTypesIconMap.find(ft => ft.type === type)?.path;
  }

  isImage(fileType: string): boolean {
    return fileType.includes('image');
  }

  showUploadCompleted(): boolean {
    return !this.actualFile.isUploading && this.actualFile.isUploading !== undefined;
  }

  showUploadBar(): boolean {
    return this.actualFile.isUploading || this.actualFile.isUploading === undefined;
  }
}
