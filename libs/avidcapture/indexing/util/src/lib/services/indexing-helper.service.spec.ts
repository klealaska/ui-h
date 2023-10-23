import { TestBed } from '@angular/core/testing';
import {
  FormatterService,
  PageHelperService,
  ToastService,
  ValidatorService,
} from '@ui-coe/avidcapture/core/util';
import {
  activityStub,
  compositeDataStub,
  fieldBaseStub,
  getActivityStub,
  getAdvancedFilterStub,
  getArchivedDocumentsStub,
  getCompositeDataStub,
  getFieldBaseStub,
  getIndexedLabelStub,
  getNextDocumentRequestBody,
} from '@ui-coe/avidcapture/shared/test';
import {
  Activity,
  ActivityTypes,
  AdvancedFiltersKeys,
  AggregateBodyRequest,
  AppPages,
  ChangeLog,
  DocumentLabelKeys,
  EscalationCategoryTypes,
  FieldBase,
  IndexedLabel,
  IndexingPageAction,
  IngestionTypes,
  InputDataTypes,
  LabelValue,
  LookupCustomerAccount,
  SearchBodyRequest,
  SortDirection,
  ToastNotifications,
  escalationCategoryReasonTypes,
} from '@ui-coe/avidcapture/shared/types';
import { documentLabelColors } from '@ui-coe/avidcapture/shared/util';

import { IndexingHelperService } from './indexing-helper.service';

const toastServiceSpy = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
};

const formatterServiceSpy = {
  getFormattedFieldValue: jest.fn(),
};

const validatorServiceSpy = {
  numericValidator: jest.fn(),
  currencyValidator: jest.fn(),
  dateValidator: jest.fn(),
};

const pageHelperServiceSpy = {
  getDateRange: jest.fn(),
};

const compositeDataMock = {
  indexed: {
    documentId: '1',
    fileId: '1',
    indexer: 'Mock Indexer',
    dateReceived: '10/30/2020',
    lastModified: '10/30/2020',
    labels: [
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: 'mock',
        page: 1,
        value: {
          text: 'mock',
          confidence: 99.99,
          boundingBox: [],
          required: false,
          verificationState: '',
          incomplete: false,
          incompleteReason: '',
          type: '',
        },
      },
      {
        id: '00000000-0000-0000-0000-000000000000',
        label: DocumentLabelKeys.nonLookupLabels.InvoiceType,
        page: 1,
        value: {
          text: '123456789',
          confidence: 99.99,
          boundingBox: [],
          required: false,
          verificationState: '',
          incomplete: false,
          incompleteReason: '',
          type: '',
        },
      },
    ],
    escalations: [],
    activities: [],
  },
};

