import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import {
  HttpRequestActive,
  HttpRequestComplete,
  RetryStrategyService,
} from '@ui-coe/avidcapture/core/data-access';
import {
  BuyerKeywordService,
  DocumentSearchHelperService,
  PageHelperService,
  ToastService,
  XdcService,
} from '@ui-coe/avidcapture/core/util';
import {
  AdvancedFilter,
  AdvancedFiltersKeys,
  AggregateBodyRequest,
  AppPages,
  BatchEscalationRequest,
  Buyer,
  Document,
  DocumentReduce,
  EscalationCategoryTypes,
  EscalationLevelTypes,
  SearchApplyFunction,
  SearchBodyRequest,
  SearchContext,
  SortDirection,
  escalationCategoryReasonTypes,
} from '@ui-coe/avidcapture/shared/types';
import * as fs from 'file-saver';
import * as JSZip from 'jszip';
import { Observable, from, of } from 'rxjs';
import { catchError, finalize, map, mergeMap, retry, tap } from 'rxjs/operators';

import * as actions from './document.actions';
import { DocumentStateModel } from './document.model';

const defaults: DocumentStateModel = {
  invoices: [],
  buyers: [],
  filteredBuyers: [],
  filters: {
    buyerId: [],
  },
  defaultPageFilters: {
    buyerId: [],
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
  name: 'document',
  defaults,
})
@Injectable()
export class DocumentState {
  constructor(
    protected xdcService: XdcService,
    protected retryStrategyService: RetryStrategyService,
    protected documentSearchHelperService: DocumentSearchHelperService,
    protected pageHelperService: PageHelperService,
    protected bkwService: BuyerKeywordService,
    protected toastService: ToastService,
    protected viewPort: ViewportScroller,
    protected store: Store
  ) {}

