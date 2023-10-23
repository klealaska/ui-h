import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { SourceSystem } from './models/source-system';
import { PendingUpload, UploaderConfig } from './models/uploader.model';
import { AlertsService } from './services/alerts.service';
import { AttachmentsService } from './services/attachments.service';
import { UploaderUtilService } from './services/uploader-util.service';

@Component({
  selector: 'ax-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploaderComponent implements OnInit, OnDestroy {
  files: any[] = [];
  pendingDeletes: any[] = [];
  formattedAcceptedFiles: string;
  formattedMaxFileSize: number;
  private subscriptions: Subscription[] = [];
  @Input() uploaderConfig: UploaderConfig = {
    acceptedFiles: '.pdf, .xls, .xlsx, .doc, .docx, .ppt, .pptx, .jpg, .jpeg, .png, .svg',
    maxFiles: 5,
    maxSize: 20000000,
    sourceSystem: SourceSystem.ExperienceQA,
    baseUrl: 'https://ax-ae1-st-reqapi-svc-api.azurewebsites.net',
    attachmentUrl: 'https://ax-ae1-st-atmapi-svc-api.azurewebsites.net',
  };

  @Input() parentId: string;
  @Input() customInvoiceUploadParam = '';
  @Input() isEditable = true;
  @Input() userId: string;
  @Input() isDisabled = false;
  @Input() sourceEmail = '';
  @Output() fileUploadedSuccessfully = new EventEmitter<string>();

  constructor(
    private uploaderUtilService: UploaderUtilService,
    private elementRef: ElementRef,
    private attachmentService: AttachmentsService,
    private alertsService: AlertsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.formattedAcceptedFiles = this.uploaderConfig.acceptedFiles.replace(/\./g, '');
    this.formattedMaxFileSize = this.uploaderConfig.maxSize / 1000000;
    this.attachmentService.setConfig(this.uploaderConfig);

    if (this.uploaderConfig.sourceSystem !== SourceSystem.AvidSuite) {
      this.getAttachments(this.parentId);
    }

    this.addDropListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getAttachments(requisitionId: string): void {
    this.subscriptions.push(
      this.attachmentService.getAttachments(requisitionId).subscribe(
        response => {
          response.map((file, index) => {
            if (index <= this.uploaderConfig.maxFiles)
              this.files.push(this.uploaderUtilService.filePipe(file));
          });
          this.checkMaxValidFiles();
          this.changeDetectorRef.detectChanges();
        },
        error => {
          this.alertsService.open('Something unexpected happened, please try again', 5);
        }
      )
    );
  }

  fileSelectEvent(event: any): void {
    this.validateFiles(event);
  }

  openFile(fileId: string): void {
    this.subscriptions.push(
      this.attachmentService.downloadAttachmentFile(fileId).subscribe(
        response => {
          if (response.type.includes('image/') || response.type.includes('application/pdf')) {
            this.uploaderUtilService.openFileLink(response);
            return;
          }
          this.uploaderUtilService.openDownloadLink(response);
        },
        error => {
          this.alertsService.open('Something unexpected happened, please try again', 5);
        }
      )
    );
  }

  downloadFile(file: any): void {
    this.subscriptions.push(
      this.attachmentService.downloadAttachmentFile(file.id).subscribe(response => {
        response.name = file.name;
        this.uploaderUtilService.openDownloadLink(response);
      })
    );
  }

  onRemove(file: any): void {
    this.files.splice(this.files.indexOf(file), 1);
    this.deleteFile(file);
    this.files.length === this.uploaderConfig.maxFiles
      ? (this.isDisabled = true)
      : (this.isDisabled = false);
  }

  deleteFile(file: any): void {
    if (file && file.id !== undefined) {
      this.subscriptions.push(
        this.attachmentService.deleteAttachmentFile(this.parentId, file.id).subscribe(
          response => {
            //this.alertsService.openSnackBar(`The file ${file.name} has been deleted`, 5)
          },
          error => {
            // this.alertsService.openSnackBar('Something unexpected happened, please try again', 5)
            this.files.push(file);
          }
        )
      );
    } else {
      this.pendingDeletes.push(file);
    }
  }

  // Validates and uploads user selected files
  private validateFiles(event): void {
    // validates max number of files and uploads files if less than max number of files
    this.performCustomValidationsAndUpload(event);
    // processes "rejected" files based on the native control validations (max files size, file types etc)
    this.uploaderUtilService.handleRejectedFiles(event, this.uploaderConfig.maxSize);
  }

  private performCustomValidationsAndUpload(event): void {
    // Verify max number of files haven't been exceeded
    if (event.addedFiles.length + this.files.length > this.uploaderConfig.maxFiles) {
      this.toastMaxFilesError();
      return;
    }

    // Verify uploaded file name isn't a dup
    event = this.uploaderUtilService.checkForDuplicateFileNamesAndRemoveFromUploadList(
      event,
      this.files
    );

    this.uploaderUtilService.minSizeCheck(event);
    // Upload files that passed custom validation
    this.files.push(...event.addedFiles);
    this.uploadFiles(event.addedFiles);
    this.checkMaxValidFiles();
  }

  toastMaxFilesError(): void {
    this.alertsService.open(
      `Max number of attachments allowed is ${this.uploaderConfig.maxFiles}`,
      5
    );
  }

  uploadFiles(addedFiles: any[]): void {
    const uploadedDocs = [];
    addedFiles.forEach(file => {
      if (this.uploaderConfig.sourceSystem === SourceSystem.AvidSuite) {
        uploadedDocs.push(this.uploadAvidInvoice(file));
      } else {
        this.createRequisitionMetadata(file);
      }
    });

    if (this.uploaderConfig.sourceSystem === SourceSystem.AvidSuite) {
      this.pendingUploadCreate(uploadedDocs);
    }
  }

  uploadFile(attachmentId: string, file: File): void {
    const actualFile = this.files.find(f => file.name === f.name);
    this.updateItemStatus(actualFile, true);
    this.subscriptions.push(
      this.attachmentService.uploadAttachmentFile(attachmentId, file).subscribe(
        response => {
          if (this.pendingDeletes.length === 0) {
            this.updateItemStatus(actualFile, false);
            this.changeDetectorRef.detectChanges();
            this.updateItemAttachmentId(actualFile, response.id);
            return;
          }
          this.pendingDeletes.forEach((pendingFile, index) => {
            if (actualFile.name === pendingFile.name) {
              this.pendingDeletes.splice(index, 1);
              this.deleteFileAfter(pendingFile, response.id);
            }
          });
        },
        error => {
          this.alertsService.open('Something unexpected happened, please try again', 5);
          this.files = this.files.filter(fileItem => fileItem !== file);
          this.checkMaxValidFiles();
        }
      )
    );
  }

  deleteFileAfter(file: any, attachmentId: string): void {
    this.subscriptions.push(
      this.attachmentService.deleteAttachmentFile(this.parentId, attachmentId).subscribe(
        response => {
          // this.alertsService.openSnackBar(`The file ${file.name} has been deleted`, 5)
        },
        error => {
          // this.alertsService.openSnackBar('Something unexpected happened, please try again', 5)
          this.files.push(file);
        }
      )
    );
  }

  updateItemStatus(file: any, status: boolean): void {
    const index = this.files.indexOf(file);
    file.isUploading = status;
    this.files[index] = file;
  }

  updateItemAttachmentId(file: any, id: any): void {
    const index = this.files.indexOf(file);
    file.id = id;
    this.files[index] = file;
  }

  createRequisitionMetadata(file: File): void {
    this.subscriptions.push(
      this.attachmentService
        .createAttachmentMetaData(
          this.parentId,
          this.uploaderUtilService.getMetaData(file, this.uploaderConfig.sourceSystem, this.userId)
        )
        .subscribe(
          response => {
            this.uploadFile(response.id, file);
          },
          error => {
            this.alertsService.open('Something unexpected happened, please try again', 5);
            this.files = this.files.filter(fileItem => fileItem !== file);
            this.checkMaxValidFiles();
          }
        )
    );
  }
  private checkMaxValidFiles(): void {
    this.files.length === this.uploaderConfig.maxFiles
      ? (this.isDisabled = true)
      : (this.isDisabled = false);
  }

  addDropListener(): void {
    const overlay = this.elementRef.nativeElement.querySelector(`#dropzone-disabled-overlay`);
    if (overlay !== null) {
      overlay.addEventListener('drop', function (e) {
        e.preventDefault();
        this.toastMaxFilesError();
        e.dataTransfer.effectAllowed = 'none';
        e.dataTransfer.dropEffect = 'none';
      });
      overlay.addEventListener(
        'dragenter',
        function (e) {
          e.preventDefault();
          e.dataTransfer.effectAllowed = 'none';
          e.dataTransfer.dropEffect = 'none';
        },
        false
      );

      overlay.addEventListener('dragover', function (e) {
        e.preventDefault();
      });
    }
  }

  uploadAvidInvoice(file: File): PendingUpload {
    const actualFile: File = this.files.find(f => file.name === f.name);
    const correlationId = this.getSourceInvoiceId();
    const pendingUpload: PendingUpload = {
      correlationId,
      buyerId: this.parentId,
      username: this.sourceEmail,
      fileName: file.name,
    };

    const formData = this.attachmentService.getAvidFormData(
      file,
      this.sourceEmail,
      null,
      this.parentId,
      this.getSourceInvoiceId(),
      this.customInvoiceUploadParam,
      correlationId
    );

    this.updateItemStatus(actualFile, true);
    this.subscriptions.push(
      this.attachmentService.postFormData(formData).subscribe(
        res => {
          const emittedValue = this.uploaderConfig.baseUrl.includes('indexing-ui-manual-upload')
            ? actualFile.name
            : res;
          this.updateItemStatus(actualFile, false);
          this.fileUploadedSuccessfully.emit(emittedValue);
          this.changeDetectorRef.detectChanges();
        },
        () => {
          this.alertsService.open(
            `Something unexpected happened with ${file.name}, please try again`,
            5
          );
        }
      )
    );
    return pendingUpload;
  }

  pendingUploadCreate(pendingUpload: PendingUpload[]) {
    this.subscriptions.push(
      this.attachmentService
        .pendingUpload(pendingUpload, this.uploaderConfig.indexingBaseUrl)
        .subscribe()
    );
  }

  private getSourceInvoiceId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
