import { Component, Inject, OnDestroy, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { BatchActions, Document } from '@ui-coe/avidcapture/shared/types';
import { Observable, Subscription, take, tap } from 'rxjs';

import { ConfirmComponent } from '../modals/confirm/confirm.component';

@Component({
  selector: 'xdc-snackbar-batch-actions',
  templateUrl: './snackbar-batch-actions.component.html',
  styleUrls: ['./snackbar-batch-actions.component.scss'],
})
export class SnackbarBatchActionsComponent implements OnDestroy {
  action = '';

  private subscriptions: Subscription[] = [];

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarBatchActionsComponent>,
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      itemsSelected: Signal<Document[]>;
      canDownloadPdf$: Observable<boolean>;
    },
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  close(): void {
    this.action = null;
    this.snackBarRef.dismissWithAction();
  }

  deleteSelected(): void {
    this.subscriptions.push(
      this.dialog
        .open(ConfirmComponent, {
          data: {
            title:
              this.data.itemsSelected().length > 1 ? 'Delete these items?' : 'Delete this item?',
            message:
              this.data.itemsSelected().length > 1
                ? 'They will be kept in your recycle bin for 30 days.'
                : 'It will be kept in your recycle bin for 30 days.',
            confirmButton: 'xdc.shared.confirm-modal-delete-button-text',
          },
        })
        .afterClosed()
        .pipe(
          tap(value => {
            if (value) {
              this.action = BatchActions.Delete;
              this.snackBarRef.dismissWithAction();
            }
          }),
          take(1)
        )
        .subscribe()
    );
  }

  downloadSelected(): void {
    this.subscriptions.push(
      this.dialog
        .open(ConfirmComponent, {
          data: {
            title:
              this.data.itemsSelected().length > 1
                ? 'Download these items?'
                : 'Download this item?',
            message:
              this.data.itemsSelected().length > 1
                ? 'They will be downloaded to your computer.'
                : 'It will be downloaded to your computer.',
            confirmButton: 'xdc.shared.confirm-modal-download-button-text',
          },
        })
        .afterClosed()
        .pipe(
          tap(value => {
            if (value) {
              this.action = BatchActions.Download;
              this.snackBarRef.dismissWithAction();
            }
          }),
          take(1)
        )
        .subscribe()
    );
  }
}
