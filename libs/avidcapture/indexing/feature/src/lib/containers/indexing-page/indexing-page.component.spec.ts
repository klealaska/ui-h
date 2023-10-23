import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import {
  AddMenuOptions,
  RefreshToken,
  RemoveMenuOptions,
  SetCurrentPage,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import { IdleService, ToastService, XdcService } from '@ui-coe/avidcapture/core/util';
import {
  CheckForDuplicateDocument,
  DisableHighlight,
  EnableSubmitButton,
  IndexingPageState,
  IndexingUtilityState,
  InitIndexingPage,
  LockDocument,
  PostRejectToSender,
  PutInEscalation,
  QueryRejectToSenderTemplates,
  ResetIndexingState,
  SaveIndexedDocument,
  SetEscalation,
  SetPdfFileValue,
  SetPdfSecret,
  SkipDocument,
  SubmitIndexedDocument,
  SwapDocument,
  UpdateFontFace,
  UpdateSelectedDocumentText,
} from '@ui-coe/avidcapture/indexing/data-access';
import { DocumentSwapComponent, IndexingHeaderComponent } from '@ui-coe/avidcapture/indexing/ui';
import { HotkeysService, IndexingHelperService } from '@ui-coe/avidcapture/indexing/util';
import { RemovePendingPageSignalEvents } from '@ui-coe/avidcapture/pending/data-access';
import { RemoveRecycleBinPageSignalEvents } from '@ui-coe/avidcapture/recycle-bin/data-access';
import { RemoveResearchPageSignalEvents } from '@ui-coe/avidcapture/research/data-access';
import {
  CoreStateMock,
  activityStub,
  compositeDataStub,
  fieldBaseStub,
  getCompositeDataStub,
  getEscalationStub,
  getIndexedLabelStub,
  hasAllTheClaimsTokenStub,
  hasCustomerRoleTokenStub,
  indexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  AppPages,
  DocumentLabelKeys,
  EscalationCategoryTypes,
  EscalationLevelTypes,
  IndexedLabel,
  IndexingPageAction,
  LabelValue,
  UserMenuOptions,
} from '@ui-coe/avidcapture/shared/types';
import {
  DocumentCommandBarComponent,
  DocumentViewerComponent,
} from '@ui-coe/avidcapture/shared/ui';
import {
  dataExceptionIssueTypes,
  imageIssueTypes,
  internalEscalationChoices,
  recycleIssueTypes,
  scanningOpsQcTypes,
} from '@ui-coe/avidcapture/shared/util';
import { AxLabelComponent, AxLoadingSpinnerComponent } from '@ui-coe/shared/ui';
import { DateTime } from 'luxon';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { DuplicateDetectionComponent } from '../../modals/duplicate-detection/duplicate-detection.component';
import { RejectToSenderCrudComponent } from '../../modals/reject-to-sender-crud/reject-to-sender-crud.component';
import { DocumentFieldsComponent } from '../document-fields/document-fields.component';
import { IndexingPageComponent } from './indexing-page.component';

const dialogStub = {
  open: jest.fn(),
  closeAll: jest.fn(),
};
const routerSpy = {
  navigate: jest.fn(),
};
const toastServiceSpy = {
  warning: jest.fn(),
};
const idleServiceSpy = {
  startWatching: jest.fn(),
  stopTimer: jest.fn(),
  resetWatch: jest.fn(),
};
const hotkeysServiceStub = {
  openHelpModal: jest.fn(),
};
const xdcServiceStub = {
  getFile: jest.fn(),
};
const environmentStub = {
  maxUnindexedPages: '10',
  apiBaseUri: 'http://idcapi.avidxchange.com/',
} as any;

const IndexingHelperServiceStub = {
  getNotifications: jest.fn(),
  requiredFieldsValidation: jest.fn(),
  determineCurrentPage: jest.fn(),
  canDisplayPredictedValues: jest.fn(),
};

describe('IndexingPageComponent', () => {
  let component: IndexingPageComponent;
  let fixture: ComponentFixture<IndexingPageComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        IndexingPageComponent,
        MockComponent(IndexingHeaderComponent),
        MockComponent(DocumentCommandBarComponent),
        MockComponent(DocumentViewerComponent),
        MockComponent(DocumentFieldsComponent),
        MockComponent(AxLabelComponent),
        MockComponent(AxLoadingSpinnerComponent),
      ],
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([CoreStateMock, IndexingPageState, IndexingUtilityState], {
          developmentMode: true,
        }),
      ],
      providers: [
        {
          provide: ToastService,
          useValue: toastServiceSpy,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                docId: '101163321',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
        {
          provide: IdleService,
          useValue: idleServiceSpy,
        },
        {
          provide: HotkeysService,
          useValue: hotkeysServiceStub,
        },
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: 'environment',
          useValue: environmentStub,
        },
        {
          provide: XdcService,
          useValue: xdcServiceStub,
        },
        {
          provide: IndexingHelperService,
          useValue: IndexingHelperServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexingPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    idleServiceSpy.startWatching.mockReturnValue(of(false));
    dialogStub.open.mockReturnValue({
      afterClosed: () => of('Timeout'),
    });

    jest.spyOn(store, 'dispatch').mockImplementation();
    store.reset({
      indexingPage: {
        compositeData: compositeDataStub,
      },
      indexingDocumentFields: {
        fields: fieldBaseStub,
      },
      core: {
        userAccount: {
          preferred_username: 'testEmail',
        },
        userMenuOptions: [{ text: UserMenuOptions.ClientGuidelines }],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define maxUnindexedPages using environment variable', () => {
    fixture.detectChanges();
    expect(component.maxUnindexedPages).toBe(10);
  });

  it('should dispatch InitIndexingPage action', () => {
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenNthCalledWith(1, [
      new InitIndexingPage('101163321'),
      new AddMenuOptions({ text: UserMenuOptions.HotkeyGuide }),
    ]);
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should stop idle service timer', () => expect(idleServiceSpy.stopTimer).toHaveBeenCalled());

    it('should reset indexing state back to defaults, remove HotkeyGuide user menu option from header menu option list, and unlock document', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new UnlockDocument('101163321'),
        new ResetIndexingState(),
        new RemoveMenuOptions({ text: UserMenuOptions.HotkeyGuide }),
        new RemovePendingPageSignalEvents(),
        new RemoveRecycleBinPageSignalEvents(),
        new RemoveResearchPageSignalEvents(),
      ]));

    it('should close any and all modals that are open', () =>
      expect(dialogStub.closeAll).toHaveBeenCalled());
  });

  describe('idleService watch', () => {
    describe('when user is a customer user', () => {
      beforeEach(() => {
        idleServiceSpy.startWatching.mockReturnValue(of(true));
        fixture.detectChanges();
      });

      it('should dispatch Lock Document action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(2, new LockDocument('101163321')));

      it('should call idle services resetWatch function', () =>
        expect(idleServiceSpy.resetWatch).toHaveBeenCalledTimes(1));
    });
  });

  describe('DuplicateDetectionModal open', () => {
    const compositeDuplicateDataStub = compositeDataStub;
    compositeDuplicateDataStub.indexed.labels.push({
      id: '',
      label: DocumentLabelKeys.nonLookupLabels.InvoiceNumber,
      page: 1,
      value: {
        text: 'invoiceNumber',
        confidence: 99.99,
        boundingBox: [],
        required: false,
        verificationState: '',
        incomplete: false,
        incompleteReason: '',
        type: '',
      },
    });

    compositeDuplicateDataStub.indexed.labels.push({
      id: '',
      label: DocumentLabelKeys.lookupLabels.Supplier,
      page: 1,
      value: {
        text: 'supplierName',
        confidence: 99.99,
        boundingBox: [],
        required: false,
        verificationState: '',
        incomplete: false,
        incompleteReason: '',
        type: '',
      },
    });

    beforeEach(() => {
      store.reset({
        indexingPage: {
          compositeData: compositeDuplicateDataStub,
        },
        indexingDocumentFields: {
          fields: fieldBaseStub,
        },
        indexingUtility: {
          duplicateDetectionError: { documentId: '123', sourceDocumentId: null },
        },
        core: {
          userAccount: {
            preferred_username: 'testEmail',
          },
          userMenuOptions: [{ text: UserMenuOptions.ClientGuidelines }],
        },
      });
      fixture.detectChanges();
    });

    it('should open up duplicate detection modal when an id is passed in to observable', () =>
      expect(dialogStub.open).toHaveBeenNthCalledWith(1, DuplicateDetectionComponent, {
        autoFocus: false,
        data: {
          duplicateDetectionError: { documentId: '123', sourceDocumentId: null },
          canViewAllBuyers$: component.canViewAllBuyers$,
          supplierName: 'supplierName',
          invoiceNumber: 'invoiceNumber',
        },
      }));
  });

  describe('timeoutOccured()', () => {
    describe('when currentPage is defined in core state', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        store.reset({
          core: {
            currentPage: AppPages.Queue,
          },
          indexingPage: {
            compositeData,
          },
        });
        component.timeoutOccurred();
      });

      it('should open a toast message', () =>
        expect(toastServiceSpy.warning).toHaveBeenNthCalledWith(1, expect.anything()));

      it('should route you back to currentPage', () =>
        expect(routerSpy.navigate).toHaveBeenNthCalledWith(1, [AppPages.Queue]));
    });

    describe('when currentPage is null in core state', () => {
      const compositeData = getCompositeDataStub();
      const fileNameLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.FileName);

      compositeData.indexed.labels.push(fileNameLabel);

      beforeEach(() => {
        store.reset({
          core: {
            currentPage: null,
          },
          indexingPage: {
            compositeData,
          },
        });
        IndexingHelperServiceStub.determineCurrentPage.mockReturnValueOnce(AppPages.UploadsQueue);
        component.timeoutOccurred();
      });

      it('should call indexinghelperservice.determineCurrentPage fn', () =>
        expect(IndexingHelperServiceStub.determineCurrentPage).toHaveBeenNthCalledWith(
          1,
          compositeData
        ));

      it('should open a toast message', () =>
        expect(toastServiceSpy.warning).toHaveBeenNthCalledWith(1, expect.anything()));

      it('should route you back to determined page returned from indexing helper service', () =>
        expect(routerSpy.navigate).toHaveBeenNthCalledWith(1, [AppPages.UploadsQueue]));
    });
  });

  describe('saveInvoice()', () => {
    const compositeDataStub = getCompositeDataStub();

    beforeEach(() => {
      compositeDataStub.indexed.activities.splice(0, compositeDataStub.indexed.activities.length);
      compositeDataStub.indexed.activities.push(activityStub);
    });

    describe('when there are new internalQa escalations', () => {
      beforeEach(() => {
        compositeDataStub.indexed.activities[0].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerQa,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };

        component.saveInvoice(compositeDataStub.indexed, true);
      });

      it('should dispatch PutInEscalation action', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new PutInEscalation(compositeDataStub.indexed, IndexingPageAction.Save, '101163321')
        );
      });
    });

    describe('when there are existing and new internalQa escalations', () => {
      beforeEach(() => {
        compositeDataStub.indexed.activities[0].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerActivity,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };
        compositeDataStub.indexed.activities.push(activityStub);
        compositeDataStub.indexed.activities[1].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerQa,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };
        component.saveInvoice(compositeDataStub.indexed, true);
      });

      it('should dispatch PutInEscalation action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new PutInEscalation(compositeDataStub.indexed, IndexingPageAction.Save, '101163321')
        ));
    });

    describe('when the new escalation is not internalQa', () => {
      beforeEach(() => {
        compositeDataStub.indexed.activities[0].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerActivity,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };

        component.saveInvoice(compositeDataStub.indexed, true);
      });

      it('should dispatch saveIndexedDocuent action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SaveIndexedDocument(compositeDataStub.indexed, IndexingPageAction.Save)
        ));
    });

    describe('when there are no new escalations', () => {
      beforeEach(() => {
        compositeDataStub.indexed.activities[0].escalation = null;
        component.saveInvoice(compositeDataStub.indexed, false);
      });

      it('should dispatch SaveIndexedDocument action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SaveIndexedDocument(compositeDataStub.indexed, IndexingPageAction.Save)
        ));
    });
  });

  describe('submitInvoice()', () => {
    const compositeDataStub = getCompositeDataStub();
    compositeDataStub.indexed.labels.push({
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

    beforeEach(() => {
      compositeDataStub.indexed.activities.splice(0, compositeDataStub.indexed.activities.length);
      compositeDataStub.indexed.activities.push(activityStub);
    });

    describe('when there are new internalQa escalations', () => {
      beforeEach(() => {
        IndexingHelperServiceStub.getNotifications.mockReturnValue([]);
        compositeDataStub.indexed.activities[0].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerQa,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };
        component.submitInvoice(compositeDataStub.indexed, true);
      });

      it('should dispatch PutInEscalation action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new PutInEscalation(compositeDataStub.indexed, IndexingPageAction.Save, '101163321')
        ));
    });

    describe('when there are existing and new internalQa escalations', () => {
      beforeEach(() => {
        IndexingHelperServiceStub.getNotifications.mockReturnValue([]);
        compositeDataStub.indexed.activities[0].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerActivity,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };
        compositeDataStub.indexed.activities.push(activityStub);
        compositeDataStub.indexed.activities[1].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerQa,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };
        component.submitInvoice(compositeDataStub.indexed, true);
      });

      it('should dispatch PutInEscalation action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new PutInEscalation(compositeDataStub.indexed, IndexingPageAction.Save, '101163321')
        ));
    });

    describe('when the new escalation is not internalQa', () => {
      beforeEach(() => {
        IndexingHelperServiceStub.getNotifications.mockReturnValue([]);
        compositeDataStub.indexed.activities[0].escalation = {
          category: {
            issue: EscalationCategoryTypes.IndexerActivity,
            reason: '',
          },
          description: '',
          escalationLevel: '',
          resolution: '',
        };
        component.submitInvoice(compositeDataStub.indexed, true);
      });

      it('should dispatch SubmitIndexedDocument action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new EnableSubmitButton(false),
          new SubmitIndexedDocument(
            compositeDataStub.indexed,
            IndexingPageAction.Submit,
            '101163321'
          ),
        ]));
    });

    describe('when there are no new escalations', () => {
      beforeEach(() => {
        IndexingHelperServiceStub.getNotifications.mockReturnValue([]);
        compositeDataStub.indexed.activities[0].escalation = null;
        component.submitInvoice(compositeDataStub.indexed, false);
      });

      it('should dispatch SubmitIndexedDocument action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new EnableSubmitButton(false),
          new SubmitIndexedDocument(
            compositeDataStub.indexed,
            IndexingPageAction.Submit,
            '101163321'
          ),
        ]));
    });

    describe('When notifications service returns notifications', () => {
      beforeEach(() => {
        IndexingHelperServiceStub.getNotifications.mockReturnValue([
          { tittle: 'Confirm', message: 'mock' },
        ]);
        jest.spyOn(component as any, 'handleNotifications').mockImplementation();
        component.submitInvoice(compositeDataStub.indexed, false);
      });

      it('should call handleNotifications', () => {
        expect(component['handleNotifications']).toHaveBeenCalledTimes(1);
      });
    });

    describe('When missing required fields is true', () => {
      beforeEach(() => {
        IndexingHelperServiceStub.requiredFieldsValidation.mockReturnValue(true);
        jest.spyOn(component as any, 'handleNotifications').mockImplementation();
        jest.spyOn(component as any, 'handleSubmitInvoice').mockImplementation();
        component.submitInvoice(compositeDataStub.indexed, false);
      });

      it('should return and not call anything', () => {
        expect(component['handleNotifications']).not.toHaveBeenCalled();
        expect(component['handleSubmitInvoice']).not.toHaveBeenCalled();
      });
    });
  });

  describe('skipToPreviousDocument()', () => {
    beforeEach(() => {
      component.skipToPreviousDocument();
    });

    it('should dispatch SkipDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new SkipDocument('101163321', -1));
    });

    it('should closeAll dialogs if any are open', () =>
      expect(dialogStub.closeAll).toHaveBeenCalled());
  });

  describe('skipToNextDocument()', () => {
    beforeEach(() => {
      component.skipToNextDocument();
    });

    it('should dispatch SkipToNextDocument action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new SkipDocument('101163321', 1));
    });

    it('should closeAll dialogs if any are open', () =>
      expect(dialogStub.closeAll).toHaveBeenCalled());
  });

  describe('markAsSelectedChange()', () => {
    describe('when mark as option is Reject to Sender', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'openReturnToSenderModal').mockImplementation();
        component.markAsSelectedChange(EscalationCategoryTypes.RejectToSender);
      });

      it('should call the openReturnToSenderModal fn', () =>
        expect(component['openReturnToSenderModal']).toHaveBeenCalledTimes(1));
    });

    describe('when mark as option is NOT Reject to Sender', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'openEscalationModal').mockImplementation();
        component.markAsSelectedChange(EscalationCategoryTypes.IndexerQa);
      });

      it('should call the openEscalationModal fn', () =>
        expect(component['openEscalationModal']).toHaveBeenNthCalledWith(
          1,
          EscalationCategoryTypes.IndexerQa
        ));
    });
  });

  describe('selectedItemsUpdated()', () => {
    beforeEach(() => {
      component.selectedItemsUpdated(indexedLabelStub);
      fixture.detectChanges();
    });

    it('should dispatch UpdateSelectedDocumentText action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new UpdateSelectedDocumentText(indexedLabelStub)
      ));
  });

  describe('getAgeStamp()', () => {
    describe('when ingestionType is defined', () => {
      let ageStamp = '';
      const compositeDataStub = getCompositeDataStub();

      beforeEach(() => {
        compositeDataStub.indexed.dateReceived = '2021-4-2T10:51:29.6302889Z';
        compositeDataStub.indexed.labels.push(
          {
            id: '00000000-0000-0000-0000-000000000000',
            label: DocumentLabelKeys.nonLookupLabels.IngestionType,
            page: 1,
            value: {
              text: 'email',
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
            label: DocumentLabelKeys.nonLookupLabels.SourceEmail,
            page: 1,
            value: {
              text: 'user@email.com',
              confidence: 99.99,
              boundingBox: [],
              required: false,
              verificationState: '',
              incomplete: false,
              incompleteReason: '',
              type: '',
            },
          }
        );
        ageStamp = component.getAgeStamp(compositeDataStub.indexed);
      });

      afterEach(() => {
        compositeDataStub.indexed.labels.splice(compositeDataStub.indexed.labels.length - 2, 2);
      });

      it('should return age stamp string with ingestion type', () => {
        const formattedDate = DateTime.fromISO(compositeDataStub.indexed.dateReceived).toFormat(
          'dd MMM y h:mma ZZZZ'
        );
        expect(ageStamp).toBe(`Delivered by email ( user@email.com ) on ${formattedDate}`);
      });

      it('should set tooltip to amount of hours it has been since invoice was received', () => {
        const hours = DateTime.local()
          .diff(DateTime.fromISO(compositeDataStub.indexed.dateReceived), ['hours'])
          .toFormat('h');
        expect(component.tooltipText).toBe(`This invoice was received ${hours} hours ago`);
      });
    });

    describe('when ingestionType is undefined', () => {
      let ageStamp = '';
      const compositeDataStub = getCompositeDataStub();

      beforeEach(() => {
        compositeDataStub.indexed.dateReceived = '2020-10-26T21:51:29.6302889Z';
        ageStamp = component.getAgeStamp(compositeDataStub.indexed);
      });

      it('should return age stamp string without ingestion type', () => {
        const formattedDate = DateTime.fromISO(compositeDataStub.indexed.dateReceived).toFormat(
          'dd MMM y h:mma ZZZZ'
        );
        expect(ageStamp).toBe(`Delivered on ${formattedDate}`);
      });
    });
  });

  describe('highlightField()', () => {
    beforeEach(() => {
      component.highlightField('[1,1,1,1,1,1,1,1]');
    });

    it('should set fieldToHighlight to the boundingbox coordinates', () =>
      expect(component.fieldToHighlight).toBe('[1,1,1,1,1,1,1,1]'));
  });

  describe('boundingBoxToHighlight()', () => {
    beforeEach(() => {
      component.boundingBoxToHighlight('[1,1,1,1,1,1,1,1]');
    });

    it('should set boundingBoxCoordinatesToHighlight to the boundingbox coordinates', () =>
      expect(component.boundingBoxCoordinatesToHighlight).toBe('[1,1,1,1,1,1,1,1]'));
  });

  describe('lookupFieldsValid()', () => {
    it('should return false when formgroup is null', () => {
      expect(component.lookupFieldsValid(null)).toBeFalsy();
    });

    it('should return false when formgroup is undefined', () => {
      expect(component.lookupFieldsValid(undefined)).toBeFalsy();
    });

    it('should return true when all lookup fields completed', () => {
      const formBuilder: FormBuilder = new FormBuilder();
      const testFormGroup = formBuilder.group({
        CustomerAccountNumber: '70644',
        Supplier: 'CINTAS CORPORATION #612',
        SupplierAddress: 'P.O. BOX 630803 CINCINNATI, OH 45263-0803',
        ShipToName: 'TEST',
        ShipToAddress: 'TEST',
        OrderedBy: 'TEST',
        Workflow: 'TEST',
      });
      expect(component.lookupFieldsValid(testFormGroup)).toBeTruthy();
    });

    it('should return false when all lookup fields not complete', () => {
      const formBuilder: FormBuilder = new FormBuilder();
      const testFormGroup = formBuilder.group({
        CustomerAccountNumber: '70644',
        Supplier: 'CINTAS CORPORATION #612',
        SupplierAddress: 'P.O. BOX 630803 CINCINNATI, OH 45263-0803',
      });
      expect(component.lookupFieldsValid(testFormGroup)).toBeFalsy();
    });
  });

  describe('openHotKeysModal()', () => {
    beforeEach(() => {
      component.openHotKeysModal();
    });

    it('should call hotkeys service openHelpModal function', () => {
      expect(hotkeysServiceStub.openHelpModal).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshToken()', () => {
    beforeEach(() => {
      component.refreshToken(AppPages.Indexing.File);
    });

    it('should dispatch RefreshToken & SetCurrentPage actions', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new RefreshToken(),
        new SetCurrentPage(AppPages.Indexing.File),
      ]));
  });

  describe('swapDocument()', () => {
    describe('when buyerId label is found', () => {
      const indexedDataStub = getCompositeDataStub().indexed;
      const indexedLabelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerId);
      indexedDataStub.labels.push(indexedLabelStub);

      beforeEach(() => {
        component.swapDocument(indexedDataStub, 'mockName');
      });

      afterEach(() => indexedDataStub.labels.pop());

      it('should open up DocumentSwapComponent dialog', () =>
        expect(dialogStub.open).toHaveBeenNthCalledWith(1, DocumentSwapComponent, {
          autoFocus: false,
          width: '49.875em',
        }));
    });

    describe('when buyerId label is NOT found', () => {
      const indexedDataStub = getCompositeDataStub().indexed;
      const indexedLabelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerName);
      indexedDataStub.labels = [];
      indexedDataStub.labels.push(indexedLabelStub);

      beforeEach(() => {
        component.swapDocument(indexedDataStub, 'mockName');
      });

      afterEach(() => indexedDataStub.labels.pop());

      it('should open up DocumentSwapComponent dialog', () =>
        expect(dialogStub.open).toHaveBeenNthCalledWith(1, DocumentSwapComponent, {
          autoFocus: false,
          width: '49.875em',
        }));
    });

    describe('after modal has been closed, & file is defined', () => {
      const indexedDataStub = getCompositeDataStub().indexed;
      const indexedLabelStub = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.BuyerId);
      indexedDataStub.labels.push(indexedLabelStub);

      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of({} as any),
        });
        component.swapDocument(indexedDataStub, 'mockName');
      });

      it('should dispatch SwapDocument action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new SwapDocument({} as any, indexedLabelStub.value.text)
        ));
    });
  });

  describe('openPasswordModal()', () => {
    describe('after modal has been closed, & password is NOT an empty string', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of('mock'),
        });
        component.openPasswordModal();
      });

      it('should dispatch SetPdfPassword action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetPdfSecret('mock')));
    });

    describe('after modal has been closed, & password is an empty string', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of(''),
        });
        component.openPasswordModal();
      });

      it('should NOT dispatch any action', () => expect(store.dispatch).not.toHaveBeenCalled());
    });
  });

  describe('private openEscalationModal()', () => {
    describe('after modal has been closed & result is defined and escalation is IndexerQA', () => {
      const escalationStub = getEscalationStub(EscalationCategoryTypes.IndexerQa);
      escalationStub.escalationLevel = EscalationLevelTypes.InternalProcess;
      escalationStub.description = 'comms';
      escalationStub.category.reason = 'mock';

      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of({ selectedValue: 'mock', comment: 'comms' }),
        });
        component['openEscalationModal'](EscalationCategoryTypes.IndexerQa);
      });

      it('should dispatch SetEscalation action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetEscalation(escalationStub)));
    });
    describe('after modal has been closed & result is defined and escalation is IndexerQA', () => {
      const escalationStub = getEscalationStub(EscalationCategoryTypes.NonInvoiceDocument);
      escalationStub.escalationLevel = EscalationLevelTypes.InternalXdc;
      escalationStub.description = 'comms';
      escalationStub.category.reason = 'mock';

      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of({ selectedValue: 'mock', comment: 'comms' }),
        });
        component['openEscalationModal'](EscalationCategoryTypes.NonInvoiceDocument);
      });

      it('should dispatch SetEscalation action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetEscalation(escalationStub)));
    });

    describe('after modal has been closed, & result is undefined', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of(null),
        });
        component['openEscalationModal'](EscalationCategoryTypes.IndexerQa);
      });

      it('should NOT dispatch any actions', () => expect(store.dispatch).not.toHaveBeenCalled());
    });
  });

  describe('private openReturnToSenderModal()', () => {
    describe('after modal has been closed & payload is defined', () => {
      const compositeDataStub = getCompositeDataStub();
      const sourceEmailLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SourceEmail);
      const escalationStub = getEscalationStub(EscalationCategoryTypes.RecycleBin);
      const payloadStub = {
        toEmailAddress: 'mock@mock.com',
        templateId: 1,
        comments: '',
      };

      compositeDataStub.indexed.labels.push(sourceEmailLabel);
      escalationStub.escalationLevel = EscalationLevelTypes.InternalXdc;
      escalationStub.description = EscalationCategoryTypes.RejectToSender;
      escalationStub.category.reason = 'Other';

      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of(payloadStub),
        });
        store.reset({
          core: {
            userAccount: {
              preferred_username: 'mock@mock.com',
              email: 'mock@mock.com',
            },
          },
          indexingPage: {
            compositeData: compositeDataStub,
            buyerId: 1,
          },
          indexingUtility: {
            rejectToSenderTemplates: [
              {
                templateId: 1,
              },
            ],
            duplicateIndexedData: null,
          },
        });

        component['openReturnToSenderModal']();
      });

      it('should first dispatch QueryRejectToSenderTemplates & CheckForDuplicateDocument actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryRejectToSenderTemplates(1),
          new CheckForDuplicateDocument(),
        ]));

      it('should then dispatch PostRejectToSender & SetEscalation actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(2, [
          new PostRejectToSender({
            ...payloadStub,
            submitterEmailAddress: 'mock@mock.com',
            fileId: compositeDataStub.indexed.fileId as any,
            dateReceived: compositeDataStub.indexed.dateReceived,
          }),
          new SetEscalation(escalationStub),
        ]));
    });

    describe('after modal has been closed, & payload is NOT defined', () => {
      const compositeDataStub = getCompositeDataStub();
      const sourceEmailLabel = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.SourceEmail);

      compositeDataStub.indexed.labels.push(sourceEmailLabel);

      beforeEach(() => {
        dialogStub.open.mockReturnValue({
          afterClosed: () => of(false),
        });
        store.reset({
          indexingPage: {
            compositeData: compositeDataStub,
            buyerId: 1,
          },
        });
        component['openReturnToSenderModal']();
      });

      it('should only dispatch QueryRejectToSenderTemplates & CheckForDuplicateDocument actions', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new QueryRejectToSenderTemplates(1),
          new CheckForDuplicateDocument(),
        ]);
        expect(store.dispatch).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('openReturnToSenderCrudModal()', () => {
    beforeEach(() => {
      dialogStub.open.mockReturnValue({
        afterClosed: () => of(null),
      });

      store.reset({
        indexingPage: {
          buyerId: 1,
        },
      });

      component['openReturnToSenderCrudModal']();
    });

    it('should first dispatch QueryRejectToSenderTemplates action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryRejectToSenderTemplates(1)));

    it('should open up the RejectToSenderCrudComponent modal', () => {
      expect(dialogStub.open).toHaveBeenNthCalledWith(1, RejectToSenderCrudComponent, {
        autoFocus: false,
        width: '40em',
        data: {
          buyerId: 1,
        },
      });
    });

    it('should call closeAll for the dialog', () => expect(dialogStub.closeAll).toHaveBeenCalled());
  });

  describe('private getDropdownOptions()', () => {
    describe('when an indexer qa escalation is selected', () => {
      it('should return internalEscalationChoices', () => {
        expect(component['getDropdownOptions'](EscalationCategoryTypes.IndexerQa)).toEqual(
          internalEscalationChoices
        );
      });
    });

    describe('when an image issue escalation is selected', () => {
      it('should return imageIssueTypes', () => {
        expect(component['getDropdownOptions'](EscalationCategoryTypes.ImageIssue)).toEqual(
          imageIssueTypes
        );
      });
    });

    describe('when an indexing ops qc issue escalation is selected', () => {
      it('should return dataExceptionIssueTypes', () => {
        expect(component['getDropdownOptions'](EscalationCategoryTypes.IndexingOpsQc)).toEqual(
          dataExceptionIssueTypes
        );
      });
    });

    describe('when a recycle issue escalation is selected', () => {
      it('should return recycleIssueTypes', () => {
        expect(component['getDropdownOptions'](EscalationCategoryTypes.RecycleBin)).toEqual(
          recycleIssueTypes
        );
      });
    });

    describe('when a ScanningOpsQC escalation is selected', () => {
      it('should return scanningOpsQcTypes', () => {
        expect(component['getDropdownOptions'](EscalationCategoryTypes.ScanningOpsQC)).toEqual(
          scanningOpsQcTypes
        );
      });
    });

    describe('when escalation selected is NOT valid', () => {
      it('should return empty array', () => {
        expect(component['getDropdownOptions']('test')).toEqual([]);
      });
    });
  });

  describe('downloadFile()', () => {
    const compositeDataStub = getCompositeDataStub();
    beforeEach(() => {
      xdcServiceStub.getFile.mockReturnValue(of(new Blob()));
      component.downloadFile(compositeDataStub);
    });

    it('should call xdcService to getFile', () => {
      expect(xdcServiceStub.getFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateFontFace', () => {
    beforeEach(() => {
      component.updateFontFace(true);
    });

    it('should dispatch updateFontFace and SetPdfFileValue', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new UpdateFontFace(true),
        new SetPdfFileValue(),
      ]);
    });
  });

  describe('disableHighlight', () => {
    beforeEach(() => {
      component.disableHighlight(true);
    });

    it('should dispatch disableHighlight', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new DisableHighlight(true));
    });
  });

  describe('handleNotifications', () => {
    describe('after modal has been close and value returned is true', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        jest.spyOn(component as any, 'handleSubmitInvoice').mockReturnValue(of());
        component.notifications = [{ title: 'confirm', message: 'notification 1' }];
        component.handleNotifications(null, true);
      });

      it('should call handleSubmitInvoice action', () =>
        expect(component['handleSubmitInvoice']).toHaveBeenCalledTimes(1));
    });

    describe('after modal has been close and value returned is true and there are still notificaitons left', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        jest.spyOn(component as any, 'handleNotifications');
        component.notifications = [
          { title: 'confirm', message: 'notification 1' },
          { title: 'confirm', message: 'notification 2' },
        ];
        component.handleNotifications(null, true);
      });

      it('should call handleNotifications again to open another confirm modal', () =>
        expect(component['handleNotifications']).toHaveBeenNthCalledWith(1, null, true));
    });

    describe('after modal has been close and value returned is false', () => {
      beforeEach(() => {
        jest.spyOn(component as any, 'handleSubmitInvoice').mockReturnValue(of());
        dialogStub.open.mockReturnValue({ afterClosed: () => of(false) });
        component.notifications = [{ title: 'confirm', message: 'notification 1' }];
        component.handleNotifications(null, false);
      });

      it('should not call handleSubmitInvoice action', () =>
        expect(component['handleSubmitInvoice']).toHaveBeenCalledTimes(0));
    });
  });
});
