import { ViewportScroller } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { QueryDocumentCardSetCounts, SetCurrentPage } from '@ui-coe/avidcapture/core/data-access';
import { PageHelperService } from '@ui-coe/avidcapture/core/util';
import { QueryUnindexedDocument, StorePageFilters } from '@ui-coe/avidcapture/indexing/data-access';
import {
  BatchDeletion,
  BatchDownload,
  ClearUploadedDocumentMessages,
  DisablePageRefresh,
  EnablePageRefresh,
  FilterByInvoiceName,
  QueryUploadedInvoices,
  ResetPageNumber,
  SetColumnSortedData,
  SetScrollPosition,
  SetSourceEmail,
  SetUploadsPageSignalEvents,
  UploadDocument,
  UploadsQueuePageState,
} from '@ui-coe/avidcapture/my-uploads/data-access';
import {
  UploadCompleteComponent,
  UploadsDropZoneComponent,
  UploadsQueueGridComponent,
} from '@ui-coe/avidcapture/my-uploads/ui';
import {
  CoreStateMock,
  getAdvancedFilterStub,
  getDocuments,
  hasAllTheClaimsTokenStub,
  singleOrgTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import { AppPages, BatchActions, SortDirection } from '@ui-coe/avidcapture/shared/types';
import {
  LoadingSpinnerAppComponent,
  SnackbarBatchActionsComponent,
} from '@ui-coe/avidcapture/shared/ui';
import {
  ToastHorizontalPositions,
  ToastIconTypes,
  ToastTypes,
  ToastVerticalPositions,
} from '@ui-coe/shared/types';
import { ButtonComponent, InputComponent } from '@ui-coe/shared/ui-v2';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { UploadsQueuePageComponent } from './uploads-queue-page.component';

const viewPortStub = {
  getScrollPosition: jest.fn(),
};
const dialogStub = {
  open: jest.fn(),
};
const pageHelperServiceStub = {
  setTimeoutForPageRefresh: jest.fn(),
  openUploadErrorToast: jest.fn(),
} as any;
const matSnackBarStub = {
  dismiss: jest.fn(),
  openFromComponent: jest.fn(() => ({
    afterDismissed: (): any => of(null),
  })),
};

describe('UploadsQueuePageComponent', () => {
  let component: UploadsQueuePageComponent;
  let fixture: ComponentFixture<UploadsQueuePageComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UploadsQueuePageComponent,
        MockComponent(UploadsQueueGridComponent),
        MockComponent(UploadsDropZoneComponent),
        MockComponent(LoadingSpinnerAppComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [
        HttpClientTestingModule,
        NgxsModule.forRoot([CoreStateMock, UploadsQueuePageState], { developmentMode: true }),
        NoopAnimationsModule,
        ButtonComponent,
        InputComponent,
        MatIconModule,
        MatSnackBarModule,
      ],
      providers: [
        {
          provide: ViewportScroller,
          useValue: viewPortStub,
        },
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: PageHelperService,
          userValue: pageHelperServiceStub,
        },
        {
          provide: 'environment',
          useValue: {},
        },
        {
          provide: MatSnackBar,
          useValue: matSnackBarStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadsQueuePageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    store.reset({
      core: {
        token: hasAllTheClaimsTokenStub,
        orgNames: [{ id: '25', name: 'test' }],
        filteredBuyers: [{ id: '25', name: 'test' }],
        userAccount: {
          preferred_username: 'mocktest',
        },
      },
      uploadsQueuePage: {
        invoices: [],
        searchByFileNameValue: 'searchValueMock',
      },
    });

    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => jest.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when filteredBuyers has length greater than 0', () => {
      beforeEach(() => {
        jest.spyOn(component, 'loadPage');
        jest.spyOn(component as any, 'initiateSearchfilter');
        fixture.detectChanges();
      });

      it('should call the loadPage fn', () => expect(component.loadPage).toHaveBeenCalledTimes(1));

      it('should call the initiateSearchfilter fn', () =>
        expect(component['initiateSearchfilter']).toHaveBeenCalledTimes(1));

      it('should set seatchValueMock to search control', () =>
        expect(component.searchControl.value).toEqual('searchValueMock'));

      it('should dispatch SetSourceEmail actions 1st', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetSourceEmail('mocktest')));

      it('should dispatch ResetPageNumber, EnablePageRefresh, & QueryUploadedInvoices actions 2nd', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(2, [
          new SetCurrentPage(AppPages.UploadsQueue),
          new ResetPageNumber(),
          new QueryUploadedInvoices(),
          new EnablePageRefresh(),
          new QueryDocumentCardSetCounts(),
          new SetUploadsPageSignalEvents(),
        ]));

      it('should not call loadPageEvent when scrolling has not hit bottom of page', () => {
        jest.spyOn(component, 'loadNextPage').mockImplementation();
        window.dispatchEvent(new Event('scroll'));
        expect(component.loadNextPage).not.toHaveBeenCalled();
      });
    });

    describe('when filteredBuyersCore has a length equal to 0', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: singleOrgTokenStub,
            userAccount: {
              preferred_username: 'mocktest',
            },
            filteredBuyers: [],
            orgsId: ['25'],
            orgNames: [{ id: '25', name: 'test' }],
          },
          uploadsQueuePage: {
            invoices: [],
          },
        });
        jest.spyOn(component, 'loadPage');
        jest.spyOn(component as any, 'initiateSearchfilter');
        fixture.detectChanges();
      });

      it('should NOT call the loadPage fn', () =>
        expect(component.loadPage).not.toHaveBeenCalled());

      it('should NOT call the initiateSearchfilter fn', () =>
        expect(component['initiateSearchfilter']).not.toHaveBeenCalled());

      it('should NOT dispatch a set of actions', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when filteredBuyersCore has a length greater than 0 but username is null', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: singleOrgTokenStub,
            userAccount: {
              preferred_username: null,
            },
            filteredBuyers: [{ id: '25', name: 'test' }],
            orgsId: ['25'],
            orgNames: [{ id: '25', name: 'test' }],
          },
          uploadsQueuePage: {
            invoices: [],
          },
        });
        jest.spyOn(component, 'loadPage');
        jest.spyOn(component as any, 'initiateSearchfilter');
        fixture.detectChanges();
      });

      it('should NOT call the loadPage fn', () =>
        expect(component.loadPage).not.toHaveBeenCalled());

      it('should NOT call the initiateSearchfilter fn', () =>
        expect(component['initiateSearchfilter']).not.toHaveBeenCalled());

      it('should NOT dispatch a set of actions', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      component['uploadsCompletedSnackBarRef'] = { dismiss: jest.fn() } as any;
      component['batchSnackBarRef'] = { dismiss: jest.fn() } as any;
      fixture.destroy();
    });

    it('should dismiss the uploadsCompletedSnackBarRef if it is defined', () =>
      expect(component['uploadsCompletedSnackBarRef'].dismiss).toHaveBeenCalledTimes(1));

    it('should dismiss the batchSnackBarRef if it is defined', () =>
      expect(component['batchSnackBarRef'].dismiss).toHaveBeenCalledTimes(1));
  });

  describe('openInvoice()', () => {
    const data = getDocuments()[0];
    const pageFilters = getAdvancedFilterStub();

    beforeEach(() => {
      store.reset({
        core: {
          token: singleOrgTokenStub,
          userAccount: {
            preferred_username: 'mocktest',
          },
          filteredBuyers: [],
          orgsId: ['25'],
          orgNames: [{ id: '25', name: 'test' }],
        },
        uploadsQueuePage: {
          filters: pageFilters,
        },
      });
      viewPortStub.getScrollPosition.mockReturnValue([0, 2000]);
      component.openInvoice(data);
    });

    it('should dispatch QueryArchivedDocument & SetScrollPosition actions', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new QueryUnindexedDocument(data.documentId),
        new SetScrollPosition([0, 2000]),
        new StorePageFilters(pageFilters),
      ]);
    });
  });

  describe('columnSorted()', () => {
    const sortStub = { active: 'dateReceived', direction: SortDirection.Ascending };
    beforeEach(() => {
      jest.spyOn(store, 'dispatch');
      component.columnSorted(sortStub);
    });

    it('should dispatch SetColumnSortedData action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetColumnSortedData(sortStub)));
  });

  describe('loadNextPage', () => {
    beforeEach(() => {
      component.loadNextPage();
    });

    it('should dispatch QueryUploadedInvoices', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryUploadedInvoices());
    });
  });

  describe('refreshPage()', () => {
    beforeEach(() => {
      component.refreshPage();
    });

    it('should dispatch multiple actions to refresh data', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new ResetPageNumber(),
        new QueryUploadedInvoices(),
        new DisablePageRefresh(),
        new QueryDocumentCardSetCounts(),
      ]));
  });

  describe('refresh button enabling/disabling', () => {
    it('should dispatch EnablePageRefresh action', fakeAsync(() => {
      pageHelperServiceStub.setTimeoutForPageRefresh.mockReturnValue(of(0));
      component.refreshPage();
      tick(30000);
      expect(store.dispatch).toHaveBeenNthCalledWith(2, new EnablePageRefresh());
    }));
  });

  describe('uploadInvoice()', () => {
    const fileStub = {} as any;
    beforeEach(() => {
      jest.spyOn(component as any, 'openUploadsCompletedToast').mockImplementation();
      component.uploadInvoice({ file: fileStub, orgId: '25', correlationId: 'GUID' });
    });

    it('should dispatch UploadDocument', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new UploadDocument(fileStub, '25', 'GUID')
      ));

    it('should call the openUploadsCompletedToast fn', () =>
      expect(component['openUploadsCompletedToast']).toHaveBeenCalledTimes(1));
  });

  describe('uploadError()', () => {
    beforeEach(() => {
      component.uploadError('message');
    });

    it('should open up a snackBar', () =>
      expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(1, expect.anything(), {
        duration: 5000,
        horizontalPosition: ToastHorizontalPositions.End,
        verticalPosition: ToastVerticalPositions.Top,
        data: {
          title: 'Error',
          message: 'message',
          icon: ToastIconTypes.Critical,
          type: ToastTypes.Critical,
          close: true,
        },
      }));
  });

  describe('private initiateSearchfilter()', () => {
    beforeEach(() => {
      component['initiateSearchfilter']();
    });

    it('should dispatch FilterByInvoiceName action when search has a value', fakeAsync(() => {
      component.searchControl.setValue('mock');
      tick(500);
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new FilterByInvoiceName('mock'));
    }));
  });

  describe('batchSelect()', () => {
    const documentsStub = getDocuments();

    describe('when batchSnackBarRef is NULL & user selects the delete action', () => {
      beforeEach(() => {
        matSnackBarStub.openFromComponent.mockReturnValueOnce({
          instance: {
            action: BatchActions.Delete,
          } as any,
          afterDismissed: jest.fn(() => of(null)),
        } as any);
        component.batchSelect(documentsStub);
      });

      it('should open up the batch action snackbar', () =>
        expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(
          1,
          SnackbarBatchActionsComponent,
          {
            duration: 0,
            horizontalPosition: ToastHorizontalPositions.Center,
            verticalPosition: ToastVerticalPositions.Bottom,
            data: {
              itemsSelected: component['itemsSelected'],
              canDownloadPdf$: component.canDownloadPdf$,
            },
          }
        ));

      it('should dispatch BatchDeletion & reset all batch variables', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(
          1,
          new BatchDeletion(['fc87b20a-21c4-4519-bcd4-28aba43f7ccc'])
        );
        expect(component.resetBatchSelection).toBeTruthy();
        expect(component['itemsSelected']()).toEqual([]);
        expect(component['batchSnackBarRef']).toBeNull();
      });
    });

    describe('when batchSnackBarRef is NULL & user selects the download action', () => {
      beforeEach(() => {
        matSnackBarStub.openFromComponent.mockReturnValueOnce({
          instance: {
            action: BatchActions.Download,
          } as any,
          afterDismissed: jest.fn(() => of(null)),
        } as any);
        component.batchSelect(documentsStub);
      });

      it('should open up the batch action snackbar', () =>
        expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(
          1,
          SnackbarBatchActionsComponent,
          {
            duration: 0,
            horizontalPosition: ToastHorizontalPositions.Center,
            verticalPosition: ToastVerticalPositions.Bottom,
            data: {
              itemsSelected: component['itemsSelected'],
              canDownloadPdf$: component.canDownloadPdf$,
            },
          }
        ));

      it('should dispatch BatchDownload & reset all batch variables', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new BatchDownload(documentsStub));
        expect(component.resetBatchSelection).toBeTruthy();
        expect(component['itemsSelected']()).toEqual([]);
        expect(component['batchSnackBarRef']).toBeNull();
      });
    });

    describe('when batchSnackBarRef is opened and rows returned are 0', () => {
      beforeEach(() => {
        component['batchSnackBarRef'] = matSnackBarStub as any;
        component.batchSelect([]);
      });

      it('should set batchSnackBarRef to null when snackBar is dismissed', () => {
        expect(matSnackBarStub.dismiss).toHaveBeenCalledTimes(1);
        expect(component['batchSnackBarRef']).toBeNull();
      });
    });

    describe('when batchSnackBarRef is NOT NULL', () => {
      beforeEach(() => {
        component['batchSnackBarRef'] = matSnackBarStub as any;
        component.batchSelect(documentsStub);
      });

      it('should NOT open up the batch action snackbar', () =>
        expect(matSnackBarStub.openFromComponent).not.toHaveBeenCalled());
    });
  });

  describe('private openUploadsCompletedToast()', () => {
    describe('when uploadsCompletedSnackBarRef is NULL', () => {
      beforeEach(() => {
        store.reset({
          uploadsQueuePage: {
            uploadedDocumentMessages: [],
          },
        });
        component['openUploadsCompletedToast']();
      });

      it('should open a snackbar for uploaded document messages', () =>
        expect(matSnackBarStub.openFromComponent).toHaveBeenNthCalledWith(
          1,
          UploadCompleteComponent,
          expect.objectContaining({
            duration: 30000,
            horizontalPosition: ToastHorizontalPositions.End,
            verticalPosition: ToastVerticalPositions.Bottom,
            data: {
              messages$: component.uploadedDocumentMessages$,
            },
          })
        ));

      it('should dispatch ClearUploadedDocumentMessages & set snackBarRef to null when snackBar is dismissed', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new ClearUploadedDocumentMessages());
        expect(component['uploadsCompletedSnackBarRef']).toBeNull();
      });
    });

    describe('when uploadsCompletedSnackBarRef is NOT NULL', () => {
      beforeEach(() => {
        component['uploadsCompletedSnackBarRef'] = matSnackBarStub as any;
        component['openUploadsCompletedToast']();
      });

      it('should NOT open up the batch action snackbar', () =>
        expect(matSnackBarStub.openFromComponent).not.toHaveBeenCalled());
    });
  });
});
