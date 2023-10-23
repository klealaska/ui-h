import {
  QueryDocumentCardSetCounts,
  SendLockMessage,
  StartLockHeartbeat,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import {
  QueryUploadedInvoices,
  UpdateMyUploadsInvoiceSubmit,
} from '@ui-coe/avidcapture/my-uploads/data-access';
import {
  QueryQueueInvoices,
  SetPendingPageSignalEvents,
  UpdateQueueOnInvoiceSubmit,
} from '@ui-coe/avidcapture/pending/data-access';
import {
  QueryRecycleBinDocuments,
  SetRecycleBinPageSignalEvents,
  UpdateRecycleBinQueueOnInvoiceSubmit,
} from '@ui-coe/avidcapture/recycle-bin/data-access';
import {
  QueryResearchInvoices,
  SetResearchPageSignalEvents,
  UpdateResearchQueueOnInvoiceSubmit,
} from '@ui-coe/avidcapture/research/data-access';
import {
  activityStub,
  buyersStub,
  compositeDataStub,
  escalationActivityStub,
  escalationsStub,
  getActivityStub,
  getAdvancedFilterStub,
  getAggregateBodyRequest,
  getCompositeDataStub,
  getEscalationStub,
  getFieldBaseStub,
  getIndexedLabelStub,
  hasAllTheClaimsTokenStub,
  indexedLabelStub,
  internalEscalationsStub,
  sortedColumnStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  ActivityTypes,
  AppPages,
  DocumentLabelKeys,
  EscalationCategoryTypes,
  FieldBase,
  FieldTypes,
  IndexedData,
  IndexedLabel,
  IndexingPageAction,
  InvoiceTypes,
  LabelValue,
  SkipDocumentDirection,
} from '@ui-coe/avidcapture/shared/types';
import jwt_decode from 'jwt-decode';
import { of, throwError } from 'rxjs';

import {
  LoadPrepProperty,
  LoadPrepSupplier,
  ParseDocumentFormFields,
  SetDueDate,
  SetExistingProperty,
  SetExistingSupplier,
} from '../indexing-document-fields/indexing-document-fields.actions';
import * as indexingUtilityActions from '../indexing-utility/indexing-utility.actions';
import * as indexingPageActions from './indexing-page.actions';
import { IndexingPageSelectors } from './indexing-page.selectors';
import { IndexingPageState } from './indexing-page.state';

jest.mock('jwt-decode', () => ({ default: jest.fn() }));

describe('IndexingPageState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const xdcServiceStub = {
    getUnindexedDocument: jest.fn(),
    putEscalation: jest.fn(),
    putIndexed: jest.fn(),
    putIndexedSubmit: jest.fn(),
    unlockDocument: jest.fn(),
    getNextUnindexedDocument: jest.fn(),
    getSkipUnindexedDocument: jest.fn(),
    getFile: jest.fn(),
  };
  const indexingHelperServiceStub = {
    handleSaveSubmitSuccess: jest.fn(),
    handleSaveSubmitError: jest.fn(),
    handleDocSwapSubmission: jest.fn(),
    handleNoMoreInvoices: jest.fn(),
    setOriginalValues: jest.fn(),
    associateSelection: jest.fn(),
    createLabelColors: jest.fn(),
    internalEscalationCount: jest.fn(),
    updateChangedLabels: jest.fn(),
    generateChangeLog: jest.fn(() => []),
    addActivity: jest.fn(),
    getIndexedLabel: jest.fn(),
    getNextDocumentRequestBody: jest.fn(),
    updateLabelValueUponThresholdCheck: jest.fn(),
    getFieldsToRemove: jest.fn(),
    getPageData: jest.fn(),
  };
  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };
  const pageHelperServiceStub = {
    getPdfFileRequest: jest.fn(),
  };
  const toastServiceStub = {
    warning: jest.fn(),
  };
  const routerStub = {
    navigate: jest.fn(),
  };

  const formatterServiceStub = {
    getSanitizedFieldValue: jest.fn(),
    getCurrencyDouble: jest.fn(),
  };

  const storeStub = {
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          userAccount: {
            preferred_username: 'mockName',
            name: 'mockName',
          },
          currentPage: AppPages.Queue,
        },
        pendingPage: {
          filteredBuyers: buyersStub,
          sortedColumnData: sortedColumnStub,
        },
        indexingPage: {
          escalation: escalationsStub,
          startDate: '',
        },
      })
    ),
    select: jest.fn(),
    selectOnce: jest.fn(),
    snapshot: jest.fn(),
  };

  const indexingPageState = new IndexingPageState(
    xdcServiceStub as any,
    toastServiceStub as any,
    routerStub as any,
    indexingHelperServiceStub as any,
    retryServiceStub as any,
    pageHelperServiceStub as any,
    storeStub as any,
    formatterServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () =>
      expect(
        IndexingPageState.data({ compositeData: getCompositeDataStub() } as any)
      ).toStrictEqual({
        compositeData: getCompositeDataStub(),
      }));
  });

  describe('Action: InitIndexingPage', () => {
    describe('when document data already exists', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData: compositeDataStub,
        });
        indexingPageState.initIndexingPage(stateContextStub, {
          documentId: '1',
        });
      });

      it('should dispatch QueryUnindexedDocument action', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.QueryUnindexedDocument('1')
        ));
    });

    describe('when document data does not exists', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ compositeData: null });
        indexingPageState.initIndexingPage(stateContextStub, {
          documentId: '1',
        });
      });

      it('should dispatch QueryUnindexedDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.QueryUnindexedDocument('1')
        ));
    });
  });

  describe('Action: QueryUnindexedDocument', () => {
    describe('when document is locked', () => {
      beforeEach(() => {
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should of called xdcService getUnindexedDocument api', () =>
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(1, '1', 'mockName'));

      it('should open toast', () => {
        expect(toastServiceStub.warning).toHaveBeenNthCalledWith(
          1,
          'Invoice 1 was locked by mockIndexerName. Please try a different document.'
        );
      });

      it('should route you back to the queue page', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]));
    });

    describe('when document is unlocked', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
            name: 'mockIndexerName',
          },
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        compositeDataStub.indexed.labels.push({
          id: '00000000-0000-0000-0000-000000000000',
          label: DocumentLabelKeys.nonLookupLabels.BuyerId,
          page: 1,
          value: {
            text: '25',
            confidence: 1,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should of called xdcService getUnindexedDocument api', () =>
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          '1',
          'mockIndexerName'
        ));

      it('should navigate to indexing page with invoiceId of MockDocumentId', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['indexing', '1']));

      it('should patchState for compositeData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          compositeData: compositeDataStub,
          hasNewEscalations: false,
          originalCompositeData: compositeDataStub,
          associatedErrorMessage: null,
          startDate: expect.anything(),
          allowedToUnlockDocument: true,
          isReadOnly: true,
        }));

      it('should dispatch action CreateLabelColors', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.SetBuyerId('25'),
          new indexingPageActions.SetPdfFileValue(),
          new indexingUtilityActions.CreateLabelColors(),
          new SendLockMessage('mockIndexerName', '1', '25'),
          new StartLockHeartbeat('1', '25'),
          new indexingPageActions.UpdateLabelsAfterThresholdCheck(),
          new indexingPageActions.RoundCurrencyValues(),
          new indexingPageActions.InitialInvoiceTypeLabelValueCheck(),
        ]));
    });

    describe('when document has displayIdentifiers on true label', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
            name: 'mockIndexerName',
          },
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        compositeDataStub.indexed.labels.push({
          id: '00000000-0000-0000-0000-000000000000',
          label: DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues,
          page: 1,
          value: {
            text: '1',
            confidence: 1,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should dispatch regular actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.SetBuyerId('25'),
          new indexingPageActions.SetPdfFileValue(),
          new indexingUtilityActions.CreateLabelColors(),
          new SendLockMessage('mockIndexerName', '1', '25'),
          new StartLockHeartbeat('1', '25'),
          new indexingPageActions.UpdateLabelsAfterThresholdCheck(),
          new indexingPageActions.RoundCurrencyValues(),
          new indexingPageActions.InitialInvoiceTypeLabelValueCheck(),
        ]));

      it('should dispatch actions LoadPrepSupplier and , LoadPrepProperty', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, [
          new LoadPrepSupplier(),
          new LoadPrepProperty(),
        ]));
    });

    describe('when document has displayIdentifiers on FALSE label', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
            name: 'mockIndexerName',
          },
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        compositeDataStub.indexed.labels.push({
          id: '00000000-0000-0000-0000-000000000000',
          label: DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues,
          page: 1,
          value: {
            text: '0',
            confidence: 1,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should dispatch regular actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.SetBuyerId('25'),
          new indexingPageActions.SetPdfFileValue(),
          new indexingUtilityActions.CreateLabelColors(),
          new SendLockMessage('mockIndexerName', '1', '25'),
          new StartLockHeartbeat('1', '25'),
          new indexingPageActions.UpdateLabelsAfterThresholdCheck(),
          new indexingPageActions.RoundCurrencyValues(),
          new indexingPageActions.InitialInvoiceTypeLabelValueCheck(),
        ]));

      it('should not dispatch prepop actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(2, []));
    });

    describe('when document is LARGE', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
            name: 'mockIndexerName',
          },
        },
      };
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.unindexed = null;

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should patchState isReadOnly as true', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            isReadOnly: true,
          })
        ));
    });

    describe('When document does not have unindexed data ', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
            name: 'mockIndexerName',
          },
        },
      };
      const compositeDataStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should patchState isReadOnly as true', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            isReadOnly: true,
          })
        ));
    });

    describe('When document does not have pages on unindexed data ', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
            name: 'mockIndexerName',
          },
        },
      };
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.unindexed.pages = null;
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should patchState isReadOnly as true', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            isReadOnly: true,
          })
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.getUnindexedDocument.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error toast', done => {
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
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
              expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);

              done();
            },
          });
      });
    });

    describe('when receiving an error with code 409', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({
            core: {
              currentPage: AppPages.Queue,
              userAccount: {
                preferred_username: 'mockName',
              },
            },
          })
        );
        xdcServiceStub.getUnindexedDocument.mockReturnValue(throwError(() => ({ status: 409 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 409 })));
      });

      it('should throw a warning toast and route them back to the currentPage they were on', done => {
        indexingPageState
          .queryUnindexedDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: err => {
              expect(err).toEqual({ status: 409 });
              expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
                allowedToUnlockDocument: false,
              });
              expect(toastServiceStub.warning).toHaveBeenNthCalledWith(
                1,
                'Invoice is locked. Please try a different document.'
              );
              expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);

              done();
            },
          });
      });
    });
  });

  describe('Action: PutInEscalation', () => {
    const stateStub = {
      core: {
        currentPage: AppPages.Queue,
        userAccount: {
          preferred_username: 'mockName',
        },
      },
    };
    beforeEach(() => storeStub.snapshot.mockReturnValueOnce(stateStub));

    describe('addActivity() internalQA validation', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.activities[0].escalation = internalEscalationsStub;
      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation: internalEscalationsStub });
        xdcServiceStub.putEscalation.mockReturnValue(of(undefined));

        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe();
      });

      afterEach(() => {
        compositeData.indexed.activities = [];
      });

      it('should call indexingHelperService addActivity function', () => {
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          undefined,
          ActivityTypes.Exception,
          'mockName',
          internalEscalationsStub,
          undefined,
          []
        );
      });
    });

    describe('escalation ordinal and activity link updates', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation: escalationsStub });
        xdcServiceStub.putEscalation.mockReturnValue(of(undefined));
        compositeData.indexed.activities[0].escalation = escalationsStub;
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe();
      });

      afterEach(() => {
        compositeData.indexed.activities = [];
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          undefined,
          ActivityTypes.Exception,
          'mockName',
          escalationsStub,
          undefined,
          []
        ));
    });

    describe('when receiving a successful return', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);
      const escalation = getEscalationStub(EscalationCategoryTypes.ImageIssue);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation });
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);
        compositeData.indexed.activities[0].escalation = escalation;

        xdcServiceStub.putEscalation.mockReturnValue(of(undefined));
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe();
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          undefined,
          ActivityTypes.Exception,
          'mockName',
          escalation,
          undefined,
          []
        ));

      it('should of called xdcService putEscalation api', () =>
        expect(xdcServiceStub.putEscalation).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService handleSaveSubmitSuccess function', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Save,
          fileNameLabel.value.text
        ));

      it('should setState back to defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          compositeData: null,
          pdfFile: null,
          hasNewEscalations: false,
          updateFontFace: false,
          buyerId: null,
          latestFieldAssociation: null,
          originalCompositeData: null,
          changedLabels: [],
          associatedErrorMessage: null,
          escalation: null,
          startDate: '',
          allowedToUnlockDocument: true,
          associatedLookupFieldValue: null,
          isReadOnly: false,
          swappedDocument: null,
          disableHighlight: null,
          pageFilters: null,
        }));

      it('should dispatch UnlockDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new UnlockDocument('1'),
          new indexingUtilityActions.UpdateAllQueueCounts(),
        ]));

      it('should dispatch GetNextDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new indexingPageActions.GetNextDocument('1', searchBodyRequestStub, '')
        ));
    });

    describe('when changeLog has values', () => {
      const compositeData = getCompositeDataStub();
      const prevLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          changedLabels: [prevLabel],
          escalation: escalationsStub,
        });
        indexingHelperServiceStub.generateChangeLog.mockReturnValueOnce([
          {
            previous: prevLabel,
            current: compositeData.indexed.labels[1],
          },
        ]);
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Exception,
            documentId: '1',
          })
          .subscribe();
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          [prevLabel],
          ActivityTypes.Exception,
          'mockName',
          escalationsStub,
          undefined,
          [
            {
              previous: prevLabel,
              current: compositeData.indexed.labels[1],
            },
          ]
        ));
    });

    describe('when fileName label is not found', () => {
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation: escalationsStub });
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);

        xdcServiceStub.putEscalation.mockReturnValue(of(undefined));
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe();
      });

      it('should of called xdcService putEscalation api', () =>
        expect(xdcServiceStub.putEscalation).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService handleSaveSubmitSuccess function with empty for fileName', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Save,
          ''
        ));
    });

    describe('when activities changeLog.current needs to be updated', () => {
      const compositeData = getCompositeDataStub();
      const activityStub = getActivityStub();
      activityStub.changeLog = [
        {
          previous: null,
          current: getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
        },
      ];
      compositeData.indexed.activities.push(activityStub);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation: escalationsStub });
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);

        xdcServiceStub.putEscalation.mockReturnValue(of(undefined));
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe();
      });

      it('should of called xdcService putEscalation api', () =>
        expect(xdcServiceStub.putEscalation).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService handleSaveSubmitSuccess function with empty for fileName', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Save,
          ''
        ));
    });

    describe('when escalation category is void', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);
      const escalation = getEscalationStub(EscalationCategoryTypes.Void);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation });
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);
        compositeData.indexed.activities[0].escalation = escalation;

        xdcServiceStub.putEscalation.mockReturnValue(of(undefined));
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe();
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          undefined,
          ActivityTypes.Exception,
          'mockName',
          escalation,
          undefined,
          []
        ));

      it('should call indexingHelperService handleDocSwapSubmission fn', () =>
        expect(indexingHelperServiceStub.handleDocSwapSubmission).toHaveBeenNthCalledWith(
          1,
          fileNameLabel.value.text
        ));

      it('should dispatch Unlock Action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new UnlockDocument('1'),
          new indexingUtilityActions.UpdateAllQueueCounts(),
        ]));

      it('should route back to queue page', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]));
    });

    describe('when escalation category is RecycleBin', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);
      const escalation = getEscalationStub(EscalationCategoryTypes.RecycleBin);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation });
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);
        compositeData.indexed.activities[0].escalation = escalation;

        xdcServiceStub.putEscalation.mockReturnValue(of(undefined));
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe();
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          undefined,
          ActivityTypes.Exception,
          'mockName',
          escalation,
          undefined,
          []
        ));

      it('should call indexingHelperService handleSaveSubmitSuccess fn', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Delete,
          fileNameLabel.value.text
        ));

      it('should dispatch GetNextDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new indexingPageActions.GetNextDocument('1', searchBodyRequestStub, 'Recycle Bin')
        ));
    });

    describe('when receiving an error', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        xdcServiceStub.putEscalation.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error toast', done => {
        indexingPageState
          .putInEscalation(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleSaveSubmitError).toHaveBeenCalled();
              done();
            },
          });
      });
    });
  });

  describe('Action: SaveIndexedDocument', () => {
    describe('when receiving a successful return and redirectQueue is false', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          escalation: escalationsStub,
        });
        xdcServiceStub.putIndexed.mockReturnValue(of(undefined));
        indexingPageState
          .saveIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            redirectQueue: false,
          })
          .subscribe();
      });

      it('should of called xdcService postIndexed api', () =>
        expect(xdcServiceStub.putIndexed).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          undefined,
          ActivityTypes.Save,
          'mockName',
          escalationsStub,
          undefined,
          []
        ));

      it('should call indexingHelperService handleSaveSubmitSuccess function', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Save,
          fileNameLabel.value.text
        ));

      it('should setState changedLabel to defaults', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          changedLabels: [],
        }));

      it('should route you back to the queue page', () =>
        expect(routerStub.navigate).not.toHaveBeenCalled());
    });

    describe('when receiving a successful return and redirectQueue is true', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          escalation: escalationsStub,
        });
        xdcServiceStub.putIndexed.mockReturnValue(of(undefined));
        indexingPageState
          .saveIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            redirectQueue: true,
          })
          .subscribe();
      });

      it('should setState back to defaults', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          compositeData: null,
          pdfFile: null,
          hasNewEscalations: false,
          updateFontFace: false,
          buyerId: null,
          latestFieldAssociation: null,
          originalCompositeData: null,
          changedLabels: [],
          associatedErrorMessage: null,
          escalation: null,
          startDate: '',
          allowedToUnlockDocument: true,
          associatedLookupFieldValue: null,
          isReadOnly: false,
          swappedDocument: null,
          disableHighlight: null,
          pageFilters: null,
        }));

      it('should route you back to the queue page', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]));
    });

    describe('when changeLog has values', () => {
      const compositeData = getCompositeDataStub();
      const prevLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          changedLabels: [prevLabel],
          escalation: escalationsStub,
        });
        indexingHelperServiceStub.generateChangeLog.mockReturnValueOnce([
          {
            previous: prevLabel,
            current: compositeData.indexed.labels[1],
          },
        ]);
        indexingPageState
          .saveIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            redirectQueue: false,
          })
          .subscribe();
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          [prevLabel],
          ActivityTypes.Save,
          'mockName',
          escalationsStub,
          undefined,
          [
            {
              previous: prevLabel,
              current: compositeData.indexed.labels[1],
            },
          ]
        ));
    });

    describe('when fileName label is not found', () => {
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation: escalationsStub });
        xdcServiceStub.putIndexed.mockReturnValue(of(undefined));
        indexingPageState
          .saveIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            redirectQueue: false,
          })
          .subscribe();
      });

      it('should of called xdcService putIndexed api', () =>
        expect(xdcServiceStub.putIndexed).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService handleSaveSubmitSuccess function with empty for fileName', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Save,
          ''
        ));
    });

    describe('when receiving an error', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        xdcServiceStub.putIndexed.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error toast', done => {
        indexingPageState
          .saveIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            redirectQueue: false,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleSaveSubmitError).toHaveBeenNthCalledWith(
                1,
                IndexingPageAction.Save
              );

              done();
            },
          });
      });
    });
  });

  describe('Action: SubmitIndexedDocument', () => {
    describe('when out of invoices', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          escalation: escalationsStub,
        });
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);
        xdcServiceStub.putIndexedSubmit.mockReturnValue(of(undefined));
        indexingPageState
          .submitIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Submit,
            documentId: '1',
          })
          .subscribe();
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          undefined,
          ActivityTypes.Submit,
          'mockName',
          escalationsStub,
          undefined,
          []
        ));

      it('should of called xdcService putIndexedSubmit api', () =>
        expect(xdcServiceStub.putIndexedSubmit).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService handleSaveSubmitSuccess function', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Submit,
          fileNameLabel.value.text
        ));

      it('should setState back to defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          compositeData: null,
          pdfFile: null,
          hasNewEscalations: false,
          updateFontFace: false,
          buyerId: null,
          latestFieldAssociation: null,
          originalCompositeData: null,
          changedLabels: [],
          associatedErrorMessage: null,
          escalation: null,
          startDate: '',
          allowedToUnlockDocument: true,
          associatedLookupFieldValue: null,
          isReadOnly: false,
          swappedDocument: null,
          disableHighlight: null,
          pageFilters: null,
        }));

      it('should dispatch UnlockDocument & EnableSubmitButton actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new UnlockDocument('1'),
          new indexingUtilityActions.EnableSubmitButton(true),
          new indexingUtilityActions.UpdateAllQueueCounts(),
        ]));

      it('should dispatch GetNextDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new indexingPageActions.GetNextDocument('1', searchBodyRequestStub, 'Submit')
        ));
    });

    describe('when changeLog has values', () => {
      const compositeData = getCompositeDataStub();
      const prevLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          changedLabels: [prevLabel],
          escalation: escalationsStub,
        });
        indexingHelperServiceStub.generateChangeLog.mockReturnValueOnce([
          {
            previous: prevLabel,
            current: compositeData.indexed.labels[1],
          },
        ]);
        indexingPageState
          .submitIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Submit,
            documentId: '1',
          })
          .subscribe();
      });

      it('should call indexingHelperService addActivity function', () =>
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          [prevLabel],
          ActivityTypes.Submit,
          'mockName',
          escalationsStub,
          undefined,
          [
            {
              previous: prevLabel,
              current: compositeData.indexed.labels[1],
            },
          ]
        ));
    });

    describe('when fileName label is not found', () => {
      const compositeData = getCompositeDataStub();

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation: escalationsStub });
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);
        xdcServiceStub.putIndexedSubmit.mockReturnValue(of(undefined));
        indexingPageState
          .submitIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Submit,
            documentId: '1',
          })
          .subscribe();
      });

      it('should of called xdcService putIndexedSubmit api', () =>
        expect(xdcServiceStub.putIndexedSubmit).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService handleSaveSubmitSuccess function with empty for fileName', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Submit,
          ''
        ));
    });

    describe('when activities changeLog.current needs to be updated', () => {
      const compositeData = getCompositeDataStub();
      const activityStub = getActivityStub();
      activityStub.changeLog = [
        {
          previous: null,
          current: getIndexedLabelStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
        },
      ];
      compositeData.indexed.activities.push(activityStub);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ escalation: escalationsStub });
        indexingHelperServiceStub.internalEscalationCount.mockReturnValueOnce(1);

        xdcServiceStub.putIndexedSubmit.mockReturnValue(of(undefined));
        indexingPageState
          .submitIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Submit,
            documentId: '1',
          })
          .subscribe();
      });

      it('should of called xdcService putIndexedSubmit api', () =>
        expect(xdcServiceStub.putIndexedSubmit).toHaveBeenNthCalledWith(1, compositeData.indexed));

      it('should call indexingHelperService handleSaveSubmitSuccess function with empty for fileName', () =>
        expect(indexingHelperServiceStub.handleSaveSubmitSuccess).toHaveBeenNthCalledWith(
          1,
          IndexingPageAction.Submit,
          ''
        ));
    });

    describe('when receiving an error', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);
      const currentActivityCount = compositeData.indexed.activities.length;

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 500 })));
        xdcServiceStub.putIndexedSubmit.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should throw an error toast', done => {
        indexingPageState
          .submitIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Submit,
            documentId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(compositeData.indexed.activities.length).toBe(currentActivityCount - 1);
              expect(indexingHelperServiceStub.handleSaveSubmitError).toHaveBeenNthCalledWith(
                1,
                IndexingPageAction.Submit
              );
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
                1,
                new indexingUtilityActions.EnableSubmitButton(true)
              );

              done();
            },
          });
      });
    });

    describe('when receiving an error with status code of 406', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        retryServiceStub.retryApiCall.mockReturnValue(
          throwError(() => ({
            status: 406,
            error: {
              documentId: '1234',
              reason: '',
              sourceDocumentId: null,
              invoiceNumber: '1234',
            },
          }))
        );
        xdcServiceStub.putIndexedSubmit.mockReturnValue(
          throwError(() => ({
            status: 406,
            error: {
              documentId: '1234',
              reason: '',
              sourceDocumentId: null,
              invoiceNumber: '1234',
            },
          }))
        );
      });

      it('should dispatch DisplayDuplicateDetectionModal action with error message', done => {
        indexingPageState
          .submitIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Save,
            documentId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(compositeData.indexed.activities.length).toBe(0);
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
                new indexingPageActions.AddAutoFormatActivity(compositeData.indexed, {
                  documentId: '1234',
                  reason: '',
                  sourceDocumentId: null,
                  invoiceNumber: '1234',
                }),
                new indexingUtilityActions.SetDuplicateDocumentId({
                  documentId: '1234',
                  reason: '',
                  sourceDocumentId: null,
                  invoiceNumber: '1234',
                }),
              ]);
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
                2,
                new indexingUtilityActions.EnableSubmitButton(true)
              );

              done();
            },
          });
      });
    });

    describe('when receiving an error with status code of 400', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        retryServiceStub.retryApiCall.mockReturnValue(
          throwError(() => ({
            status: 400,
            error: 'Missing Fields: ServiceEndDate',
          }))
        );
        xdcServiceStub.putIndexedSubmit.mockReturnValue(
          throwError(() => ({
            status: 400,
            error: 'Missing Fields: ServiceEndDate',
          }))
        );
      });

      it('should throw an error toast', done => {
        indexingPageState
          .submitIndexedDocument(stateContextStub, {
            indexedDocument: compositeData.indexed,
            action: IndexingPageAction.Submit,
            documentId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(toastServiceStub.warning).toHaveBeenNthCalledWith(
                1,
                'Missing Fields: ServiceEndDate'
              );
              expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
                1,
                new indexingUtilityActions.EnableSubmitButton(true)
              );

              done();
            },
          });
      });
    });
  });

  describe('Action: SetEscalation', () => {
    describe('when escalation is Non Invoice Document and invoiceNumber and invoiceAmount has data', () => {
      const escalation = escalationsStub;
      const compositeData = compositeDataStub;
      compositeData.indexed.labels.push({
        label: DocumentLabelKeys.nonLookupLabels.InvoiceNumber,
        page: 1,
        value: {
          text: '12',
          confidence: 99.99,
          boundingBox: [],
          required: false,
          verificationState: '',
        } as LabelValue,
      } as IndexedLabel);

      compositeData.indexed.labels.push({
        label: DocumentLabelKeys.nonLookupLabels.InvoiceAmount,
        page: 1,
        value: {
          text: '12',
          confidence: 99.99,
          boundingBox: [],
          required: false,
          verificationState: '',
        } as LabelValue,
      } as IndexedLabel);
      const compositeDataModified = compositeDataStub;
      compositeDataModified.indexed.labels[2].value.text = '';
      compositeDataModified.indexed.labels[3].value.text = '';
      beforeEach(() => {
        indexingHelperServiceStub.internalEscalationCount.mockReturnValue(0);

        compositeData.indexed.activities = [];
        compositeData.indexed.activities.push(activityStub);
        compositeData.indexed.activities[0].escalation = null;
        escalation.category.issue = EscalationCategoryTypes.NonInvoiceDocument;
        indexingHelperServiceStub.getFieldsToRemove.mockReturnValue([
          'InvoiceNumber',
          'InvoiceAmount',
        ]);
        stateContextStub.getState.mockReturnValue({
          compositeData,
        });

        storeStub.select.mockImplementation(cb =>
          of(
            cb({
              indexingPage: {
                compositeData: compositeDataModified,
              },
            })
          )
        );

        indexingPageState
          .setEscalation(stateContextStub, {
            escalation,
          })
          .subscribe();
      });

      it('should dispatch UpdateOnManualIntervention action', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.UpdateOnManualIntervention({
            key: 'InvoiceNumber',
            value: '',
          } as FieldBase<string>)
        );

        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new indexingPageActions.UpdateOnManualIntervention({
            key: 'InvoiceAmount',
            value: '',
          } as FieldBase<string>)
        );
      });
    });

    describe('when escalation is Non Invoice Document and invoiceNumber and invoiceAmount are blank', () => {
      const escalation = escalationsStub;
      const compositeData = compositeDataStub;
      const compositeDataModified = compositeDataStub;

      beforeEach(() => {
        indexingHelperServiceStub.internalEscalationCount.mockReturnValue(0);

        compositeData.indexed.activities = [];
        compositeData.indexed.activities.push(activityStub);
        compositeData.indexed.activities[0].escalation = null;
        compositeDataModified.indexed.labels[2].value.text = '';
        compositeDataModified.indexed.labels[3].value.text = '';
        escalation.category.issue = EscalationCategoryTypes.NonInvoiceDocument;

        indexingHelperServiceStub.getFieldsToRemove.mockReturnValue([]);
        stateContextStub.getState.mockReturnValue({
          compositeData,
        });

        storeStub.select.mockImplementation(cb =>
          of(
            cb({
              indexingPage: {
                compositeData: compositeDataModified,
              },
            })
          )
        );

        indexingPageState.setEscalation(stateContextStub, {
          escalation,
        });
      });

      it('should dispatch HandleEscalationSubmission action', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingUtilityActions.HandleEscalationSubmission(true)
        );
      });
    });

    describe('when escalation is NOT a new account created', () => {
      const escalation = escalationsStub;
      beforeEach(() => {
        indexingHelperServiceStub.internalEscalationCount.mockReturnValue(0);

        compositeDataStub.indexed.activities = [];
        compositeDataStub.indexed.activities.push(activityStub);
        compositeDataStub.indexed.activities[0].escalation = null;
        escalation.category.reason = DocumentLabelKeys.lookupLabels.ShipToAddress;
        escalation.category.issue = EscalationCategoryTypes.ImageIssue;
        indexingHelperServiceStub.getFieldsToRemove.mockReturnValue([]);
        stateContextStub.getState.mockReturnValue({
          compositeData: compositeDataStub,
        });

        indexingPageState.setEscalation(stateContextStub, {
          escalation,
        });
      });

      it('should dispatch HandleEscalationSubmission action', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingUtilityActions.HandleEscalationSubmission(true)
        );
      });
    });

    describe('when escalation is a new account created', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData: compositeDataStub,
        });
        indexingHelperServiceStub.internalEscalationCount.mockReturnValue(1);
        escalationsStub.category.issue = ActivityTypes.CreateNewAccount;
        indexingPageState.setEscalation(stateContextStub, {
          escalation: escalationsStub,
        });
      });

      it('should NOT dispatch HandleEscalationSubmission action', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenNthCalledWith(
          1,
          new indexingUtilityActions.HandleEscalationSubmission(true)
        );
      });
    });
  });

  describe('Action: AddCompositeDataActivity', () => {
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        compositeData: compositeDataStub,
      });
      indexingPageState.addCompositeDataActivity(stateContextStub, {
        activity: activityStub,
      });
    });

    it('should patchState for activities', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        ...stateContextStub.getState(),
        compositeData: {
          ...stateContextStub.getState().compositeData,
          indexed: {
            ...stateContextStub.getState().compositeData.indexed,
            activities: [
              ...stateContextStub.getState().compositeData.indexed.activities,
              activityStub,
            ],
          },
        },
      }));
  });

  describe('Action: RemoveCustomerAccountActivity', () => {
    describe('when customerAccount activity is greater than -1', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();
      compositeDataStub.indexed.activities.push(activityStub);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData: compositeDataStub,
          startDate: activityStub.startDate,
        });
        indexingPageState.removeCustomerAccountActivity(stateContextStub);
      });

      it('should patchState for activities with the customer account activity removed', () => {
        expect(stateContextStub.getState().compositeData.indexed.activities.length).toBe(1);
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          compositeData: {
            ...stateContextStub.getState().compositeData,
            indexed: {
              ...stateContextStub.getState().compositeData.indexed,
              activities: [...stateContextStub.getState().compositeData.indexed.activities],
            },
          },
        });
      });
    });

    describe('when customerAccount activity is NOT greater than -1', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();
      compositeDataStub.indexed.activities.push(activityStub);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData: compositeDataStub,
          startDate: '2021-02-11T17:38:19.0958208Z',
        });
        indexingPageState.removeCustomerAccountActivity(stateContextStub);
      });

      it('should patchState for activities with the customer account activity NOT removed', () => {
        expect(stateContextStub.getState().compositeData.indexed.activities.length).toBe(2);
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          compositeData: {
            ...stateContextStub.getState().compositeData,
            indexed: {
              ...stateContextStub.getState().compositeData.indexed,
              activities: [...stateContextStub.getState().compositeData.indexed.activities],
            },
          },
        });
      });
    });
  });

  describe('Action: UpdateOnLookupFieldAssociation', () => {
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName);
    const updatedLabel = JSON.parse(JSON.stringify(indexedLabel));

    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        compositeData: getCompositeDataStub(),
      });
      indexingHelperServiceStub.getIndexedLabel.mockReturnValue(indexedLabel);
      indexingPageState.updateOnLookupFieldAssociation(stateContextStub, {
        indexedLabel,
      });
    });

    it('should call indexingHelperService getIndexedLabel function', () =>
      expect(indexingHelperServiceStub.getIndexedLabel).toHaveBeenNthCalledWith(
        1,
        getCompositeDataStub().indexed.labels,
        indexedLabel.label
      ));

    it('should patchState for latestFieldAssociation & associatedErrorMessage', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        latestFieldAssociation: {
          field: indexedLabel.label,
          value: indexedLabel.value.text,
        },
      }));

    it('should dispatch UpdateChangedLabels & UpdateCompositeDataLabels actions', () => {
      updatedLabel.value.text = '';
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new indexingPageActions.UpdateChangedLabels(indexedLabel),
        new indexingPageActions.UpdateCompositeDataLabel(updatedLabel),
      ]);
    });
  });

  describe('Action: UpdateOnNonLookupFieldAssociation', () => {
    describe('when updated label exists in indexed labels', () => {
      const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      const updatedLabel = JSON.parse(JSON.stringify(indexedLabel));

      beforeEach(() => {
        updatedLabel.value.confidence = 1;
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        indexingHelperServiceStub.getIndexedLabel.mockReturnValue(indexedLabel);
        indexingPageState.updateOnNonLookupFieldAssociation(stateContextStub, {
          indexedLabel,
        });
      });

      it('should call indexingHelperService getIndexedLabel function', () =>
        expect(indexingHelperServiceStub.getIndexedLabel).toHaveBeenNthCalledWith(
          1,
          getCompositeDataStub().indexed.labels,
          indexedLabel.label
        ));

      it('should patchState for latestFieldAssociation & associatedErrorMessage', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          latestFieldAssociation: {
            field: indexedLabel.label,
            value: indexedLabel.value.text,
          },
          associatedErrorMessage: {
            message: '',
            label: '',
          },
        }));

      it('should dispatch UpdateChangedLabels & UpdateCompositeDataLabels actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateChangedLabels(indexedLabel),
          new indexingPageActions.UpdateCompositeDataLabel(updatedLabel),
        ]));
    });

    describe('when updated label DOES NOT exists in indexed labels', () => {
      const indexedLabel = {
        id: '00000000-0000-0000-0000-000000000000',
        label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
        page: 0,
        value: {
          boundingBox: [0, 0, 0, 0, 0, 0, 0, 0],
          confidence: 0,
          incomplete: true,
          incompleteReason: '',
          required: false,
          text: '',
          type: '',
          verificationState: '',
        },
      };
      const updatedLabel = JSON.parse(JSON.stringify(indexedLabel));

      beforeEach(() => {
        updatedLabel.value.confidence = 0;
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        indexingHelperServiceStub.getIndexedLabel.mockReturnValue(indexedLabel);
        indexingPageState.updateOnNonLookupFieldAssociation(stateContextStub, {
          indexedLabel,
        });
      });

      it('should call indexingHelperService getIndexedLabel function', () =>
        expect(indexingHelperServiceStub.getIndexedLabel).toHaveBeenNthCalledWith(
          1,
          getCompositeDataStub().indexed.labels,
          indexedLabel.label
        ));

      it('should patchState for latestFieldAssociation', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          latestFieldAssociation: {
            field: indexedLabel.label,
            value: indexedLabel.value.text,
          },
          associatedErrorMessage: {
            message: 'Invalid text selected.',
            label: indexedLabel.label,
          },
        }));

      it('should dispatch UpdateChangedLabels & AddCompositeDataLabels actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateChangedLabels(indexedLabel),
          new indexingPageActions.AddCompositeDataLabel(updatedLabel),
        ]));
    });

    describe('When is date type and value is null', () => {
      const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
      const updatedLabel = JSON.parse(JSON.stringify(indexedLabel));
      indexedLabel.value.text = null;
      indexedLabel.value.type = 'date';
      beforeEach(() => {
        updatedLabel.value.confidence = 1;
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        indexingHelperServiceStub.getIndexedLabel.mockReturnValue(indexedLabel);
        indexingPageState.updateOnNonLookupFieldAssociation(stateContextStub, {
          indexedLabel,
        });
      });

      it('should patchState for latestFieldAssociation & associatedErrorMessage', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          latestFieldAssociation: {
            field: indexedLabel.label,
            value: indexedLabel.value.text,
          },
          associatedErrorMessage: {
            message: 'Date must be greater than 1970.',
            label: 'InvoiceDate',
          },
        }));

      it('should dispatch SetDueDate', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(2, new SetDueDate()));
    });
  });

  describe('Action: UpdateOnManualIntervention', () => {
    describe('when updated label exists in indexed labels', () => {
      const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      const updatedLabel = JSON.parse(JSON.stringify(indexedLabel));
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: hasAllTheClaimsTokenStub,
        },
      };

      beforeEach(() => {
        updatedLabel.value.confidence = 1;
        updatedLabel.value.text = '';
        updatedLabel.value.type = 'text';
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('');
        indexingHelperServiceStub.getIndexedLabel.mockReturnValue(indexedLabel);
        (jwt_decode as jest.Mock).mockImplementationOnce(() => ({}));
        indexingPageState.updateOnManualIntervention(stateContextStub, {
          formValue: getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType),
        });
      });

      it('should call indexingHelperService getIndexedLabel function', () =>
        expect(indexingHelperServiceStub.getIndexedLabel).toHaveBeenNthCalledWith(
          1,
          getCompositeDataStub().indexed.labels,
          getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType).key
        ));

      it('should patchState null for associatedErrorMessage & associatedLookupFieldValue', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          associatedErrorMessage: null,
          associatedLookupFieldValue: null,
        }));

      it('should dispatch UpdateChangedLabels & UpdateCompositeDataLabels actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateChangedLabels(indexedLabel),
          new indexingPageActions.UpdateCompositeDataLabel(updatedLabel),
        ]));
    });

    describe('when associatedLookupFieldValue is null', () => {
      const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      const updatedLabel = JSON.parse(JSON.stringify(indexedLabel));

      beforeEach(() => {
        updatedLabel.value.confidence = 1;
        updatedLabel.value.text = '';
        updatedLabel.value.type = 'text';
        updatedLabel.value.boundingBox = ['1', '1', '1', '1', '1', '1', '1', '1'];
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
          associatedLookupFieldValue: null,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('');
        indexingHelperServiceStub.getIndexedLabel.mockReturnValue(indexedLabel);
        (jwt_decode as jest.Mock).mockImplementationOnce(() => ({}));
        indexingPageState.updateOnManualIntervention(stateContextStub, {
          formValue: getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType),
        });
      });

      it('should dispatch UpdateChangedLabels & UpdateCompositeDataLabels actions', () => {
        const removedBoundingBoxLabel = JSON.parse(JSON.stringify(updatedLabel));
        removedBoundingBoxLabel.value.boundingBox = [];

        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateChangedLabels(indexedLabel),
          new indexingPageActions.UpdateCompositeDataLabel(removedBoundingBoxLabel),
        ]);
      });
    });

    describe('when updated label DOES NOT exists in indexed labels', () => {
      const indexedLabel = {
        id: '00000000-0000-0000-0000-000000000000',
        label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
        page: 0,
        value: {
          boundingBox: [],
          confidence: 0,
          incomplete: false,
          incompleteReason: null,
          required: false,
          text: '',
          type: 'text',
          verificationState: 'NotRequired',
        },
      };
      const updatedLabel = JSON.parse(JSON.stringify(indexedLabel));

      beforeEach(() => {
        updatedLabel.value.confidence = 1;
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('');
        indexingHelperServiceStub.getIndexedLabel.mockReturnValue(indexedLabel);
        (jwt_decode as jest.Mock).mockImplementationOnce(() => ({}));
        indexingPageState.updateOnManualIntervention(stateContextStub, {
          formValue: getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber),
        });
      });

      it('should call indexingHelperService getIndexedLabel function', () =>
        expect(indexingHelperServiceStub.getIndexedLabel).toHaveBeenNthCalledWith(
          1,
          getCompositeDataStub().indexed.labels,
          getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber).key
        ));

      it('should patchState null for associatedErrorMessage & associatedLookupFieldValue', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          associatedErrorMessage: null,
          associatedLookupFieldValue: null,
        }));

      it('should dispatch UpdateChangedLabels & AddCompositeDataLabels actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateChangedLabels(indexedLabel),
          new indexingPageActions.AddCompositeDataLabel(updatedLabel),
        ]));
    });
  });

  describe('Action: UpdateCompositeDataLabel', () => {
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        compositeData: getCompositeDataStub(),
      });
      indexingPageState.updateCompositeDataLabel(stateContextStub, {
        indexedLabel,
      });
    });

    it('should patchState for updating label on compositeData', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        ...stateContextStub.getState(),
        compositeData: {
          ...stateContextStub.getState().compositeData,
          indexed: {
            ...stateContextStub.getState().compositeData.indexed,
            labels: [
              ...stateContextStub.getState().compositeData.indexed.labels.slice(0, 0),
              Object.assign(
                {},
                stateContextStub.getState().compositeData.indexed.labels[0],
                indexedLabel
              ),
              ...stateContextStub.getState().compositeData.indexed.labels.slice(1),
            ],
          },
        },
      }));
  });

  describe('Action: AddCompositeDataLabel', () => {
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        compositeData: getCompositeDataStub(),
      });
      indexingPageState.addCompositeDataLabel(stateContextStub, {
        indexedLabel,
      });
    });

    it('should patchState for adding label', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        ...stateContextStub.getState(),
        compositeData: {
          ...stateContextStub.getState().compositeData,
          indexed: {
            ...stateContextStub.getState().compositeData.indexed,
            labels: [...stateContextStub.getState().compositeData.indexed.labels, indexedLabel],
          },
        },
      }));
  });

  describe('Action: UpdateChangedLabels', () => {
    describe('when changedLabel is NOT a new label', () => {
      const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          originalCompositeData: getCompositeDataStub(),
        });
        indexingHelperServiceStub.updateChangedLabels.mockReturnValue([indexedLabelStub]);
        indexingPageState.updateChangedLabels(stateContextStub, {
          changedLabel: indexedLabel,
        });
      });

      it('should NOT patchState for adding label to originalCompositeData', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          originalCompositeData: {
            ...stateContextStub.getState().originalCompositeData,
            indexed: {
              ...stateContextStub.getState().originalCompositeData.indexed,
              labels: [
                ...stateContextStub.getState().originalCompositeData.indexed.labels,
                indexedLabel,
              ],
            },
          },
        }));

      it('should call indexingHelperService updateChangedLabels function', () =>
        expect(indexingHelperServiceStub.updateChangedLabels).toHaveBeenCalledTimes(1));

      it('should patchState for changedLabels', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          changedLabels: [indexedLabelStub],
        }));
    });

    describe('when changedLabel is a new label', () => {
      const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          originalCompositeData: getCompositeDataStub(),
        });
        indexingHelperServiceStub.updateChangedLabels.mockReturnValue([indexedLabelStub]);
        indexingPageState.updateChangedLabels(stateContextStub, {
          changedLabel: indexedLabel,
        });
      });

      it('should patchState for adding label to originalCompositeData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          originalCompositeData: {
            ...stateContextStub.getState().originalCompositeData,
            indexed: {
              ...stateContextStub.getState().originalCompositeData.indexed,
              labels: [
                ...stateContextStub.getState().originalCompositeData.indexed.labels,
                indexedLabel,
              ],
            },
          },
        }));

      it('should call indexingHelperService updateChangedLabels function', () =>
        expect(indexingHelperServiceStub.updateChangedLabels).toHaveBeenCalledTimes(1));

      it('should patchState for changedLabels', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(2, {
          changedLabels: [indexedLabelStub],
        }));
    });
  });

  describe('Action: QueryNextDocument', () => {
    describe('when getting next document successfully', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue({
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
              name: 'mockName',
            },
            token: '',
          },
        });
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        xdcServiceStub.getNextUnindexedDocument.mockReturnValue(of(compositeDataStub));
        indexingPageState
          .queryNextDocument(stateContextStub, { requestBody: searchBodyRequestStub })
          .subscribe();
      });

      it('should of called xdcService getNextUnindexedDocument function', () => {
        expect(xdcServiceStub.getNextUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockName',
          searchBodyRequestStub
        );
      });

      it('should dispatch HandleNextDocumentGiven action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.HandleNextDocumentGiven(compositeDataStub)
        ));
    });

    describe('when receiving an error', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue({
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
            },
            token: '',
            currentPage: null,
          },
        });
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
        xdcServiceStub.getNextUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should open a warning toast with a message of no more invoices', done => {
        indexingPageState
          .queryNextDocument(stateContextStub, { requestBody: searchBodyRequestStub })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
              expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
              done();
            },
          });
      });
    });

    describe('when receiving an error & current page is Queue', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue({
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
            },
            token: '',
            currentPage: AppPages.Queue,
          },
        });
        xdcServiceStub.getNextUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should open a warning toast with a message of no more invoices', done => {
        indexingPageState
          .queryNextDocument(stateContextStub, { requestBody: searchBodyRequestStub })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
              expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);

              done();
            },
          });
      });
    });

    describe('when receiving an error & current page is Research', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue({
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
            },
            token: '',
            currentPage: AppPages.Research,
          },
        });
        xdcServiceStub.getNextUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should open a warning toast with a message of no more invoices', done => {
        indexingPageState
          .queryNextDocument(stateContextStub, { requestBody: searchBodyRequestStub })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
              expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['research']);

              done();
            },
          });
      });
    });

    describe('when receiving an error & current page is Recycle Bin', () => {
      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue({
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
            },
            token: '',
            currentPage: AppPages.RecycleBin,
          },
        });
        xdcServiceStub.getNextUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should open a warning toast with a message of no more invoices', done => {
        indexingPageState
          .queryNextDocument(stateContextStub, { requestBody: searchBodyRequestStub })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
              expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['recyclebin']);

              done();
            },
          });
      });
    });
  });

  describe('Action: GetNextDocument', () => {
    const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
    describe('When is document is locked by other user', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      documentStub.userLock.indexer = 'mockIndexerLockUser';
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .getNextDocument(stateContextStub, {
            documentId: '1',
            requestBody: searchBodyRequestStub,
            action: 'Submit',
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc1',
          'mockIndexerName'
        );
      });

      it('should dispatch some GetNextDocument', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.GetNextDocument('mockDoc1', searchBodyRequestStub, 'Submit')
        ));
    });

    describe('when invoice submitted is the last one in the queue', () => {
      const invoicesMock = [];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(storeMock));
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 1,
        });
        indexingPageState
          .getNextDocument(stateContextStub, {
            documentId: 'mockDoc2',
            requestBody: searchBodyRequestStub,
            action: 'Submit',
          })
          .subscribe();
      });

      it('should NOT call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).not.toHaveBeenCalled();
      });

      it('should NOT dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());

      it('should navigate back to the currentPage', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]));
    });

    describe('When is Queue Page and submits an invoice document and there is a invoice list on the store', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .getNextDocument(stateContextStub, {
            documentId: 'mockDoc2',
            requestBody: searchBodyRequestStub,
            action: 'Submit',
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc3',
          'mockIndexerName'
        );
      });

      it('should dispatch HandleNextDocumentGiven', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.HandleNextDocumentGiven(documentStub)
        ));

      it('should dispatch UpdateQueueOnInvoiceSubmit', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new UpdateQueueOnInvoiceSubmit('mockDoc2')
        ));
    });

    describe('When is MyUploads Page and submits an invoice document and there is a invoice list on the store', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.UploadsQueue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .getNextDocument(stateContextStub, {
            documentId: 'mockDoc2',
            requestBody: searchBodyRequestStub,
            action: 'Submit',
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc3',
          'mockIndexerName'
        );
      });

      it('should dispatch HandleNextDocumentGiven', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.HandleNextDocumentGiven(documentStub)
        ));

      it('should dispatch UpdateMyUploadsInvoiceSubmit', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new UpdateMyUploadsInvoiceSubmit('mockDoc2')
        ));
    });

    describe('When is Research Page and submits an invoice document and there is a invoice list on the store', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Research,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .getNextDocument(stateContextStub, {
            documentId: 'mockDoc2',
            requestBody: searchBodyRequestStub,
            action: 'Submit',
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc3',
          'mockIndexerName'
        );
      });

      it('should dispatch HandleNextDocumentGiven', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.HandleNextDocumentGiven(documentStub)
        ));

      it('should dispatch UpdateMyUploadsInvoiceSubmit', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new UpdateResearchQueueOnInvoiceSubmit('mockDoc2')
        ));
    });

    describe('When is RecycleBin Page and submits an invoice document and there is a invoice list on the store', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.RecycleBin,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .getNextDocument(stateContextStub, {
            documentId: 'mockDoc2',
            requestBody: searchBodyRequestStub,
            action: 'Submit',
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc3',
          'mockIndexerName'
        );
      });

      it('should dispatch HandleNextDocumentGiven', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.HandleNextDocumentGiven(documentStub)
        ));

      it('should dispatch UpdateRecycleBinQueueOnInvoiceSubmit', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          2,
          new UpdateRecycleBinQueueOnInvoiceSubmit('mockDoc2')
        ));
    });

    describe('When is Queue Page and the user submit an invoice and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc3',
          requestBody: searchBodyRequestStub,
          action: 'Recycle Bin',
        });
      });

      it('should dispatch QueryQueueInvoices', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryQueueInvoices()));
    });

    describe('When is MyUploads and the user submits an invoice and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.UploadsQueue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc3',
          requestBody: searchBodyRequestStub,
          action: 'Submit',
        });
      });

      it('should dispatch QueryUploadedInvoices', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryUploadedInvoices()));
    });

    describe('When is Research page and the user submits an invoice and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Research,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc3',
          requestBody: searchBodyRequestStub,
          action: 'Submit',
        });
      });

      it('should dispatch QueryResearchInvoices', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryResearchInvoices()));
    });

    describe('When is RecycleBin page and the user submits an invoice and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.RecycleBin,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc3',
          requestBody: searchBodyRequestStub,
          action: 'Submit',
        });
      });

      it('should dispatch QueryRecycleBinDocuments', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new QueryRecycleBinDocuments()
        ));
    });

    describe('When is QueuePAge page and the user submits an invoices and there are no more invoices to load', () => {
      const invoicesMock = [{ documentId: 'mockDoc1' }];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 1,
          myUploadsCount: 1,
          escalationCount: 1,
          recycleBinCount: 1,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 1,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc1',
          requestBody: searchBodyRequestStub,
          action: 'Submit',
        });
      });

      it('should show Warning toas message and navigate to Queue page', () => {
        expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]);
      });
    });

    describe('When is UploadsQueue page and the user submits an invoices and there are no more invoices to load', () => {
      const invoicesMock = [{ documentId: 'mockDoc1' }];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.UploadsQueue,
          documentCount: 1,
          myUploadsCount: 1,
          escalationCount: 1,
          recycleBinCount: 1,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 1,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc1',
          requestBody: searchBodyRequestStub,
          action: 'Submit',
        });
      });

      it('should show Warning toas message and navigate to UploadsQueue page', () => {
        expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.UploadsQueue]);
      });
    });

    describe('When is Research page and the user submits an invoices and there are no more invoices to load', () => {
      const invoicesMock = [{ documentId: 'mockDoc1' }];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Research,
          documentCount: 1,
          myUploadsCount: 1,
          escalationCount: 1,
          recycleBinCount: 1,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 1,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc1',
          requestBody: searchBodyRequestStub,
          action: 'Submit',
        });
      });

      it('should show Warning toas message and navigate to Research page', () => {
        expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.Research]);
      });
    });

    describe('When is RecycleBin page and the user submits an invoices and there are no more invoices to load', () => {
      const invoicesMock = [{ documentId: 'mockDoc1' }];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.RecycleBin,
          documentCount: 1,
          myUploadsCount: 1,
          escalationCount: 1,
          recycleBinCount: 1,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 1,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.getNextDocument(stateContextStub, {
          documentId: 'mockDoc1',
          requestBody: searchBodyRequestStub,
          action: 'Submit',
        });
      });

      it('should show Warning toas message and navigate to RecycleBin page', () => {
        expect(indexingHelperServiceStub.handleNoMoreInvoices).toHaveBeenNthCalledWith(1);
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, [AppPages.RecycleBin]);
      });
    });
  });

  describe('Action: SkipDocument', () => {
    describe('When is document is locked by other user', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      documentStub.userLock.indexer = 'mockIndexerLockUser';
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .skipDocument(stateContextStub, {
            docId: '1',
            index: 1,
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc1',
          'mockIndexerName'
        );
      });

      it('should dispatch some SkipDocument', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.SkipDocument('mockDoc1', 1)
        ));
    });

    describe('When is Queue Page and the user wants a previous document and there is a invoice list on the store', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .skipDocument(stateContextStub, {
            docId: 'mockDoc2',
            index: -1,
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc1',
          'mockIndexerName'
        );
      });

      it('should setState back to defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          compositeData: null,
          pdfFile: null,
          hasNewEscalations: false,
          buyerId: null,
          latestFieldAssociation: null,
          originalCompositeData: null,
          changedLabels: [],
          associatedErrorMessage: null,
          escalation: null,
          startDate: '',
          allowedToUnlockDocument: true,
          associatedLookupFieldValue: null,
          isReadOnly: true,
          swappedDocument: null,
          updateFontFace: false,
          disableHighlight: null,
          pageFilters: null,
        }));

      it('should dispatch some actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.HandleNextDocumentGiven(documentStub),
          new UnlockDocument('mockDoc2'),
        ]));
    });

    describe('When is Queue Page and the user wants the Next document and there is a invoice list on the store', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState
          .skipDocument(stateContextStub, {
            docId: 'mockDoc2',
            index: 1,
          })
          .subscribe();
      });

      it('Should call getUnindexedDocument service ', () => {
        expect(xdcServiceStub.getUnindexedDocument).toHaveBeenNthCalledWith(
          1,
          'mockDoc3',
          'mockIndexerName'
        );
      });

      it('should setState back to defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          compositeData: null,
          pdfFile: null,
          hasNewEscalations: false,
          buyerId: null,
          latestFieldAssociation: null,
          originalCompositeData: null,
          changedLabels: [],
          associatedErrorMessage: null,
          escalation: null,
          startDate: '',
          allowedToUnlockDocument: true,
          associatedLookupFieldValue: null,
          isReadOnly: true,
          swappedDocument: null,
          updateFontFace: false,
          disableHighlight: null,
          pageFilters: null,
        }));

      it('should dispatch some actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.HandleNextDocumentGiven(documentStub),
          new UnlockDocument('mockDoc2'),
        ]));
    });

    describe('When is Queue Page and the user wants the Next document and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Queue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.skipDocument(stateContextStub, {
          docId: 'mockDoc3',
          index: 1,
        });
      });

      it('should dispatch QueryQueueInvoices', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryQueueInvoices()));
    });

    describe('When is MyUploads Page and the user wants the Next document and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.UploadsQueue,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.skipDocument(stateContextStub, {
          docId: 'mockDoc3',
          index: 1,
        });
      });

      it('should dispatch QueryUploadedInvoices', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryUploadedInvoices()));
    });

    describe('When is MyUploads Page and the user wants the Next document and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.Research,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.skipDocument(stateContextStub, {
          docId: 'mockDoc3',
          index: 1,
        });
      });

      it('should dispatch QueryResearchInvoices', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, new QueryResearchInvoices()));
    });

    describe('When is RecycleBin Page and the user wants the Next document and there is no more invoices in the list but remains no loaded invoices', () => {
      const invoicesMock = [
        { documentId: 'mockDoc1' },
        { documentId: 'mockDoc2' },
        { documentId: 'mockDoc3' },
      ];
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: '',
          currentPage: AppPages.RecycleBin,
          documentCount: 10,
          myUploadsCount: 10,
          escalationCount: 10,
          recycleBinCount: 10,
          pendingPage: invoicesMock,
          uploadsQueuePage: invoicesMock,
          researchPage: invoicesMock,
          recycleBinPage: invoicesMock,
        },
      } as any;

      const documentStub = getCompositeDataStub();
      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        storeStub.selectSnapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getPageData.mockReturnValue({
          invoices: invoicesMock,
          invoicesPageCount: 5,
        });
        xdcServiceStub.getUnindexedDocument.mockReturnValue(of(documentStub));
        indexingPageState.skipDocument(stateContextStub, {
          docId: 'mockDoc3',
          index: 1,
        });
      });

      it('should dispatch QueryRecycleBinDocuments', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new QueryRecycleBinDocuments()
        ));
    });

    describe('When there is no page name', () => {
      describe('User wants to get next document', () => {
        const invoicesMock = [
          { documentId: 'mockDoc1' },
          { documentId: 'mockDoc2' },
          { documentId: 'mockDoc3' },
        ];
        const storeMock = {
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
            },
            token: '',
            currentPage: null,
          },
        } as any;

        beforeEach(() => {
          storeStub.snapshot.mockReturnValue(storeMock);
          storeStub.selectSnapshot.mockReturnValue(invoicesMock);
          indexingPageState.skipDocument(stateContextStub, {
            docId: 'mockDoc2',
            index: 1,
          });
        });

        it('should dispatch some actions', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            1,
            new indexingPageActions.SkipToNextDocument('mockDoc2')
          ));
      });

      describe('User wants to get next document', () => {
        const invoicesMock = [
          { documentId: 'mockDoc1' },
          { documentId: 'mockDoc2' },
          { documentId: 'mockDoc3' },
        ];
        const storeMock = {
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
            },
            token: '',
            currentPage: null,
          },
        } as any;

        beforeEach(() => {
          storeStub.snapshot.mockReturnValue(storeMock);
          storeStub.selectSnapshot.mockReturnValue(invoicesMock);
          indexingPageState.skipDocument(stateContextStub, {
            docId: 'mockDoc2',
            index: -1,
          });
        });

        it('should dispatch some actions', () =>
          expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
            1,
            new indexingPageActions.SkipToPreviousDocument('mockDoc2')
          ));
      });
    });
  });

  describe('Action: SkipToPreviousDocument', () => {
    describe('when receiving a document back from next query', () => {
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockName',
          },
          token: '',
          currentPage: AppPages.Queue,
        },
      } as any;

      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
      const documentStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(of(documentStub));

        indexingPageState
          .skipToPreviousDocument(stateContextStub, {
            docId: '44',
          })
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
          searchBodyRequestStub
        ));

      it('should setState back to defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          compositeData: null,
          pdfFile: null,
          hasNewEscalations: false,
          buyerId: null,
          latestFieldAssociation: null,
          originalCompositeData: null,
          changedLabels: [],
          associatedErrorMessage: null,
          escalation: null,
          startDate: '',
          allowedToUnlockDocument: true,
          associatedLookupFieldValue: null,
          isReadOnly: true,
          swappedDocument: null,
          updateFontFace: false,
          disableHighlight: null,
          pageFilters: null,
        }));

      it('should dispatch some actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.HandleNextDocumentGiven(documentStub),
          new UnlockDocument('44'),
        ]));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should throw an error toast', done => {
        indexingPageState
          .skipToPreviousDocument(stateContextStub, {
            docId: '44',
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

  describe('Action: SkipToNextDocument', () => {
    describe('when receiving a document back from next query', () => {
      const storeMock = {
        core: {
          orgIds: [],
          userAccount: {
            preferred_username: 'mockName',
          },
          token: '',
          currentPage: AppPages.Queue,
        },
      } as any;

      const searchBodyRequestStub = getAggregateBodyRequest({ buyerId: '25' } as any);
      const documentStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.snapshot.mockReturnValue(storeMock);
        indexingHelperServiceStub.getNextDocumentRequestBody.mockReturnValue(searchBodyRequestStub);
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(of(documentStub));

        indexingPageState
          .skipToNextDocument(stateContextStub, {
            docId: '44',
          })
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
          searchBodyRequestStub
        ));

      it('should setState back to defaults', () =>
        expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
          compositeData: null,
          pdfFile: null,
          hasNewEscalations: false,
          buyerId: null,
          latestFieldAssociation: null,
          originalCompositeData: null,
          changedLabels: [],
          associatedErrorMessage: null,
          escalation: null,
          startDate: '',
          allowedToUnlockDocument: true,
          associatedLookupFieldValue: null,
          isReadOnly: true,
          swappedDocument: null,
          updateFontFace: false,
          disableHighlight: null,
          pageFilters: null,
        }));

      it('should dispatch some actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.HandleNextDocumentGiven(documentStub),
          new UnlockDocument('44'),
        ]));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.getSkipUnindexedDocument.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should throw an error toast', done => {
        indexingPageState
          .skipToNextDocument(stateContextStub, {
            docId: '44',
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

  describe('Action: SetBuyerId', () => {
    beforeEach(() => {
      indexingPageState.setBuyerId(stateContextStub, {
        buyerId: '44',
      });
    });

    it('should patchState for buyerId', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        buyerId: 44,
      }));
  });

  describe('Action: RoundCurrencyValues', () => {
    describe('When invoiceAmount has a value', () => {
      const compositeData = getCompositeDataStub();
      beforeEach(() => {
        compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.InvoiceAmount;
        compositeData.indexed.labels[0].value.text = '587.568';
        stateContextStub.getState.mockReturnValue({ compositeData });
        formatterServiceStub.getCurrencyDouble.mockReturnValueOnce('587.57');
        indexingPageState.roundCurrencyValues(stateContextStub);
      });

      it('should patch compositeData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          compositeData,
        }));
    });

    describe('When PreviousBalance has a value', () => {
      const compositeData = getCompositeDataStub();
      beforeEach(() => {
        compositeData.indexed.labels[0].label = DocumentLabelKeys.nonLookupLabels.PreviousBalance;
        compositeData.indexed.labels[0].value.text = '587.568';
        stateContextStub.getState.mockReturnValue({ compositeData });
        formatterServiceStub.getCurrencyDouble.mockReturnValueOnce('587.57');
        indexingPageState.roundCurrencyValues(stateContextStub);
      });

      it('should patch compositeData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          compositeData,
        }));
    });

    describe('When InvoiceAmoutn and PreviousBalance has no value', () => {
      const compositeData = getCompositeDataStub();
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ compositeData });
        indexingPageState.roundCurrencyValues(stateContextStub);
      });

      it('should patch compositeData', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
          compositeData,
        }));
    });
  });

  describe('Action: RemoveLatestFieldAssociation', () => {
    beforeEach(() => {
      indexingPageState.removeLatestFieldAssociation(stateContextStub);
    });

    it('should patchState for latestFieldAssociation', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        latestFieldAssociation: null,
      }));
  });

  describe('Action: SetPdfFileValue', () => {
    const stateStub = {
      core: {
        userAccount: {
          preferred_username: 'mockIndexerName',
        },
      },
    };

    beforeEach(() => {
      pageHelperServiceStub.getPdfFileRequest.mockReturnValue({
        url: `api/file/1`,
        httpHeaders: { Authorization: `Bearer token` },
        withCredentials: true,
      });
      storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
      stateContextStub.getState.mockReturnValue({ compositeData: getCompositeDataStub() });
      indexingPageState.setPdfFileValue(stateContextStub);
    });

    it('should patchState for pdfFile', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        pdfFile: {
          url: `api/file/1`,
          httpHeaders: { Authorization: `Bearer token` },
          withCredentials: true,
        },
      }));
  });

  describe('Action: SetPdfSecret', () => {
    const pdfFileStub = {
      url: 'mockUrl',
      httpHeaders: { Authorization: `Bearer token` },
      withCredentials: true,
    };

    beforeEach(() => {
      stateContextStub.getState.mockReturnValue({
        pdfFile: pdfFileStub,
      });
      indexingPageState.setPdfPassword(stateContextStub, { secret: 'mock' });
    });

    it('should patchState for pdfFile adding password prop', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        pdfFile: {
          ...pdfFileStub,
          password: 'mock',
        },
        isReadOnly: true,
      }));
  });

  describe('Action: UpdateLookupFieldAssociationValue', () => {
    const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
    beforeEach(() => {
      indexingPageState.updateLookupFieldAssociationValue(stateContextStub, {
        field: fieldStub,
      });
    });

    it('should patchState for associatedLookupFieldValue', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        associatedLookupFieldValue: fieldStub,
      }));
  });

  describe('Action: ResetIndexingState', () => {
    beforeEach(() => {
      jest.spyOn(window.sessionStorage.__proto__, 'setItem').mockImplementation();
      indexingPageState.resetIndexingState(stateContextStub);
    });

    it('should set pageFilters into sessionStorage as null', () =>
      expect(localStorage.setItem).toHaveBeenNthCalledWith(1, 'indexingPage.pageFilters', null));

    it('should setState back to defaults', () =>
      expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
        compositeData: null,
        pdfFile: null,
        hasNewEscalations: false,
        buyerId: null,
        latestFieldAssociation: null,
        originalCompositeData: null,
        changedLabels: [],
        associatedErrorMessage: null,
        escalation: null,
        startDate: '',
        allowedToUnlockDocument: true,
        associatedLookupFieldValue: null,
        isReadOnly: false,
        swappedDocument: null,
        updateFontFace: false,
        disableHighlight: null,
        pageFilters: null,
      }));
  });

  describe('Action: UpdateLabelsAfterThresholdCheck', () => {
    const stateStub = {
      core: {
        userAccount: {
          preferred_username: 'mockIndexerName',
        },
        token: hasAllTheClaimsTokenStub,
      },
    };
    describe('when indexingDocumentFields state is defined', () => {
      const indexedLabels = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];

      beforeEach(() => {
        jest
          .spyOn(IndexingPageSelectors, 'activityToDisplay')
          .mockImplementation(() => escalationActivityStub);
        (jwt_decode as jest.Mock).mockImplementationOnce(() => ({}));
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        storeStub.select.mockImplementation(cb =>
          of(
            cb({
              indexingDocumentFields: {
                formFields: getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
              },
            })
          )
        );
        storeStub.selectOnce.mockReturnValueOnce(of(true));
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        jest.spyOn(indexingHelperServiceStub, 'updateLabelValueUponThresholdCheck');
        indexingHelperServiceStub.updateLabelValueUponThresholdCheck.mockReturnValue(indexedLabels);
        indexingPageState.updateLabelsAfterThresholdCheck(stateContextStub).subscribe();
      });

      it('should patchState for updated labels', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          ...stateContextStub.getState(),
          compositeData: {
            ...stateContextStub.getState().compositeData,
            indexed: {
              ...stateContextStub.getState().compositeData.indexed,
              labels: indexedLabels,
            },
          },
        }));

      it('should dispatch ParseDocumentFormFields & EnableQueueSockets actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new ParseDocumentFormFields(),
          new indexingPageActions.EnableQueueSockets(),
        ]));

      it('should call updateLabelValueUponThresholdCheck with hasEscalation', () =>
        expect(
          indexingHelperServiceStub.updateLabelValueUponThresholdCheck
        ).toHaveBeenNthCalledWith(1, expect.anything(), expect.anything(), false, true, true));
    });

    describe('when indexingDocumentFields state is NULL', () => {
      const stateStub = {
        core: {
          userAccount: {
            preferred_username: 'mockIndexerName',
          },
          token: hasAllTheClaimsTokenStub,
        },
      };
      const indexedLabels = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];

      beforeEach(() => {
        jest
          .spyOn(IndexingPageSelectors, 'activityToDisplay')
          .mockImplementation(() => activityStub);
        (jwt_decode as jest.Mock).mockImplementationOnce(() => ({}));
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        storeStub.select.mockImplementation(cb =>
          of(
            cb({
              indexingDocumentFields: null,
            })
          )
        );
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        indexingHelperServiceStub.updateLabelValueUponThresholdCheck.mockReturnValue(indexedLabels);
        indexingPageState.updateLabelsAfterThresholdCheck(stateContextStub).subscribe();
      });

      it('should patchState for updated labels', () =>
        expect(stateContextStub.patchState).not.toHaveBeenCalled());
    });
  });

  describe('Action: UpdateSupplierAddressLabel', () => {
    const boundingBoxCoordsStub = [1, 1, 1, 1, 1, 1, 1, 1];
    const compositeData = getCompositeDataStub();
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.SupplierAddress);
    const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.SupplierAddress);

    describe('valid SupplierAddressLabel', () => {
      compositeData.indexed.labels.push(indexedLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData,
        });
        indexingPageState.updateSupplierAddressLabel(stateContextStub, {
          supplierAddressFormValue: fieldBaseStub,
          boundingBoxCoordinates: boundingBoxCoordsStub,
        });
      });

      it('should update supplier address label text, confidence, & bounding box values', () => {
        const supplierAddressLabel = compositeData.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.lookupLabels.SupplierAddress
        );

        expect(supplierAddressLabel.value.text).toBe('');
        expect(supplierAddressLabel.value.confidence).toBe(1);
        expect(supplierAddressLabel.value.boundingBox).toEqual(boundingBoxCoordsStub);
      });

      it('should dispatch UpdateCompositeDataLabel action with updated supplier address label', () => {
        const supplierAddressLabel = compositeData.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.lookupLabels.SupplierAddress
        );
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateChangedLabels(supplierAddressLabel),
          new indexingPageActions.UpdateCompositeDataLabel(supplierAddressLabel),
        ]);
      });
    });

    describe('invalid SupplierAddress label', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        indexingPageState.updateSupplierAddressLabel(stateContextStub, {
          supplierAddressFormValue: fieldBaseStub,
          boundingBoxCoordinates: boundingBoxCoordsStub,
        });
      });

      it('should NOT dispatch UpdateCompositeDataLabel action when supplier address label not found', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('Action: UpdateShipToAddressLabel', () => {
    const boundingBoxCoordsStub = [1, 1, 1, 1, 1, 1, 1, 1];
    const compositeData = getCompositeDataStub();
    const indexedLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToAddress);
    const fieldBaseStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.ShipToAddress);

    describe('valid ShipToAddress label', () => {
      compositeData.indexed.labels.push(indexedLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData,
        });
        indexingPageState.updateShipToAddressLabel(stateContextStub, {
          shipToAddressFormValue: fieldBaseStub,
          boundingBoxCoordinates: boundingBoxCoordsStub,
        });
      });

      it('should update ship to address label text, confidence, & bounding box values', () => {
        const shipTpAddressLabel = compositeData.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.lookupLabels.ShipToAddress
        );

        expect(shipTpAddressLabel.value.text).toBe('');
        expect(shipTpAddressLabel.value.confidence).toBe(1);
        expect(shipTpAddressLabel.value.boundingBox).toEqual(boundingBoxCoordsStub);
      });

      it('should dispatch UpdateCompositeDataLabel action with updated ship to address label', () => {
        const shipTpAddressLabel = compositeData.indexed.labels.find(
          lbl => lbl.label === DocumentLabelKeys.lookupLabels.ShipToAddress
        );
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.UpdateCompositeDataLabel(shipTpAddressLabel)
        );
      });
    });

    describe('invalid ShipToAddress label', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData: getCompositeDataStub(),
        });
        indexingPageState.updateSupplierAddressLabel(stateContextStub, {
          supplierAddressFormValue: fieldBaseStub,
          boundingBoxCoordinates: boundingBoxCoordsStub,
        });
      });

      it('should NOT dispatch UpdateCompositeDataLabel action when shipto address label not found', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('no ShipToAddress label found', () => {
      const compositeDataCopy = JSON.parse(JSON.stringify(compositeData));
      compositeDataCopy.indexed.labels = [];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          compositeData: compositeDataCopy,
        });
        indexingPageState.updateShipToAddressLabel(stateContextStub, {
          shipToAddressFormValue: fieldBaseStub,
          boundingBoxCoordinates: boundingBoxCoordsStub,
        });
      });

      it('should NOT dispatch UpdateCompositeDataLabel action with updated ship to address label', () => {
        expect(stateContextStub.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('Action: AddAutoFormatActivity', () => {
    describe('addActivity() for AutoFormat error', () => {
      const compositeData = getCompositeDataStub();
      const invoiceNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.InvoiceNumber
      );
      const date = new Date();
      compositeData.indexed.labels.push(invoiceNumberLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ startDate: date });

        indexingPageState.addAutoFormatActivity(stateContextStub, {
          indexedDocument: compositeData.indexed,
          error: {
            documentId: '1234',
            reason: 'Duplicate detected for auto formatted invoice number',
            sourceDocumentId: null,
            invoiceNumber: 'W1000023',
          },
        });
      });

      afterEach(() => {
        compositeData.indexed.activities = [];
      });

      it('should call indexingHelperService addActivity function', () => {
        expect(indexingHelperServiceStub.addActivity).toHaveBeenNthCalledWith(
          1,
          compositeData.indexed,
          [invoiceNumberLabel],
          ActivityTypes.Update,
          'System',
          null,
          date,
          []
        );
      });
    });

    describe('addActivity() not called for regular duplicate detected', () => {
      const compositeData = getCompositeDataStub();
      const invoiceNumberLabel = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.InvoiceNumber
      );
      const date = new Date();
      compositeData.indexed.labels.push(invoiceNumberLabel);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({ startDate: date });

        indexingPageState.addAutoFormatActivity(stateContextStub, {
          indexedDocument: compositeData.indexed,
          error: {
            documentId: '1234',
            reason: 'Duplicate Detected',
            sourceDocumentId: null,
            invoiceNumber: 'W1000023',
          },
        });
      });

      it('should NOT call indexingHelperService addActivity function', () => {
        expect(indexingHelperServiceStub.addActivity).not.toHaveBeenCalled();
      });
    });

    describe('addActivity() not called when no invoice number label', () => {
      const indexedData = {
        labels: [],
      };

      beforeEach(() => {
        indexingPageState.addAutoFormatActivity(stateContextStub, {
          indexedDocument: indexedData as unknown as IndexedData,
          error: {
            documentId: '1234',
            reason: '',
            sourceDocumentId: null,
            invoiceNumber: 'W1000023',
          },
        });
      });

      it('should NOT call indexingHelperService addActivity function', () => {
        expect(indexingHelperServiceStub.addActivity).not.toHaveBeenCalled();
      });
    });
  });

  describe('Action: UpdateSwappedDocument', () => {
    const stateStub = {
      core: {
        userAccount: {
          preferred_username: 'mockIndexerName',
        },
      },
    };
    const compositeDataStub = getCompositeDataStub();
    const indexedDataStub = getCompositeDataStub().indexed;
    indexedDataStub.fileId = 'mock';

    beforeEach(() => {
      pageHelperServiceStub.getPdfFileRequest.mockReturnValue({
        url: `api/file/1`,
        httpHeaders: { Authorization: `Bearer token` },
        withCredentials: true,
      });
      storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
      stateContextStub.getState.mockReturnValue({
        compositeData: compositeDataStub,
        swappedDocument: null,
      });
      indexingPageState.updateSwappedDocument(stateContextStub, {
        indexedDocument: indexedDataStub,
      });
    });

    it('should setState with passed in indexedData & get new swapped document', () =>
      expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
        ...stateContextStub.getState(),
        compositeData: {
          ...stateContextStub.getState().compositeData,
          indexed: indexedDataStub,
        },
        swappedDocument: {
          url: `api/file/1`,
          httpHeaders: { Authorization: `Bearer token` },
          withCredentials: true,
        },
      }));
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
        storeStub.snapshot.mockReturnValue({
          core: {
            orgIds: [],
            userAccount: {
              preferred_username: 'mockName',
              name: 'mockName',
            },
            token: '',
          },
        });
        indexingPageState.handleNextDocumentGiven(stateContextStub, {
          document: compositeDataStub,
        });
      });

      it('should patchState for compositeData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          compositeData: compositeDataStub,
          pdfFile: {
            url: `api/file/1`,
            httpHeaders: { Authorization: `Bearer token` },
            withCredentials: true,
          },
          hasNewEscalations: false,
          originalCompositeData: compositeDataStub,
          associatedErrorMessage: null,
          startDate: expect.anything(),
        }));

      it('should navigate you to the indexing page', () =>
        expect(routerStub.navigate).toHaveBeenNthCalledWith(1, ['indexing', '1']));

      it('should dispatch SetExistingSupplier, SetExistingProperty, and SetBuyerId actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryDocumentCardSetCounts(),
          new indexingPageActions.SetBuyerId('25'),
          new indexingPageActions.SetPdfFileValue(),
          new SendLockMessage('mockName', compositeDataStub.unindexed.documentId, '25'),
          new StartLockHeartbeat(compositeDataStub.unindexed.documentId, '25'),
          new indexingPageActions.UpdateLabelsAfterThresholdCheck(),
          new SetExistingProperty(),
          new SetExistingSupplier(),
          new indexingPageActions.InitialInvoiceTypeLabelValueCheck(),
        ]));
    });
  });

  describe('Action: updateFontFace', () => {
    beforeEach(() => {
      indexingPageState.updateFontFace(stateContextStub, { updateFontFace: true });
    });
    it('should patch updateFontFace', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { updateFontFace: true });
    });
  });

  describe('Action: disableHighlight', () => {
    beforeEach(() => {
      indexingPageState.disableHighlight(stateContextStub, { disableHighlight: true });
    });
    it('should patch disableHighlight', () => {
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { disableHighlight: true });
    });
  });

  describe('Action: StorePageFilters', () => {
    const pageFilters = getAdvancedFilterStub();

    beforeEach(() => {
      jest.spyOn(window.sessionStorage.__proto__, 'setItem').mockImplementation();
      indexingPageState.storePageFilters(stateContextStub, { pageFilters });
    });

    it('should set pageFilters into sessionStorage', () =>
      expect(localStorage.setItem).toHaveBeenNthCalledWith(
        1,
        'indexingPage.pageFilters',
        JSON.stringify(pageFilters)
      ));

    it('should patchState for pageFilters with passed in filters', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { pageFilters }));
  });

  describe('Action: InitialInvoiceTypeLabelValueCheck', () => {
    describe('when InvoiceType label exists and has a value', () => {
      const compositeData = getCompositeDataStub();
      const invoiceTypeLabelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.InvoiceType
      );

      invoiceTypeLabelStub.value.text = InvoiceTypes.Utility;
      compositeData.indexed.labels = [];
      compositeData.indexed.labels.push(invoiceTypeLabelStub);

      beforeEach(() => {
        stateContextStub.getState.mockReturnValueOnce({
          compositeData,
        });

        indexingPageState.initialInvoiceTypeLabelValueCheck(stateContextStub);
      });

      it('should keep invoice type label value as is', () =>
        expect(
          compositeData.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
          ).value.text
        ).toBe(InvoiceTypes.Utility));

      it('should not dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());
    });

    describe('when InvoiceType label exists but has no value', () => {
      const compositeData = getCompositeDataStub();
      const invoiceTypeLabelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.InvoiceType
      );
      const updatedLabelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);

      invoiceTypeLabelStub.value.text = '';
      compositeData.indexed.labels = [];
      compositeData.indexed.labels.push(invoiceTypeLabelStub);

      updatedLabelStub.value.text = InvoiceTypes.Standard;
      updatedLabelStub.value.confidence = 1;

      beforeEach(() => {
        stateContextStub.getState.mockReturnValueOnce({
          compositeData,
        });

        indexingPageState.initialInvoiceTypeLabelValueCheck(stateContextStub);
      });

      it('should dispatch UpdateCompositeDataLabel action with updated label', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.UpdateCompositeDataLabel(updatedLabelStub)
        ));

      it('should set invoice type label value to Standard', () =>
        expect(
          compositeData.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
          ).value.text
        ).toBe(InvoiceTypes.Standard));

      it('should set invoice type label confidence to 1', () =>
        expect(
          compositeData.indexed.labels.find(
            lbl => lbl.label === DocumentLabelKeys.nonLookupLabels.InvoiceType
          ).value.confidence
        ).toBe(1));
    });

    describe('when InvoiceType does not exist', () => {
      const compositeData = getCompositeDataStub();
      const newLabelStub = {
        id: '00000000-0000-0000-0000-000000000000',
        label: DocumentLabelKeys.nonLookupLabels.InvoiceType,
        page: 0,
        value: {
          boundingBox: [],
          confidence: 1,
          incomplete: false,
          incompleteReason: null,
          required: false,
          text: InvoiceTypes.Standard,
          type: FieldTypes.String,
          verificationState: 'NotRequired',
        },
      };

      compositeData.indexed.labels = [];

      beforeEach(() => {
        stateContextStub.getState.mockReturnValueOnce({
          compositeData,
        });

        indexingPageState.initialInvoiceTypeLabelValueCheck(stateContextStub);
      });

      it('should dispatch AddCompositeDataLabel action with new label', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.AddCompositeDataLabel(newLabelStub)
        ));
    });
  });

  describe('Action: EnableQueueSockets', () => {
    describe('when current page is NULL', () => {
      const stateStub = {
        core: {
          currentPage: null,
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        indexingPageState.enableQueueSockets(stateContextStub);
      });

      it('should not dispatch any actions', () =>
        expect(stateContextStub.dispatch).not.toHaveBeenCalled());
    });

    describe('when current page is Pending Queue page', () => {
      const stateStub = {
        core: {
          currentPage: AppPages.Queue,
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        indexingPageState.enableQueueSockets(stateContextStub);
      });

      it('should dispatch SetPendingPageSignalEvents action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetPendingPageSignalEvents()
        ));
    });

    describe('when current page is Research Queue page', () => {
      const stateStub = {
        core: {
          currentPage: AppPages.Research,
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        indexingPageState.enableQueueSockets(stateContextStub);
      });

      it('should dispatch SetResearchPageSignalEvents action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetResearchPageSignalEvents()
        ));
    });

    describe('when current page is Recycle Bin Queue page', () => {
      const stateStub = {
        core: {
          currentPage: AppPages.RecycleBin,
        },
      };

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb => cb(stateStub));
        indexingPageState.enableQueueSockets(stateContextStub);
      });

      it('should dispatch SetResearchPageSignalEvents action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new SetRecycleBinPageSignalEvents()
        ));
    });
  });
});
