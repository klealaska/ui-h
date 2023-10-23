import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  QueryDocumentCardSetCounts,
  RetryStrategyService,
  SocketService,
  UpdatePendingQueueCount,
  UpdateRecycleBinQueueCount,
} from '@ui-coe/avidcapture/core/data-access';
import {
  BuyerKeywordService,
  DocumentSearchHelperService,
  PageHelperService,
  ToastService,
  XdcService,
} from '@ui-coe/avidcapture/core/util';
import { DocumentState, DocumentStateModel } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFilter,
  Document,
  DocumentReduce,
  EscalationCategoryTypes,
  IngestionTypes,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import * as actions from './pending-page.actions';

const defaults: DocumentStateModel = {
  invoices: [],
  buyers: [],
  filteredBuyers: [],
  filters: {
    buyerId: [],
    escalationCategoryIssue: [EscalationCategoryTypes.None],
    ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
    isSubmitted: [0],
  },
  defaultPageFilters: {
    buyerId: [],
    escalationCategoryIssue: [EscalationCategoryTypes.None],
    ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
    isSubmitted: [0],
  },
  aggregateFilters: null,
  sortedColumnData: { dateReceived: SortDirection.Ascending },
  loadMoreHidden: false,
  pageNumber: 1,
  scrollPosition: [0, 0],
  searchFields: [],
  canRefreshPage: true,
  needsDefaultDateRange: false,
};

@State<DocumentStateModel>({
  name: 'pendingPage',
  defaults,
})
@Injectable()
export class PendingPageState extends DocumentState implements NgxsOnInit {
  constructor(
    protected xdcService: XdcService,
    protected retryStrategyService: RetryStrategyService,
    protected documentSearchHelperService: DocumentSearchHelperService,
    protected pageHelperService: PageHelperService,
    protected bkwService: BuyerKeywordService,
    protected toastService: ToastService,
    protected viewPort: ViewportScroller,
    protected store: Store,
    private socketService: SocketService
  ) {
    super(
      xdcService,
      retryStrategyService,
      documentSearchHelperService,
      pageHelperService,
      bkwService,
      toastService,
      viewPort,
      store
    );
  }

  @Selector()
  static data(state: DocumentStateModel): DocumentStateModel {
    return state;
  }

  ngxsOnInit({ getState, patchState }: StateContext<DocumentStateModel>): void {
    patchState({
      filteredBuyers: [...getState().filters.buyerId],
    });
  }

  @Action(actions.QueryQueueInvoices, { cancelUncompleted: true })
  queryQueueInvoices(ctx: StateContext<DocumentStateModel>): Observable<Document[]> {
    return super.queryDocuments(ctx);
  }

  @Action(actions.QueryBuyerLookAhead, { cancelUncompleted: true })
  queryBuyerLookAhead(
    ctx: StateContext<DocumentStateModel>,
    { searchValue }: actions.QueryBuyerLookAhead
  ): Observable<Document[]> {
    return super.queryBuyerLookAhead(ctx, { searchValue });
  }

  @Action(actions.QueryAllBuyersLookAhead, { cancelUncompleted: true })
  queryAllBuyersLookAhead(
    ctx: StateContext<DocumentStateModel>,
    { searchValue }: actions.QueryAllBuyersLookAhead
  ): Observable<Document[]> {
    return super.queryAllBuyersLookAhead(ctx, { searchValue });
  }

  @Action(actions.SetAdvanceFilters)
  setAdvanceFilters(
    ctx: StateContext<DocumentStateModel>,
    { filters }: actions.SetAdvanceFilters
  ): Observable<DocumentReduce[]> {
    const existingFilters: AdvancedFilter = {
      ...ctx.getState().defaultPageFilters,
      ...filters,
    };

    return super.setAdvanceFilters(ctx, { filters: existingFilters, newFilters: filters }).pipe(
      tap(() => {
        // if (!window['Cypress']) {
        // this.logoutService.initialState.queuePage.filters = filters;
        // }
        ctx.dispatch([new actions.QueryQueueInvoices(), new QueryDocumentCardSetCounts()]);
      }),
      catchError((err: HttpErrorResponse) => {
        ctx.dispatch([new actions.QueryQueueInvoices(), new QueryDocumentCardSetCounts()]);
        throw err;
      })
    );
  }

  @Action(actions.SetFilteredBuyer)
  setFilteredBuyer(
    ctx: StateContext<DocumentStateModel>,
    { filteredBuyers }: actions.SetFilteredBuyer
  ): void {
    super.setFilteredBuyers(ctx, { filteredBuyers });
    // if (!window['Cypress']) {
    // this.logoutService.initialState.queuePage.filters.buyerId = filteredBuyers;
    // }
    ctx.dispatch([new actions.QueryQueueInvoices(), new QueryDocumentCardSetCounts()]);
  }