  @Action(actions.QueryDocuments)
  queryDocuments({
    dispatch,
    getState,
    patchState,
  }: StateContext<DocumentStateModel>): Observable<Document[]> {
    let orgIds = this.store.selectSnapshot(state => state.core.filteredBuyers);
    orgIds = orgIds.map(org => org.id);

    const currentPage = this.store.selectSnapshot(state => state.core.currentPage);
    let filters = {
      ...getState().filters,
      buyerId:
        getState().filters.buyerId.length === 0
          ? orgIds.slice(0, 10)
          : getState().filters.buyerId.map(buyer => buyer.id),
    };

    if (getState().aggregateFilters != null) {
      filters = {
        ...filters,
        ...getState().aggregateFilters,
      };
    }

    if (currentPage == AppPages.RecycleBin) {
      filters.dateRecycled = getState().needsDefaultDateRange
        ? this.pageHelperService.getDateRange(31)
        : getState().filters.dateReceived;
    } else {
      filters.dateReceived = getState().needsDefaultDateRange
        ? this.pageHelperService.getDateRange(31)
        : getState().filters.dateReceived;
    }

    const requestBody: SearchBodyRequest = this.documentSearchHelperService.getSearchRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters,
      sortField:
        Object.keys(getState().sortedColumnData).length > 0
          ? Object.keys(getState().sortedColumnData)[0]
          : '',
      sortDirection:
        Object.keys(getState().sortedColumnData).length > 0
          ? Object.values(getState().sortedColumnData)[0]
          : null,
      page: getState().pageNumber,
      pageSize: 30,
    });

    return this.xdcService.postSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((invoices: Document[]) => {
        patchState({
          invoices: getState().pageNumber > 1 ? [...getState().invoices, ...invoices] : invoices,
          loadMoreHidden: false,
          pageNumber: getState().pageNumber + 1,
        });

        if (!getState().scrollPosition.every(val => val === 0)) {
          dispatch(new actions.ScrollToPosition());
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({
            loadMoreHidden: true,
          });

          if (getState().pageNumber === 1) {
            patchState({ invoices: [] });
          }
        }
        throw err;
      })
    );
  }

  @Action(actions.QueryArchiveDocuments)
  queryArchiveDocuments({
    dispatch,
    getState,
    patchState,
  }: StateContext<DocumentStateModel>): Observable<Document[]> {
    const username: string = this.store.selectSnapshot(
      state => state.core.userAccount.preferred_username
    );
    let orgIds = this.store.selectSnapshot(state => state.core.filteredBuyers);
    orgIds = orgIds.map(org => org.id);

    let filters = {
      ...getState().filters,
      buyerId:
        getState().filters.buyerId.length === 0
          ? orgIds.slice(0, 10)
          : getState().filters.buyerId.map(buyer => buyer.id),
      sourceEmail: [username],
    };

    if (getState().aggregateFilters != null) {
      filters = {
        ...filters,
        ...getState().aggregateFilters,
      };
    }

    filters.dateReceived = getState().needsDefaultDateRange
      ? this.pageHelperService.getDateRange(31)
      : getState().filters.dateReceived;

    const requestBody: SearchBodyRequest = this.documentSearchHelperService.getSearchRequestBody({
      sourceId: SearchContext.AvidSuite,
      filters,
      sortField:
        Object.keys(getState().sortedColumnData).length > 0
          ? Object.keys(getState().sortedColumnData)[0]
          : '',
      sortDirection:
        Object.keys(getState().sortedColumnData).length > 0
          ? Object.values(getState().sortedColumnData)[0]
          : null,
      page: getState().pageNumber,
      pageSize: 30,
    });

    return this.xdcService.postArchive(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((invoices: Document[]) => {
        patchState({
          invoices: getState().pageNumber > 1 ? [...getState().invoices, ...invoices] : invoices,
          loadMoreHidden: false,
          pageNumber: getState().pageNumber + 1,
        });

        if (!getState().scrollPosition.every(val => val === 0)) {
          dispatch(new actions.ScrollToPosition());
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          patchState({
            loadMoreHidden: true,
          });

          if (getState().pageNumber === 1) {
            patchState({ invoices: [] });
          }
        }
        throw err;
      })
    );
  }

  @Action(actions.QueryBuyerLookAhead)
  queryBuyerLookAhead(
    { patchState }: StateContext<DocumentStateModel>,
    { searchValue }: actions.QueryBuyerLookAhead
  ): Observable<Document[]> {
    const orgIds = this.store.selectSnapshot(state => state.core.orgIds);

    const requestBody: AggregateBodyRequest =
      this.documentSearchHelperService.getAggregateRequestBody({
        sourceId: SearchContext.AvidSuite,
        groupBy: [AdvancedFiltersKeys.BuyerName, AdvancedFiltersKeys.SourceSystemBuyerId],
        applyFields: [
          {
            ParameterName: 'buyerName',
            ParameterValue: searchValue,
            Function: SearchApplyFunction.Contains,
            Alias: 'buyer',
          },
        ],
        filters: {
          sourceSystemBuyerId: orgIds,
          indexingSolutionId: ['2'],
          portalStatus: ['active'],
        },
        resultFilters: [
          {
            ParameterName: 'buyer',
            ParameterValue: '1',
            Operation: '==',
            Chain: null,
          },
        ],
      });

    return this.bkwService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((invoices: Document[]) => {
        let buyers: Buyer[] = [];

        buyers = invoices.map(inv => ({
          id: inv.sourceSystemBuyerId,
          name: inv.buyerName.toUpperCase(),
        }));
        patchState({ buyers });
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.QueryAllBuyersLookAhead)
  queryAllBuyersLookAhead(
    { patchState }: StateContext<DocumentStateModel>,
    { searchValue }: actions.QueryAllBuyersLookAhead
  ): Observable<Document[]> {
    const requestBody: AggregateBodyRequest =
      this.documentSearchHelperService.getAggregateRequestBody({
        sourceId: SearchContext.AvidSuite,
        groupBy: [AdvancedFiltersKeys.BuyerName, AdvancedFiltersKeys.SourceSystemBuyerId],
        applyFields: [
          {
            ParameterName: 'buyerName',
            ParameterValue: searchValue,
            Function: SearchApplyFunction.Contains,
            Alias: 'buyer',
          },
        ],
        filters: {
          indexingSolutionId: ['2'],
          portalStatus: ['active'],
        },
        resultFilters: [
          {
            ParameterName: 'buyer',
            ParameterValue: '1',
            Operation: '==',
            Chain: null,
          },
        ],
      });

    return this.bkwService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((response: Document[]) => {
        const filteredBuyers = this.store.selectSnapshot(state => state.core.filteredBuyers);
        const buyers = response
          .filter(
            res => filteredBuyers.findIndex(buyer => buyer.id === res.sourceSystemBuyerId) === -1
          )
          .map(res => ({
            id: res.sourceSystemBuyerId,
            name: res.buyerName.toUpperCase(),
          }));

        patchState({ buyers });
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.SetFilteredBuyers)
  setFilteredBuyers(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { filteredBuyers }: actions.SetFilteredBuyers
  ): void {
    patchState({
      filters: {
        ...getState().filters,
        buyerId: filteredBuyers,
      },
      defaultPageFilters: {
        ...getState().defaultPageFilters,
        buyerId: filteredBuyers,
      },
      filteredBuyers,
      pageNumber: defaults.pageNumber,
    });
  }

  @Action(actions.SetAdvanceFilters)
  setAdvanceFilters(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { filters, newFilters }: actions.SetAdvanceFilters
  ): Observable<DocumentReduce[]> {
    const filteredBuyers = this.store.selectSnapshot(state => state.core.filteredBuyers);
    const excludedKeys = [
      AdvancedFiltersKeys.BuyerId,
      AdvancedFiltersKeys.DateReceived,
      AdvancedFiltersKeys.DateSubmitted,
      AdvancedFiltersKeys.EscalationCategoryIssue,
      AdvancedFiltersKeys.EscalationLevel,
      AdvancedFiltersKeys.IngestionType,
      AdvancedFiltersKeys.IsSubmitted,
    ];
    const applyFields = [];
    const resultFilters = [];
    const keys = [];

    Object.keys(newFilters)
      .filter(key => !excludedKeys.some(excludedKey => key === excludedKey))
      .forEach(key => {
        applyFields.push({
          ParameterName: key,
          ParameterValue: newFilters[key][0],
          Function: SearchApplyFunction.Contains,
          Alias: `${key}Flag`,
        });
        resultFilters.push({
          ParameterName: `${key}Flag`,
          ParameterValue: '1',
          Operation: '==',
          Chain: null,
        });
        keys.push(key);
      });

    const requestBody: AggregateBodyRequest =
      this.documentSearchHelperService.getMultipleContainsAggregateRequest(
        SearchContext.AvidSuite,
        {
          ...getState().defaultPageFilters,
          buyerId:
            getState().defaultPageFilters.buyerId.length === 0
              ? filteredBuyers.map(buyer => buyer.id)
              : getState().defaultPageFilters.buyerId,
        },
        applyFields,
        resultFilters,
        keys
      );

    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(res => {
        const aggregateFilters = keys.reduce((acc, key) => {
          const values = res.map(r => r[key]);

          return {
            ...acc,
            [key]: [...new Set(values)], // removing duplicates,
          };
        }, {});

        patchState({
          filters,
          aggregateFilters,
          filteredBuyers: filters.buyerId,
          pageNumber: defaults.pageNumber,
        });
      }),
      catchError((err: HttpErrorResponse) => {
        patchState({
          filters,
          aggregateFilters: null,
          filteredBuyers: filters.buyerId,
          pageNumber: defaults.pageNumber,
        });
        throw err;
      })
    );
  }

  @Action(actions.SetColumnSortedData)
  setColumnSortedData(
    { patchState }: StateContext<DocumentStateModel>,
    { columnData }: actions.SetColumnSortedData
  ): void {
    patchState({
      sortedColumnData: { [columnData.active]: columnData.direction as SortDirection },
      pageNumber: defaults.pageNumber,
    });
  }

  @Action(actions.SetScrollPosition)
  setScrollPosition(
    { patchState }: StateContext<DocumentStateModel>,
    { scrollPosition }: actions.SetScrollPosition
  ): void {
    patchState({
      scrollPosition,
    });
  }

  @Action(actions.ScrollToPosition)
  scrollToPosition({ getState, patchState }: StateContext<DocumentStateModel>): void {
    this.viewPort.scrollToPosition(getState().scrollPosition);
    patchState({
      scrollPosition: defaults.scrollPosition,
    });
  }

  @Action(actions.ResetPageNumber)
  resetPageNumber({ patchState }: StateContext<DocumentStateModel>): void {
    patchState({
      pageNumber: defaults.pageNumber,
    });
  }

  @Action(actions.SetSearchFields)
  setSearchFields(
    { patchState }: StateContext<DocumentStateModel>,
    { searchFields }: actions.SetSearchFields
  ): void {
    if (!searchFields.some(field => field === 'documentId')) {
      searchFields.push('documentId');
    }
    patchState({
      searchFields,
    });
  }

  @Action(actions.UpdateQueueInvoiceOnLock)
  updateQueueInvoiceOnLock(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { documentId, lockedBy }: actions.UpdateQueueInvoiceOnLock
  ): void {
    patchState({
      ...getState(),
      invoices: getState()
        .invoices.map(invoice => ({ ...invoice }))
        .map(invoice =>
          invoice.documentId === documentId
            ? {
                ...invoice,
                lockedBy,
              }
            : invoice
        ),
    });
  }

  @Action(actions.UpdateQueueInvoiceOnUnlock)
  updateQueueInvoiceOnUnlock(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateQueueInvoiceOnUnlock
  ): void {
    patchState({
      ...getState(),
      invoices: getState()
        .invoices.map(invoice => ({ ...invoice }))
        .map(invoice =>
          invoice.documentId === documentId
            ? {
                ...invoice,
                lockedBy: 'none',
              }
            : invoice
        ),
    });
  }

  @Action(actions.UpdateQueueOnInvoiceSubmit)
  updateQueueOnInvoiceSubmit(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateQueueOnInvoiceSubmit
  ): void {
    const updateInvoices = getState().invoices.filter(
      (invoice: Document) => invoice.documentId !== documentId
    );
    patchState({
      invoices: updateInvoices,
    });
  }

  @Action(actions.RemoveFilter)
  removeFilter(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { filterKey }: actions.RemoveFilter
  ): void {
    const filters = Object.keys(getState().filters)
      .filter(key => key !== filterKey)
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: getState().filters[key],
        }),
        {}
      ) as AdvancedFilter;

    const aggregateFilters = getState().aggregateFilters
      ? (Object.keys(getState().aggregateFilters)
          .filter(key => key !== filterKey)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: getState().aggregateFilters[key],
            }),
            {}
          ) as AdvancedFilter)
      : null;

    patchState({ filters, aggregateFilters, pageNumber: defaults.pageNumber });
  }

  @Action(actions.EnablePageRefresh)
  enablePageRefresh({ patchState }: StateContext<DocumentStateModel>): void {
    patchState({ canRefreshPage: true });
  }

  @Action(actions.DisablePageRefresh)
  disablePageRefresh({ patchState }: StateContext<DocumentStateModel>): void {
    patchState({ canRefreshPage: false });
  }

  @Action(actions.BatchDeletion)
  batchDeletion(
    _: StateContext<DocumentStateModel>,
    { documentIds }: actions.BatchDeletion
  ): Observable<void> {
    const batch: BatchEscalationRequest = {
      docIds: documentIds,
      escalation: {
        category: {
          issue: EscalationCategoryTypes.RecycleBin,
          reason: escalationCategoryReasonTypes.reason.Other,
        },
        description: 'Document deleted via mass deletion.',
        escalationLevel: EscalationLevelTypes.InternalXdc,
        resolution: '',
      },
    };

    return this.xdcService.postMassEscalation(batch).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(() => this.toastService.success('Files were deleted.')),
      catchError(err => {
        this.toastService.error('Files failed to delete.');
        throw err;
      })
    );
  }

  @Action(actions.BatchDownload)
  batchDownload(
    { dispatch }: StateContext<DocumentStateModel>,
    { documents }: actions.BatchDownload
  ): Observable<void> {
    const zipFolder = JSZip();

    return from(documents).pipe(
      tap(() => dispatch(new HttpRequestActive())),
      mergeMap(document => this.xdcService.getFile(document.documentId)),
      map((blob, i) => {
        const fileName = documents[i].fileName;

        zipFolder.file(fileName, blob);
      }),
      finalize(() => {
        zipFolder
          .generateAsync({ type: 'blob' })
          .then(content => fs.saveAs(content, `batchDownload.zip`));
        dispatch(new HttpRequestComplete());
      })
    );
  }
}
