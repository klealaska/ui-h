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
  CreateQueuesNotAllowedList,
  DisablePageRefresh,
  EnablePageRefresh,
  QueryAllBuyersLookAhead,
  QueryBuyerLookAhead,
  QueryExposedFiltersCounts,
  QueryResearchInvoices,
  RemoveEscalationFilter,
  RemoveExposedFilter,
  RemoveFilter,
  RemoveResearchPageSignalEvents,
  ResearchPageSelectors,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetResearchPageSignalEvents,
  SetScrollPosition,
} from '@ui-coe/avidcapture/research/data-access';
import { UpdateQueueInvoiceOnUnlock } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  AppPages,
  BatchActions,
  Buyer,
  Document,
  EscalationCategoryTypes,
  ExposedFilter,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';
import { SnackbarBatchActionsComponent } from '@ui-coe/avidcapture/shared/ui';
import { ToastHorizontalPositions, ToastVerticalPositions } from '@ui-coe/shared/types';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-research-queue-page',
  templateUrl: './research-queue-page.component.html',
  styleUrls: ['./research-queue-page.component.scss'],
})
export class ResearchQueuePageComponent implements OnInit, OnDestroy {
  @Select(ResearchPageSelectors.researchInvoices) researchInvoices$: Observable<Document[]>;
  @Select(ResearchPageSelectors.buyers) buyers$: Observable<Buyer[]>;
  @Select(ResearchPageSelectors.filteredBuyers) filteredBuyers$: Observable<Buyer[]>;
  @Select(ResearchPageSelectors.advancedFilters) advancedFilters$: Observable<AdvancedFilter>;
  @Select(ResearchPageSelectors.appliedFilters) appliedFilters$: Observable<AdvancedFilter>;
  @Select(ResearchPageSelectors.loadMoreHidden) loadMoreHidden$: Observable<boolean>;
  @Select(ResearchPageSelectors.sortedColumnData) sortedColumnData$: Observable<SortedColumnData>;
  @Select(ResearchPageSelectors.canRefreshPage) canRefreshPage$: Observable<boolean>;
  @Select(ResearchPageSelectors.queuesNotAllowedList) queuesNotAllowedList$: Observable<string[]>;
  @Select(ResearchPageSelectors.exposedFilters) exposedFilters$: Observable<ExposedFilter[]>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.filteredBuyers) filteredBuyersCore$: Observable<Buyer[]>;
  @Select(CoreSelectors.orgNames) orgNames$: Observable<Buyer[]>;
  @Select(ClaimsQueries.canViewResearch) canViewEscalations$: Observable<boolean>;
  @Select(ClaimsQueries.canUseAdvancedFilter) canUseAdvancedFilter$: Observable<boolean>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.escalationCategoryList) escalationCategoryList$: Observable<string[]>;
  @Select(ClaimsQueries.canSeeExposedFilters) canSeeExposedFilters$: Observable<boolean>;
  @Select(ClaimsQueries.canUnlockDocumentManually) canUnlockDocumentManually$: Observable<boolean>;
  @Select(ClaimsQueries.canDownloadPdf) canDownloadPdf$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.batchSelectIsActive) batchSelectIsActive$: Observable<boolean>;

  resetBatchSelection = false;

  private subscriptions: Subscription[] = [];
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
      combineLatest([this.escalationCategoryList$, this.filteredBuyersCore$])
        .pipe(
          filter(
            ([escalationCategoryList, filteredBuyers]) =>
              name != null && filteredBuyers.length !== 0
          ),
          tap(([escalationCategoryList]: [string[], Buyer[]]) =>
            this.loadPage(escalationCategoryList)
          ),
          take(1)
        )
        .subscribe()
    );
  }

  loadPage(escalationCategoryList: string[]): void {
    this.store.dispatch([
      new SetCurrentPage(AppPages.Research),
      new CreateQueuesNotAllowedList([
        ...escalationCategoryList,
        `-${EscalationCategoryTypes.RejectToSender}`,
      ]),
      new ResetPageNumber(),
      new QueryResearchInvoices(),
      new EnablePageRefresh(),
      new QueryDocumentCardSetCounts(),
      new SetResearchPageSignalEvents(),
      new QueryExposedFiltersCounts(),
    ]);
  }

  ngOnDestroy(): void {
    this.batchSnackBarRef?.dismiss();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.store.dispatch(new RemoveResearchPageSignalEvents());
  }

  openInvoice(document: Document): void {
    const pageFilters = this.store.selectSnapshot(state => state.researchPage.filters);

    this.store.dispatch([
      new QueryUnindexedDocument(document.documentId),
      new SetScrollPosition(this.viewPort.getScrollPosition()),
      new StorePageFilters(pageFilters),
    ]);
  }

  columnSorted(columnData: Sort): void {
    this.store.dispatch(new SetColumnSortedData(columnData));
  }

  filteredBuyerAdded(buyer: Buyer, canViewAllBuyers: boolean): void {
    if (canViewAllBuyers) {
      this.store.dispatch([
        new AddFilteredBuyer(buyer),
        new ResetPageNumber(),
        new QueryResearchInvoices(),
        new QueryExposedFiltersCounts(),
      ]);
    }
  }

  filteredBuyerRemoved(buyer: Buyer, canViewAllBuyers: boolean): void {
    if (canViewAllBuyers) {
      this.store.dispatch([
        new RemoveFilteredBuyer(buyer),
        new ResetPageNumber(),
        new QueryResearchInvoices(),
        new QueryExposedFiltersCounts(),
      ]);
    }
  }

  searchBuyers(value: string, canViewAllBuyers: boolean): void {
    if (!value) {
      return;
    }

    this.store.dispatch(
      canViewAllBuyers ? new QueryAllBuyersLookAhead(value) : new QueryBuyerLookAhead(value)
    );
  }

  loadNextPage(): void {
    this.store.dispatch(new QueryResearchInvoices());
  }

  advanceSearchApplied(formValues: AdvancedFilter): void {
    this.store.dispatch(new SetAdvanceFilters(formValues));

    if (formValues.escalationCategoryIssue?.length > 0) {
      formValues.escalationCategoryIssue.forEach(issue =>
        this.store.dispatch(new RemoveExposedFilter(issue))
      );
    } else {
      this.store.dispatch(new RemoveExposedFilter());
    }
  }

  filterRemoved(filterKey: string): void {
    this.store.dispatch(new RemoveFilter(filterKey));
  }

  escalationFilterRemoved(escalationType: string): void {
    this.store.dispatch(new RemoveEscalationFilter(escalationType));
  }

  refreshPage(): void {
    this.store.dispatch([
      new ResetPageNumber(),
      new QueryResearchInvoices(),
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

  exposedFilterSelected(filterName: string): void {
    const advancedFilters = this.store.selectSnapshot(state => state.researchPage.filters);
    this.store.dispatch([
      new RemoveExposedFilter(filterName),
      new SetAdvanceFilters({
        ...advancedFilters,
        escalationCategoryIssue: [...advancedFilters.escalationCategoryIssue, filterName],
      }),
    ]);
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
