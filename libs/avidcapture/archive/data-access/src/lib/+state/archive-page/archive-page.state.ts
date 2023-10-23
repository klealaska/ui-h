import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  SortDirection,
  UserRoles,
} from '@ui-coe/avidcapture/shared/types';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import * as actions from './archive-page.actions';

const defaults: DocumentStateModel = {
  invoices: [],
  buyers: [],
  filteredBuyers: [],
  filters: {
    buyerId: [],
    isSubmitted: [1],
  },
  defaultPageFilters: {
    buyerId: [],
    isSubmitted: [1],
  },
  aggregateFilters: null,
  sortedColumnData: {},
  loadMoreHidden: false,
  pageNumber: 1,
  scrollPosition: [0, 0],
  searchFields: [],
  canRefreshPage: true,
  needsDefaultDateRange: false,
};

@State<DocumentStateModel>({
  name: 'archivePage',
  defaults,
})
@Injectable()
export class ArchivePageState extends DocumentState {
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

  ngxsOnInit({ getState, patchState }: StateContext<DocumentStateModel>): void {
    patchState({
      filters: {
        ...getState().filters,
        isSubmitted: [1],
      },
      sortedColumnData: { dateSubmitted: SortDirection.Descending },
    });
  }

  @Action(actions.QueryArchivedInvoices, { cancelUncompleted: true })
  queryArchivedInvoices(ctx: StateContext<DocumentStateModel>): Observable<Document[]> {
    const token = this.store.selectSnapshot(state => state.core.token);
    const userRoles = jwt_decode(token)['roles'] as Array<string>;

    if (userRoles?.indexOf(UserRoles.InternalOps) > -1) {
      return super.queryDocuments(ctx);
    } else {
      return super.queryArchiveDocuments(ctx);
    }
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
    ctx.dispatch(new actions.QueryArchivedInvoices());
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
        ctx.dispatch(new actions.QueryArchivedInvoices());
      }),
      catchError((err: HttpErrorResponse) => {
        ctx.dispatch(new actions.QueryArchivedInvoices());
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
    ctx.dispatch(new actions.QueryArchivedInvoices());
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

  @Action(actions.ResetPageNumber)
  resetPageNumber(ctx: StateContext<DocumentStateModel>): void {
    super.resetPageNumber(ctx);
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

  @Action(actions.UpdateArchiveQueueWithNoSUBuyers)
  updateArchiveQueueWithNoSUBuyers({ patchState }: StateContext<DocumentStateModel>): void {
    patchState({ invoices: [], loadMoreHidden: true });
  }
}
