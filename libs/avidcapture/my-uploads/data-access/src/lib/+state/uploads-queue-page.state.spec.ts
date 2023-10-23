import {
  UpdateRecycleBinQueueCount,
  UpdateUploadsQueueCount,
} from '@ui-coe/avidcapture/core/data-access';
import { DocumentState } from '@ui-coe/avidcapture/shared/data-access';
import { getContainsAggregateBodyRequest, getDocuments } from '@ui-coe/avidcapture/shared/test';
import {
  AppPages,
  EscalationCategoryTypes,
  IngestionTypes,
  PendingUploadStatus,
  SearchApplyFunction,
  SearchContext,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import { QueryUploadedInvoices, UpdatePendingUploadDocument } from './uploads-queue-page.actions';
import { UploadsQueuePageState } from './uploads-queue-page.state';

describe('UploadsQueuePageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };

  const xdcServiceStub = {
    postSearch: jest.fn(),
    postAggregateSearch: jest.fn(),
    postCreatePendingUpload: jest.fn(),
    getAllPendingDocuments: jest.fn(),
    postMassEscalation: jest.fn(),
    getFile: jest.fn(),
  };

  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };
  const documentSearchHelperServiceStub = {
    getSearchRequestBody: jest.fn(),
    getAggregateRequestBody: jest.fn(),
    getColumnSortedData: jest.fn(),
    getContainsAggregateRequest: jest.fn(),
    getCountAggregateRequest: jest.fn(),
    getMultipleContainsAggregateRequest: jest.fn(),
  };
  const pageHelperServiceStub = {
    getDateRange: jest.fn(),
  };

  const bkwServiceStub = {
    postAggregateSearch: jest.fn(),
  };

  const toastServiceStub = {
    error: jest.fn(),
    success: jest.fn(),
  };

  const viewPortStub = {
    scrollToPosition: jest.fn(),
  };

  const storeStub = {
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          filteredBuyers: [{ id: '25', name: 'test' }],
          userAccount: {
            preferred_username: 'mock@mock.com',
          },
        },
      })
    ),
  };

  const invoiceIngestionServiceStub = {
    uploadInvoice: jest.fn(),
  };

  const socketServiceStub = {
    getQueueCount: jest.fn(),
  };

  const uploadsQueuePageState = new UploadsQueuePageState(
    xdcServiceStub as any,
    retryServiceStub as any,
    documentSearchHelperServiceStub as any,
    pageHelperServiceStub as any,
    bkwServiceStub as any,
    toastServiceStub as any,
    viewPortStub as any,
    storeStub as any,
    invoiceIngestionServiceStub as any,
    socketServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () =>
      expect(UploadsQueuePageState.data({ invoices: [getDocuments()[0]] } as any)).toStrictEqual({
        invoices: [getDocuments()[0]],
      }));
  });

  describe('Action: QueryUploadedInvoices', () => {
    const documentsStub = getDocuments();
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        invoices: [],
        pageNumber: 1,
        sortedColumnData: {},
        filters: {
          buyerId: [],
        },
        searchFields: [],
        scrollPosition: [0, 0],
        core: {
          orgIds: ['1'],
          currentPage: AppPages.RecycleBin,
        },
      });
      xdcServiceStub.postSearch.mockReturnValue(of(documentsStub));
    });

    it('should return documents', done => {
      uploadsQueuePageState.queryUploadedInvoices(stateContextStub).subscribe(val => {
        expect(val).toEqual(documentsStub);
        done();
      });
    });
  });

  describe('Action: SetSourceEmail', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        filters: {
          buyerId: [],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
        },
      });

      uploadsQueuePageState.setSourceEmail(stateContextStub, { email: 'mockEmail' });
    });

    it('should patchState for the filter of sourceEmail using passed in email param', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        filters: {
          buyerId: [],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
          sourceEmail: ['mockEmail'],
        },
      }));
  });

  describe('Action: SetColumnSortedData', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setColumnSortedData');
      documentSearchHelperServiceStub.getColumnSortedData.mockReturnValue({});
      uploadsQueuePageState.setColumnSortedData(stateContextStub, {
        columnData: { active: 'fileName', direction: SortDirection.Ascending },
      });
    });

    it('should call the parents setColumnSortedData method', () =>
      expect(DocumentState.prototype.setColumnSortedData).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { columnData: { active: 'fileName', direction: SortDirection.Ascending } }
      ));

    it('should dispatch QueryUploadedInvoices', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryUploadedInvoices()));
  });

  describe('Action: ResetPageNumber', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'resetPageNumber');
      uploadsQueuePageState.resetPageNumber(stateContextStub);
    });

    it('should call the parents resetPageNumber method', () =>
      expect(DocumentState.prototype.resetPageNumber).toHaveBeenNthCalledWith(1, stateContextStub));
  });

  describe('Action: SetScrollPosition', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'setScrollPosition');
      uploadsQueuePageState.setScrollPosition(stateContextStub, { scrollPosition: [0, 2000] });
    });

    it('should call the parents setScrollPosition method', () =>
      expect(DocumentState.prototype.setScrollPosition).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { scrollPosition: [0, 2000] }
      ));
  });

  describe('Action: ScrollToPosition', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'scrollToPosition');
      uploadsQueuePageState.scrollToPosition(stateContextStub);
    });

    it('should call the parents scrollToPosition method', () =>
      expect(DocumentState.prototype.scrollToPosition).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: EnablePageRefresh', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'enablePageRefresh').mockImplementation();
      uploadsQueuePageState.enablePageRefresh(stateContextStub);
    });

    it('should call the parents enablePageRefresh method', () =>
      expect(DocumentState.prototype.enablePageRefresh).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('Action: DisablePageRefresh', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'disablePageRefresh').mockImplementation();
      uploadsQueuePageState.disablePageRefresh(stateContextStub);
    });

    it('should call the parents disablePageRefresh method', () =>
      expect(DocumentState.prototype.disablePageRefresh).toHaveBeenNthCalledWith(
        1,
        stateContextStub
      ));
  });

  describe('UpdateQueueOnInvoiceSubmit', () => {
    beforeEach(() => {
      jest.spyOn(DocumentState.prototype, 'updateQueueOnInvoiceSubmit').mockImplementation();
      uploadsQueuePageState.updateMyUploadsInvoiceSubmit(stateContextStub, { documentId: '1' });
    });

    it('should call the parents updateQueueOnInvoiceSubmit method', () =>
      expect(DocumentState.prototype.updateQueueOnInvoiceSubmit).toHaveBeenNthCalledWith(
        1,
        stateContextStub,
        { documentId: '1' }
      ));
  });

  describe('Action: UploadDocument', () => {
    describe('on success', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          uploadedDocumentMessages: [],
        });
        invoiceIngestionServiceStub.uploadInvoice.mockReturnValueOnce(of(true));
        uploadsQueuePageState
          .uploadDocument(stateContextStub, {
            file: { name: 'name' } as any,
            organizationId: '25',
            correlationId: 'GUID-GOES-HERE',
          })
          .subscribe();
      });

      it('should call invoice ingestion services uploadInvoice fn', () =>
        expect(invoiceIngestionServiceStub.uploadInvoice).toHaveBeenNthCalledWith(
          1,
          { name: 'name' } as any,
          null,
          '25',
          'mock@mock.com',
          'GUID-GOES-HERE'
        ));

      it('should patchState for isUploadSuccessful as true', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          isUploadSuccessful: true,
          uploadedDocumentMessages: [{ fileName: 'name', successful: true }],
        }));
    });

    describe('on error', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          uploadedDocumentMessages: [],
        });
        invoiceIngestionServiceStub.uploadInvoice.mockReturnValueOnce(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should patchState for isUploadSuccessful as false', done => {
        uploadsQueuePageState
          .uploadDocument(stateContextStub, {
            file: { name: 'name' } as any,
            organizationId: '25',
            correlationId: 'GUID-GOES-HERE',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                isUploadSuccessful: false,
                uploadedDocumentMessages: [{ fileName: 'name', successful: false }],
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: QueryAllPendingDocuments', () => {
    describe('on success', () => {
      const documentsStub = [
        {
          fileName: 'mock',
          username: 'mockName',
          buyerId: '1',
          correlationId: 'GUID-GOES-HERE',
        },
      ];

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              core: {
                filteredBuyers: [{ id: '1', name: 'mock company name' }],
                userAccount: {
                  preferred_username: 'mockUsername',
                },
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              core: {
                filteredBuyers: [{ id: '1', name: 'mock company name' }],
                userAccount: {
                  preferred_username: 'mockUsername',
                },
              },
            })
          );
        stateContextStub.getState.mockReturnValue({
          invoices: getDocuments(),
        });
        xdcServiceStub.getAllPendingDocuments.mockReturnValueOnce(of(documentsStub));
        uploadsQueuePageState.queryAllPendingDocuments(stateContextStub).subscribe();
      });

      it('should call xdc services getAllPendingDocuments fn', () =>
        expect(xdcServiceStub.getAllPendingDocuments).toHaveBeenNthCalledWith(1, 'mockUsername'));

      it('should patchState for invoices', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: [
            {
              documentId: documentsStub[0].correlationId,
              fileName: documentsStub[0].fileName,
              dateReceived: expect.anything(),
              uploadStatus: PendingUploadStatus.Pending,
              buyerName: 'Mock Company Name',
            },
            ...getDocuments(),
          ],
        }));
    });

    describe('on error', () => {
      beforeEach(() => {
        xdcServiceStub.getAllPendingDocuments.mockReturnValueOnce(
          throwError(() => ({ status: 404 }))
        );
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should NOT patchState for invoices', done => {
        uploadsQueuePageState.queryAllPendingDocuments(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: err => {
            expect(err).toEqual({ status: 404 });
            expect(stateContextStub.patchState).not.toHaveBeenCalled();

            done();
          },
        });
      });
    });
  });

  describe('Action: CreatePendingUpload', () => {
    describe('on success', () => {
      const documentsStub = [
        {
          fileName: 'mock',
          username: 'mockName',
          buyerId: '1',
          correlationId: 'GUID-GOES-HERE',
        },
      ];

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '1', name: 'mock company name' }],
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          invoices: getDocuments(),
        });
        xdcServiceStub.postCreatePendingUpload.mockReturnValueOnce(of(null));
        uploadsQueuePageState
          .createPendingUpload(stateContextStub, {
            documents: documentsStub,
          })
          .subscribe();
      });

      it('should call xdc services postCreatePendingUpload fn', () =>
        expect(xdcServiceStub.postCreatePendingUpload).toHaveBeenNthCalledWith(1, documentsStub));

      it('should patchState for invoices', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: [
            {
              documentId: documentsStub[0].correlationId,
              fileName: documentsStub[0].fileName,
              dateReceived: expect.anything(),
              uploadStatus: PendingUploadStatus.Pending,
              buyerName: 'Mock Company Name',
            },
            ...getDocuments(),
          ],
        }));
    });

    describe('on error', () => {
      beforeEach(() => {
        xdcServiceStub.postCreatePendingUpload.mockReturnValueOnce(
          throwError(() => ({ status: 404 }))
        );
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should NOT patchState for invoices', done => {
        uploadsQueuePageState
          .createPendingUpload(stateContextStub, {
            documents: [],
          })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 404 });
              expect(stateContextStub.patchState).not.toHaveBeenCalled();

              done();
            },
          });
      });
    });
  });

  describe('Action: UpdatePendingUploadDocument', () => {
    describe('when invoice documentId matches the correlationId passed in', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [
            {
              documentId: '1',
              uploadStatus: PendingUploadStatus.Pending,
            },
          ],
        });

        uploadsQueuePageState.updatePendingUploadDocument(stateContextStub, {
          correlationId: '1',
          documentId: '2',
        });
      });

      it('should patchState for invoice to update documentId & uploadStatus', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: [
            {
              documentId: '2',
              uploadStatus: PendingUploadStatus.Completed,
            },
          ],
        }));

      it('should dispatch UpdateUploadsQueueCount action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdateUploadsQueueCount()
        ));
    });

    describe('when invoice documentId does not match the correlationId passed in', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          invoices: [
            {
              documentId: '35',
              uploadStatus: PendingUploadStatus.Pending,
            },
          ],
        });

        uploadsQueuePageState.updatePendingUploadDocument(stateContextStub, {
          correlationId: '1',
          documentId: '2',
        });
      });

      it('should patchState for invoice and leave the values alone', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          invoices: [
            {
              documentId: '35',
              uploadStatus: PendingUploadStatus.Pending,
            },
          ],
        }));

      it('should dispatch UpdateUploadsQueueCount action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdateUploadsQueueCount()
        ));
    });
  });

  describe('Action: SetUploadsPageSignalEvents', () => {
    const hubConnectionSpy = { on: jest.fn(), off: jest.fn() };

    describe('when hubconnection is NOT NULL', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              hubConnection: hubConnectionSpy,
            },
          })
        );
        hubConnectionSpy.on.mockImplementationOnce((obj, cb) => {
          cb('correlationId', 'docId');
        });
        uploadsQueuePageState.setUploadsPageSignalEvents(stateContextStub);
      });

      it('should dispatch UpdatePendingUploadDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new UpdatePendingUploadDocument('correlationId', 'docId')
        ));
    });

    describe('when hubconnection is NULL', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              hubConnection: null,
            },
          })
        );

        uploadsQueuePageState.setUploadsPageSignalEvents(stateContextStub);
      });

      it('should NOT call hubConnections on method', () =>
        expect(hubConnectionSpy.on).not.toHaveBeenCalled());
    });
  });

  describe('Action: FilterByInvoiceName', () => {
    const defaultPageFilters = {
      buyerId: [],
      escalationCategoryIssue: [EscalationCategoryTypes.None],
      ingestionType: [IngestionTypes.Api],
      sourceEmail: ['mock@mock.com'],
      isSubmitted: [0],
    };

    describe('when getting results back from aggregate search', () => {
      const bodyRequestStub = getContainsAggregateBodyRequest({
        fileName: [],
        buyerId: ['25'] as any,
      });

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              filteredBuyers: [{ id: '25', name: 'AvidXchange, Inc' }],
            },
          })
        );
        stateContextStub.getState.mockReturnValue({
          filters: defaultPageFilters,
        });
        documentSearchHelperServiceStub.getMultipleContainsAggregateRequest.mockReturnValueOnce(
          bodyRequestStub
        );
        xdcServiceStub.postAggregateSearch.mockReturnValue(of([{ fileName: 'testmock' }]));

        uploadsQueuePageState
          .filterByInvoiceName(stateContextStub, {
            searchValue: 'mock',
          })
          .subscribe();
      });

      it('should call documentSearchHelperService getMultipleContainsAggregateRequest fn', () =>
        expect(
          documentSearchHelperServiceStub.getMultipleContainsAggregateRequest
        ).toHaveBeenNthCalledWith(
          1,
          SearchContext.AvidSuite,
          {
            ...defaultPageFilters,
            buyerId: ['25'] as any,
          },
          [
            {
              ParameterName: 'fileName',
              ParameterValue: 'mock',
              Function: SearchApplyFunction.Contains,
              Alias: 'fileNameFlag',
            },
          ],
          [
            {
              ParameterName: 'fileNameFlag',
              ParameterValue: '1',
              Operation: '==',
              Chain: null,
            },
          ],
          ['fileName']
        ));

      it('should call xdcService postAggregateSearch fn', () =>
        expect(xdcServiceStub.postAggregateSearch).toHaveBeenNthCalledWith(1, bodyRequestStub));

      it('should patchState for aggregateFilters and set pageNumber to 1', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          filters: {
            ...defaultPageFilters,
            fileName: ['testmock'],
          },
          aggregateFilters: {
            fileName: ['testmock'],
          },
          pageNumber: 1,
          searchByFileNameValue: 'mock',
        }));

      it('should dispatch QueryUploadsInvoices & UpdateUploadsQueueCount actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryUploadedInvoices(),
          new UpdateUploadsQueueCount(),
        ]));
    });

    describe('when getting no results back from the postAggregateSearch api', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: defaultPageFilters,
        });

        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState aggregateFilters as empty array and set pageNumber to 1', done => {
        uploadsQueuePageState
          .filterByInvoiceName(stateContextStub, {
            searchValue: 'mock',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                aggregateFilters: null,
                filters: { ...defaultPageFilters, fileName: ['mock'] },
                pageNumber: 1,
                searchByFileNameValue: 'mock',
              });

              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
                new QueryUploadedInvoices(),
                new UpdateUploadsQueueCount(),
              ]);

              done();
            },
          });
      });
    });

    describe('when searching with an empty string', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          filters: defaultPageFilters,
        });

        xdcServiceStub.postAggregateSearch.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should patchState aggregateFilters as empty array and set pageNumber to 1', done => {
        uploadsQueuePageState
          .filterByInvoiceName(stateContextStub, {
            searchValue: '',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                aggregateFilters: null,
                filters: { ...defaultPageFilters, fileName: [] },
                pageNumber: 1,
                searchByFileNameValue: '',
              });

              done();
            },
          });
      });
    });
  });

  describe('Action: ClearUploadedDocumentMessages', () => {
    beforeEach(() => {
      uploadsQueuePageState.clearUploadedDocumentMessages(stateContextStub);
    });

    it('should patchState an empty array for uploadedDocumentMessages', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        uploadedDocumentMessages: [],
      }));
  });

  describe('Action: BatchDeletion', () => {
    const documentsStub = [
      {
        documentId: '1',
      },
      {
        documentId: '2',
      },
      {
        documentId: '3',
      },
    ];

    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        invoices: documentsStub,
      });
      xdcServiceStub.postMassEscalation.mockReturnValue(of(null));
    });

    it('should filter out the documentIds passed in', done => {
      uploadsQueuePageState
        .batchUploadsDeletion(stateContextStub, { documentIds: ['1'] })
        .subscribe(() => {
          expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
            invoices: documentsStub.filter(inv => !['1'].includes(inv.documentId)),
          });
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
            new UpdateUploadsQueueCount(),
            new UpdateRecycleBinQueueCount(),
          ]);

          done();
        });
    });
  });

  describe('Action: BatchDownload', () => {
    const documentsStub = [
      {
        documentId: '1',
      },
      {
        documentId: '2',
      },
      {
        documentId: '3',
      },
    ];

    beforeEach(() => {
      xdcServiceStub.getFile.mockReturnValue(of(null));
    });

    it('should call getFile for each document passed in', done => {
      uploadsQueuePageState
        .batchUploadsDownload(stateContextStub, { documents: documentsStub })
        .subscribe(() => {
          expect(xdcServiceStub.getFile).toHaveBeenCalledTimes(3);
          done();
        });
    });
  });
});
