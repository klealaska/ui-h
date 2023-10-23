import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  DisablePageRefresh,
  EnablePageRefresh,
  QueryAllBuyersLookAhead,
  QueryBuyerLookAhead,
  QueryRecycleBinDocuments,
  RecycleBinSelectors,
  RemoveFilter,
  RemoveRecycleBinPageSignalEvents,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetRecycleBinPageSignalEvents,
  SetScrollPosition,
} from '@ui-coe/avidcapture/recycle-bin/data-access';
import { UpdateQueueInvoiceOnUnlock } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  AppPages,
  Buyer,
  Document,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrls: ['./recycle-bin.component.scss'],
})
export class RecycleBinPageComponent implements OnInit, OnDestroy {
  @Select(RecycleBinSelectors.recycleBinDocuments) recycleBinDocuments$: Observable<Document[]>;
  @Select(RecycleBinSelectors.buyers) buyers$: Observable<Buyer[]>;
  @Select(RecycleBinSelectors.filteredBuyers) filteredBuyers$: Observable<Buyer[]>;
  @Select(RecycleBinSelectors.advancedFilters)
  advancedFilters$: Observable<AdvancedFilter>;
  @Select(RecycleBinSelectors.appliedFilters)
  appliedFilters$: Observable<AdvancedFilter>;
  @Select(RecycleBinSelectors.loadMoreHidden) loadMoreHidden$: Observable<boolean>;
  @Select(RecycleBinSelectors.sortedColumnData)
  sortedColumnData$: Observable<SortedColumnData>;
  @Select(RecycleBinSelectors.canRefreshPage) canRefreshPage$: Observable<boolean>;
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(CoreSelectors.filteredBuyers) filteredBuyersCore$: Observable<Buyer[]>;
  @Select(CoreSelectors.orgNames) orgNames$: Observable<Buyer[]>;
  @Select(ClaimsQueries.canViewAllBuyers)
  canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canUseAdvancedFilter)
  canUseAdvancedFilter$: Observable<boolean>;
  @Select(ClaimsQueries.canUnlockDocumentManually) canUnlockDocumentManually$: Observable<boolean>;
  @Select(FeatureFlagTargetQueries.batchSelectIsActive) batchSelectIsActive$: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private viewPort: ViewportScroller,
    private pageHelperService: PageHelperService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredBuyersCore$
        .pipe(
          filter(filteredBuyers => filteredBuyers.length !== 0),
          tap(() => this.loadPage())
        )
        .subscribe()
    );
  }

  loadPage(): void {
    this.store.dispatch([
      new SetCurrentPage(AppPages.RecycleBin),
      new ResetPageNumber(),
      new QueryRecycleBinDocuments(),
      new EnablePageRefresh(),
      new QueryDocumentCardSetCounts(),
      new SetRecycleBinPageSignalEvents(),
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.store.dispatch(new RemoveRecycleBinPageSignalEvents());
  }

  searchBuyers(value: string, canViewAllBuyers: boolean): void {
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
        new QueryRecycleBinDocuments(),
      ]);
    }
  }

  filteredBuyerRemoved(buyer: Buyer, canViewAllBuyers: boolean): void {
    if (canViewAllBuyers) {
      this.store.dispatch([
        new RemoveFilteredBuyer(buyer),
        new ResetPageNumber(),
        new QueryRecycleBinDocuments(),
      ]);
    }
  }

  openInvoice(document: Document): void {
    const pageFilters = this.store.selectSnapshot(state => state.recycleBinPage.filters);

    this.store.dispatch([
      new QueryUnindexedDocument(document.documentId),
      new SetScrollPosition(this.viewPort.getScrollPosition()),
      new StorePageFilters(pageFilters),
    ]);
  }

  loadNextPage(): void {
    this.store.dispatch(new QueryRecycleBinDocuments());
  }

  advanceSearchApplied(formValues: AdvancedFilter): void {
    this.store.dispatch([new SetAdvanceFilters(formValues)]);
  }

  columnSorted(columnData: Sort): void {
    this.store.dispatch(new SetColumnSortedData(columnData));
  }

  filterRemoved(filterKey: string): void {
    this.store.dispatch(new RemoveFilter(filterKey));
  }

  refreshPage(): void {
    this.store.dispatch([
      new ResetPageNumber(),
      new QueryRecycleBinDocuments(),
      new DisablePageRefresh(),
    ]);

    this.subscriptions.push(
      this.pageHelperService
        .setTimeoutForPageRefresh()
        .pipe(tap(() => this.store.dispatch(new EnablePageRefresh())))
        .subscribe()
    );
  }

  getMinDateForFilter(): Date {
    return DateTime.local().minus({ days: 31 }).toJSDate();
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
