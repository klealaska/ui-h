import {
  compositeDataStub,
  fieldBaseStub,
  fieldControlStub,
  getAggregateBodyRequest,
  getCompositeDataStub,
} from '@ui-coe/avidcapture/shared/test';
import { AppPages, InvoiceTypes, SkipDocumentDirection } from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import * as archiveInvoicePageActions from './archive-invoice-page.actions';
import { ArchiveInvoicePageState } from './archive-invoice-page.state';

describe('ArchiveInvoicePageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const xdcServiceStub = {
    getArchivedDocument: jest.fn(),
    getSkipUnindexedDocument: jest.fn(),
  };
  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };

  const toastServiceStub = {
    warning: jest.fn(),
  };

  const docFieldServiceStub = {
    getFormFieldMetaData: jest.fn(),
    parseFieldMetaData: jest.fn(),
  };
  const indexingHelperServiceStub = {
    assignValuesToFields: jest.fn(),
    createLabelColors: jest.fn(),
    getNextDocumentRequestBody: jest.fn(),
    handleNoMoreInvoices: jest.fn(),
  };
  const pageHelperServiceStub = {
    getPdfFileRequest: jest.fn(),
  };
  const routerStub = {
    navigate: jest.fn(),
  };
  const storeStub = {
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          token: 'token',
          currentPage: AppPages.Archive,
        },
      })
    ),
    snapshot: jest.fn(),
  };

  const formatterServiceStub = {
    getFormattedFieldValue: jest.fn(),
  };
  const environmentStub = {
    apiBaseUri: 'http://idcapi.avidxchange.com/',
  } as any;

  const archiveInvoicePageState = new ArchiveInvoicePageState(
    xdcServiceStub as any,
    retryServiceStub as any,
    docFieldServiceStub as any,
    indexingHelperServiceStub as any,
    pageHelperServiceStub as any,
    routerStub as any,
    storeStub as any,
    toastServiceStub as any,
    formatterServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () => {
      const document = getCompositeDataStub();

      expect(ArchiveInvoicePageState.data({ document } as any)).toStrictEqual({ document });
    });
  });

  describe('Action: InitArchiveInvoicePage', () => {
    describe('when document data already exists', () => {
      const document = getCompositeDataStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ document });
        archiveInvoicePageState.initArchiveInvoicePage(stateContextStub, {
          documentId: '1',
        });
      });

      it('should dispatch QueryArchivedDocument action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.QueryArchivedDocument('1')
        ));
    });

    describe('when document data does not exists', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ document: null });
        archiveInvoicePageState.initArchiveInvoicePage(stateContextStub, {
          documentId: '1',
        });
      });

      it('should dispatch QueryArchivedDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.QueryArchivedDocument('1')
        ));
    });
  });

  describe('Action: QueryArchivedDocument', () => {
    describe('when data is received', () => {
      const document = getCompositeDataStub();

      beforeEach(() => {
        pageHelperServiceStub.getPdfFileRequest.mockReturnValue({
          url: `${environmentStub.apiBaseUri}api/file/1`,
          httpHeaders: { Authorization: `Bearer token` },
          withCredentials: true,
        });
        xdcServiceStub.getArchivedDocument.mockReturnValue(of(document));
        indexingHelperServiceStub.createLabelColors.mockReturnValue([]);
        archiveInvoicePageState
          .queryArchivedDocument(stateContextStub, { documentId: '1' })
          .subscribe();
      });

      it('should of called xdcService getArchivedDocument api', () =>
        expect(xdcServiceStub.getArchivedDocument).toHaveBeenNthCalledWith(1, '1'));

      it('should patchState with archivedInvoicesStub', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          document,
          pdfFile: {
            url: `${environmentStub.apiBaseUri}api/file/1`,
            httpHeaders: { Authorization: `Bearer token` },
            withCredentials: true,
          },
          labelColors: [],
        }));

      it('should dispatch QueryDocumentFormFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.QueryDocumentFormFields(InvoiceTypes.Standard)
        ));
    });

    describe('when receiving a 404', () => {
      beforeEach(() => {
        xdcServiceStub.getArchivedDocument.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState with empty array', done => {
        archiveInvoicePageState
          .queryArchivedDocument(stateContextStub, { documentId: '1' })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(toastServiceStub.warning).toHaveBeenNthCalledWith(
                1,
                `We're sorry, but you do not have access to this area of the application.`
              );
              expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Archive]);

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryDocumentFormFields', () => {
    describe('when formMetaData returns successfully', () => {
      beforeEach(() => {
        docFieldServiceStub.getFormFieldMetaData.mockReturnValue(
          of([{ fields: fieldControlStub }])
        );
        archiveInvoicePageState
          .queryDocumentFormFields(stateContextStub, {
            selectedInvoiceType: InvoiceTypes.Standard,
          })
          .subscribe();
      });

      it('should call docFieldService.getFormFieldMetaData function', () =>
        expect(docFieldServiceStub.getFormFieldMetaData).toHaveBeenCalled());

      it('should patchState for formFields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formFields: fieldControlStub,
        }));

      it('should dispatch ParseDocumentFormFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.ParseDocumentFormFields(InvoiceTypes.Standard)
        ));
    });
    describe('when formMetaData returns an empty array', () => {
      beforeEach(() => {
        docFieldServiceStub.getFormFieldMetaData.mockReturnValue(of([]));
        archiveInvoicePageState
          .queryDocumentFormFields(stateContextStub, {
            selectedInvoiceType: InvoiceTypes.Standard,
          })
          .subscribe();
      });

      it('should call docFieldService.getFormFieldMetaData function', () =>
        expect(docFieldServiceStub.getFormFieldMetaData).toHaveBeenCalledTimes(1));

      it('should patchState undefined for formFields', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          formFields: undefined,
        }));

      it('should dispatch ParseDocumentFormFields action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.ParseDocumentFormFields(InvoiceTypes.Standard)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        docFieldServiceStub.getFormFieldMetaData.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should throw an error toast', done => {
        archiveInvoicePageState
          .queryDocumentFormFields(stateContextStub, {
            selectedInvoiceType: InvoiceTypes.Standard,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              done();
            },
          });
      });
    });
  });

  describe('Action: ParseDocumentFormFields', () => {
    const document = getCompositeDataStub();

    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        formFields: fieldControlStub,
        document,
        labelColors: [],
      });
      docFieldServiceStub.parseFieldMetaData.mockReturnValue(of({}));
      formatterServiceStub.getFormattedFieldValue.mockReturnValue('value');
      indexingHelperServiceStub.assignValuesToFields.mockReturnValue(fieldBaseStub);
      archiveInvoicePageState
        .parseDocumentFormFields(stateContextStub, {
          selectedInvoiceType: InvoiceTypes.Standard,
        })
        .subscribe();
    });

    it('should call docFieldService.parseFieldMetaData function', () =>
      expect(docFieldServiceStub.parseFieldMetaData).toHaveBeenNthCalledWith(
        1,
        InvoiceTypes.Standard,
        fieldControlStub
      ));

    it('should call formatterService', () => {
      expect(formatterServiceStub.getFormattedFieldValue).toHaveBeenNthCalledWith(
        1,
        fieldBaseStub[0],
        fieldBaseStub[0].value
      );
    });

    it('should patchState for fields & formGroupInstance', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        fields: fieldBaseStub,
      }));
  });

  describe('Action: updateFontFace', () => {
    beforeEach(() => {
      archiveInvoicePageState.updateFontFace(stateContextStub, { updateFontFace: true });
    });
    it('should patch updateFontFace', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { updateFontFace: true });
    });
  });

  describe('Ation: SkipToPreviousDocument', () => {
    describe('when get a success call', () => {
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockName',
          },
          token: '',
          currentPage: AppPages.Archive,
        },
      } as any;

      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
      const documentStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(of(documentStub));
        archiveInvoicePageState
          .skipToPreviousDocument(stateContextStub, { documentId: '44' })
          .subscribe();
      });

      it('should call the indexerHelperService getNextDocumentRequestBody fn', () =>
        expect(indexingHelperServiceStub.getNextDocumentRequestBody).toHaveBeenNthCalledWith(
          1,
          storeMock
        ));

      it('should call the xdcservice getSkipUnindexedDocument fn', () =>
        expect(xdcServiceStub.getSkipUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockName',
          '44',
          SkipDocumentDirection.Previous,
          searchBodyRequestStub,
          true
        ));

      it('should patch Defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          document: null,
          pdfFile: null,
          formFields: [],
          fields: [],
          labelColors: expect.anything(),
          updateFontFace: false,
        }));

      it('should dispatch the Action HandleNextDocumentGiven', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.HandleNextDocumentGiven(documentStub)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should throw an error toast', done => {
        archiveInvoicePageState
          .skipToPreviousDocument(stateContextStub, {
            documentId: '44',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Ation: SkipToNextDocument', () => {
    describe('when get a success call', () => {
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockName',
          },
          token: '',
          currentPage: AppPages.Archive,
        },
      } as any;

      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
      const documentStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(of(documentStub));
        archiveInvoicePageState
          .skipToNextDocument(stateContextStub, { documentId: '44' })
          .subscribe();
      });

      it('should call the indexerHelperService getNextDocumentRequestBody fn', () =>
        expect(indexingHelperServiceStub.getNextDocumentRequestBody).toHaveBeenNthCalledWith(
          1,
          storeMock
        ));

      it('should call the xdcservice getSkipUnindexedDocument fn', () =>
        expect(xdcServiceStub.getSkipUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockName',
          '44',
          SkipDocumentDirection.Next,
          searchBodyRequestStub,
          true
        ));

      it('should patch Defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          document: null,
          pdfFile: null,
          formFields: [],
          fields: [],
          labelColors: expect.anything(),
          updateFontFace: false,
        }));

      it('should dispatch the Action HandleNextDocumentGiven', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.HandleNextDocumentGiven(documentStub)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should throw an error toast', done => {
        archiveInvoicePageState
          .skipToNextDocument(stateContextStub, {
            documentId: '44',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);

              done();
            },
          });
      });
    });
  });

  describe('Action: HandleNextDocumentGiven', () => {
    describe('when getting next document successfully', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              orgIds: [],
              userAccount: {
                preferred_username: 'mockName',
                name: 'mockName',
              },
              token: '',
            },
          })
        );

        pageHelperServiceStub.getPdfFileRequest.mockReturnValue({
          url: `api/file/1`,
          httpHeaders: { Authorization: `Bearer token` },
          withCredentials: true,
        });

        archiveInvoicePageState.handleNextDocumentGiven(stateContextStub, {
          document: compositeDataStub,
        });
      });

      it('should navigate you to the indexing page', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['archive', '1']));

      it('should patchState for compositeData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          document: compositeDataStub,
          pdfFile: {
            url: `api/file/1`,
            httpHeaders: { Authorization: `Bearer token` },
            withCredentials: true,
          },
          labelColors: [],
        }));

      it('should dispatch QueryDocumentFormFields', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new archiveInvoicePageActions.QueryDocumentFormFields(InvoiceTypes.Standard)
        );
      });
    });
  });
});
