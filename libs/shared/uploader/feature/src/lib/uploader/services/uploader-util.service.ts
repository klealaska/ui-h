import { Injectable } from '@angular/core';
import { AttachmentMetaData } from '../models/uploader.model';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root',
})
export class UploaderUtilService {
  constructor(private alertsService: AlertsService) {}

  // Handles max file size and unsupported file type validation
  handleRejectedFiles(event, maxSize: number): void {
    if (event.rejectedFiles.length > 0) {
      let sizeError = false;
      let typeError = false;

      event.rejectedFiles.forEach(fileItem => {
        if (fileItem.reason == 'size') {
          sizeError = true;
        }
        if (fileItem.reason == 'type') {
          typeError = true;
        }
      });

      if (sizeError) {
        this.alertsService.open(`File exceeds ${maxSize / 1000000}MB limit.`, 5);
      }

      if (typeError) {
        this.alertsService.open(`File type not allowed.`, 5);
      }

      if (sizeError && typeError) {
        this.alertsService.open(`File exceeds ${maxSize / 1000000}MB limit.`, 2);
        setTimeout(() => this.alertsService.open(`File type not allowed.`, 5), 2400);
      }
    }
  }

  checkForDuplicateFileNamesAndRemoveFromUploadList(event, files: any[]): any[] {
    const uniqueValues = [...new Set([...files, ...event.addedFiles].map(n => n.name))];

    if (uniqueValues.length != files.length + event.addedFiles.length) {
      //we have at least one dupe
      for (let i: number = event.addedFiles.length - 1; i >= 0; i--) {
        const currentAddedFile = event.addedFiles[i];

        // file is a dup because it was previously uploaded already, remove
        if (files.filter(f => f.name === currentAddedFile.name).length > 0) {
          this.alertsService.open(
            `The file name has already been uploaded ${currentAddedFile.name}`,
            5
          );
          //remove file from pending upoad list, preventing it from getting uploaded
          event.addedFiles.splice(i, 1);
        }
      }
    }
    return event;
  }

  getMetaData(file: File, sourceSystem: string, userId: string): AttachmentMetaData {
    return {
      file_name: file.name,
      mime_type: file.type,
      source_system: sourceSystem,
      user_id: userId,
    };
  }

  filePipe(responseFile: any): any {
    const file: any = {};
    file.name = responseFile.file_name;
    file.type = responseFile.mime_type;
    file.id = responseFile.id;
    file.isUploading = false;

    return file;
  }

  openDownloadLink(file: any): void {
    const url = window.URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = file.name;
    anchor.target = '_blank';
    anchor.click();
  }

  openFileLink(file: any): void {
    const url = window.URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.click();
  }

  minSizeCheck(event): any[] {
    for (let i: number = event.addedFiles.length - 1; i >= 0; i--) {
      const currentAddedFile = event.addedFiles[i];
      if (currentAddedFile.size === 0) {
        this.alertsService.open(
          `Oops! Your file is empty with 0KB. Please check and try again.`,
          5
        );
        event.addedFiles.splice(i, 1);
      }
    }
    return event;
  }
}
