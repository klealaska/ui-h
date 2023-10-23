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
import { Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Document } from '@ui-coe/avidcapture/shared/types';
import { TableDataSource } from '@ui-coe/shared/ui-v2';
import { Subscription, debounceTime, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'xdc-research-grid',
  templateUrl: './research-grid.component.html',
})
export class ResearchGridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() documents: Document[] = [];
  @Input() canViewAllBuyers = false;
  @Input() currentUsername = '';
  @Input() loadMoreHidden: boolean;
  @Input() batchSelectIsActive = false;
  @Input() resetBatchSelection = false;
  @Input() canUnlockDocumentManually = false;
  @Output() columnSorted = new EventEmitter<Sort>();
  @Output() openInvoiceEvent = new EventEmitter<Document>();
  @Output() loadNextPageEvent = new EventEmitter<void>();
  @Output() rowsSelected = new EventEmitter<Document[]>();
  @Output() unlockDocumentEvent = new EventEmitter<Document>();

  displayedColumns: string[] = [
    'checkbox',
    'lockedBy',
    'fileName',
    'invoiceNumber',
    'sourceEmail',
    'buyerName',
    'supplier',
    'lastModified',
    'dateReceived',
    'escalationCategoryIssue',
    'ingestionType',
  ];
  documentDataSource: TableDataSource<Document> = new TableDataSource([]);
  selection = new SelectionModel<Document>(true, []);

  private subscriptions: Subscription[] = [];
  unlockDocument: Document;
  contextMenuVisible = false;
  contextMenuPosition = { left: 0, top: 0 };

  ngOnInit(): void {
    if (this.canViewAllBuyers || !this.batchSelectIsActive) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('checkbox'), 1);
    }

    if (this.batchSelectIsActive) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('lockedBy'), 1);
      this.displayedColumns.push('lockedBy');
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
    const numRowsMinusExcluded = this.documentDataSource.data.filter(
      row => row.lockedBy === 'none' || row.lockedBy === this.currentUsername
    ).length;

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
          if (row.lockedBy === 'none' || row.lockedBy === this.currentUsername) {
            this.selection.select(row);
          }
        });
    this.rowsSelected.emit(this.selection.selected);
  }

  onRightClick(event: MouseEvent, document: Document): void {
    event.preventDefault();
    this.unlockDocument = document;
    this.contextMenuPosition = { left: event.clientX, top: event.clientY };
    this.contextMenuVisible = true;
  }
}
