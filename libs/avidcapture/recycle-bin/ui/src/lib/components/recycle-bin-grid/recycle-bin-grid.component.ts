import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Document } from '@ui-coe/avidcapture/shared/types';
import { Subscription, debounceTime, fromEvent, tap } from 'rxjs';

@Component({
  selector: 'xdc-recycle-bin-grid',
  templateUrl: './recycle-bin-grid.component.html',
})
export class RecycleBinGridComponent implements OnInit, OnDestroy {
  @Input() documents: Document[] = [];
  @Input() currentUsername = '';
  @Input() canViewAllBuyers = false;
  @Input() batchSelectIsActive = false;
  @Input() loadMoreHidden: boolean;
  @Input() canUnlockDocumentManually = false;
  @Output() openInvoiceEvent = new EventEmitter<Document>();
  @Output() columnSorted = new EventEmitter<Sort>();
  @Output() loadNextPageEvent = new EventEmitter<void>();
  @Output() unlockDocumentEvent = new EventEmitter<Document>();

  unlockDocument: Document;
  contextMenuVisible = false;
  contextMenuPosition = { left: 0, top: 0 };

  displayedColumns: string[] = [
    'lockedBy',
    'fileName',
    'sourceEmail',
    'buyerName',
    'lastModified',
    'dateReceived',
    'ingestionType',
  ];

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    if (!this.canViewAllBuyers) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('buyerName'), 1);
    }

    if (this.batchSelectIsActive) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('lockedBy'), 1);
      this.displayedColumns.push('lockedBy');
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

  onRightClick(event: MouseEvent, document: Document): void {
    event.preventDefault();
    this.unlockDocument = document;
    this.contextMenuPosition = { left: event.clientX, top: event.clientY };
    this.contextMenuVisible = true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
