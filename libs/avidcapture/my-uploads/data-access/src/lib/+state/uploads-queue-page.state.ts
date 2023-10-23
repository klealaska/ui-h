import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  RetryStrategyService,
  SocketService,
  UpdateRecycleBinQueueCount,
  UpdateUploadsQueueCount,
} from '@ui-coe/avidcapture/core/data-access';
import {
  BuyerKeywordService,
  DocumentSearchHelperService,
  InvoiceIngestionService,
  PageHelperService,
  ToastService,
  XdcService,
} from '@ui-coe/avidcapture/core/util';
import { DocumentState, DocumentStateModel } from '@ui-coe/avidcapture/shared/data-access';
import {
  AdvancedFiltersKeys,
  AggregateBodyRequest,
  Buyer,
  Document,
  EscalationCategoryTypes,
  IngestionTypes,
  PendingUploadDocument,
  PendingUploadStatus,
  SearchApplyFunction,
  SearchContext,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';
import { Observable, catchError, of, retry, tap } from 'rxjs';

import * as actions from './uploads-queue-page.actions';

const defaults: DocumentStateModel = {
  invoices: [],
  buyers: [],
  filteredBuyers: [],
  filters: {
    buyerId: [],
    escalationCategoryIssue: [EscalationCategoryTypes.None],
    ingestionType: [IngestionTypes.Api],
    isSubmitted: [0],
  },
  defaultPageFilters: {
    buyerId: [],
    escalationCategoryIssue: [EscalationCategoryTypes.None],
    ingestionType: [IngestionTypes.Api],
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
  queuesNotAllowedList: [],
  isUploadSuccessful: false,
  uploadedDocumentMessages: [],
  searchByFileNameValue: '',
};

@State<DocumentStateModel>({
  name: 'uploadsQueuePage',
  defaults,
})
@Injectable()
export class UploadsQueuePageState extends DocumentState {
  constructor(
    protected xdcService: XdcService,
    protected retryStrategyService: RetryStrategyService,
    protected documentSearchHelperService: DocumentSearchHelperService,
    protected pageHelperService: PageHelperService,
    protected bkwService: BuyerKeywordService,
    protected toastService: ToastService,
    protected viewPort: ViewportScroller,
    protected store: Store,
    private invoiceIngestionService: InvoiceIngestionService,
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

  @Action(actions.QueryUploadedInvoices, { cancelUncompleted: true })
  queryUploadedInvoices(ctx: StateContext<DocumentStateModel>): Observable<Document[]> {
    return super
      .queryDocuments(ctx)
      .pipe(tap(() => ctx.dispatch(new actions.QueryAllPendingDocuments())));
  }

  @Action(actions.SetSourceEmail)
  setSourceEmail(ctx: StateContext<DocumentStateModel>, { email }: actions.SetSourceEmail): void {
    ctx.patchState({
      filters: {
        ...ctx.getState().filters,
        sourceEmail: [email],
      },
    });
  }

  @Action(actions.SetColumnSortedData)
  setColumnSortedData(
    ctx: StateContext<DocumentStateModel>,
    { columnData }: actions.SetColumnSortedData
  ): void {
    super.setColumnSortedData(ctx, { columnData });
    ctx.dispatch(new actions.QueryUploadedInvoices());
  }

  @Action(actions.ResetPageNumber)
  resetPageNumber(ctx: StateContext<DocumentStateModel>): void {
    super.resetPageNumber(ctx);
  }

  @Action(actions.EnablePageRefresh)
  enablePageRefresh(ctx: StateContext<DocumentStateModel>): void {
    super.enablePageRefresh(ctx);
  }

  @Action(actions.DisablePageRefresh)
  disablePageRefresh(ctx: StateContext<DocumentStateModel>): void {
    super.disablePageRefresh(ctx);
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

  @Action(actions.UpdateMyUploadsInvoiceSubmit)
  updateMyUploadsInvoiceSubmit(
    ctx: StateContext<DocumentStateModel>,
    { documentId }: actions.UpdateMyUploadsInvoiceSubmit
  ): void {
    super.updateQueueOnInvoiceSubmit(ctx, { documentId });
  }

  @Action(actions.UploadDocument)
  uploadDocument(
    { dispatch, getState, patchState }: StateContext<DocumentStateModel>,
    { file, organizationId, correlationId }: actions.UploadDocument
  ): Observable<void> {
    const sourceEmail = this.store.selectSnapshot(
      state => state.core.userAccount.preferred_username
    );

    return this.invoiceIngestionService
      .uploadInvoice(file, null, organizationId, sourceEmail, correlationId)
      .pipe(
        tap(() => {
          const pendingDocument: PendingUploadDocument = {
            correlationId,
            buyerId: organizationId,
            username: sourceEmail,
            fileName: file.name,
          };

          patchState({
            isUploadSuccessful: true,
            uploadedDocumentMessages: [
              ...getState().uploadedDocumentMessages,
              { fileName: file.name, successful: true },
            ],
          });

          dispatch(new actions.CreatePendingUpload([pendingDocument]));
        }),
        catchError((err: HttpErrorResponse) => {
          patchState({
            isUploadSuccessful: false,
            uploadedDocumentMessages: [
              ...getState().uploadedDocumentMessages,
              { fileName: file.name, successful: false },
            ],
          });
          throw err;
        })
      );
  }

  @Action(actions.QueryAllPendingDocuments)
  queryAllPendingDocuments({
    getState,
    patchState,
  }: StateContext<DocumentStateModel>): Observable<any> {
    const username = this.store.selectSnapshot(state => state.core.userAccount.preferred_username);

    return this.xdcService.getAllPendingDocuments(username).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(pendingDocuments => {
        const pendingInvoices: Document[] = pendingDocuments.map(doc => {
          const dateReceived = DateTime.local().toMillis() / 1000;
          const filteredBuyers = this.store.selectSnapshot(state => state.core.filteredBuyers);
          const buyer = filteredBuyers.find(buyer => buyer.id === doc.buyerId);
          // capitalizing each word in buyer name
          const buyerName = buyer.name
            .toLowerCase()
            .split(' ')
            .map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
            .join(' ');

          return {
            documentId: doc.correlationId,
            fileName: doc.fileName,
            dateReceived: dateReceived.toString(),
            uploadStatus: PendingUploadStatus.Pending,
            buyerName,
          };
        });

        patchState({
          invoices: [...pendingInvoices, ...getState().invoices],
        });
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  @Action(actions.CreatePendingUpload)
  createPendingUpload(
    { getState, patchState }: StateContext<DocumentStateModel>,
    { documents }: actions.CreatePendingUpload
  ): Observable<void> {
    const dateReceived = DateTime.local().toMillis() / 1000;
    const filteredBuyers = this.store.selectSnapshot(state => state.core.filteredBuyers);

    return this.xdcService.postCreatePendingUpload(documents).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(() => {
        const invoices = getState().invoices;
        const pendingInvoices: Document[] = documents.map(doc => {
          const buyer = filteredBuyers.find(buyer => buyer.id === doc.buyerId);
          // capitalizing each word in buyer name
          const buyerName = buyer.name
            .toLowerCase()
            .split(' ')
            .map(word => `${word.charAt(0).toUpperCase()}${word.substring(1)}`)
            .join(' ');

          return {
            documentId: doc.correlationId,
            fileName: doc.fileName,
            dateReceived: dateReceived.toString(),
            uploadStatus: PendingUploadStatus.Pending,
            buyerName,
          };
        });

        patchState({
          invoices: [...pendingInvoices, ...invoices],
        });
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.UpdatePendingUploadDocument)
  updatePendingUploadDocument(
    { dispatch, getState, patchState }: StateContext<DocumentStateModel>,
    { correlationId, documentId }: actions.UpdatePendingUploadDocument
  ): void {
    patchState({
      invoices: getState()
        .invoices.map(invoice => ({ ...invoice }))
        .map(invoice =>
          invoice.documentId === correlationId
            ? {
                ...invoice,
                documentId,
                uploadStatus: PendingUploadStatus.Completed,
              }
            : invoice
        ),
    });

    dispatch(new UpdateUploadsQueueCount());
  }

  @Action(actions.SetUploadsPageSignalEvents)
  setUploadsPageSignalEvents({ dispatch }: StateContext<DocumentStateModel>): void {
    const hubConnection = this.store.selectSnapshot(state => state.core.hubConnection);

    if (hubConnection != null) {
      hubConnection.on('onPendingUploadComplete', (correlationId: string, documentId: string) =>
        dispatch(new actions.UpdatePendingUploadDocument(correlationId, documentId))
      );
    }
  }

  @Action(actions.FilterByInvoiceName, { cancelUncompleted: true })
  filterByInvoiceName(
    { dispatch, getState, patchState }: StateContext<DocumentStateModel>,
    { searchValue }: actions.FilterByInvoiceName
  ): Observable<Document[]> {
    const orgIds = this.store.selectSnapshot(state => state.core.filteredBuyers);
    const requestBody: AggregateBodyRequest =
      this.documentSearchHelperService.getMultipleContainsAggregateRequest(
        SearchContext.AvidSuite,
        {
          ...getState().filters,
          buyerId: orgIds.map((buyer: Buyer) => buyer.id),
        },
        [
          {
            ParameterName: AdvancedFiltersKeys.FileName,
            ParameterValue: searchValue,
            Function: SearchApplyFunction.Contains,
            Alias: `${AdvancedFiltersKeys.FileName}Flag`,
          },
        ],
        [
          {
            ParameterName: `${AdvancedFiltersKeys.FileName}Flag`,
            ParameterValue: '1',
            Operation: '==',
            Chain: null,
          },
        ],
        [AdvancedFiltersKeys.FileName]
      );
    return this.xdcService.postAggregateSearch(requestBody).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap(response => {
        const values = response.map(r => r[AdvancedFiltersKeys.FileName]);

        patchState({
          filters: { ...getState().filters, fileName: [...new Set(values)] },
          aggregateFilters: { fileName: [...new Set(values)] },
          pageNumber: defaults.pageNumber,
          searchByFileNameValue: searchValue,
        });
        dispatch([new actions.QueryUploadedInvoices(), new UpdateUploadsQueueCount()]);
      }),
      catchError((err: HttpErrorResponse) => {
        patchState({
          aggregateFilters: null,
          filters: {
            ...getState().filters,
            fileName: searchValue ? [searchValue] : [],
          },
          pageNumber: defaults.pageNumber,
          searchByFileNameValue: searchValue,
        });
        dispatch([new actions.QueryUploadedInvoices(), new UpdateUploadsQueueCount()]);
        throw err;
      })
    );
  }

  @Action(actions.ClearUploadedDocumentMessages)
  clearUploadedDocumentMessages({ patchState }: StateContext<DocumentStateModel>): void {
    patchState({
      uploadedDocumentMessages: [],
    });
  }

  @Action(actions.BatchDeletion, { cancelUncompleted: true })
  batchUploadsDeletion(
    ctx: StateContext<DocumentStateModel>,
    { documentIds }: actions.BatchDeletion
  ): Observable<void> {
    return super.batchDeletion(ctx, { documentIds }).pipe(
      tap(() => {
        ctx.patchState({
          invoices: ctx.getState().invoices.filter(inv => !documentIds.includes(inv.documentId)),
        });

        ctx.dispatch([new UpdateUploadsQueueCount(), new UpdateRecycleBinQueueCount()]);
      })
    );
  }

  @Action(actions.BatchDownload, { cancelUncompleted: true })
  batchUploadsDownload(
    ctx: StateContext<DocumentStateModel>,
    { documents }: actions.BatchDownload
  ): Observable<void> {
    return super.batchDownload(ctx, { documents });
  }
}
