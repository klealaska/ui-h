import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { Select, Store } from '@ngxs/store';
import {
  ClaimsQueries,
  CoreSelectors,
  FeatureFlagTargetQueries,
  QueryDocumentCardSetCounts,
  SetCurrentPage,
} from '@ui-coe/avidcapture/core/data-access';
import { PageHelperService } from '@ui-coe/avidcapture/core/util';
import { QueryUnindexedDocument, StorePageFilters } from '@ui-coe/avidcapture/indexing/data-access';
import {
  BatchDeletion,
  BatchDownload,
  ClearUploadedDocumentMessages,
  DisablePageRefresh,
  EnablePageRefresh,
  FilterByInvoiceName,
  QueryUploadedInvoices,
  ResetPageNumber,
  SetColumnSortedData,
  SetScrollPosition,
  SetSourceEmail,
  SetUploadsPageSignalEvents,
  UploadDocument,
  UploadsQueuePageSelectors,
} from '@ui-coe/avidcapture/my-uploads/data-access';
import { UploadCompleteComponent } from '@ui-coe/avidcapture/my-uploads/ui';
import {
  AppPages,
  BatchActions,
  Buyer,
  Document,
  SortedColumnData,
  UploadedDocumentMessage,
} from '@ui-coe/avidcapture/shared/types';
import { SnackbarBatchActionsComponent } from '@ui-coe/avidcapture/shared/ui';
import { ToastHorizontalPositions, ToastVerticalPositions } from '@ui-coe/shared/types';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-uploads-queue-page',
  templateUrl: './uploads-queue-page.component.html',
  styleUrls: ['./uploads-queue-page.component.scss'],
})
export class UploadsQueuePageComponent implements OnInit, OnDestroy {
  @Select(UploadsQueuePageSelectors.uploadedInvoices) uploadedInvoices$: Observable<Document[]>;
  @Select(UploadsQueuePageSelectors.loadMoreHidden) loadMoreHidden$: Observable<boolean>;
  @Select(UploadsQueuePageSelectors.sortedColumnData)
  sortedColumnData$: Observable<SortedColumnData>;
  @Select(UploadsQueuePageSelectors.canRefreshPage) canRefreshPage$: Observable<boolean>;
  @Select(UploadsQueuePageSelectors.uploadedDocumentMessages) uploadedDocumentMessages$: Observable<
    UploadedDocumentMessage[]
  >;
  @Select(UploadsQueuePageSelectors.searchByFileNameValue)
  searchByFileNameValue$: Observable<string>;
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(CoreSelectors.filteredBuyers) filteredBuyersCore$: Observable<Buyer[]>;
  @Select(ClaimsQueries.canUpload) canUpload$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canDownloadPdf) canDownloadPdf$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.batchSelectIsActive) batchSelectIsActive$: Observable<boolean>;

  searchControl: FormControl<string> = new FormControl('');
  resetBatchSelection = false;

  private subscriptions: Subscription[] = [];
  private uploadsCompletedSnackBarRef: MatSnackBarRef<UploadCompleteComponent>;
  private batchSnackBarRef: MatSnackBarRef<SnackbarBatchActionsComponent>;
  private itemsSelected = signal<Document[]>([]);

  constructor(
    private store: Store,
    private viewPort: ViewportScroller,
    private pageHelperService: PageHelperService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([this.currentUsername$, this.filteredBuyersCore$, this.searchByFileNameValue$])
        .pipe(
          filter(
            ([name, filteredBuyers, searchByFileNameValue]) =>
              name != null && filteredBuyers.length !== 0
          ),
          tap(([username, filteredBuyers, searchByFileNameValue]) => {
            this.searchControl.setValue(searchByFileNameValue);
            this.store.dispatch(new SetSourceEmail(username));
            this.loadPage();
          })
        )
        .subscribe()
    );
  }

  loadPage(): void {
    this.store.dispatch([
      new SetCurrentPage(AppPages.UploadsQueue),
      new ResetPageNumber(),
      new QueryUploadedInvoices(),
      new EnablePageRefresh(),
      new QueryDocumentCardSetCounts(),
      new SetUploadsPageSignalEvents(),
    ]);
    this.initiateSearchfilter();
  }

  ngOnDestroy(): void {
    this.uploadsCompletedSnackBarRef?.dismiss();
    this.batchSnackBarRef?.dismiss();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openInvoice(document: Document): void {
    const pageFilters = this.store.selectSnapshot(state => state.uploadsQueuePage.filters);

    this.store.dispatch([
      new QueryUnindexedDocument(document.documentId),
      new SetScrollPosition(this.viewPort.getScrollPosition()),
      new StorePageFilters(pageFilters),
    ]);
  }

  columnSorted(columnSorted: Sort): void {
    this.store.dispatch(new SetColumnSortedData(columnSorted));
  }

  loadNextPage(): void {
    this.store.dispatch(new QueryUploadedInvoices());
  }

  refreshPage(): void {
    this.store.dispatch([
      new ResetPageNumber(),
      new QueryUploadedInvoices(),
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

  uploadInvoice(value: { file: File; orgId: string; correlationId: string }): void {
    this.store.dispatch(new UploadDocument(value.file, value.orgId, value.correlationId));
    this.openUploadsCompletedToast();
  }

  uploadError(message: string): void {
    this.pageHelperService.openUploadErrorToast(message);
  }

  private initiateSearchfilter(): void {
    this.subscriptions.push(
      this.searchControl.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((value: string) => this.store.dispatch(new FilterByInvoiceName(value)))
        )
        .subscribe()
    );
  }

  batchSelect(rows: Document[]): void {
    this.itemsSelected.update(() => rows);

    if (rows.length === 0 && this.batchSnackBarRef != null) {
      this.batchSnackBarRef.dismiss();
      this.batchSnackBarRef = null;
      return;
    }

    if (!this.batchSnackBarRef) {
      this.resetBatchSelection = false;
      this.batchSnackBarRef = this.snackBar.openFromComponent(SnackbarBatchActionsComponent, {
        duration: 0,
        horizontalPosition: ToastHorizontalPositions.Center,
        verticalPosition: ToastVerticalPositions.Bottom,
        data: {
          itemsSelected: this.itemsSelected,
          canDownloadPdf$: this.canDownloadPdf$,
        },
      });

      this.subscriptions.push(
        this.batchSnackBarRef
          .afterDismissed()
          .pipe(
            tap(() => {
              const documentIds = this.itemsSelected().map(row => row.documentId);

              switch (this.batchSnackBarRef.instance.action) {
                case BatchActions.Delete:
                  this.store.dispatch(new BatchDeletion(documentIds));
                  break;
                case BatchActions.Download:
                  this.store.dispatch(new BatchDownload(this.itemsSelected()));
                  break;
              }

              this.resetBatchSelection = true;
              this.itemsSelected.set([]);
              this.batchSnackBarRef = null;
            }),
            take(1)
          )
          .subscribe()
      );
    }
  }

  private openUploadsCompletedToast(): void {
    if (!this.uploadsCompletedSnackBarRef) {
      this.uploadsCompletedSnackBarRef = this.snackBar.openFromComponent(UploadCompleteComponent, {
        duration: 30000,
        horizontalPosition: ToastHorizontalPositions.End,
        verticalPosition: ToastVerticalPositions.Bottom,
        data: {
          messages$: this.uploadedDocumentMessages$,
        },
      });

      this.subscriptions.push(
        this.uploadsCompletedSnackBarRef
          .afterDismissed()
          .pipe(
            tap(() => {
              this.store.dispatch(new ClearUploadedDocumentMessages());
              this.uploadsCompletedSnackBarRef = null;
            }),
            take(1)
          )
          .subscribe()
      );
    }
  }
}
