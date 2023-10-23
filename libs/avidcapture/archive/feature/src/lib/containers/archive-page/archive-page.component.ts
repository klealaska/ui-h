import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Select, Store } from '@ngxs/store';
import {
  ArchivePageSelectors,
  DisablePageRefresh,
  EnablePageRefresh,
  QueryAllBuyersLookAhead,
  QueryArchivedDocument,
  QueryArchivedInvoices,
  QueryBuyerLookAhead,
  RemoveFilter,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetScrollPosition,
} from '@ui-coe/avidcapture/archive/data-access';
import {
  AddFilteredBuyer,
  ClaimsQueries,
  CoreSelectors,
  QueryDocumentCardSetCounts,
  RemoveFilteredBuyer,
  SetCurrentPage,
} from '@ui-coe/avidcapture/core/data-access';
import { PageHelperService } from '@ui-coe/avidcapture/core/util';
import {
  AdvancedFilter,
  AppPages,
  Buyer,
  Document,
  SortedColumnData,
} from '@ui-coe/avidcapture/shared/types';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

@Component({
  selector: 'xdc-archive',
  templateUrl: './archive-page.component.html',
  styleUrls: ['./archive-page.component.scss'],
})
export class ArchivePageComponent implements OnInit, OnDestroy {
  @Select(ArchivePageSelectors.archivedInvoices) archivedInvoices$: Observable<Document[]>;
  @Select(ArchivePageSelectors.buyers) buyers$: Observable<Buyer[]>;
  @Select(ArchivePageSelectors.filteredBuyers) filteredBuyers$: Observable<Buyer[]>;
  @Select(ArchivePageSelectors.advancedFilters) advancedFilters$: Observable<AdvancedFilter>;
  @Select(ArchivePageSelectors.appliedFilters) appliedFilters$: Observable<AdvancedFilter>;
  @Select(ArchivePageSelectors.loadMoreHidden) loadMoreHidden$: Observable<boolean>;
  @Select(ArchivePageSelectors.sortedColumnData) sortedColumnData$: Observable<SortedColumnData>;
  @Select(ArchivePageSelectors.canRefreshPage) canRefreshPage$: Observable<boolean>;
  @Select(CoreSelectors.isLoading) isLoading$: Observable<boolean>;
  @Select(CoreSelectors.currentUsername) currentUsername$: Observable<string>;
  @Select(CoreSelectors.filteredBuyers) filteredBuyersCore$: Observable<Buyer[]>;
  @Select(CoreSelectors.orgNames) orgNames$: Observable<Buyer[]>;
  @Select(ClaimsQueries.canViewAllBuyers) canViewAllBuyers$: Observable<boolean>;
  @Select(ClaimsQueries.canUseAdvancedFilter) canUseAdvancedFilter$: Observable<boolean>;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private viewPort: ViewportScroller,
    private pageHelperService: PageHelperService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([this.currentUsername$, this.filteredBuyersCore$])
        .pipe(
          filter(([name, filteredBuyers]) => name != null && filteredBuyers.length !== 0),
          tap(() => this.loadPage()),
          take(1)
        )
        .subscribe()
    );
  }

  loadPage(): void {
    this.store.dispatch([
      new SetCurrentPage(AppPages.Archive),
      new ResetPageNumber(),
      new QueryArchivedInvoices(),
      new QueryDocumentCardSetCounts(),
      new EnablePageRefresh(),
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openInvoice(document: Document): void {
    this.store.dispatch([
      new QueryArchivedDocument(document.documentId),
      new SetScrollPosition(this.viewPort.getScrollPosition()),
    ]);
  }

  columnSorted(columnSorted: Sort): void {
    this.store.dispatch(new SetColumnSortedData(columnSorted));
  }

  filteredBuyerAdded(buyer: Buyer, canViewAllBuyers: boolean): void {
    if (canViewAllBuyers) {
      this.store.dispatch([
        new AddFilteredBuyer(buyer),
        new ResetPageNumber(),
        new QueryArchivedInvoices(),
      ]);
    }
  }

  filteredBuyerRemoved(buyer: Buyer, canViewAllBuyers: boolean): void {
    if (canViewAllBuyers) {
      this.store.dispatch([
        new RemoveFilteredBuyer(buyer),
        new ResetPageNumber(),
        new QueryArchivedInvoices(),
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
    this.store.dispatch(new QueryArchivedInvoices());
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
      new QueryArchivedInvoices(),
      new DisablePageRefresh(),
    ]);

    this.subscriptions.push(
      this.pageHelperService
        .setTimeoutForPageRefresh()
        .pipe(tap(() => this.store.dispatch(new EnablePageRefresh())))
        .subscribe()
    );
  }
}
