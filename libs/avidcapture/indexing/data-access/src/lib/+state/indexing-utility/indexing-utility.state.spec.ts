import {
  UpdatePendingQueueCount,
  UpdateRecycleBinQueueCount,
  UpdateResearchQueueCount,
  UpdateUploadsQueueCount,
} from '@ui-coe/avidcapture/core/data-access';
import {
  activityStub,
  createCustomerAccountStub,
  customerAccountsStub,
  getCompositeDataStub,
  getFieldBaseStub,
  getIndexedLabelStub,
  hasAllTheClaimsTokenStub,
  suppliersStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  ActivityTypes,
  DocumentLabelKeys,
  Escalation,
  EscalationLevelTypes,
  IndexingPageAction,
  RejectToSenderPayload,
  RejectToSenderTemplate,
  Document,
} from '@ui-coe/avidcapture/shared/types';
import { of, throwError } from 'rxjs';

import { UpdateFormattedFields } from '../indexing-document-fields/indexing-document-fields.actions';
import * as indexingPageActions from '../indexing-page/indexing-page.actions';
import { CreateIndexedLabel, UpdateOldBoundingBoxCoordinates } from './indexing-utility.actions';
import { IndexingUtilityState } from './indexing-utility.state';

describe('IndexingUtilityState', () => {
  const stateContextStub = {
    getState: jest.fn(),
    setState: jest.fn(),
    patchState: jest.fn(),
    dispatch: jest.fn(),
  };
  const xdcServiceStub = {
    unlockDocument: jest.fn(),
    lockDocument: jest.fn(),
    getArchivedDocument: jest.fn(),
  };
  const indexingHelperServiceStub = {
    createLabelColors: jest.fn(),
    getActivityLabel: jest.fn(),
    getDuplicateDocumentId: jest.fn(),
  };
  const retryServiceStub = {
    retryApiCall: jest.fn(),
  };
  const toastServiceStub = {
    success: jest.fn(),
    error: jest.fn(),
  };
  const socketServiceStub = {
    sendLockMessage: jest.fn(),
    sendUnlockMessage: jest.fn(),
    getQueueCount: jest.fn(),
  };
  const lookupApiServiceStub = {
    getCustomerAccounts: jest.fn(),
  };
  const formatterServiceStub = {
    getSanitizedFieldValue: jest.fn(),
    handleMaxFieldLength: jest.fn(),
  };
  const storeStub = {
    selectSnapshot: jest.fn(cb =>
      cb({
        core: {
          userAccount: {
            preferred_username: 'mockIndexer',
          },
          featureFlags: [{ id: 'Indexing.Xdc.AllEscalationsInternalIsActive', enabled: true }],
          token: hasAllTheClaimsTokenStub,
        },
        indexingPage: {
          compositeData: getCompositeDataStub(),
          startDate: '',
          allowedToUnlockDocument: true,
          buyerId: 1,
        },
      })
    ),
  };
  const documentSearchHelperServiceStub = {
    getCountAggregateRequest: jest.fn(),
  };

  const pageHelperServiceStub = {
    getDateRange: jest.fn(),
  };

  const bkwsServiceStub = {
    postRejectToSender: jest.fn(),
    postRejectToSenderTemplates: jest.fn(),
    postRejectToSenderCreate: jest.fn(),
    postRejectToSenderEdit: jest.fn(),
    postRejectToSenderDelete: jest.fn(),
  };

  const invoiceIngestionServiceStub = {
    swapInvoice: jest.fn(),
  };

  const indexingUtilityState = new IndexingUtilityState(
    xdcServiceStub as any,
    toastServiceStub as any,
    indexingHelperServiceStub as any,
    retryServiceStub as any,
    socketServiceStub as any,
    lookupApiServiceStub as any,
    formatterServiceStub as any,
    storeStub as any,
    documentSearchHelperServiceStub as any,
    pageHelperServiceStub as any,
    bkwsServiceStub as any,
    invoiceIngestionServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    it('should select all data from state', () =>
      expect(IndexingUtilityState.data({ labelColors: [] } as any)).toStrictEqual({
        labelColors: [],
      }));
  });

  describe('Action: LockDocument', () => {
    describe('when receiving a successful unlock', () => {
      beforeEach(() => {
        xdcServiceStub.lockDocument.mockReturnValue(of(null));
        indexingUtilityState
          .lockDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe();
      });

      it('should of called xdcService lockDocument api', () =>
        expect(xdcServiceStub.lockDocument).toHaveBeenNthCalledWith(1, '1'));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        xdcServiceStub.lockDocument.mockReturnValue(throwError(() => ({ status: 404 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error toast', done => {
        indexingUtilityState
          .lockDocument(stateContextStub, {
            documentId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(xdcServiceStub.lockDocument).toHaveBeenNthCalledWith(1, '1');
              done();
            },
          });
      });
    });
  });

  describe('Action: CreateLabelColors', () => {
    beforeEach(() => {
      indexingHelperServiceStub.createLabelColors.mockReturnValue([]);
      indexingUtilityState.createLabelColors(stateContextStub);
    });

    it('should of called indexingHelperService createLabelColors function', () =>
      expect(indexingHelperServiceStub.createLabelColors).toHaveBeenNthCalledWith(
        1,
        getCompositeDataStub().indexed
      ));

    it('should patchState for compositeData', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        labelColors: [],
      }));
  });

  describe('Action: HandleEscalationSubmission', () => {
    describe('when hasNewEscalations is TRUE', () => {
      const compositeData = getCompositeDataStub();
      beforeEach(() => {
        indexingUtilityState.handleEscalationSubmission(stateContextStub, {
          hasNewEscalations: true,
        });
      });

      it('should put document on escalation queue ', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.PutInEscalation(
            compositeData.indexed,
            IndexingPageAction.Save,
            compositeData.indexed.documentId
          )
        );
      });
    });

    describe('when hasNewEscalations is FALSE', () => {
      const compositeData = getCompositeDataStub();
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            core: {
              userAccount: {
                preferred_username: 'mockIndexer',
              },
            },
            indexingPage: {
              compositeData: getCompositeDataStub(),
              startDate: '',
            },
          })
        );
        indexingUtilityState.handleEscalationSubmission(stateContextStub, {
          hasNewEscalations: false,
        });
      });

      it('should dispatch the SaveIndexedDocument action', () => {
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.SaveIndexedDocument(
            compositeData.indexed,
            IndexingPageAction.Save,
            true
          )
        );
      });
    });
  });

  describe('Action: CreateCustomerAccountActivity', () => {
    const escalation: Escalation = {
      category: {
        issue: ActivityTypes.CreateNewAccount,
        reason: '',
      },
      description: ActivityTypes.CreateNewAccount,
      escalationLevel: EscalationLevelTypes.CustomerFacing,
      resolution: '',
    };

    describe('when termsLabel does NOT exist', () => {
      const compositeData = getCompositeDataStub();
      const customerAccountLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      compositeData.indexed.labels.push(customerAccountLabel);

      beforeEach(() => {
        compositeData.indexed.activities = [];
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData } })
        );
        indexingHelperServiceStub.getActivityLabel.mockReturnValue(customerAccountLabel);
        indexingUtilityState.createCustomerAccountActivity(stateContextStub, {
          customerAccount: createCustomerAccountStub,
        });
      });

      it('should dispatch UpdateCompositeDataActivity & CreateIndexedLabel actions', () => {
        const activity = activityStub;

        activity.activity = ActivityTypes.CreateNewAccount;
        activity.changeLog = null;
        activity.endDate = expect.anything();
        activity.startDate = expect.anything();
        activity.indexer = 'mockIndexer';
        activity.description = '';
        activity.labels = [
          customerAccountLabel,
          {
            id: '00000000-0000-0000-0000-000000000000',
            label: DocumentLabelKeys.nonLookupLabels.Terms,
            page: 0,
            value: {
              text: '',
              confidence: 1,
              boundingBox: [],
              required: false,
              incomplete: false,
              incompleteReason: null,
              type: 'string',
              verificationState: 'NotRequired',
            },
          },
        ];
        activity.escalation = escalation;

        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.SetEscalation(escalation),
          new indexingPageActions.AddCompositeDataActivity(activity),
          new CreateIndexedLabel(
            DocumentLabelKeys.nonLookupLabels.Terms,
            createCustomerAccountStub.paymentTerms
          ),
        ]);
      });
    });

    describe('when termsLabel does exist', () => {
      const compositeData = getCompositeDataStub();
      const customerAccountLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const termsLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.Terms);
      compositeData.indexed.labels.push(customerAccountLabel, termsLabel);

      beforeEach(() => {
        compositeData.indexed.activities = [];
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingPage: { compositeData } })
        );
        indexingHelperServiceStub.getActivityLabel
          .mockReturnValueOnce(customerAccountLabel)
          .mockReturnValueOnce(termsLabel);
        indexingUtilityState.createCustomerAccountActivity(stateContextStub, {
          customerAccount: createCustomerAccountStub,
        });
      });

      it('should dispatch UpdateCompositeDataEscalation & UpdateCompositeDataActivity & UpdateCompositeDataLabel actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.SetEscalation({
            category: {
              issue: ActivityTypes.CreateNewAccount,
              reason: '',
            },
            description: ActivityTypes.CreateNewAccount,
            escalationLevel: EscalationLevelTypes.CustomerFacing,
            resolution: '',
          }),
          new indexingPageActions.AddCompositeDataActivity({
            ordinal: 1,
            startDate: expect.anything(),
            endDate: expect.anything(),
            indexer: 'mockIndexer',
            activity: ActivityTypes.CreateNewAccount,
            changeLog: null,
            description: '',
            escalation,
            labels: [customerAccountLabel, termsLabel],
          }),
          new indexingPageActions.UpdateCompositeDataLabel(termsLabel),
        ]));
    });
  });

  describe('Action: CreateIndexedLabel', () => {
    beforeEach(() => {
      indexingUtilityState.createIndexedLabel(stateContextStub, {
        label: DocumentLabelKeys.nonLookupLabels.ShipToCode,
        labelValue: 'mock',
      });
    });

    it('should dispatch AddCompositeDataLabel action', () => {
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new indexingPageActions.AddCompositeDataLabel({
          id: '00000000-0000-0000-0000-000000000000',
          label: DocumentLabelKeys.nonLookupLabels.ShipToCode,
          page: 0,
          value: {
            boundingBox: [],
            confidence: 1,
            incomplete: false,
            incompleteReason: null,
            required: false,
            text: 'mock',
            type: 'string',
            verificationState: 'NotRequired',
          },
        }),
        new indexingPageActions.UpdateChangedLabels({
          id: '00000000-0000-0000-0000-000000000000',
          label: DocumentLabelKeys.nonLookupLabels.ShipToCode,
          page: 0,
          value: {
            boundingBox: [],
            confidence: 1,
            incomplete: false,
            incompleteReason: null,
            required: false,
            text: 'mock',
            type: 'string',
            verificationState: 'NotRequired',
          },
        }),
      ]);
    });
  });

  describe('Action: ConfirmNewAccount', () => {
    describe('when receiving data back from the API and records is more than 0', () => {
      const responseStub = {
        count: 2,
        records: customerAccountsStub,
      };
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingDocumentFields: { selectedSupplier: suppliersStub[0] } })
        );
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingUtilityState
          .confirmNewAccount(stateContextStub, {
            accountNumber: 'test',
          })
          .subscribe();
      });

      it('should call lookupApiServiceStub.getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          'test',
          suppliersStub[0].vendorID,
          true
        ));

      it('should patchState for customerAccountExists with true', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          customerAccountExists: true,
        }));
    });

    describe('when receiving data back from the API and records is 0', () => {
      const responseStub = {
        count: 0,
        records: [],
      };
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingDocumentFields: { selectedSupplier: suppliersStub[0] } })
        );
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(responseStub));
        indexingUtilityState
          .confirmNewAccount(stateContextStub, {
            accountNumber: 'test',
          })
          .subscribe();
      });

      it('should call lookupApiServiceStub.getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).toHaveBeenNthCalledWith(
          1,
          'test',
          suppliersStub[0].vendorID,
          true
        ));

      it('should patchState for customerAccountExists with false', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          customerAccountExists: false,
        }));
    });

    describe('when receiving an error back from the API', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingDocumentFields: { selectedSupplier: suppliersStub[0] } })
        );
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
      });

      it('should patchState with empty array', done => {
        indexingUtilityState
          .confirmNewAccount(stateContextStub, { accountNumber: 'test' })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
                customerAccounts: customerAccountsStub,
              });

              done();
            },
          });
      });
    });

    describe('when a supplier is not selected', () => {
      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementationOnce(cb =>
          cb({ indexingDocumentFields: { selectedSupplier: null } })
        );
        lookupApiServiceStub.getCustomerAccounts.mockReturnValue(of(null));
        indexingUtilityState
          .confirmNewAccount(stateContextStub, {
            accountNumber: 'test',
          })
          .subscribe();
      });

      it('should NOT call lookupApiServiceStub.getCustomerAccounts function', () =>
        expect(lookupApiServiceStub.getCustomerAccounts).not.toHaveBeenNthCalledWith(
          1,
          'test',
          suppliersStub[0].vendorID
        ));

      it('should NOT patchState for customerAccountExists', () =>
        expect(stateContextStub.patchState).not.toHaveBeenNthCalledWith(1, {
          customerAccountExists: false,
        }));
    });
  });

  describe('Action: UpdateSelectedDocumentText', () => {
    beforeEach(() => {
      indexingUtilityState.updateSelectedDocumentText(stateContextStub, {
        selectedDocumentText: null,
      });
    });

    it('should patchState for selectedDocumentText', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        selectedDocumentText: null,
      }));
  });

  describe('Action: SanitizeFieldValue', () => {
    describe('when label is found & is a is Lookup Field', () => {
      const field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);
      const compositeData = getCompositeDataStub();
      const invoiceDateLabel = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);

      invoiceDateLabel.value.boundingBox = [1, 1, 1, 1, 0, 0, 0, 0];
      compositeData.indexed.labels.push(invoiceDateLabel);
      const expectedValue = invoiceDateLabel;
      expectedValue.value.text = '$100.00';

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({ core: { token: hasAllTheClaimsTokenStub }, indexingPage: { compositeData } })
        );
        stateContextStub.getState.mockReturnValueOnce({
          selectedDocumentText: invoiceDateLabel,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('$100.00');
        indexingUtilityState.sanitizeFieldValue(stateContextStub, {
          field,
          isLookupField: true,
        });
      });

      it('should set field.value to selectedText.value.text', () =>
        expect(field.value).toBe(expectedValue.value.text));

      it('should patchState for selectedDocumentText a null value', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedDocumentText: null,
        }));

      it('should dispatch UpdateOnLookupFieldAssociation & UpdateOldBoundingBoxCoordinates actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateOnLookupFieldAssociation(expectedValue),
          new UpdateOldBoundingBoxCoordinates([1, 1, 1, 1, 0, 0, 0, 0]),
          new UpdateFormattedFields(field),
        ]));
    });

    describe('when label is found & is Customer Account Number & value is over 50 characters long', () => {
      const field = getFieldBaseStub(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
      const compositeData = getCompositeDataStub();
      const accountLabel = getIndexedLabelStub(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      );
      const longText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

      accountLabel.value.boundingBox = [1, 1, 1, 1, 0, 0, 0, 0];
      accountLabel.value.text = longText;
      compositeData.indexed.labels.push(accountLabel);
      const expectedValue = accountLabel;
      expectedValue.value.text = 'Lorem ipsum dolor sit amet, consectetur adipiscing';

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({ core: { token: hasAllTheClaimsTokenStub }, indexingPage: { compositeData } })
        );
        stateContextStub.getState.mockReturnValueOnce({
          selectedDocumentText: accountLabel,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce(longText);
        formatterServiceStub.handleMaxFieldLength.mockReturnValueOnce(
          'Lorem ipsum dolor sit amet, consectetur adipiscing'
        );
        indexingUtilityState.sanitizeFieldValue(stateContextStub, {
          field,
          isLookupField: true,
        });
      });

      it('should call handleMaxFieldLength helper function', () =>
        expect(formatterServiceStub.handleMaxFieldLength).toHaveBeenNthCalledWith(1, longText, 50));

      it('should set field.value to selectedText.value.text', () =>
        expect(field.value).toBe(expectedValue.value.text));
    });

    describe('when label is NOT found && is NOT a Lookup Field', () => {
      const field = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
      const compositeData = getCompositeDataStub();
      const invoiceDateLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);
      const expectedValue = invoiceDateLabel;
      expectedValue.label = field.key;
      expectedValue.value.type = field.type;
      expectedValue.value.text = '$100.00';

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({ core: { token: hasAllTheClaimsTokenStub }, indexingPage: { compositeData } })
        );
        stateContextStub.getState.mockReturnValueOnce({
          selectedDocumentText: invoiceDateLabel,
        });
        formatterServiceStub.getSanitizedFieldValue.mockReturnValueOnce('$100.00');
        indexingUtilityState.sanitizeFieldValue(stateContextStub, {
          field,
          isLookupField: false,
        });
      });

      it('should set field.value to selectedText.value.text', () =>
        expect(field.value).toBe(expectedValue.value.text));

      it('should patchState for selectedDocumentText a null value', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          selectedDocumentText: null,
        }));

      it('should dispatch UpdateOnNonLookupFieldAssociation & UpdateOldBoundingBoxCoordinates actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateOnNonLookupFieldAssociation(expectedValue),
          new UpdateOldBoundingBoxCoordinates([]),
          new UpdateFormattedFields(field),
        ]));
    });
  });

  describe('Action: SetDuplicateDocumentId', () => {
    beforeEach(() => {
      indexingUtilityState.setDuplicateDocumentId(stateContextStub, {
        duplicateDetectionError: {
          documentId: 'mock',
          sourceDocumentId: null,
          reason: '',
          invoiceNumber: '',
        },
      });
    });

    it('should patchState for duplicateDetectionError', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        duplicateDetectionError: {
          documentId: 'mock',
          sourceDocumentId: null,
          reason: '',
          invoiceNumber: '',
        },
      }));
  });

  describe('Action: UpdateAdditionalLookupValue', () => {
    describe('when passed in label is NOT NULL', () => {
      const shipToCodeLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.ShipToCode);

      beforeEach(() => {
        indexingUtilityState.updateAdditionalLookupValue(stateContextStub, {
          label: shipToCodeLabel,
          lookupValue: 'mockCode',
          labelName: DocumentLabelKeys.nonLookupLabels.ShipToCode,
        });
      });

      it('should set label value to the passed in lookupValue', () =>
        expect(shipToCodeLabel.value.text).toBe('mockCode'));

      it('should set label confidence to 1', () =>
        expect(shipToCodeLabel.value.confidence).toBe(1));

      it('should dispatch UpdateCompositeDataLabel & UpdateChangedLabels actions', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
          new indexingPageActions.UpdateCompositeDataLabel(shipToCodeLabel),
          new indexingPageActions.UpdateChangedLabels(shipToCodeLabel),
        ]));
    });

    describe('when passed in label is NULL', () => {
      beforeEach(() => {
        indexingUtilityState.updateAdditionalLookupValue(stateContextStub, {
          label: undefined,
          lookupValue: undefined,
          labelName: DocumentLabelKeys.nonLookupLabels.ShipToCode,
        });
      });

      it('should dispatch CreateIndexedLabel action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new CreateIndexedLabel(DocumentLabelKeys.nonLookupLabels.ShipToCode, undefined)
        ));
    });
  });

  describe('Action: UpdateOldBoundingBoxCoordinates', () => {
    beforeEach(() => {
      indexingUtilityState.updateOldBoundingBoxCoordinates(stateContextStub, {
        coordinates: [],
      });
    });

    it('should patchState for oldBoundingBoxCoordinates', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        oldBoundingBoxCoordinates: [],
      }));
  });

  describe('Action: QueryRejectToSenderTemplates', () => {
    describe('when receiving templates back from api', () => {
      const templateStub: RejectToSenderTemplate[] = [
        {
          templateId: '2341',
          sourceSystemBuyerId: '1',
          sourceSystemId: '1',
          templateName: 'mock',
          templateSubjectLine: 'mock',
          notificationTemplate: 'mock',
          isActive: true,
        },
      ];

      beforeEach(() => {
        bkwsServiceStub.postRejectToSenderTemplates.mockReturnValueOnce(of(templateStub));
        indexingUtilityState
          .queryRejectToSenderTemplates(stateContextStub, {
            buyerId: 25,
          })
          .subscribe();
      });

      it('should call out to the bkws api for reject to sender templates', () =>
        expect(bkwsServiceStub.postRejectToSenderTemplates).toHaveBeenNthCalledWith(1, 25));

      it('should patchState for rejectToSenderTemplates', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          rejectToSenderTemplates: templateStub,
        }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        bkwsServiceStub.postRejectToSenderTemplates.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should not patchState', done => {
        indexingUtilityState
          .queryRejectToSenderTemplates(stateContextStub, {
            buyerId: 25,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(bkwsServiceStub.postRejectToSenderTemplates).toHaveBeenNthCalledWith(1, 25);
              expect(stateContextStub.patchState).not.toHaveBeenCalled();

              done();
            },
          });
      });
    });
  });

  describe('Action: CheckForDuplicateDocument', () => {
    describe('when receiving an archived document back', () => {
      const compositeDataStub = getCompositeDataStub();
      const archivedCompositeDataStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData: compositeDataStub,
            },
          })
        );
        indexingHelperServiceStub.getDuplicateDocumentId.mockReturnValueOnce('481984');
        xdcServiceStub.getArchivedDocument.mockReturnValueOnce(of(archivedCompositeDataStub));

        indexingUtilityState.checkForDuplicateDocument(stateContextStub).subscribe();
      });

      it('should call out to the indexingHelperService to get the duplicate document id', () =>
        expect(indexingHelperServiceStub.getDuplicateDocumentId).toHaveBeenNthCalledWith(
          1,
          compositeDataStub.indexed.activities
        ));

      it('should call out to the xdcService api for the archived document', () =>
        expect(xdcServiceStub.getArchivedDocument).toHaveBeenNthCalledWith(1, '481984'));

      it('should patchState for duplicateIndexedData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          duplicateIndexedData: archivedCompositeDataStub.indexed,
        }));
    });

    describe('when duplicateDocumentId is not defined', () => {
      const compositeDataStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData: compositeDataStub,
            },
          })
        );
        indexingHelperServiceStub.getDuplicateDocumentId.mockReturnValueOnce(null);

        indexingUtilityState.checkForDuplicateDocument(stateContextStub).subscribe();
      });

      it('should call out to the indexingHelperService to get the duplicate document id', () =>
        expect(indexingHelperServiceStub.getDuplicateDocumentId).toHaveBeenNthCalledWith(
          1,
          compositeDataStub.indexed.activities
        ));

      it('should NOT call out to the xdcService api for the archived document', () =>
        expect(xdcServiceStub.getArchivedDocument).not.toHaveBeenCalled());

      it('should patchState for duplicateIndexedData', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          duplicateIndexedData: null,
        }));
    });

    describe('when receiving an error', () => {
      const compositeDataStub = getCompositeDataStub();

      beforeEach(() => {
        storeStub.selectSnapshot.mockImplementation(cb =>
          cb({
            indexingPage: {
              compositeData: compositeDataStub,
            },
          })
        );
        indexingHelperServiceStub.getDuplicateDocumentId.mockReturnValueOnce('77781');
        xdcServiceStub.getArchivedDocument.mockReturnValue(throwError(() => ({ status: 500 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should patchState for duplicateIndexedData', done => {
        indexingUtilityState.checkForDuplicateDocument(stateContextStub).subscribe({
          next: () => {
            return;
          },
          error: () => {
            expect(xdcServiceStub.getArchivedDocument).toHaveBeenNthCalledWith(1, '77781');
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
              duplicateIndexedData: null,
            });

            done();
          },
        });
      });
    });
  });

  describe('Action: PostRejectToSender', () => {
    describe('when receiving templates back from api', () => {
      const payloadStub: RejectToSenderPayload = {
        toEmailAddress: 'mock@mock.com',
        templateId: 1,
        submitterEmailAddress: 'mock1@mock.com',
        fileId: 0,
        dateReceived: '2022-04-23T18:25:43.511Z',
      };

      beforeEach(() => {
        bkwsServiceStub.postRejectToSender.mockReturnValueOnce(of({}));
        indexingUtilityState
          .postRejectToSender(stateContextStub, {
            payload: payloadStub,
          })
          .subscribe();
      });

      it('should call out to the bkws api to post the reject to sender', () =>
        expect(bkwsServiceStub.postRejectToSender).toHaveBeenNthCalledWith(1, payloadStub));

      it('should display a toast message', () => {
        expect(toastServiceStub.success).toHaveBeenNthCalledWith(
          1,
          'Email submitted successfully to recipient.'
        );
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        bkwsServiceStub.postRejectToSender.mockReturnValue(throwError(() => ({ status: 500 })));
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 500 })));
      });

      it('should throw an error', done => {
        indexingUtilityState
          .postRejectToSender(stateContextStub, {
            payload: null,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(bkwsServiceStub.postRejectToSender).toHaveBeenNthCalledWith(1, null);
              expect(toastServiceStub.error).toHaveBeenNthCalledWith(
                1,
                'Email submission failed. Please try submitting your email again. Contact support if the problem persists.'
              );

              done();
            },
          });
      });
    });
  });

  describe('Action: CreateRejectToSenderTemplate', () => {
    describe('when successfully creating a template', () => {
      const payloadStub: RejectToSenderTemplate = {
        sourceSystemBuyerId: '25',
        sourceSystemId: 'AvidSuite',
        templateName: 'Mock',
        templateSubjectLine: 'Shmock',
        notificationTemplate: '<html>nonsense</html>',
        isActive: true,
      };

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          rejectToSenderTemplates: [
            {
              sourceSystemBuyerId: '25',
              sourceSystemId: 'AvidSuite',
              templateName: 'Mock',
              templateSubjectLine: 'Shmock',
              notificationTemplate: '<html>mocksense</html>',
              isActive: true,
              templateId: '2',
            },
          ],
        });
        bkwsServiceStub.postRejectToSenderCreate.mockReturnValueOnce(of(1234));
        indexingUtilityState
          .createRejectToSenderTemplate(stateContextStub, {
            payload: payloadStub,
          })
          .subscribe();
      });

      it('should call out to the bkws api for creating a reject to sender template', () =>
        expect(bkwsServiceStub.postRejectToSenderCreate).toHaveBeenNthCalledWith(1, payloadStub));

      it('should patchState for rejectToSenderTemplates', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          rejectToSenderTemplates: [
            {
              sourceSystemBuyerId: '25',
              sourceSystemId: 'AvidSuite',
              templateName: 'Mock',
              templateSubjectLine: 'Shmock',
              notificationTemplate: '<html>mocksense</html>',
              isActive: true,
              templateId: '2',
            },
            { ...payloadStub, templateId: '1234' },
          ],
        }));

      it('should display a toast message', () => {
        expect(toastServiceStub.success).toHaveBeenNthCalledWith(1, 'Template added.');
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        bkwsServiceStub.postRejectToSenderCreate.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        indexingUtilityState
          .createRejectToSenderTemplate(stateContextStub, {
            payload: null,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(bkwsServiceStub.postRejectToSenderCreate).toHaveBeenNthCalledWith(1, null);
              expect(stateContextStub.patchState).not.toHaveBeenCalled();

              done();
            },
          });
      });
    });
  });

  describe('Action: EditRejectToSenderTemplate', () => {
    describe('when successfully editing a template', () => {
      const payloadSub: RejectToSenderTemplate = {
        sourceSystemBuyerId: '25',
        sourceSystemId: 'AvidSuite',
        templateName: 'Mock',
        templateSubjectLine: 'Shmock',
        notificationTemplate: '<html>nonsense</html>',
        isActive: true,
        templateId: '2',
      };

      beforeEach(() => {
        stateContextStub.getState.mockReturnValue({
          rejectToSenderTemplates: [
            {
              sourceSystemBuyerId: '25',
              sourceSystemId: 'AvidSuite',
              templateName: 'Mock',
              templateSubjectLine: 'Shmock',
              notificationTemplate: '<html>mocksense</html>',
              isActive: true,
              templateId: '2',
            },
          ],
        });
        bkwsServiceStub.postRejectToSenderEdit.mockReturnValueOnce(of(null));
        indexingUtilityState
          .editRejectToSenderTemplate(stateContextStub, {
            payload: payloadSub,
          })
          .subscribe();
      });

      it('should call out to the bkws api for editing a reject to sender template', () =>
        expect(bkwsServiceStub.postRejectToSenderEdit).toHaveBeenNthCalledWith(1, payloadSub));

      it('should patchState for rejectToSenderTemplates', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          rejectToSenderTemplates: [payloadSub],
        }));

      it('should display a toast message', () => {
        expect(toastServiceStub.success).toHaveBeenNthCalledWith(1, 'Template saved.');
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        bkwsServiceStub.postRejectToSenderEdit.mockReturnValue(throwError(() => ({ status: 404 })));

        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        indexingUtilityState
          .editRejectToSenderTemplate(stateContextStub, {
            payload: null,
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(bkwsServiceStub.postRejectToSenderEdit).toHaveBeenNthCalledWith(1, null);
              expect(stateContextStub.patchState).not.toHaveBeenCalled();

              done();
            },
          });
      });
    });
  });

  describe('Action: DeleteRejectToSenderTemplate', () => {
    describe('when successfully deleting a template', () => {
      const templateStub = {
        sourceSystemBuyerId: '25',
        sourceSystemId: 'AvidSuite',
        templateName: 'Mock',
        templateSubjectLine: 'Shmock',
        notificationTemplate: '<html>nonsense</html>',
        isActive: true,
        templateId: '1',
      };

      beforeEach(() => {
        stateContextStub.getState.mockReturnValueOnce({
          rejectToSenderTemplates: [templateStub],
        });
        bkwsServiceStub.postRejectToSenderDelete.mockReturnValueOnce(of(null));
        indexingUtilityState
          .deleteRejectToSenderTemplate(stateContextStub, {
            templateId: '1',
          })
          .subscribe();
      });

      it('should call out to the bkws api for deleting a reject to sender template', () =>
        expect(bkwsServiceStub.postRejectToSenderDelete).toHaveBeenNthCalledWith(1, '1'));

      it('should patchState for rejectToSenderTemplates', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
          rejectToSenderTemplates: [],
        }));

      it('should display a toast message', () => {
        expect(toastServiceStub.success).toHaveBeenNthCalledWith(1, 'Template deleted.');
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        stateContextStub.getState.mockReturnValueOnce({
          rejectToSenderTemplates: [],
        });
        bkwsServiceStub.postRejectToSenderDelete.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        indexingUtilityState
          .deleteRejectToSenderTemplate(stateContextStub, {
            templateId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(bkwsServiceStub.postRejectToSenderDelete).toHaveBeenNthCalledWith(1, '1');
              expect(stateContextStub.patchState).not.toHaveBeenCalled();

              done();
            },
          });
      });
    });
  });

  describe('Action: EnableSubmitButton', () => {
    beforeEach(() => {
      indexingUtilityState.enableSubmitButton(stateContextStub, {
        canSubmit: false,
      });
    });

    it('should patchState for canSubmit with passed in value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { canSubmit: false }));
  });

  describe('Action: SwapDocument', () => {
    describe('when swap is successful', () => {
      const indexedData = getCompositeDataStub().indexed;

      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              core: {
                userAccount: {
                  preferred_username: 'mockName',
                },
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData: getCompositeDataStub(),
              },
            })
          );

        invoiceIngestionServiceStub.swapInvoice.mockReturnValueOnce(of(indexedData));
        indexingUtilityState
          .swapDocument(stateContextStub, {
            file: {} as any,
            organizationId: '1',
          })
          .subscribe();
      });

      it('should call invoiceIngestionService swapInvoice fn', () =>
        expect(invoiceIngestionServiceStub.swapInvoice).toHaveBeenNthCalledWith(
          1,
          {} as any,
          '1',
          'mockName',
          getCompositeDataStub().indexed
        ));

      it('should dispatch UpdateSwappedDocument action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new indexingPageActions.UpdateSwappedDocument(indexedData)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        storeStub.selectSnapshot
          .mockImplementationOnce(cb =>
            cb({
              core: {
                userAccount: {
                  preferred_username: 'mockName',
                },
              },
            })
          )
          .mockImplementationOnce(cb =>
            cb({
              indexingPage: {
                compositeData: getCompositeDataStub(),
              },
            })
          );

        invoiceIngestionServiceStub.swapInvoice.mockReturnValue(
          throwError(() => ({ status: 404 }))
        );
        retryServiceStub.retryApiCall.mockReturnValue(throwError(() => ({ status: 404 })));
      });

      it('should throw an error', done => {
        indexingUtilityState
          .swapDocument(stateContextStub, {
            file: {} as any,
            organizationId: '1',
          })
          .subscribe({
            next: () => {
              return;
            },
            error: () => {
              expect(invoiceIngestionServiceStub.swapInvoice).toHaveBeenNthCalledWith(
                1,
                {} as any,
                '1',
                'mockName',
                getCompositeDataStub().indexed
              );
              expect(stateContextStub.dispatch).not.toHaveBeenCalled();

              done();
            },
          });
      });
    });
  });

  describe('Action: UpdateAllQueueCounts()', () => {
    beforeEach(() => {
      indexingUtilityState.updateAllQueueCounts(stateContextStub);
    });

    it('should dispatch an action for each queues count', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new UpdatePendingQueueCount(),
        new UpdateUploadsQueueCount(),
        new UpdateResearchQueueCount(),
        new UpdateRecycleBinQueueCount(),
      ]));
  });
});
