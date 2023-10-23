import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Document } from '@ui-coe/avidcapture/shared/types';
import { Subscription, debounceTime, fromEvent, pipe, tap } from 'rxjs';

@Component({
  selector: 'xdc-archive-grid',
  templateUrl: './archive-grid.component.html',
})
export class ArchiveGridComponent implements OnInit, OnDestroy {
  @Input() documents: Document[] = [];
  @Input() canViewAllBuyers = false;
  @Input() loadMoreHidden: boolean;
  @Output() openInvoiceEvent = new EventEmitter<Document>();
  @Output() columnSorted = new EventEmitter<Sort>();
  @Output() loadNextPageEvent = new EventEmitter<void>();
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'fileName',
    'invoiceNumber',
    'supplier',
    'sourceEmail',
    'buyerName',
    'dateReceived',
    'dateSubmitted',
    'ingestionType',
  ];

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
