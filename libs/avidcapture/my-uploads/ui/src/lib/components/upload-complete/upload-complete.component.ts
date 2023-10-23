import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { UploadedDocumentMessage } from '@ui-coe/avidcapture/shared/types';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'xdc-upload-complete',
  templateUrl: './upload-complete.component.html',
  styleUrls: ['./upload-complete.component.scss'],
})
export class UploadCompleteComponent implements OnInit {
  successfulMessages$: Observable<UploadedDocumentMessage[]>;
  failedMessages$: Observable<UploadedDocumentMessage[]>;

  constructor(
    public snackBarRef: MatSnackBarRef<UploadCompleteComponent>,
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      messages$: Observable<UploadedDocumentMessage[]>;
    }
  ) {}

  ngOnInit(): void {
    this.successfulMessages$ = this.data.messages$.pipe(
      map(messages => messages.filter(m => m.successful))
    );
    this.failedMessages$ = this.data.messages$.pipe(
      map(messages => messages.filter(m => !m.successful))
    );
  }

  close(): void {
    this.snackBarRef.dismiss();
  }
}
