import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  QueryDocumentCardSetCounts,
  RetryStrategyService,
  UpdateRecycleBinQueueCount,
  UpdateResearchQueueCount,
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
  AggregateBodyRequest,
  Document,
  DocumentReduce,
  EscalationCategoryTypes,
  SearchContext,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';

import * as actions from './research-page.actions';

const defaults: DocumentStateModel = {
  invoices: [],
  buyers: [],
  filteredBuyers: [],
  filters: {
    buyerId: [],
    escalationCategoryIssue: [
      `-${EscalationCategoryTypes.RecycleBin}`,
      `-${EscalationCategoryTypes.Void}`,
      `-${EscalationCategoryTypes.None}`,
      `-${EscalationCategoryTypes.RejectToSender}`,
    ],
    isSubmitted: [0],
  },
  defaultPageFilters: {
    buyerId: [],
    escalationCategoryIssue: [
      `-${EscalationCategoryTypes.RecycleBin}`,
      `-${EscalationCategoryTypes.Void}`,
      `-${EscalationCategoryTypes.None}`,
      `-${EscalationCategoryTypes.RejectToSender}`,
    ],
    isSubmitted: [0],
  },
  aggregateFilters: null,
  sortedColumnData: { lastModified: SortDirection.Ascending },
  loadMoreHidden: false,
  pageNumber: 1,
  scrollPosition: [0, 0],
  searchFields: [],
  canRefreshPage: true,
  needsDefaultDateRange: false,
  queuesNotAllowedList: [],
  exposedFilters: [
    {
      name: EscalationCategoryTypes.SupplierResearch,
      count: 0,
      show: false,
    },
    {
      name: EscalationCategoryTypes.DuplicateResearch,
      count: 0,
      show: false,
    },
    {
      name: EscalationCategoryTypes.ImageIssue,
      count: 0,
      show: false,
    },
    {
      name: EscalationCategoryTypes.NonInvoiceDocument,
      count: 0,
      show: false,
    },
    {
      name: EscalationCategoryTypes.ShipToResearch,
      count: 0,
      show: false,
    },
  ],
};

@State<DocumentStateModel>({
  name: 'researchPage',
  defaults,
})
@Injectable()
export class ResearchPageState extends DocumentState {
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

  @Action(actions.QueryResearchInvoices, { cancelUncompleted: true })
  queryResearchInvoices(ctx: StateContext<DocumentStateModel>): Observable<Document[]> {
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
    ctx.dispatch([new actions.QueryResearchInvoices(), new QueryDocumentCardSetCounts()]);
  }

