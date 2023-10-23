import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Document, PendingUploadStatus } from '@ui-coe/avidcapture/shared/types';
import { TableDataSource } from '@ui-coe/shared/ui-v2';
import { Subscription, debounceTime, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'xdc-uploads-queue-grid',
  templateUrl: './uploads-queue-grid.component.html',
})
export class UploadsQueueGridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() documents: Document[] = [];
  @Input() canViewAllBuyers = false;
  @Input() loadMoreHidden: boolean;
  @Input() batchSelectIsActive = false;
  @Input() resetBatchSelection = false;
  @Output() openInvoiceEvent = new EventEmitter<Document>();
  @Output() columnSorted = new EventEmitter<string[]>();
  @Output() loadNextPageEvent = new EventEmitter<void>();
  @Output() rowsSelected = new EventEmitter<Document[]>();

  displayedColumns: string[] = ['checkbox', 'fileName', 'buyerName', 'dateReceived', 'status'];
  documentDataSource: TableDataSource<Document> = new TableDataSource([]);
  selection = new SelectionModel<Document>(true, []);
  pendingUploadStatus = PendingUploadStatus; // for template

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    if (this.canViewAllBuyers || !this.batchSelectIsActive) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('checkbox'), 1);
    }

    if (!this.canViewAllBuyers) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('buyerName'), 1);
    }

    this.subscriptions.push(
      fromEvent(window, 'scroll')
        .pipe(
          debounceTime(100),
          tap((e: Event) => {
            if (
              e.target['scrollingElement'] &&
              Number(e.target['scrollingElement'].offsetHeight) +
                Number(e.target['scrollingElement'].scrollTop) >=
                e.target['scrollingElement'].scrollHeight - 1 &&
              !this.loadMoreHidden
            ) {
              this.loadNextPageEvent.emit();
            }
          })
        )
        .subscribe()
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.documents?.currentValue) {
      this.documentDataSource.data = changes.documents.currentValue;
    }

    if (changes.resetBatchSelection?.currentValue) {
      this.selection.clear();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRowsMinusExcluded = this.documentDataSource.data.filter(row => {
      if (row.uploadStatus) {
        if (row.uploadStatus.toLowerCase() === PendingUploadStatus.Completed.toLowerCase()) {
          return row;
        }
      } else {
        return row;
      }
    }).length;

    return numSelected === numRowsMinusExcluded;
  }

  selectRow(row: Document): void {
    this.selection.toggle(row);
    this.rowsSelected.emit(this.selection.selected);
  }

  selectAllRows(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.documentDataSource.data.forEach(row => {
          if (row.uploadStatus) {
            if (row.uploadStatus.toLowerCase() === PendingUploadStatus.Completed.toLowerCase()) {
              this.selection.select(row);
            }
          } else {
            this.selection.select(row);
          }
        });

    this.rowsSelected.emit(this.selection.selected);
  }
}