  @Action(actions.SetColumnSortedData)
  setColumnSortedData(
    ctx: StateContext<DocumentStateModel>,
    { columnData }: actions.SetColumnSortedData
  ): void {
    super.setColumnSortedData(ctx, { columnData });
    ctx.dispatch(new actions.QueryQueueInvoices());
  }

  @Action(actions.ResetPageNumber)
  resetPageNumber(ctx: StateContext<DocumentStateModel>): void {
    super.resetPageNumber(ctx);
  }

  @Action(actions.UpdateQueueInvoiceOnLock)
  updateQueueInvoiceOnLock(
    ctx: StateContext<DocumentStateModel>,
    { documentId, lockedBy }: actions.UpdateQueueInvoiceOnLock
  ): void {
    super.updateQueueInvoiceOnLock(ctx, { documentId, lockedBy });
  }

  @Action(actions.UpdateQueueInvoiceOnUnlock)
  updateQueueInvoiceOnUnlock(
    ctx: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateQueueInvoiceOnUnlock
  ): void {
    super.updateQueueInvoiceOnUnlock(ctx, { documentId });
  }

  @Action(actions.UpdateQueueOnInvoiceSubmit)
  updateQueueOnInvoiceSubmit(
    ctx: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateQueueOnInvoiceSubmit
  ): void {
    super.updateQueueOnInvoiceSubmit(ctx, { documentId });
  }

  @Action(actions.SetScrollPosition)
  setScrollPosition(
    ctx: StateContext<DocumentStateModel>,
    { scrollPosition }: actions.SetScrollPosition
  ): void {
    super.setScrollPosition(ctx, { scrollPosition });
  }

  @Action(actions.ScrollToPosition)
  scrollToPosition(ctx: StateContext<DocumentStateModel>): void {
    super.scrollToPosition(ctx);
  }

  @Action(actions.SetSearchFields)
  setSearchFields(
    ctx: StateContext<DocumentStateModel>,
    { searchFields }: actions.SetSearchFields
  ): void {
    super.setSearchFields(ctx, { searchFields });
  }

  @Action(actions.RemoveFilter)
  removeFilter(ctx: StateContext<DocumentStateModel>, { filterKey }: actions.RemoveFilter): void {
    super.removeFilter(ctx, { filterKey });
    ctx.dispatch(new actions.SetAdvanceFilters(ctx.getState().filters));
  }

  @Action(actions.EnablePageRefresh)
  enablePageRefresh(ctx: StateContext<DocumentStateModel>): void {
    super.enablePageRefresh(ctx);
  }

  @Action(actions.DisablePageRefresh)
  disablePageRefresh(ctx: StateContext<DocumentStateModel>): void {
    super.disablePageRefresh(ctx);
  }

  @Action(actions.SetPendingPageSignalEvents)
  setPendingPageSignalEvents({ dispatch }: StateContext<DocumentStateModel>): void {
    const hubConnection = this.store.selectSnapshot(state => state.core.hubConnection);

    if (hubConnection != null) {
      hubConnection.on('onPendingLock', (documentId: string, lockedBy: string) =>
        dispatch(new actions.UpdateQueueInvoiceOnLock(documentId, lockedBy))
      );
      hubConnection.on('onPendingUnlock', (documentId: string) =>
        dispatch(new actions.UpdateQueueInvoiceOnUnlock(documentId))
      );
      hubConnection.on('onInvoiceSubmit', (documentId: string) =>
        dispatch(new actions.UpdateQueueOnInvoiceSubmit(documentId))
      );
      hubConnection.on('onEscalationSubmit', (documentId: string) =>
        dispatch(new actions.UpdateQueueOnInvoiceSubmit(documentId))
      );
    }
  }

  @Action(actions.RemovePendingPageSignalEvents)
  removePendingPageSignalEvents(): void {
    const hubConnection: HubConnection = this.store.selectSnapshot(
      state => state.core.hubConnection
    );

    hubConnection.off('onPendingLock');
    hubConnection.off('onPendingUnlock');
    hubConnection.off('onInvoiceSubmit');
    hubConnection.off('onEscalationSubmit');
  }

  @Action(actions.BatchDeletion, { cancelUncompleted: true })
  batchPendingDeletion(
    ctx: StateContext<DocumentStateModel>,
    { documentIds }: actions.BatchDeletion
  ): Observable<void> {
    return super.batchDeletion(ctx, { documentIds }).pipe(
      tap(() => {
        ctx.patchState({
          invoices: ctx.getState().invoices.filter(inv => !documentIds.includes(inv.documentId)),
        });

        ctx.dispatch([new UpdatePendingQueueCount(), new UpdateRecycleBinQueueCount()]);
      })
    );
  }

  @Action(actions.BatchDownload, { cancelUncompleted: true })
  batchPendingDownload(
    ctx: StateContext<DocumentStateModel>,
    { documents }: actions.BatchDownload
  ): Observable<void> {
    return super.batchDownload(ctx, { documents });
  }
}
