import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import {
  InitArchiveInvoicePage,
  QueryArchivedDocument,
  UpdateFontFace,
  SkipToNextDocument,
  SkipToPreviousDocument,
} from '@ui-coe/avidcapture/archive/data-access';
import {
  ArchiveFieldsComponent,
  ArchiveInvoiceHeaderComponent,
} from '@ui-coe/avidcapture/archive/ui';
import { AddMenuOptions, RemoveMenuOptions } from '@ui-coe/avidcapture/core/data-access';
import { XdcService } from '@ui-coe/avidcapture/core/util';
import {
  CoreStateMock,
  getCompositeDataStub,
  getIndexedLabelStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  ActivityTypes,
  DocumentLabelKeys,
  FieldBase,
  InvoiceTypes,
  UserMenuOptions,
} from '@ui-coe/avidcapture/shared/types';
import {
  DocumentCommandBarComponent,
  DocumentViewerComponent,
} from '@ui-coe/avidcapture/shared/ui';
import { DateTime } from 'luxon';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { ArchiveInvoicePageComponent } from './archive-invoice-page.component';

const xdcServiceStub = {
  getFile: jest.fn(),
};

const environmentStub = {
  maxUnindexedPages: '10',
} as any;

describe('ArchiveInvoicePageComponent', () => {
  let component: ArchiveInvoicePageComponent;
  let fixture: ComponentFixture<ArchiveInvoicePageComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArchiveInvoicePageComponent,
        MockComponent(ArchiveInvoiceHeaderComponent),
        MockComponent(DocumentCommandBarComponent),
        MockComponent(DocumentViewerComponent),
        MockComponent(ArchiveFieldsComponent),
      ],
      imports: [
        NgxsModule.forRoot([CoreStateMock], { developmentMode: true }),
        MatFormFieldModule,
        HttpClientTestingModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ docId: '101163321' })),
            snapshot: {
              params: {
                docId: '101163321',
              },
            },
          },
        },
        {
          provide: 'environment',
          useValue: {},
        },
        {
          provide: XdcService,
          useValue: xdcServiceStub,
        },
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveInvoicePageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    store.reset({
      core: {
        userAccount: {
          preferred_username: 'testEmail',
        },
        userMenuOptions: [{ text: UserMenuOptions.ClientGuidelines }],
      },
    });

    jest.spyOn(store, 'dispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should define maxUnindexedPages using environment variable', () => {
      fixture.detectChanges();
      expect(component.maxUnindexedPages).toBe(10);
    });

    it('should dispatch InitArchiveInvoicePage & AddMenuOptions actions', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new InitArchiveInvoicePage('101163321'),
        new AddMenuOptions({ text: UserMenuOptions.HotkeyGuide }),
      ]));
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      fixture.destroy();
    });

    it('should dispatch RemoveMenuOptions action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new RemoveMenuOptions({ text: UserMenuOptions.HotkeyGuide })
      ));
  });

  describe('getInvoiceType()', () => {
    describe('when InvoiceType is found & InvoiceType is Utility', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.nonLookupLabels.InvoiceType);
      label.value.text = InvoiceTypes.Utility;
      let value = '';

      beforeEach(() => {
        value = component.getInvoiceType([label]);
      });

      it('should return invoice type as Utility', () => expect(value).toBe(InvoiceTypes.Utility));
    });

    describe('when InvoiceType is NOT found', () => {
      const label = getIndexedLabelStub(DocumentLabelKeys.lookupLabels.Supplier);
      let value = '';

      beforeEach(() => {
        value = component.getInvoiceType([label]);
      });

      it('should return invoice type as Standard', () => expect(value).toBe(InvoiceTypes.Standard));
    });
  });

  describe('boundingBoxToHighlight()', () => {
    beforeEach(() => {
      component.boundingBoxToHighlight('[1,1,1,1,1,1,1,1]');
    });

    it('should set boundingBoxCoordinatesToHighlight to boundingBoxId passed in', () =>
      expect(component.boundingBoxCoordinatesToHighlight).toBe('[1,1,1,1,1,1,1,1]'));
  });

  describe('highlightField()', () => {
    beforeEach(() => {
      component.highlightField(DocumentLabelKeys.lookupLabels.CustomerAccountNumber);
    });

    it('should set fieldToHighlight to bounding box information being passed in', () =>
      expect(component.fieldToHighlight).toBe(
        DocumentLabelKeys.lookupLabels.CustomerAccountNumber
      ));
  });

  describe('getSubmittedDate()', () => {
    describe('when an activity is found', () => {
      const archivedCompositeDocumentStub = getCompositeDataStub();
      const activityStub = {
        ordinal: 2,
        startDate: '',
        endDate: '2021-4-2T10:51:29.6302889Z',
        indexer: 'avidtest@avidxchange.com',
        activity: ActivityTypes.Submit,
        description: '',

        escalation: {
          category: { issue: '', reason: '' },
          description: '',
          escalationLevel: '',
          resolution: '',
        },
        labels: [],
      } as any;
      let ageStamp = '';

      beforeEach(() => {
        archivedCompositeDocumentStub.indexed.activities.push(activityStub);
        ageStamp = component.getSubmittedDate(archivedCompositeDocumentStub);
      });

      it('should return age stamp string with ingestion type', () => {
        const formattedDate = DateTime.fromISO(activityStub.endDate).toFormat(
          'dd MMM y h:mma ZZZZ'
        );
        expect(ageStamp).toBe(`Submitted on ${formattedDate} by ${activityStub.indexer}`);
      });
    });

    describe('when an activity is NOT found', () => {
      const archivedCompositeDocumentStub = getCompositeDataStub();
      let ageStamp = '';

      beforeEach(() => {
        archivedCompositeDocumentStub.indexed.activities.pop();
        ageStamp = component.getSubmittedDate(archivedCompositeDocumentStub);
      });

      it('should return age stamp string with as empty', () => {
        expect(ageStamp).toBe('');
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
      component.updateFontFace(true, '123-321');
    });

    it('should dispatch updateFontFace and SetPdfFileValue', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new UpdateFontFace(true),
        new QueryArchivedDocument('123-321'),
      ]);
    });
  });

  describe('getIsUtilityField', () => {
    describe('When is a utility field should returns true', () => {
      const fieldBase = { key: 'ServiceStartDate' };
      const utilityFields = ['ServiceStartDate'];
      it('should returns true', () => {
        expect(
          component.getIsUtilityField(fieldBase as FieldBase<string>, utilityFields)
        ).toBeTruthy();
      });
    });

    describe('When is not a utility field should returns false', () => {
      const fieldBase = { key: 'InvoiceNumber' };
      const utilityFields = ['ServiceStartDate'];
      it('should returns true', () => {
        expect(
          component.getIsUtilityField(fieldBase as FieldBase<string>, utilityFields)
        ).toBeFalsy();
      });
    });
  });

  describe('private getPredictedValue', () => {
    describe('when canDisplayPredictedValues label is turned ON', () => {
      let result: boolean;
      const labelStub = getIndexedLabelStub(
        DocumentLabelKeys.nonLookupLabels.DisplayPredictedValues
      );

      labelStub.value.text = '1';

      beforeEach(() => {
        result = component.getPredictedValue([labelStub]);
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
        result = component.getPredictedValue([labelStub]);
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
        result = component.getPredictedValue([labelStub]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });

    describe('when label cannot be found', () => {
      let result: boolean;

      beforeEach(() => {
        result = component.getPredictedValue([]);
      });

      it('should return FALSE', () => expect(result).toBeFalsy());
    });
  });

  describe('skipToPreviousDocument', () => {
    beforeEach(() => {
      component.skipToPreviousDocument();
    });

    it('should dispatch skipToPreviousDocument', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new SkipToPreviousDocument('101163321'));
    });
  });

  describe('skipToNextDocument', () => {
    beforeEach(() => {
      component.skipToNextDocument();
    });

    it('should dispatch skipToNextDocument', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new SkipToNextDocument('101163321'));
    });
  });
});
