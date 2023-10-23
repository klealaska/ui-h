import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { RetryStrategyService } from '@ui-coe/avidcapture/core/data-access';
import {
  FormatterService,
  PageHelperService,
  ToastService,
  XdcService,
} from '@ui-coe/avidcapture/core/util';
import { FieldService, IndexingHelperService } from '@ui-coe/avidcapture/indexing/util';
import {
  CompositeDocument,
  DocumentLabelKeys,
  FieldBase,
  Fields,
  SearchBodyRequest,
  SkipDocumentDirection,
} from '@ui-coe/avidcapture/shared/types';
import { documentLabelColors } from '@ui-coe/avidcapture/shared/util';
import { Observable, of } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';

import * as actions from './archive-invoice-page.actions';
import { ArchiveInvoicePageStateModel } from './archive-invoice-page.model';

const defaults: ArchiveInvoicePageStateModel = {
  document: null,
  pdfFile: null,
  formFields: [],
  fields: [],
  labelColors: documentLabelColors,
  updateFontFace: false,
};

@State<ArchiveInvoicePageStateModel>({
  name: 'archiveInvoicePage',
  defaults,
})
@Injectable()
export class ArchiveInvoicePageState {
  constructor(
    private xdcService: XdcService,
    private retryStrategyService: RetryStrategyService,
    private docFieldService: FieldService,
    private indexingHelperService: IndexingHelperService,
    private pageHelperService: PageHelperService,
    private router: Router,
    private store: Store,
    private toast: ToastService,
    private formatterService: FormatterService
  ) {}

  @Selector()
  static data(state: ArchiveInvoicePageStateModel): ArchiveInvoicePageStateModel {
    return state;
  }

  @Action(actions.InitArchiveInvoicePage)
  initArchiveInvoicePage(
    { dispatch, getState }: StateContext<ArchiveInvoicePageStateModel>,
    { documentId }: actions.InitArchiveInvoicePage
  ): void {
    if (getState().document == null) {
      dispatch(new actions.QueryArchivedDocument(documentId));
    }
  }

  @Action(actions.QueryArchivedDocument)
  queryArchivedDocument(
    { dispatch, patchState }: StateContext<ArchiveInvoicePageStateModel>,
    { documentId }: actions.QueryArchivedDocument
  ): Observable<CompositeDocument> {
    const token = this.store.selectSnapshot(state => state.core.token);

    return this.xdcService.getArchivedDocument(documentId).pipe(
      retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
      tap((document: CompositeDocument) => {
        const invoiceTypeLabel = document.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
        );
        const labelColors = this.indexingHelperService.createLabelColors(document.indexed);

        this.router.navigate(['archive', documentId]);

        patchState({
          document,
          pdfFile: this.pageHelperService.getPdfFileRequest(document.indexed.documentId, token),
          labelColors,
        });

        dispatch(new actions.QueryDocumentFormFields(invoiceTypeLabel.value.text));
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 404) {
          const currentPage = this.store.selectSnapshot(state => state.core.currentPage);
          const toastMessage = `We're sorry, but you do not have access to this area of the application.`;

          this.toast.warning(toastMessage);
          this.router.navigate([currentPage]);
        }

        throw err;
      })
    );
  }

  @Action(actions.QueryDocumentFormFields)
  queryDocumentFormFields(
    { dispatch, patchState }: StateContext<ArchiveInvoicePageStateModel>,
    { selectedInvoiceType }: actions.QueryDocumentFormFields
  ): Observable<Fields[]> {
    return this.docFieldService.getFormFieldMetaData().pipe(
      tap((fields: Fields[]) => {
        patchState({
          formFields: fields[0]?.fields,
        });
        dispatch(new actions.ParseDocumentFormFields(selectedInvoiceType));
      }),
      catchError((err: HttpErrorResponse) => {
        throw err;
      })
    );
  }

  @Action(actions.ParseDocumentFormFields)
  parseDocumentFormFields(
    { getState, patchState }: StateContext<ArchiveInvoicePageStateModel>,
    { selectedInvoiceType }: actions.ParseDocumentFormFields
  ): Observable<FieldBase<string>[]> {
    return this.docFieldService.parseFieldMetaData(selectedInvoiceType, getState().formFields).pipe(
      tap(parsedFields => {
        let fields = this.indexingHelperService.assignValuesToFields(
          parsedFields,
          getState().document.indexed
        );

        fields = fields.map(field => {
          return {
            ...field,
            value: this.formatterService.getFormattedFieldValue(field, field.value),
          };
        });

        patchState({
          fields,
        });
      })
    );
  }

  @Action(actions.UpdateFontFace)
  updateFontFace(
    { patchState }: StateContext<ArchiveInvoicePageStateModel>,
    { updateFontFace }: actions.UpdateFontFace
  ): void {
    patchState({ updateFontFace });
  }

  @Action(actions.SkipToNextDocument, { cancelUncompleted: true })
  skipToNextDocument(
    { dispatch, setState }: StateContext<ArchiveInvoicePageStateModel>,
    { documentId }: actions.SkipToNextDocument
  ): Observable<CompositeDocument> {
    const store = this.store.snapshot();
    const username = store.core.userAccount.preferred_username;
    const requestBody: SearchBodyRequest =
      this.indexingHelperService.getNextDocumentRequestBody(store);
    return this.xdcService
      .getSkipUnindexedDocument(username, documentId, SkipDocumentDirection.Next, requestBody, true)
      .pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((document: CompositeDocument) => {
          setState({ ...defaults });
          dispatch(new actions.HandleNextDocumentGiven(document));
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.indexingHelperService.handleNoMoreInvoices();
          }
          throw err;
        })
      );
  }

  @Action(actions.SkipToPreviousDocument, { cancelUncompleted: true })
  skipToPreviousDocument(
    { dispatch, setState }: StateContext<ArchiveInvoicePageStateModel>,
    { documentId }: actions.SkipToPreviousDocument
  ): Observable<CompositeDocument> {
    const store = this.store.snapshot();
    const username = store.core.userAccount.preferred_username;
    const requestBody: SearchBodyRequest =
      this.indexingHelperService.getNextDocumentRequestBody(store);
    return this.xdcService
      .getSkipUnindexedDocument(
        username,
        documentId,
        SkipDocumentDirection.Previous,
        requestBody,
        true
      )
      .pipe(
        retry({ count: 1, delay: err => this.retryStrategyService.retryApiCall(of(err)) }),
        tap((document: CompositeDocument) => {
          setState({ ...defaults });
          dispatch(new actions.HandleNextDocumentGiven(document));
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.indexingHelperService.handleNoMoreInvoices();
          }
          throw err;
        })
      );
  }

  @Action(actions.HandleNextDocumentGiven, { cancelUncompleted: true })
  handleNextDocumentGiven(
    { dispatch, patchState }: StateContext<ArchiveInvoicePageStateModel>,
    { document }: actions.HandleNextDocumentGiven
  ): void {
    const token = this.store.selectSnapshot(state => state.core.token);
    const invoiceTypeLabel = document.indexed.labels.find(
      lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
    );
    const labelColors = this.indexingHelperService.createLabelColors(document.indexed);

    this.router.navigate(['archive', document.indexed.documentId]);

    patchState({
      document,
      pdfFile: this.pageHelperService.getPdfFileRequest(document.indexed.documentId, token),
      labelColors,
    });

    dispatch(new actions.QueryDocumentFormFields(invoiceTypeLabel.value.text));
  }
}