  @Action(actions.SetAdvanceFilters)
  setAdvanceFilters(
    ctx: StateContext<DocumentStateModel>,
    { filters }: actions.SetAdvanceFilters
  ): Observable<DocumentReduce[]> {
    const existingFilters: AdvancedFilter = {
      ...ctx.getState().defaultPageFilters,
      ...filters,
      escalationCategoryIssue:
        filters.escalationCategoryIssue == null || filters.escalationCategoryIssue.length === 0
          ? [...ctx.getState().queuesNotAllowedList]
          : filters.escalationCategoryIssue,
    };

    return super.setAdvanceFilters(ctx, { filters: existingFilters, newFilters: filters }).pipe(
      tap(() => {
        ctx.dispatch([new actions.QueryResearchInvoices(), new QueryDocumentCardSetCounts()]);
      }),
      catchError((err: HttpErrorResponse) => {
        ctx.dispatch([new actions.QueryResearchInvoices(), new QueryDocumentCardSetCounts()]);
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
    ctx.dispatch(new actions.QueryResearchInvoices());
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

  @Action(actions.UpdateResearchQueueInvoiceOnLock)
  updateResearchQueueInvoiceOnLock(
    ctx: StateContext<DocumentStateModel>,
    { documentId, lockedBy }: actions.UpdateResearchQueueInvoiceOnLock
  ): void {
    super.updateQueueInvoiceOnLock(ctx, { documentId, lockedBy });
  }

  @Action(actions.UpdateResearchQueueInvoiceOnUnlock)
  updateResearchQueueInvoiceOnUnlock(
    ctx: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateResearchQueueInvoiceOnUnlock
  ): void {
    super.updateQueueInvoiceOnUnlock(ctx, { documentId });
  }

  @Action(actions.UpdateResearchQueueOnInvoiceSubmit)
  updateResearchQueueOnInvoiceSubmit(
    ctx: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateResearchQueueOnInvoiceSubmit
  ): void {
    super.updateQueueOnInvoiceSubmit(ctx, { documentId });
  }

  @Action(actions.RemoveFilter)
  removeFilter(ctx: StateContext<DocumentStateModel>, { filterKey }: actions.RemoveFilter): void {
    super.removeFilter(ctx, { filterKey });
    ctx.dispatch(new actions.SetAdvanceFilters(ctx.getState().filters));
  }

  @Action(actions.RemoveEscalationFilter)
  removeEscalationFilter(
    { dispatch, getState, patchState }: StateContext<DocumentStateModel>,
    { escalationType }: actions.RemoveEscalationFilter
  ): void {
    const filters = getState().filters;
    const index = filters.escalationCategoryIssue.indexOf(escalationType);
    const exposedFilters = getState().exposedFilters?.map(filter => ({
      ...filter,
      show: filter.name === escalationType ? true : filter.show,
    }));

    filters.escalationCategoryIssue.splice(index, 1);

    patchState({
      filters: {
        ...filters,
        escalationCategoryIssue:
          filters.escalationCategoryIssue.length === 0
            ? [...getState().queuesNotAllowedList]
            : filters.escalationCategoryIssue,
      },
      pageNumber: 1,
      exposedFilters,
    });

    dispatch([new actions.QueryResearchInvoices(), new QueryDocumentCardSetCounts()]);
  }

  @Action(actions.RemoveExposedFilter)
  removeExposedFilter(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { filterName }: actions.RemoveExposedFilter
  ): void {
    let exposedFilters;
    if (filterName !== '') {
      exposedFilters = getState().exposedFilters.map(filter => ({
        ...filter,
        show: filter.name === filterName ? false : filter.show,
      }));
    } else {
      exposedFilters = getState().exposedFilters.map(filter => ({
        ...filter,
        show: filter.count > 0 ? true : false,
      }));
    }
    patchState({
      exposedFilters,
    });
  }

  @Action(actions.EnablePageRefresh)
  enablePageRefresh(ctx: StateContext<DocumentStateModel>): void {
    super.enablePageRefresh(ctx);
  }

  @Action(actions.DisablePageRefresh)
  disablePageRefresh(ctx: StateContext<DocumentStateModel>): void {
    super.disablePageRefresh(ctx);
  }

  @Action(actions.CreateQueuesNotAllowedList)
  createQueuesNotAllowedList(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { escalationCategoryList }: actions.CreateQueuesNotAllowedList
  ): void {
    patchState({
      filters: {
        ...getState().filters,
        escalationCategoryIssue: [
          ...getState().filters.escalationCategoryIssue,
          ...escalationCategoryList,
        ],
      },
      queuesNotAllowedList: [
        ...getState().defaultPageFilters.escalationCategoryIssue,
        ...escalationCategoryList,
      ],
    });
  }

  @Action(actions.SetResearchPageSignalEvents)
  setResearchPageSignalEvents({ dispatch }: StateContext<DocumentStateModel>): void {
    const hubConnection: HubConnection = this.store.selectSnapshot(
      state => state.core.hubConnection
    );

    if (hubConnection != null) {
      hubConnection.on('onResearchLock', (documentId: string, lockedBy: string) =>
        dispatch(new actions.UpdateResearchQueueInvoiceOnLock(documentId, lockedBy))
      );
      hubConnection.on('onResearchUnlock', (documentId: string) =>
        dispatch(new actions.UpdateResearchQueueInvoiceOnUnlock(documentId))
      );
      hubConnection.on('onInvoiceSubmit', (documentId: string) =>
        dispatch(new actions.UpdateResearchQueueOnInvoiceSubmit(documentId))
      );
      hubConnection.on('onEscalationSubmit', (documentId: string) =>
        dispatch(new actions.UpdateResearchQueueOnInvoiceSubmit(documentId))
      );
    }
  }

  @Action(actions.RemoveResearchPageSignalEvents)
  removeResearchPageSignalEvents(): void {
    const hubConnection: HubConnection = this.store.selectSnapshot(
      state => state.core.hubConnection
    );

    hubConnection.off('onResearchLock');
    hubConnection.off('onResearchUnlock');
    hubConnection.off('onInvoiceSubmit');
    hubConnection.off('onEscalationSubmit');
  }

  @Action(actions.QueryExposedFiltersCounts)
  queryExposedFiltersCounts({
    getState,
    patchState,
  }: StateContext<DocumentStateModel>): Observable<DocumentReduce[]> {
    const escalationCategories = getState().exposedFilters.map(fltr => fltr.name);

    let orgIds = this.store.selectSnapshot(state => state.core.filteredBuyers);
    orgIds = orgIds.map(org => org.id);

    const requests: AggregateBodyRequest[] = escalationCategories.reduce((acc, category) => {
      const filters = {
        ...getState().filters,
        buyerId:
          getState().filters.buyerId.length === 0
            ? orgIds.slice(0, 10)
            : getState().filters.buyerId.map(buyer => buyer.id),
        escalationCategoryIssue: [category],
      };
      const documentRequest = this.documentSearchHelperService.getCountAggregateWithAliasRequest(
        SearchContext.AvidSuite,
        filters,
        category
      );

      acc.push(documentRequest);
      return acc;
    }, []);

    return this.xdcService.postAggregateBulkSearch(requests).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      map(request =>
        request.map(req => {
          delete req.isSubmitted;
          return req;
        })
      ),
      tap(request => {
        const exposedFilters = escalationCategories.reduce((acc, category) => {
          if (request.find(req => Object.keys(req)[0] === category)) {
            acc.push({
              name: category,
              count: request.find(req => Object.keys(req)[0] === category)[category],
              show:
                request.find(req => Object.keys(req)[0] === category)[category] > 0 ? true : false,
            });
          } else {
            acc.push({
              name: category,
              count: 0,
              show: false,
            });
          }
          return acc;
        }, []);

        exposedFilters.forEach(filter => {
          if (getState().filters.escalationCategoryIssue.includes(filter.name)) {
            filter.show = false;
          }
        });

        patchState({
          exposedFilters,
        });
      }),
      catchError(err => {
        const exposedFilters = getState().exposedFilters.map(fltr => ({
          name: fltr.name,
          count: 0,
          show: false,
        }));

        patchState({
          exposedFilters,
        });

        throw err;
      })
    );
  }

  @Action(actions.BatchDeletion, { cancelUncompleted: true })
  batchResearchDeletion(
    ctx: StateContext<DocumentStateModel>,
    { documentIds }: actions.BatchDeletion
  ): Observable<void> {
    return super.batchDeletion(ctx, { documentIds }).pipe(
      tap(() => {
        ctx.patchState({
          invoices: ctx.getState().invoices.filter(inv => !documentIds.includes(inv.documentId)),
        });

        ctx.dispatch([new UpdateResearchQueueCount(), new UpdateRecycleBinQueueCount()]);
      })
    );
  }

  @Action(actions.BatchDownload, { cancelUncompleted: true })
  batchResearchDownload(
    ctx: StateContext<DocumentStateModel>,
    { documents }: actions.BatchDownload
  ): Observable<void> {
    return super.batchDownload(ctx, { documents });
  }
}