describe('IndexingHelperService', () => {
  let service: IndexingHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastService,
          useValue: toastServiceSpy,
        },
        {
          provide: FormatterService,
          useValue: formatterServiceSpy,
        },
        {
          provide: ValidatorService,
          useValue: validatorServiceSpy,
        },
        {
          provide: PageHelperService,
          useValue: pageHelperServiceSpy,
        },
      ],
    });
    service = TestBed.inject(IndexingHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleSaveSubmitSuccess()', () => {
    const toastType = ToastNotifications.Success;
    const toastSettings = {
      tapToDismiss: false,
      timeOut: 5000,
    };
    const fileName = 'Mock Filename';

    describe('IndexingPageAction.Submit', () => {
      beforeEach(() => {
        service.handleSaveSubmitSuccess(IndexingPageAction.Submit, fileName);
      });

      it('should of opened a success toast message', () =>
        expect(toastServiceSpy.success).toHaveBeenNthCalledWith(1, expect.anything()));
    });

    describe('IndexingPageAction.Save', () => {
      beforeEach(() => {
        service.handleSaveSubmitSuccess(IndexingPageAction.Save, fileName);
      });

      it('should of opened a success toast message', () =>
        expect(toastServiceSpy.success).toHaveBeenNthCalledWith(1, expect.anything()));
    });

    describe('IndexingPageAction.Delete', () => {
      beforeEach(() => {
        service.handleSaveSubmitSuccess(IndexingPageAction.Delete, fileName);
      });

      it('should of opened a success toast message', () =>
        expect(toastServiceSpy.success).toHaveBeenNthCalledWith(1, expect.anything()));
    });
  });

  describe('handleSaveSubmitError()', () => {
    beforeEach(() => {
      service.handleSaveSubmitError(IndexingPageAction.Submit);
    });

    it('should of opened an error toast message', () =>
      expect(toastServiceSpy.error).toHaveBeenCalled());
  });

  describe('handleLookupError()', () => {
    beforeEach(() => {
      service.handleLookupError();
    });

    it('should of opened an error toast message', () =>
      expect(toastServiceSpy.error).toHaveBeenCalled());
  });

  describe('handleInactiveShipTo()', () => {
    beforeEach(() => {
      service.handleInactiveShipTo();
    });

    it('should of opened a warning toast message', () =>
      expect(toastServiceSpy.warning).toHaveBeenCalled());
  });

  describe('handleDocSwapSubmission()', () => {
    beforeEach(() => {
      service.handleDocSwapSubmission('mockFileName');
    });

    it('should of opened a success toast message', () =>
      expect(toastServiceSpy.success).toHaveBeenNthCalledWith(1, expect.anything()));
  });

  describe('handleNoMoreInvoices', () => {
    beforeEach(() => {
      service.handleNoMoreInvoices();
    });
    it('should of opened a warning toast message', () =>
      expect(toastServiceSpy.warning).toHaveBeenNthCalledWith(
        1,
        'There are no more invoices to index.'
      ));
  });

  describe('createLabelColors()', () => {
    describe('when needsColorLabel returns false', () => {
      it('should return an array of label colors', () => {
        expect(service.createLabelColors(compositeDataMock.indexed)).toEqual(documentLabelColors);
        expect(documentLabelColors.length).toBe(19);
      });
    });

    describe('when needsColorLabel returns true', () => {
      it('should return an array of label colors', () => {
        compositeDataMock.indexed.labels[0].label = 'mock';
        expect(service.createLabelColors(compositeDataMock.indexed)).toEqual(documentLabelColors);
        expect(documentLabelColors.length).toBe(19);
      });
    });
  });

  describe('getIndexedLabel()', () => {
    const newLabel = {
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
        type: '',
        verificationState: 'NotRequired',
      },
    };
    const indexedLabels = [getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName)];

    describe('when label is NOT found', () => {
      it('should return a new label', () =>
        expect(
          service.getIndexedLabel(
            indexedLabels,
            DocumentLabelKeys.lookupLabels.CustomerAccountNumber
          )
        ).toEqual(newLabel));
    });

    describe('when label is found', () => {
      it('should return a new label', () =>
        expect(
          service.getIndexedLabel(indexedLabels, DocumentLabelKeys.lookupLabels.ShipToName)
        ).toEqual(indexedLabels[0]));
    });
  });

  describe('assignValuesToFields()', () => {
    let returnedValue: FieldBase<string>[];

    describe('when field.key && label.label do not equal', () => {
      beforeEach(() => {
        returnedValue = service.assignValuesToFields(fieldBaseStub, compositeDataStub.indexed);
      });

      it('should return fieldBaseStub', () => expect(returnedValue).toEqual(fieldBaseStub));
    });

    describe('when field.key && label.label do equal', () => {
      fieldBaseStub[0].key = DocumentLabelKeys.lookupLabels.ShipToName;
      beforeEach(() => {
        returnedValue = service.assignValuesToFields(fieldBaseStub, compositeDataStub.indexed);
      });

      it('should set returnedValue.value to be fieldBaseStub value', () =>
        expect(returnedValue[0].value).toBe(fieldBaseStub[0].value));

      it('should set returnedValue.confidence to fieldBase confidence', () =>
        expect(returnedValue[0].confidence).toBe(fieldBaseStub[0].confidence));
    });

    describe('when field.key === OrderedBy', () => {
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels.push(
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.OrderedBy)
      );

      beforeEach(() => {
        const fieldStub = [
          getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.OrderedByName),
          getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy),
        ];

        fieldStub[0].value = 'OrderedByName';
        returnedValue = service.assignValuesToFields(fieldStub, compositeData.indexed);
      });

      it('should set returnedValue.value to be fieldBaseStub value', () =>
        expect(returnedValue[0].value).toBe('OrderedByName'));

      it('should set returnedValue.confidence to fieldBase confidence', () =>
        expect(returnedValue[0].confidence).toBe(fieldBaseStub[0].confidence));
    });

    describe('when field.key === OrderedBy but OrderedByName label is NULL', () => {
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels.push(
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.OrderedBy)
      );

      beforeEach(() => {
        const fieldStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.OrderedBy)];

        returnedValue = service.assignValuesToFields(fieldStub, compositeData.indexed);
      });

      it('should set returnedValue.value to be an empty string', () =>
        expect(returnedValue[0].value).toBe(''));
    });

    describe('when field.key === Workflow', () => {
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels.push(
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Workflow)
      );

      beforeEach(() => {
        const fieldStub = [
          getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.WorkflowName),
          getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow),
        ];

        fieldStub[0].value = 'WorkflowName';
        returnedValue = service.assignValuesToFields(fieldStub, compositeData.indexed);
      });

      it('should set returnedValue.value to be fieldBaseStub value', () =>
        expect(returnedValue[0].value).toBe('WorkflowName'));

      it('should set returnedValue.confidence to fieldBase confidence', () =>
        expect(returnedValue[0].confidence).toBe(fieldBaseStub[0].confidence));
    });

    describe('when field.key === Workflow but WorkflowName label is NULL', () => {
      const compositeData = getCompositeDataStub();
      compositeData.indexed.labels.push(
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Workflow)
      );

      beforeEach(() => {
        const fieldStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Workflow)];

        returnedValue = service.assignValuesToFields(fieldStub, compositeData.indexed);
      });

      it('should set returnedValue.value to be an empty string', () =>
        expect(returnedValue[0].value).toBe(''));
    });
  });

  describe('getActivityLabel()', () => {
    let returnedValue: IndexedLabel;

    beforeEach(() => {
      returnedValue = service.getActivityLabel(
        DocumentLabelKeys.nonLookupLabels.InvoiceType,
        '101',
        compositeDataStub.indexed
      );
    });

    it('should set the bounding box to an empty []', () =>
      expect(returnedValue.value.boundingBox).toEqual(
        compositeDataStub.indexed.labels[0].value.boundingBox
      ));

    it('should set label value to 101', () => expect(returnedValue.value.text).toBe('101'));

    it('should set label confidence to 1', () => expect(returnedValue.value.confidence).toBe(1));
  });

  describe('hasInternalEscalation()', () => {
    afterEach(() => {
      compositeDataStub.indexed.activities = [];
      compositeDataStub.indexed.activities.push(activityStub);
    });

    it('should return true if internalqa', () => {
      compositeDataStub.indexed.activities[0].escalation = {
        category: {
          issue: EscalationCategoryTypes.IndexerQa,
          reason: escalationCategoryReasonTypes.reason.ShipToField,
        },
        escalationLevel: '',
        description: '',
        resolution: '',
      };

      const result = service.internalEscalationCount(compositeDataStub.indexed) > 0;
      expect(result).toBeTruthy();
    });

    it('should return false if internal indexer activity', () => {
      compositeDataStub.indexed.activities[0].escalation = {
        category: {
          issue: EscalationCategoryTypes.IndexerActivity,
          reason: escalationCategoryReasonTypes.reason.ShipToField,
        },
        escalationLevel: '',
        description: '',
        resolution: '',
      };

      const result = service.internalEscalationCount(compositeDataStub.indexed) > 0;
      expect(result).toBeFalsy();
    });

    it('should return false if external type', () => {
      compositeDataStub.indexed.activities[0].escalation = {
        category: {
          issue: EscalationCategoryTypes.IndexingOpsQc,
          reason: escalationCategoryReasonTypes.reason.ShipToField,
        },
        escalationLevel: '',
        description: '',
        resolution: '',
      };

      const result = service.internalEscalationCount(compositeDataStub.indexed) > 0;
      expect(result).toBeFalsy();
    });
  });

  describe('updateChangedLabels()', () => {
    describe('when changedLabels array is empty', () => {
      let returnedValue: IndexedLabel[];
      beforeEach(() => {
        compositeDataStub.indexed.labels[0].label =
          DocumentLabelKeys.nonLookupLabels.InvoiceDueDate;
        returnedValue = service.updateChangedLabels(
          DocumentLabelKeys.nonLookupLabels.InvoiceDueDate,
          compositeDataStub.indexed,
          []
        );
      });

      afterEach(
        () =>
          (compositeDataStub.indexed.labels[0].label =
            DocumentLabelKeys.nonLookupLabels.InvoiceType)
      );

      it('should return an array of 1 label', () => {
        expect(returnedValue).toEqual([compositeDataStub.indexed.labels[0]]);
      });
    });

    describe('when label sent in already exists in the changedLabels array', () => {
      let returnedValue: IndexedLabel[];
      beforeEach(() => {
        returnedValue = service.updateChangedLabels(
          DocumentLabelKeys.nonLookupLabels.InvoiceType,
          compositeDataStub.indexed,
          [compositeDataStub.indexed.labels[0]]
        );
      });

      it('should return an array of 1 label', () => {
        expect(returnedValue).toEqual([compositeDataStub.indexed.labels[0]]);
        expect(returnedValue.length).toBe(1);
      });
    });
  });

  describe('generateChangeLog()', () => {
    describe('when labels have been changed', () => {
      const compositeData = getCompositeDataStub();
      const prevLabel = [getIndexedLabelStub(DocumentLabelKeys.lookupLabels.ShipToName)];
      let returnedValue: ChangeLog[];

      beforeEach(() => {
        returnedValue = service.generateChangeLog(compositeData.indexed, prevLabel);
      });

      it('should return an array of ChangedLog values', () =>
        expect(returnedValue).toEqual([
          {
            previous: prevLabel[0],
            current: compositeData.indexed.labels[1],
          },
        ]));
    });

    describe('when labels have NOT been changed', () => {
      const compositeData = getCompositeDataStub();
      let returnedValue: ChangeLog[];

      beforeEach(() => {
        returnedValue = service.generateChangeLog(compositeData.indexed, []);
      });

      it('should return an empty array', () => expect(returnedValue).toEqual([]));
    });
  });

  describe('addActivity()', () => {
    beforeEach(() => {
      service.addActivity(
        compositeDataStub.indexed,
        [compositeDataStub.indexed.labels[0]],
        'Save',
        'mockIndexer',
        compositeDataStub.indexed.activities[0].escalation,
        '',
        []
      );
    });

    it('should return indexedData with an activity of save', () =>
      expect(
        compositeDataStub.indexed.activities[compositeDataStub.indexed.activities.length - 1]
          .activity
      ).toBe('Save'));
  });

  describe('getFieldValidationMessage()', () => {
    describe('when field.value is empty string', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.WorkOrderNo);

      it('should return an empty string for message', () =>
        expect(service.getFieldValidationMessage(fieldStub)).toBe(''));
    });

    describe('when type is numeric & is INVALID', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.WorkOrderNo);

      beforeEach(() => {
        validatorServiceSpy.numericValidator.mockReturnValueOnce(false);
        fieldStub.type = InputDataTypes.Number;
        fieldStub.value = 'abcd';
      });

      it('should return invalid number format message', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('Invalid format. Numeric only');
        expect(validatorServiceSpy.numericValidator).toHaveBeenNthCalledWith(1, fieldStub.value);
      });
    });
    describe('when type is numeric & is VALID', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.PurchaseOrderIdentifier);

      beforeEach(() => {
        validatorServiceSpy.numericValidator.mockReturnValueOnce(true);
        fieldStub.type = InputDataTypes.Number;
        fieldStub.value = '1111';
      });

      it('should return return an empty string message', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('');
        expect(validatorServiceSpy.numericValidator).toHaveBeenNthCalledWith(1, fieldStub.value);
      });
    });

    describe('when type is currency & is an empty field value due to regex replacement', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = 'abcd';
      });

      it('should return invalid number format message & NOT call currencyValidator', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('Invalid format. Currency only');
        expect(validatorServiceSpy.currencyValidator).not.toHaveBeenNthCalledWith(
          1,
          fieldStub.value
        );
      });
    });

    describe('when type is currency & is NAN', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = '00.00.00';
      });

      it('should return invalid number format message & NOT call currencyValidator', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('Invalid format. Currency only');
        expect(validatorServiceSpy.currencyValidator).not.toHaveBeenNthCalledWith(
          1,
          fieldStub.value
        );
      });
    });

    describe('when type is currency & is larger than the int limit', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = '214748364799';
      });

      it('should return invalid number format message & NOT call currencyValidator', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('Invalid format. Currency only');
        expect(validatorServiceSpy.currencyValidator).not.toHaveBeenNthCalledWith(
          1,
          fieldStub.value
        );
      });
    });

    describe('when type is currency & is INVALID', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        formatterServiceSpy.getFormattedFieldValue.mockReturnValueOnce('$12,00');
        validatorServiceSpy.currencyValidator.mockReturnValueOnce(false);
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = 'abc12';
      });

      it('should return invalid number format message & call currencyValidator', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('Invalid format. Currency only');
        expect(formatterServiceSpy.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          fieldStub,
          '12'
        );
        expect(validatorServiceSpy.currencyValidator).toHaveBeenNthCalledWith(1, '$12,00');
      });
    });

    describe('when type is currency & is VALID', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        formatterServiceSpy.getFormattedFieldValue.mockReturnValueOnce('$1111.00');
        validatorServiceSpy.currencyValidator.mockReturnValueOnce(true);
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = '1111';
      });

      it('should return an empty string message', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('');
        expect(formatterServiceSpy.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          fieldStub,
          '1111'
        );
        expect(validatorServiceSpy.currencyValidator).toHaveBeenNthCalledWith(1, '$1111.00');
      });
    });

    describe('when type is currency & negative simbol is at the end', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceAmount);

      beforeEach(() => {
        formatterServiceSpy.getFormattedFieldValue.mockReturnValueOnce('$1234.00');
        validatorServiceSpy.currencyValidator.mockReturnValueOnce(true);
        fieldStub.type = InputDataTypes.Currency;
        fieldStub.value = '1234-';
      });

      it('should return an empty string message', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('');
        expect(formatterServiceSpy.getFormattedFieldValue).toHaveBeenNthCalledWith(
          1,
          fieldStub,
          '-1234'
        );
        expect(validatorServiceSpy.currencyValidator).toHaveBeenNthCalledWith(1, '$1234.00');
      });
    });

    describe('when type is date & is INVALID', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);

      beforeEach(() => {
        validatorServiceSpy.dateValidator.mockReturnValueOnce(false);
        fieldStub.type = InputDataTypes.Date;
        fieldStub.value = '0101';
      });

      it('should return invalid number format message', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe(
          'Invalid format. Please use mm/dd/yyyy'
        );
        expect(validatorServiceSpy.dateValidator).toHaveBeenNthCalledWith(1, fieldStub.value);
      });
    });

    describe('when type is date & is VALID', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceDate);

      beforeEach(() => {
        validatorServiceSpy.dateValidator.mockReturnValueOnce(true);
        fieldStub.type = InputDataTypes.Date;
        fieldStub.value = '010121';
      });

      it('should return an empty string message', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('');
        expect(validatorServiceSpy.dateValidator).toHaveBeenNthCalledWith(1, fieldStub.value);
      });
    });

    describe('when type is string', () => {
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber);

      beforeEach(() => {
        fieldStub.type = InputDataTypes.String;
        fieldStub.value = '010121';
      });

      it('should return an empty string message', () => {
        expect(service.getFieldValidationMessage(fieldStub)).toBe('');
      });
    });
  });

  describe('getNextDocumentRequestBody()', () => {
    describe('when currentPage is Queue', () => {
      describe('and indexingPage pageFilters are null', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Queue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: null,
          },
          pendingPage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are NO filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Queue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          pendingPage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Queue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          pendingPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is empty', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Queue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          pendingPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: {},
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is NULL', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Queue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          pendingPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: null,
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when pendingPage from state is NULL', () => {
        const storeStub = {
          core: {
            currentPage: AppPages.Queue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          pendingPage: null,
        };
        const expectedValue = getNextDocumentRequestBody({} as any);
        expectedValue.Controls.SearchAllPages = true;
        expectedValue.Filters = {
          buyerId: ['1337'] as any,
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        };

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () =>
          expect(service.getNextDocumentRequestBody(storeStub)).toEqual(expectedValue));
      });
    });

    describe('when currentPage is Research', () => {
      describe('and indexingPage pageFilters are null', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.RejectToSender}`,
          ],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Research,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            researchPageEscalationCategoryList: [],
          },
          indexingPage: {
            pageFilteres: null,
          },
          researchPage: {
            searchFields: [],
            filters: {
              buyerId: [],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
                `-${EscalationCategoryTypes.RejectToSender}`,
              ],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are NO filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.RejectToSender}`,
          ],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Research,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            researchPageEscalationCategoryList: [],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          researchPage: {
            searchFields: [],
            filters: {
              buyerId: [],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
                `-${EscalationCategoryTypes.RejectToSender}`,
              ],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.RejectToSender}`,
          ],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Research,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            researchPageEscalationCategoryList: [],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          researchPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
                `-${EscalationCategoryTypes.RejectToSender}`,
              ],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are filtered escalation category issues', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.RejectToSender}`,
            EscalationCategoryTypes.ShipToResearch,
          ],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Research,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            researchPageEscalationCategoryList: [],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          researchPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
                `-${EscalationCategoryTypes.RejectToSender}`,
                EscalationCategoryTypes.ShipToResearch,
              ],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is empty', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.RejectToSender}`,
          ],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Research,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            researchPageEscalationCategoryList: [],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          researchPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
                `-${EscalationCategoryTypes.RejectToSender}`,
              ],
            },
            sortedColumnData: {},
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is NULL', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.RejectToSender}`,
          ],
          isSubmitted: [0],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Research,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            researchPageEscalationCategoryList: [],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          researchPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
              escalationCategoryIssue: [
                `-${EscalationCategoryTypes.RecycleBin}`,
                `-${EscalationCategoryTypes.Void}`,
                `-${EscalationCategoryTypes.None}`,
                `-${EscalationCategoryTypes.RejectToSender}`,
              ],
            },
            sortedColumnData: null,
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when researchPage from state is NULL', () => {
        const storeStub = {
          core: {
            currentPage: AppPages.Research,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            researchPageEscalationCategoryList: [],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          researchPage: null,
        };
        const expectedValue = getNextDocumentRequestBody({} as any);
        expectedValue.Controls.SearchAllPages = true;
        expectedValue.Filters = {
          buyerId: ['1337'] as any,
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.RecycleBin}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.RejectToSender}`,
          ],
          isSubmitted: [0],
        };

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () =>
          expect(service.getNextDocumentRequestBody(storeStub)).toEqual(expectedValue));
      });
    });

    describe('when currentPage is Uploads Queue', () => {
      describe('and indexingPage pageFilters are null', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
          sourceEmail: ['mock'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.UploadsQueue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            userAccount: {
              preferred_username: 'mock',
            },
          },
          indexingPage: {
            pageFilteres: null,
          },
          uploadsQueuePage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are NO filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
          sourceEmail: ['mock'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.UploadsQueue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            userAccount: {
              preferred_username: 'mock',
            },
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          uploadsQueuePage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
          sourceEmail: ['mock'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.UploadsQueue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            userAccount: {
              preferred_username: 'mock',
            },
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          uploadsQueuePage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is empty', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
          sourceEmail: ['mock'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.UploadsQueue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            userAccount: {
              preferred_username: 'mock',
            },
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          uploadsQueuePage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: {},
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is NULL', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
          sourceEmail: ['mock'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.UploadsQueue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            userAccount: {
              preferred_username: 'mock',
            },
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          uploadsQueuePage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: null,
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when uploadsQueuePage from state is NULL', () => {
        const storeStub = {
          core: {
            currentPage: AppPages.UploadsQueue,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
            userAccount: {
              preferred_username: 'mock',
            },
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          uploadsQueuePage: null,
        };
        const expectedValue = getNextDocumentRequestBody({} as any);
        expectedValue.Controls.SearchAllPages = true;
        expectedValue.Filters = {
          buyerId: ['1337'] as any,
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
          isSubmitted: [0],
          sourceEmail: ['mock'],
        };

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () =>
          expect(service.getNextDocumentRequestBody(storeStub)).toEqual(expectedValue));
      });
    });

    describe('when currentPage is RecycleBin', () => {
      describe('and indexingPage pageFilters are NULL', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
          isSubmitted: [0],
          dateRecycled: ['1/1/22', '2/1/22'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.RecycleBin,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilters: null,
          },
          recycleBinPage: {
            searchFields: [],
            filters: {
              buyerId: [],
              escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
              isSubmitted: [0],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          pageHelperServiceSpy.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are NO filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
          isSubmitted: [0],
          dateRecycled: ['1/1/22', '2/1/22'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.RecycleBin,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          recycleBinPage: {
            searchFields: [],
            filters: {
              buyerId: [],
              escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
              isSubmitted: [0],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          jest.spyOn(service as any, 'determineCurrentPage').mockImplementationOnce(() => '');
          pageHelperServiceSpy.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1'],
          escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
          isSubmitted: [0],
          dateRecycled: ['1/1/22', '2/1/22'],
        } as any);
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.RecycleBin,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          recycleBinPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
              escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
              isSubmitted: [0],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          pageHelperServiceSpy.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is empty', () => {
        const requestStub = getNextDocumentRequestBody(
          {
            buyerId: ['1'],
            escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
            isSubmitted: [0],
            dateRecycled: ['1/1/22', '2/1/22'],
          } as any,
          SortDirection.Descending
        );
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.RecycleBin,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          recycleBinPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
              escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
              isSubmitted: [0],
            },
            sortedColumnData: {},
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          pageHelperServiceSpy.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is NULL', () => {
        const requestStub = getNextDocumentRequestBody(
          {
            buyerId: ['1'],
            escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
            isSubmitted: [0],
            dateRecycled: ['1/1/22', '2/1/22'],
          } as any,
          SortDirection.Descending
        );
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.RecycleBin,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          recycleBinPage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: null,
          },
        };
        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          pageHelperServiceSpy.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when recycleBinPage from state is NULL', () => {
        const storeStub = {
          core: {
            currentPage: AppPages.RecycleBin,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          indexingPage: {
            pageFilteres: getAdvancedFilterStub(),
          },
          recycleBinPage: null,
        };
        pageHelperServiceSpy.getDateRange.mockReturnValueOnce(['1/1/22', '2/1/22']);
        const expectedValue = getNextDocumentRequestBody({} as any);
        expectedValue.Controls.SearchAllPages = true;
        expectedValue.Filters = {
          buyerId: ['1337'] as any,
          escalationCategoryIssue: [EscalationCategoryTypes.RecycleBin],
          isSubmitted: [0],
        };
        expectedValue.SortDirection = SortDirection.Descending;
        expectedValue.Filters.dateRecycled = ['1/1/22', '2/1/22'];

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () =>
          expect(service.getNextDocumentRequestBody(storeStub)).toEqual(expectedValue));
      });
    });

    describe('when currentPage is Archive', () => {
      describe('and indexingPage pageFilters are null', () => {
        const requestStub = getNextDocumentRequestBody(
          {
            buyerId: ['1337'],
            isSubmitted: [1],
          } as any,
          SortDirection.Descending
        );
        requestStub.SortField = 'dateSubmitted';
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Archive,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          archivePage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are NO filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody(
          {
            buyerId: ['1337'],
            isSubmitted: [1],
          } as any,
          SortDirection.Descending
        );
        requestStub.SortField = 'dateSubmitted';
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Archive,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },

          archivePage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with orgIds for the filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('and there are filtered buyers', () => {
        const requestStub = getNextDocumentRequestBody({
          buyerId: ['1337'],
          isSubmitted: [1],
        } as any);

        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Archive,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          archivePage: {
            searchFields: [],
            filters: {
              buyerId: [
                {
                  id: '1337',
                  name: 'mock',
                },
              ],
            },
            sortedColumnData: { [AdvancedFiltersKeys.DateReceived]: SortDirection.Ascending },
          },
        };
        let expectedValue: AggregateBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with filtered buyerIds', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is empty', () => {
        const requestStub = getNextDocumentRequestBody(
          {
            buyerId: ['1337'],
            isSubmitted: [1],
          } as any,
          SortDirection.Descending
        );
        requestStub.SortField = 'dateSubmitted';
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Archive,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          archivePage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
            sortedColumnData: {},
          },
        };

        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });

      describe('when sortedColumnData is NULL', () => {
        const requestStub = getNextDocumentRequestBody(
          {
            buyerId: ['1337'],
            isSubmitted: [1],
          } as any,
          SortDirection.Descending
        );
        requestStub.SortField = 'dateSubmitted';
        requestStub.Controls.SearchAllPages = true;

        const storeStub = {
          core: {
            currentPage: AppPages.Archive,
            filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
          },
          archivePage: {
            searchFields: [],
            filters: {
              buyerId: [],
            },
            sortedColumnData: {},
          },
        };

        let expectedValue: SearchBodyRequest;

        beforeEach(() => {
          expectedValue = service.getNextDocumentRequestBody(storeStub);
        });

        it('should return a searchBodyRequest with default sort values', () => {
          expect(requestStub).toEqual(expectedValue);
        });
      });
    });

    describe('when currentPage is NULL', () => {
      const requestStub = getNextDocumentRequestBody({ buyerId: [] } as any);
      requestStub.Controls.SearchAllPages = true;

      const storeStub = {
        core: {
          currentPage: null,
          filteredBuyers: [{ id: '1337', name: 'LeetFleet' }],
        },
        indexingPage: {
          pageFilters: {
            escalationCategoryIssue: [],
          },
        },
        archivePage: null,
        archiveInvoicePage: null,
      };
      let expectedValue: SearchBodyRequest;

      beforeEach(() => {
        jest.spyOn(service as any, 'determineCurrentPage').mockImplementationOnce(() => '');
        expectedValue = service.getNextDocumentRequestBody(storeStub);
      });

      it('should return a searchBodyRequest with all default values', () => {
        expect(requestStub).toEqual(expectedValue);
      });
    });
  });

  describe('updateLabelValueUponThresholdCheck()', () => {
    describe('when label is not included in the document fields array', () => {
      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerId)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      let returnedValue: IndexedLabel[] = [];

      beforeEach(() => {
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          false,
          false,
          false
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(labelsStub));
    });

    describe('when label has a confidence score of 1', () => {
      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      labelsStub[0].value.confidence = 1;
      let returnedValue: IndexedLabel[] = [];

      beforeEach(() => {
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          false,
          false,
          false
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(labelsStub));
    });

    describe('when label is found, displayPredictedValuesLbl is ON, user is a Sponsor User, & confidence is higher than display threshold', () => {
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );
      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      let returnedValue: IndexedLabel[] = [];

      displayPredictedValuesLbl.value.text = '1';
      labelsStub[0].value.confidence = 0.95;
      fieldBaseStub[0].displayThreshold.view = 90;
      labelsStub.push(displayPredictedValuesLbl);

      beforeEach(() => {
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          false
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(labelsStub));
    });

    describe('when lookup label is included in the document fields array but confidence is below the threshold value', () => {
      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier)];
      let returnedValue: IndexedLabel[] = [];
      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier),
      ];

      labelsStub[0].value.confidence = 0.5;
      expectedValue[0].value.confidence = 0.5;
      expectedValue[0].value.text = '';
      expectedValue[0].value.boundingBox = [];

      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 100;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          false
        );
      });

      it('should return updated labels', () => expect(returnedValue).toEqual(expectedValue));

      it('should set label.value.text to empty string', () =>
        expect(returnedValue[0].value.text).toBe(''));

      it('should set label.value.boundingBox to empty array', () =>
        expect(returnedValue[0].value.boundingBox).toEqual([]));
    });

    describe('when InvoiceType label is included in the document fields array but confidence is below the threshold', () => {
      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceType)];
      let returnedValue: IndexedLabel[] = [];
      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType),
      ];

      labelsStub[0].value.confidence = 0.5;
      labelsStub[0].value.text = 'Utility';
      expectedValue[0].value.confidence = 0.5;
      expectedValue[0].value.text = 'Standard';
      expectedValue[0].value.boundingBox = [];

      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 90;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          false,
          false,
          false
        );
      });

      it('should return updated labels', () => expect(returnedValue).toEqual(expectedValue));

      it('should set label.value.text to Standard string', () =>
        expect(returnedValue[0].value.text).toBe('Standard'));

      it('should set label.value.boundingBox to empty array', () =>
        expect(returnedValue[0].value.boundingBox).toEqual([]));
    });

    describe('when lookup label is included in the document fields array and the confidence is above the threshold value', () => {
      const labelsStub = [
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier)];
      let returnedValue: IndexedLabel[] = [];
      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      expectedValue[0].value.confidence = 1;
      expectedValue[1].value.text = '1';
      expectedValue[1].value.confidence = 1;

      labelsStub[0].value.confidence = 1;
      labelsStub[1].value.text = '1';
      labelsStub[1].value.confidence = 1;
      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 50;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          false
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(expectedValue));
    });

    describe('when lookup label is included in the document fields array and all the checks are TRUE', () => {
      const labelsStub = [
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues),
      ];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier)];
      let returnedValue: IndexedLabel[] = [];
      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues),
      ];
      expectedValue[0].value.confidence = 1;
      expectedValue[1].value.text = '1';
      expectedValue[1].value.confidence = 1;
      expectedValue[2].value.text = '1';
      expectedValue[2].value.confidence = 1;

      labelsStub[0].value.confidence = 1;
      labelsStub[1].value.text = '1';
      labelsStub[1].value.confidence = 1;
      labelsStub[2].value.text = '1';
      labelsStub[2].value.confidence = 1;

      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 50;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          true
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(expectedValue));
    });

    describe('when non lookup label is included in the document fields array but confidence is below the threshold value', () => {
      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      let returnedValue: IndexedLabel[] = [];
      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
      ];

      labelsStub[0].value.confidence = 0.5;
      expectedValue[0].value.confidence = 0.5;
      expectedValue[0].value.text = '';
      expectedValue[0].value.boundingBox = [];

      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 100;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          false
        );
      });

      it('should return updated labels', () => expect(returnedValue).toEqual(expectedValue));

      it('should set label.value.text to empty string', () =>
        expect(returnedValue[0].value.text).toBe(''));

      it('should set label.value.boundingBox to empty array', () =>
        expect(returnedValue[0].value.boundingBox).toEqual([]));
    });

    describe('when non lookup label is included in the document fields array and the confidence is above the threshold value', () => {
      const labelsStub = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      const fieldBaseStub = [
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
        getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      let returnedValue: IndexedLabel[] = [];
      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      expectedValue[0].value.confidence = 1;
      expectedValue[1].value.confidence = 1;
      labelsStub[0].value.confidence = 1;
      labelsStub[1].value.confidence = 1;
      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 50;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          false
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(expectedValue));
    });

    describe('when it is as customer user and no escalations', () => {
      let returnedValue: IndexedLabel[] = [];

      const labelsStub = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];

      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];

      labelsStub[1].value.text = '0';
      expectedValue[0].value.text = '';
      expectedValue[1].value.text = '0';
      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 100;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          false,
          false,
          false
        );
      });

      it('should do not display predicted values and set all to empty', () => {
        expect(returnedValue).toEqual(expectedValue);
      });
    });

    describe('when is customer user and has escalations', () => {
      let returnedValue: IndexedLabel[] = [];

      const labelsStub = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];

      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues),
      ];

      expectedValue[0].value.text = 'mockTest';
      labelsStub[0].value.text = 'mockTest';
      expectedValue[1].value.text = '1';
      labelsStub[1].value.text = '1';
      beforeEach(() => {
        fieldBaseStub[0].displayThreshold.view = 100;
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          false,
          true,
          false
        );
      });

      it('should display predicted values', () => {
        expect(returnedValue).toEqual(expectedValue);
      });
    });

    describe('When user updates values and should not display predicted values and isUpdatedDocument', () => {
      let returnedValue: IndexedLabel[] = [];

      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];

      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
      ];

      describe('when displayPredicted values is false and confidence is 1', () => {
        expectedValue[0].value.text = 'mockTest';
        expectedValue[0].value.confidence = 1;

        labelsStub[0].value.text = 'mockTest';
        labelsStub[0].value.confidence = 1;
        beforeEach(() => {
          fieldBaseStub[0].displayThreshold.view = 100;
          returnedValue = service.updateLabelValueUponThresholdCheck(
            labelsStub,
            fieldBaseStub,
            false,
            false,
            false
          );
        });

        it('should display updated values', () => {
          expect(returnedValue).toEqual(expectedValue);
        });
      });
    });

    describe('When user updates values and should not display predicted values and do not isUpdatedDocument', () => {
      let returnedValue: IndexedLabel[] = [];

      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber)];

      const expectedValue: IndexedLabel[] = [
        getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceNumber),
      ];

      describe('when displayPredicted values is false and confidence is 1', () => {
        expectedValue[0].value.text = 'mockTest';
        expectedValue[0].value.confidence = 1;

        labelsStub[0].value.text = 'mockTest';
        labelsStub[0].value.confidence = 1;
        beforeEach(() => {
          fieldBaseStub[0].displayThreshold.view = 100;
          returnedValue = service.updateLabelValueUponThresholdCheck(
            labelsStub,
            fieldBaseStub,
            false,
            false,
            false
          );
        });

        it('should display updated values', () => {
          expect(returnedValue).toEqual(expectedValue);
        });
      });
    });

    describe('when label is found, DisplayIdentifierSearchValues is ON, user is a Sponsor User, & confidence is higher than display threshold & is lookupfield', () => {
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      const displayIdentifierSearchValues = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );

      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier)];
      let returnedValue: IndexedLabel[] = [];

      displayPredictedValuesLbl.value.text = '1';
      displayIdentifierSearchValues.value.text = '1';
      labelsStub[0].value.confidence = 0.95;
      fieldBaseStub[0].displayThreshold.view = 90;
      labelsStub.push(displayPredictedValuesLbl);
      labelsStub.push(displayIdentifierSearchValues);

      beforeEach(() => {
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          false
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(labelsStub));
    });

    describe('when label is found, DisplayIdentifierSearchValues is OFF, user is a Sponsor User, & confidence is higher than display threshold & is lookupfield', () => {
      const displayPredictedValuesLbl = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      const displayIdentifierSearchValues = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );

      const labelsStub = [getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier)];
      const fieldBaseStub = [getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier)];
      let returnedValue: IndexedLabel[] = [];

      displayPredictedValuesLbl.value.text = '1';
      displayIdentifierSearchValues.value.text = '0';
      labelsStub[0].value.confidence = 0.95;
      labelsStub[0].value.text = 'supplier mock';
      fieldBaseStub[0].displayThreshold.view = 90;

      labelsStub.push(displayPredictedValuesLbl);
      labelsStub.push(displayIdentifierSearchValues);

      beforeEach(() => {
        returnedValue = service.updateLabelValueUponThresholdCheck(
          labelsStub,
          fieldBaseStub,
          true,
          false,
          false
        );
      });

      it('should return back an the same labels that were passed into the service helper fn', () =>
        expect(returnedValue).toEqual(labelsStub));
    });
  });

  describe('hasNewAccountActivity', () => {
    describe('when activities has a CreateNewAccount activity', () => {
      const activityStub = getActivityStub();

      it('should return true', () =>
        expect(service.hasNewAccountActivity([activityStub])).toBeTruthy());
    });
    describe('when activities DOES NOT have a CreateNewAccount activity', () => {
      const activityStub = getActivityStub();
      activityStub.activity = ActivityTypes.Create;

      it('should return false', () =>
        expect(service.hasNewAccountActivity([activityStub])).toBeFalsy());
    });
    describe('when activities has no activities', () => {
      it('should return false', () => expect(service.hasNewAccountActivity([])).toBeFalsy());
    });
  });

  describe('getFieldsToRemove', () => {
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
    describe('When escalationIssue is Non Invoice Document ', () => {
      it('Should returns an array with InvoiceNumber and InvoiceAmount', () => {
        expect(
          service.getFieldsToRemove('Non Invoice Document', compositeData.indexed.labels)
        ).toHaveLength(2);
      });
    });

    describe('When escalationIssue is ImageIssue ', () => {
      it('Should returns an array with InvoiceNumber and InvoiceAmount', () => {
        expect(service.getFieldsToRemove('ImageIssue', compositeData.indexed.labels)).toHaveLength(
          0
        );
      });
    });
  });

  describe('getNotifications', () => {
    const compositeDataStub = getCompositeDataStub();

    describe('When invoice number starts with none and invoice amount is over 500k', () => {
      beforeEach(() => {
        compositeDataStub.indexed.labels = [];
        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceAmount,
          page: 1,
          value: {
            text: '500001',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceNumber,
          page: 1,
          value: {
            text: '',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          page: 1,
          value: {
            text: 'none',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);
      });
      it('should add notification', () => {
        expect(service.getNotifications(compositeDataStub.indexed).length).toBe(2);
      });
    });

    describe('When invoice number is not blank and invoice amount is over 500k', () => {
      beforeEach(() => {
        compositeDataStub.indexed.labels = [];
        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceAmount,
          page: 1,
          value: {
            text: '500001',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceNumber,
          page: 1,
          value: {
            text: 'mock',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          page: 1,
          value: {
            text: 'mock',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);
      });
      it('should add notification', () => {
        expect(service.getNotifications(compositeDataStub.indexed).length).toBe(1);
      });
    });

    describe('When invoice number is blank and customerAccount is NONE and invoice amount is below 500k', () => {
      beforeEach(() => {
        compositeDataStub.indexed.labels = [];
        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceAmount,
          page: 1,
          value: {
            text: '499999',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceNumber,
          page: 1,
          value: {
            text: '',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          page: 1,
          value: {
            text: 'none',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);
      });
      it('should add notification', () => {
        expect(service.getNotifications(compositeDataStub.indexed).length).toBe(1);
      });
    });

    describe('When no labels exist should return no notifications', () => {
      beforeEach(() => {
        compositeDataStub.indexed.labels = [];
      });
      it('should return no notifications', () => {
        expect(service.getNotifications(compositeDataStub.indexed).length).toBe(0);
      });
    });

    describe('When value object is null should return no notifications', () => {
      beforeEach(() => {
        compositeDataStub.indexed.labels = [];
        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceAmount,
          page: 1,
          value: null,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.InvoiceNumber,
          page: 1,
          value: null,
        } as IndexedLabel);

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          page: 1,
          value: null,
        } as IndexedLabel);
      });
      it('should return no notifications', () => {
        expect(service.getNotifications(compositeDataStub.indexed).length).toBe(0);
      });
    });
  });

  // write tests for requiredFieldsValidation
  describe('requiredFieldsValidation', () => {
    const fields = [getFieldBaseStub('CustomerAccountNumber')];
    describe('When customer account number number does not have a value', () => {
      const compositeDataStub = getCompositeDataStub();
      beforeEach(() => {
        compositeDataStub.indexed.labels = [];

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          page: 1,
          value: {
            text: '',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);
      });
      it('should return true (missing required data)', () => {
        expect(service.requiredFieldsValidation(compositeDataStub.indexed, fields)).toBeTruthy();
      });
    });

    describe('When customer account number number has a value', () => {
      const compositeDataStub = getCompositeDataStub();

      beforeEach(() => {
        compositeDataStub.indexed.labels = [];

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
          page: 1,
          value: {
            text: 'none',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);
      });
      it('should return false (no missing required data)', () => {
        expect(service.requiredFieldsValidation(compositeDataStub.indexed, fields)).toBeFalsy();
      });
    });

    describe('When work order number does not have a value', () => {
      const compositeDataStub = getCompositeDataStub();
      const workOrderStub = [getFieldBaseStub('WorkOrderNo')];
      workOrderStub[0].required = false;

      beforeEach(() => {
        compositeDataStub.indexed.labels = [];

        compositeDataStub.indexed.labels.push({
          label: DocumentLabelKeys.nonLookupLabels.WorkOrderNo,
          page: 1,
          value: {
            text: '',
            confidence: 99.99,
            boundingBox: [],
            required: false,
            verificationState: '',
          } as LabelValue,
        } as IndexedLabel);
      });
      it('should return false (no missing required data)', () => {
        expect(
          service.requiredFieldsValidation(compositeDataStub.indexed, workOrderStub)
        ).toBeFalsy();
      });
    });
  });

  describe('getNewCustomerAccount', () => {
    it('should return null when no create account activity exists', () => {
      compositeDataStub.indexed.activities = [];
      expect(service.getNewCustomerAccount(compositeDataStub.indexed, [])).toBeNull();
    });

    it('should return new item when create account activity exists', () => {
      compositeDataStub.indexed.activities.push({
        activity: ActivityTypes.CreateNewAccount,
        escalation: {},
        labels: [
          {
            label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
            value: {
              text: 'test',
            },
          },
          {
            label: DocumentLabelKeys.nonLookupLabels.Terms,
            value: {
              text: '1',
            },
          },
        ],
        ordinal: 1,
      } as Activity);
      expect(service.getNewCustomerAccount(compositeDataStub.indexed, [])).not.toBeNull();
    });

    it('should return new item when two create account activity exists', () => {
      compositeDataStub.indexed.activities.push({
        activity: ActivityTypes.CreateNewAccount,
        escalation: {},
        labels: [
          {
            label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
            value: {
              text: 'test',
            },
          },
          {
            label: DocumentLabelKeys.nonLookupLabels.Terms,
            value: {
              text: '1',
            },
          },
        ],
        ordinal: 1,
      } as Activity);

      compositeDataStub.indexed.activities.push({
        activity: ActivityTypes.CreateNewAccount,
        escalation: {},
        labels: [
          {
            label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
            value: {
              text: 'test2',
            },
          },
          {
            label: DocumentLabelKeys.nonLookupLabels.Terms,
            value: {
              text: '2',
            },
          },
        ],
        ordinal: 2,
      } as Activity);

      const result = service.getNewCustomerAccount(compositeDataStub.indexed, []);
      expect(result).not.toBeNull();
      expect(result.accountNo).toBe('test2');
    });

    it('should return new account when existing records is null', () => {
      compositeDataStub.indexed.activities.push({
        activity: ActivityTypes.CreateNewAccount,
        escalation: {},
        labels: [
          {
            label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
            value: {
              text: 'test',
            },
          },
          {
            label: DocumentLabelKeys.nonLookupLabels.Terms,
            value: {
              text: '1',
            },
          },
        ],
        ordinal: 1,
      } as Activity);

      compositeDataStub.indexed.activities.push({
        activity: ActivityTypes.CreateNewAccount,
        escalation: {},
        labels: [
          {
            label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
            value: {
              text: 'test2',
            },
          },
          {
            label: DocumentLabelKeys.nonLookupLabels.Terms,
            value: {
              text: '2',
            },
          },
        ],
        ordinal: 2,
      } as Activity);

      const result = service.getNewCustomerAccount(compositeDataStub.indexed, null);
      expect(result).not.toBeNull();
      expect(result.accountNo).toBe('test2');
    });

    it('should return null when new account equals existing account', () => {
      compositeDataStub.indexed.activities = [];
      compositeDataStub.indexed.activities.push({
        activity: ActivityTypes.CreateNewAccount,
        escalation: {},
        labels: [
          {
            label: DocumentLabelKeys.lookupLabels.CustomerAccountNumber,
            value: {
              text: 'test',
            },
          },
          {
            label: DocumentLabelKeys.nonLookupLabels.Terms,
            value: {
              text: '1',
            },
          },
        ],
        ordinal: 1,
      } as Activity);

      const existingAccount: LookupCustomerAccount = {
        vendorAccountId: 1,
        accountNo: ' TeSt ',
        propertyId: 0,
        propertyName: 'test',
        termTypeId: 1,
        allowRetainage: true,
        isActive: true,
        propertyAddress: null,
      };

      const result = service.getNewCustomerAccount(compositeDataStub.indexed, [existingAccount]);
      expect(result).toBeNull();
    });
  });

  // getPaymentTerms tests
  describe('getPaymentTerms', () => {
    beforeAll(() => {
      jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation();
    });

    it('should return data when paymentTerms exist in localStorage', () => {
      window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() =>
        JSON.stringify([
          {
            termTypeId: 1,
            termTypeName: 'test',
            numberDaysUntilDue: 1,
            isEndOfMonth: false,
          },
        ])
      );

      expect(service.getPaymentTerms().length).toBe(1);
    });

    it('should return empty array when NO paymentTerms exist in localStorage', () => {
      window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() => null);

      expect(service.getPaymentTerms().length).toBe(0);
    });

    it('should return empty array when not an array', () => {
      window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() =>
        JSON.stringify({
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 1,
          isEndOfMonth: false,
        })
      );

      expect(service.getPaymentTerms().length).toBe(0);
    });

    it('should return empty array when invalid json', () => {
      window.sessionStorage.__proto__.getItem = jest.fn().mockImplementationOnce(() => 'test');

      expect(service.getPaymentTerms().length).toBe(0);
    });
  });

  // setPaymentTerms tests
  describe('setPaymentTerms', () => {
    beforeAll(() => {
      jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation();
    });

    it('should not setItem if null', () => {
      service.setPaymentTerms(null);
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });

    it('should setItem if payment terms passed', () => {
      service.setPaymentTerms([
        {
          termTypeId: 1,
          termTypeName: 'test',
          numberDaysUntilDue: 1,
          isEndOfMonth: false,
        },
      ]);
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getPredictedValue()', () => {
    describe('when all checks are TRUE', () => {
      let result: string;
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

      labelStub.value.confidence = 99.9;
      fieldStub.displayThreshold.view = 95;

      beforeAll(() => {
        jest.spyOn(service as any, 'canDisplayPredictedValues').mockImplementationOnce(() => true);
        jest
          .spyOn(service as any, 'canDisplayIdentifierSearchValues')
          .mockImplementationOnce(() => true);

        result = service.getPredictedValue(
          [fieldStub],
          [labelStub],
          DocumentLabelKeys.lookupLabels.Supplier,
          true
        );
      });

      it('should return NULL', () => {
        expect(result).toBe(labelStub.value.text);
      });
    });

    describe('when canDisplayPredictedValues is FALSE', () => {
      let result: string;
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

      beforeAll(() => {
        jest.spyOn(service as any, 'canDisplayPredictedValues').mockImplementationOnce(() => false);
        jest
          .spyOn(service as any, 'canDisplayIdentifierSearchValues')
          .mockImplementationOnce(() => true);

        result = service.getPredictedValue(
          [fieldStub],
          [labelStub],
          DocumentLabelKeys.lookupLabels.Supplier,
          true
        );
      });

      it('should return NULL', () => {
        expect(result).toBeNull();
      });
    });

    describe('when canDisplayIdentifierSearchValues is FALSE', () => {
      let result: string;
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

      beforeAll(() => {
        jest.spyOn(service as any, 'canDisplayPredictedValues').mockImplementationOnce(() => true);
        jest
          .spyOn(service as any, 'canDisplayIdentifierSearchValues')
          .mockImplementationOnce(() => false);

        result = service.getPredictedValue(
          [fieldStub],
          [labelStub],
          DocumentLabelKeys.lookupLabels.Supplier,
          true
        );
      });

      it('should return NULL', () => {
        expect(result).toBeNull();
      });
    });

    describe('when user is NOT a sponsor user', () => {
      let result: string;
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

      beforeAll(() => {
        jest.spyOn(service as any, 'canDisplayPredictedValues').mockImplementationOnce(() => true);
        jest
          .spyOn(service as any, 'canDisplayIdentifierSearchValues')
          .mockImplementationOnce(() => true);

        result = service.getPredictedValue(
          [fieldStub],
          [labelStub],
          DocumentLabelKeys.lookupLabels.Supplier,
          false
        );
      });

      it('should return NULL', () => {
        expect(result).toBeNull();
      });
    });

    describe('when everything is turned on but the label confidence is not >= field display threshold', () => {
      let result: string;
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

      labelStub.value.confidence = 0;
      fieldStub.displayThreshold.view = 10;

      beforeAll(() => {
        jest.spyOn(service as any, 'canDisplayPredictedValues').mockImplementationOnce(() => true);
        jest
          .spyOn(service as any, 'canDisplayIdentifierSearchValues')
          .mockImplementationOnce(() => true);

        result = service.getPredictedValue(
          [fieldStub],
          [labelStub],
          DocumentLabelKeys.lookupLabels.Supplier,
          true
        );
      });

      it('should return NULL', () => {
        expect(result).toBeNull();
      });
    });

    describe('when labels array is empty', () => {
      let result: string;
      const fieldStub = getFieldBaseStub(DocumentLabelKeys.lookupLabels.Supplier);

      beforeAll(() => {
        jest.spyOn(service as any, 'canDisplayPredictedValues').mockImplementationOnce(() => true);
        jest
          .spyOn(service as any, 'canDisplayIdentifierSearchValues')
          .mockImplementationOnce(() => true);

        result = service.getPredictedValue(
          [fieldStub],
          [],
          DocumentLabelKeys.lookupLabels.Supplier,
          true
        );
      });

      it('should return NULL', () => {
        expect(result).toBeNull();
      });
    });

    describe('when fields array is empty', () => {
      let result: string;
      const labelStub = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);

      labelStub.value.confidence = 0;

      beforeAll(() => {
        jest.spyOn(service as any, 'canDisplayPredictedValues').mockImplementationOnce(() => true);
        jest
          .spyOn(service as any, 'canDisplayIdentifierSearchValues')
          .mockImplementationOnce(() => true);

        result = service.getPredictedValue(
          [],
          [labelStub],
          DocumentLabelKeys.lookupLabels.Supplier,
          true
        );
      });

      it('should return NULL', () => {
        expect(result).toBeNull();
      });
    });
  });

  describe('determineCurrentPage()', () => {
    describe('when determined page is Pending Queue Page with an ingestion type of email', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();
      const ingestionTypeLblStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.IngestionType
      );

      compositeDataStub.indexed.activities = [];
      compositeDataStub.indexed.labels = [];

      activityStub.activity = ActivityTypes.Create;
      ingestionTypeLblStub.value.text = IngestionTypes.Email;
      compositeDataStub.indexed.activities.push(activityStub);
      compositeDataStub.indexed.labels.push(ingestionTypeLblStub);

      it('should return Queue page string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe(AppPages.Queue);
      });
    });

    describe('when determined page is Pending Queue Page with an ingestion type of scan', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();
      const ingestionTypeLblStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.IngestionType
      );

      compositeDataStub.indexed.activities = [];
      compositeDataStub.indexed.labels = [];

      activityStub.activity = ActivityTypes.Create;
      ingestionTypeLblStub.value.text = IngestionTypes.Scan;
      compositeDataStub.indexed.activities.push(activityStub);
      compositeDataStub.indexed.labels.push(ingestionTypeLblStub);

      it('should return Queue page string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe(AppPages.Queue);
      });
    });

    describe('when determined page is Uploads Queue Page', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();
      const ingestionTypeLblStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.IngestionType
      );

      compositeDataStub.indexed.activities = [];
      compositeDataStub.indexed.labels = [];

      activityStub.activity = ActivityTypes.Create;
      ingestionTypeLblStub.value.text = IngestionTypes.Api;
      compositeDataStub.indexed.activities.push(activityStub);
      compositeDataStub.indexed.labels.push(ingestionTypeLblStub);

      it('should return Uploads Queue page string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe(AppPages.UploadsQueue);
      });
    });

    describe('when determined page is Research Queue Page', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();

      compositeDataStub.indexed.activities = [];

      activityStub.activity = ActivityTypes.Exception;
      activityStub.escalation = {
        category: {
          issue: EscalationCategoryTypes.DataExceptionAU,
        } as any,
      } as any;
      compositeDataStub.indexed.activities.push(activityStub);

      it('should return Research Queue page string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe(AppPages.Research);
      });
    });

    describe('when determined page is RecycleBin Queue Page', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();

      compositeDataStub.indexed.activities = [];

      activityStub.activity = ActivityTypes.Exception;
      activityStub.escalation = {
        category: {
          issue: EscalationCategoryTypes.RecycleBin,
        } as any,
      } as any;
      compositeDataStub.indexed.activities.push(activityStub);

      it('should return RecycleBin Queue page string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe(AppPages.RecycleBin);
      });
    });

    describe('when determined page is Archive Page', () => {
      const compositeDataStub = getCompositeDataStub();
      compositeDataStub.indexed.isSubmitted = true;

      it('should return Archive page string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe(AppPages.Archive);
      });
    });

    describe('when activity has a lot of activities that we do not use', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();
      const saveActivityStub = getActivityStub();
      const createNewAcctStub = getActivityStub();

      compositeDataStub.indexed.activities = [];

      saveActivityStub.activity = ActivityTypes.Save;
      createNewAcctStub.activity = ActivityTypes.CreateNewAccount;
      activityStub.activity = ActivityTypes.Exception;
      activityStub.escalation = {
        category: {
          issue: EscalationCategoryTypes.DataExceptionAU,
        } as any,
      } as any;
      compositeDataStub.indexed.activities.push(activityStub, saveActivityStub, createNewAcctStub);

      it('should filter out the nonsense and return Research Queue page string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe(AppPages.Research);
      });
    });

    describe('when ingestion type label is missing', () => {
      const compositeDataStub = getCompositeDataStub();
      const activityStub = getActivityStub();

      compositeDataStub.indexed.activities = [];

      activityStub.activity = ActivityTypes.Create;
      compositeDataStub.indexed.activities.push(activityStub);

      it('should return empty string', () => {
        expect(service.determineCurrentPage(compositeDataStub)).toBe('');
      });
    });
  });

  describe('private canDisplayPredictedValues', () => {
    describe('when canDisplayPredictedValues label is turned ON', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      labelStub.value.text = '1';

      beforeEach(() => {
        result = service['canDisplayPredictedValues']([labelStub]);
      });

      it('should return TRUE', () => expect(result).toBeTruthy());
    });

    describe('when canDisplayPredictedValues label is turned OFF', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      labelStub.value.text = '0';

      beforeEach(() => {
        result = service['canDisplayPredictedValues']([labelStub]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });

    describe('when label does not have a bit for a value', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      labelStub.value.text = 'test';

      beforeEach(() => {
        result = service['canDisplayPredictedValues']([labelStub]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });

    describe('when label cannot be found', () => {
      let result: boolean;

      beforeEach(() => {
        result = service['canDisplayPredictedValues']([]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });
  });

  describe('private canDisplayIdentifierSearchValues', () => {
    describe('when canDisplayIdentifierSearchValues label is turned ON', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );

      labelStub.value.text = '1';

      beforeEach(() => {
        result = service['canDisplayIdentifierSearchValues']([labelStub]);
      });

      it('should return TRUE', () => expect(result).toBeTruthy());
    });

    describe('when canDisplayIdentifierSearchValues label is turned OFF', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );

      labelStub.value.text = '0';

      beforeEach(() => {
        result = service['canDisplayIdentifierSearchValues']([labelStub]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });

    describe('when label does not have a bit for a value', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayIdentifierSearchValues
      );

      labelStub.value.text = 'test';

      beforeEach(() => {
        result = service['canDisplayIdentifierSearchValues']([labelStub]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });

    describe('when label cannot be found', () => {
      let result: boolean;

      beforeEach(() => {
        result = service['canDisplayIdentifierSearchValues']([]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });
  });

  describe('getPageData', () => {
    let result;
    const selectSnapshot = {
      core: { documentCount: 1, myUploadsCount: 2, escalationCount: 3, recycleBinCount: 4 },
      pendingPage: { invoices: [getArchivedDocumentsStub()[0]] },
      uploadsQueuePage: { invoices: [getArchivedDocumentsStub()[0]] },
      researchPage: { invoices: [getArchivedDocumentsStub()[0]] },
      recycleBinPage: { invoices: [getArchivedDocumentsStub()[0]] },
    };

    describe('When is queue page', () => {
      beforeEach(() => {
        result = service['getPageData'](selectSnapshot, AppPages.Queue);
      });

      it('should return invoicesPageCount and the invices of the current page', () => {
        expect(result).toEqual({ invoicesPageCount: 1, invoices: [getArchivedDocumentsStub()[0]] });
      });
    });

    describe('When is UploadsQueue page', () => {
      beforeEach(() => {
        result = service['getPageData'](selectSnapshot, AppPages.UploadsQueue);
      });

      it('should return invoicesPageCount and the invices of the current page', () => {
        expect(result).toEqual({ invoicesPageCount: 2, invoices: [getArchivedDocumentsStub()[0]] });
      });
    });

    describe('When is Research page', () => {
      beforeEach(() => {
        result = service['getPageData'](selectSnapshot, AppPages.Research);
      });

      it('should return invoicesPageCount and the invices of the current page', () => {
        expect(result).toEqual({ invoicesPageCount: 3, invoices: [getArchivedDocumentsStub()[0]] });
      });
    });

    describe('When is RecycleBin page', () => {
      beforeEach(() => {
        result = service['getPageData'](selectSnapshot, AppPages.RecycleBin);
      });

      it('should return invoicesPageCount and the invices of the current page', () => {
        expect(result).toEqual({ invoicesPageCount: 4, invoices: [getArchivedDocumentsStub()[0]] });
      });
    });
  });

  describe('getDuplicateDocumentId()', () => {
    describe('when there is no exception activity', () => {
      let result = '';
      const activities = [getActivityStub()];

      beforeEach(() => {
        result = service.getDuplicateDocumentId(activities);
      });

      it('should return NULL', () => expect(result).toBeNull());
    });

    describe('when there is an exception activity but not a duplicate research one', () => {
      let result = '';
      const activity = getActivityStub();

      activity.activity = ActivityTypes.Exception;
      activity.escalation.category.issue = EscalationCategoryTypes.DataExceptionAU;

      beforeEach(() => {
        result = service.getDuplicateDocumentId([activity]);
      });

      it('should return NULL', () => expect(result).toBeNull());
    });

    describe('when there is an exception activity that is duplicate research and has documentId in description', () => {
      let result = '';
      const activity = getActivityStub();

      activity.activity = ActivityTypes.Exception;
      activity.escalation.category.issue = EscalationCategoryTypes.DuplicateResearch;
      activity.escalation.description = JSON.stringify({ documentId: '1', sourceDocumentId: '2' });

      beforeEach(() => {
        result = service.getDuplicateDocumentId([activity]);
      });

      it('should return documentId', () => expect(result).toBe('1'));
    });

    describe('when there is an exception activity that is duplicate research and but does nothave documentId in description', () => {
      let result = '';
      const activity = getActivityStub();

      activity.activity = ActivityTypes.Exception;
      activity.escalation.category.issue = EscalationCategoryTypes.DuplicateResearch;
      activity.escalation.description = JSON.stringify({ sourceDocumentId: '2' });

      beforeEach(() => {
        jest.spyOn(JSON, 'parse').mockImplementationOnce(null);
        result = service.getDuplicateDocumentId([activity]);
      });

      it('should return null', () => expect(result).toBeNull());
    });
  });

  describe('canDisplayPredictedValues', () => {
    describe('when label is not found', () => {
      let result: boolean;

      beforeEach(() => {
        result = service['canDisplayPredictedValues']([]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });

    describe('when label is found but does not have a bit for a value', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      labelStub.value.text = 'test';

      beforeEach(() => {
        result = service['canDisplayPredictedValues']([labelStub]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });

    describe('when label is found and has bit for a value', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      labelStub.value.text = '1';

      beforeEach(() => {
        result = service['canDisplayPredictedValues']([labelStub]);
      });

      it('should return TRUE', () => expect(result).toBeTruthy());
    });
  });
});
