import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Select, Store } from '@ngxs/store';
import {
  AddFilteredBuyer,
  ClaimsQueries,
  CoreSelectors,
  FeatureFlagTargetQueries,
  QueryDocumentCardSetCounts,
  RemoveFilteredBuyer,
  SetCurrentPage,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import { PageHelperService } from '@ui-coe/avidcapture/core/util';
import { QueryUnindexedDocument, StorePageFilters } from '@ui-coe/avidcapture/indexing/data-access';
import {
  BatchDeletion,
  BatchDownload,
  DisablePageRefresh,
  EnablePageRefresh,
  PendingPageSelectors,
  QueryAllBuyersLookAhead,
  QueryBuyerLookAhead,
  QueryQueueInvoices,
  RemoveFilter,
  RemovePendingPageSignalEvents,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetPendingPageSignalEvents,
  SetScrollPosition,
} from '@ui-coe/avidcapture/pending/data-access';
import { UpdateQueueInvoiceOnUnlock } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  AppPages,
  BatchActions,
  Buyer,
  Document,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';
import { SnackbarBatchActionsComponent } from '@ui-coe/avidcapture/shared/ui';
import { ToastHorizontalPositions, ToastVerticalPositions } from '@ui-coe/shared/types';
import { DashboardCard } from '@ui-coe/shared/ui';
import { Observable, Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-pending-page',
  templateUrl: './pending-page.component.html',
  styleUrls: ['./pending-page.component.scss'],
})
export class PendingPageComponent implements OnInit, OnDestroy {
  @Select(PendingPageSelectors.invoices) invoices$: Observable<Document[]>;
  @Select(PendingPageSelectors.buyers) buyers$: Observable<Buyer[]>;
  @Select(PendingPageSelectors.filteredBuyers) filteredBuyers$: Observable<Buyer[]>;
  @Select(PendingPageSelectors.advancedFilters) advancedFilters$: Observable<AdvancedFilter>;
  @Select(PendingPageSelectors.appliedFilters) appliedFilters$: Observable<AdvancedFilter>;
  @Select(PendingPageSelectors.loadMoreHidden) loadMoreHidden$: Observable<boolean>;
  @Select(PendingPageSelectors.sortedColumnData) sortedColumnData$: Observable<SortedColumnData>;
  @Select(PendingPageSelectors.canRefreshPage) canRefreshPage$: Observable<boolean>;
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.filteredBuyers) filteredBuyersCore$: Observable<Buyer[]>;
  @Select(CoreSelectors.orgNames) orgNames$: Observable<Buyer[]>;
  @Select(CoreSelectors.token) token$: Observable<string>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(CoreSelectors.documentCards) documentCards$: Observable<DashboardCard[]>;
  @Select(ClaimsQueries.canUpload) canUpload$: Observable<boolean>;
  @Select(ClaimsQueries.canViewResearch) canViewEscalations$: Observable<boolean>;
  @Select(ClaimsQueries.canUseAdvancedFilter) canUseAdvancedFilter$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canUnlockDocumentManually) canUnlockDocumentManually$: Observable<boolean>;
  @Select(ClaimsQueries.canDownloadPdf) canDownloadPdf$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.batchSelectIsActive) batchSelectIsActive$: Observable<boolean>;

  resetBatchSelection = false;

  private subscriptions: Subscription[] = [];
  private snackBarRef: MatSnackBarRef<SnackbarBatchActionsComponent>;
  private itemsSelected = signal<Document[]>([]);

  constructor(
    private store: Store,
    private viewPort: ViewportScroller,
    private pageHelperService: PageHelperService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredBuyersCore$
        .pipe(
          filter(filteredBuyers => {
            return filteredBuyers.length !== 0;
          }),
          tap(() => this.loadPage()),
          take(1)
        )
        .subscribe()
    );
  }

  loadPage(): void {
    this.subscriptions.push(
      this.currentUsername$
        .pipe(
          filter(([username]) => username != null),
          tap(() => {
            this.store.dispatch([
              new SetCurrentPage(AppPages.Queue),
              new ResetPageNumber(),
              new QueryQueueInvoices(),
              new EnablePageRefresh(),
              new QueryDocumentCardSetCounts(),
              new SetPendingPageSignalEvents(),
            ]);
          }),
          take(1)
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.snackBarRef?.dismiss();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.store.dispatch(new RemovePendingPageSignalEvents());
  }

  openInvoice(document: Document): void {
    const pageFilters = this.store.selectSnapshot(state => state.pendingPage.filters);

    this.store.dispatch([
      new QueryUnindexedDocument(document.documentId),
      new SetScrollPosition(this.viewPort.getScrollPosition()),
      new StorePageFilters(pageFilters),
    ]);
  }

  searchCustomers(value: string, canViewAllBuyers: boolean): void {
    if (!value) {
      return;
    }

    this.store.dispatch(
      canViewAllBuyers ? new QueryAllBuyersLookAhead(value) : new QueryBuyerLookAhead(value)
    );
  }

  filteredBuyerAdded(buyer: Buyer, canViewAllBuyers: boolean): void {
    if (canViewAllBuyers) {
      this.store.dispatch([
        new AddFilteredBuyer(buyer),
        new ResetPageNumber(),
        new QueryQueueInvoices(),
      ]);
    }
  }

  filteredBuyerRemoved(buyer: Buyer, canViewAllBuyers: boolean): void {
    if (canViewAllBuyers) {
      this.store.dispatch([
        new RemoveFilteredBuyer(buyer),
        new ResetPageNumber(),
        new QueryQueueInvoices(),
      ]);
    }
  }

  loadNextPage(): void {
    this.store.dispatch(new QueryQueueInvoices());
  }

  columnSorted(columnData: Sort): void {
    this.store.dispatch(new SetColumnSortedData(columnData));
  }

  advanceSearchApplied(formValues: AdvancedFilter): void {
    this.store.dispatch(new SetAdvanceFilters(formValues));
  }

  filterRemoved(filterKey: string): void {
    this.store.dispatch(new RemoveFilter(filterKey));
  }

  refreshPage(): void {
    this.store.dispatch([
      new ResetPageNumber(),
      new QueryQueueInvoices(),
      new DisablePageRefresh(),
      new QueryDocumentCardSetCounts(),
    ]);

    this.subscriptions.push(
      this.pageHelperService
        .setTimeoutForPageRefresh()
        .pipe(tap(() => this.store.dispatch(new EnablePageRefresh())))
        .subscribe()
    );
  }

  batchSelect(rows: Document[]): void {
    this.itemsSelected.update(() => rows);

    if (rows.length === 0 && this.snackBarRef != null) {
      this.snackBarRef.dismiss();
      this.snackBarRef = null;
      return;
    }

    if (!this.snackBarRef) {
      this.resetBatchSelection = false;
      this.snackBarRef = this.snackBar.openFromComponent(SnackbarBatchActionsComponent, {
        duration: 0,
        horizontalPosition: ToastHorizontalPositions.Center,
        verticalPosition: ToastVerticalPositions.Bottom,
        data: {
          itemsSelected: this.itemsSelected,
          canDownloadPdf$: this.canDownloadPdf$,
        },
      });

      this.subscriptions.push(
        this.snackBarRef
          .afterDismissed()
          .pipe(
            tap(() => {
              const documentIds = this.itemsSelected().map(row => row.documentId);

              switch (this.snackBarRef.instance.action) {
                case BatchActions.Delete:
                  this.store.dispatch(new BatchDeletion(documentIds));
                  break;
                case BatchActions.Download:
                  this.store.dispatch(new BatchDownload(this.itemsSelected()));
                  break;
              }

              this.resetBatchSelection = true;
              this.itemsSelected.set([]);
              this.snackBarRef = null;
            }),
            take(1)
          )
          .subscribe()
      );
    }
  }

  unlockDocumentManually(document: Document): void {
    this.subscriptions.push(
      this.pageHelperService.openUnlockDocumentModal().subscribe(value => {
        if (value) {
          this.store.dispatch([
            new UnlockDocument(document.documentId, document.buyerId),
            new UpdateQueueInvoiceOnUnlock(document.documentId),
          ]);
        }
      })
    );
  }
}
