import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { RetryStrategyService } from '@ui-coe/avidcapture/core/data-access';
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
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import * as actions from './recycle-bin-page.actions';

const defaults: DocumentStateModel = {
  invoices: [],
  buyers: [],
  filteredBuyers: [],
  filters: {
    buyerId: [],
    escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
    isSubmitted: [0],
  },
  defaultPageFilters: {
    buyerId: [],
    escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
    isSubmitted: [0],
  },
  aggregateFilters: null,
  sortedColumnData: { lastModified: SortDirection.Descending },
  loadMoreHidden: false,
  pageNumber: 1,
  scrollPosition: [0, 0],
  searchFields: [],
  canRefreshPage: true,
  needsDefaultDateRange: true,
};

@State<DocumentStateModel>({
  name: 'recycleBinPage',
  defaults,
})
@Injectable()
export class RecycleBinPageState extends DocumentState {
  constructor(
    protected xdcService: XdcService,
    protected retryStrategyService: RetryStrategyService,
    protected documentSearchHelperService: DocumentSearchHelperService,
    protected pageHelperService: PageHelperService,
    protected bkwService: BuyerKeywordService,
    protected toastService: ToastService,
    protected viewPort: ViewportScroller,
    protected store: Store
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

  @Action(actions.QueryRecycleBinDocuments, { cancelUncompleted: true })
  queryRecycleBinDocuments(ctx: StateContext<DocumentStateModel>): Observable<Document[]> {
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

  @Action(actions.SetFilteredBuyers)
  setFilteredBuyers(
    ctx: StateContext<DocumentStateModel>,
    { filteredBuyers }: actions.SetFilteredBuyers
  ): void {
    super.setFilteredBuyers(ctx, { filteredBuyers });
    ctx.dispatch(new actions.QueryRecycleBinDocuments());
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

    ctx.patchState({
      needsDefaultDateRange: filters.dateReceived == null,
    });

    return super.setAdvanceFilters(ctx, { filters: existingFilters, newFilters: filters }).pipe(
      tap(() => {
        ctx.dispatch(new actions.QueryRecycleBinDocuments());
      }),
      catchError((err: HttpErrorResponse) => {
        ctx.dispatch(new actions.QueryRecycleBinDocuments());
        throw err;
      })
    );
  }

  @Action(actions.SetColumnSortedData)
  setColumnSortedData(
    ctx: StateContext<DocumentStateModel>,
    { columnData }: actions.SetColumnSortedData
  ): void {
    super.setColumnSortedData(ctx, { columnData });
    ctx.dispatch(new actions.QueryRecycleBinDocuments());
  }

  @Action(actions.ResetPageNumber)
  resetPageNumber(ctx: StateContext<DocumentStateModel>): void {
    super.resetPageNumber(ctx);
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

  @Action(actions.UpdateRecycleBinQueueInvoiceOnLock)
  updateRecycleBinQueueInvoiceOnLock(
    ctx: StateContext<DocumentStateModel>,
    { documentId, lockedBy }: actions.UpdateRecycleBinQueueInvoiceOnLock
  ): void {
    super.updateQueueInvoiceOnLock(ctx, { documentId, lockedBy });
  }

  @Action(actions.UpdateRecycleBinQueueInvoiceOnUnlock)
  updateRecycleBinQueueInvoiceOnUnlock(
    ctx: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateRecycleBinQueueInvoiceOnUnlock
  ): void {
    super.updateQueueInvoiceOnUnlock(ctx, { documentId });
  }

  @Action(actions.UpdateRecycleBinQueueOnInvoiceSubmit)
  updateRecycleBinQueueOnInvoiceSubmit(
    ctx: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateRecycleBinQueueOnInvoiceSubmit
  ): void {
    super.updateQueueOnInvoiceSubmit(ctx, { documentId });
  }

  @Action(actions.RemoveFilter)
  removeFilter(ctx: StateContext<DocumentStateModel>, { filterKey }: actions.RemoveFilter): void {
    super.removeFilter(ctx, { filterKey });

    ctx.patchState({
      needsDefaultDateRange: ctx.getState().filters.dateReceived == null,
    });
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

  @Action(actions.SetRecycleBinPageSignalEvents)
  setRecycleBinPageSignalEvents({ dispatch }: StateContext<DocumentStateModel>): void {
    const hubConnection: HubConnection = this.store.selectSnapshot(
      state => state.core.hubConnection
    );

    if (hubConnection != null) {
      hubConnection.on('onRecycleBinLock', (documentId: string, lockedBy: string) =>
        dispatch(new actions.UpdateRecycleBinQueueInvoiceOnLock(documentId, lockedBy))
      );
      hubConnection.on('onRecycleBinUnlock', (documentId: string) =>
        dispatch(new actions.UpdateRecycleBinQueueInvoiceOnUnlock(documentId))
      );
      hubConnection.on('onInvoiceSubmit', (documentId: string) =>
        dispatch(new actions.UpdateRecycleBinQueueOnInvoiceSubmit(documentId))
      );
      hubConnection.on('onEscalationSubmit', (documentId: string) =>
        dispatch(new actions.UpdateRecycleBinQueueOnInvoiceSubmit(documentId))
      );
    }
  }

  @Action(actions.RemoveRecycleBinPageSignalEvents)
  removeRecycleBinPageSignalEvents(): void {
    const hubConnection = this.store.selectSnapshot(state => state.core.hubConnection);

    hubConnection.off('onRecycleBinLock');
    hubConnection.off('onRecycleBinUnlock');
    hubConnection.off('onInvoiceSubmit');
    hubConnection.off('onEscalationSubmit');
  }
}
