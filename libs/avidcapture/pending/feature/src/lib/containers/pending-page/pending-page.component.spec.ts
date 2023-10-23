import { ViewportScroller } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import {
  AddFilteredBuyer,
  QueryDocumentCardSetCounts,
  RemoveFilteredBuyer,
  SetCurrentPage,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import { PageHelperService, ToastService } from '@ui-coe/avidcapture/core/util';
import { QueryUnindexedDocument, StorePageFilters } from '@ui-coe/avidcapture/indexing/data-access';
import {
  BatchDeletion,
  BatchDownload,
  DisablePageRefresh,
  EnablePageRefresh,
  PendingPageState,
  QueryAllBuyersLookAhead,
  QueryBuyerLookAhead,
  QueryQueueInvoices,
  RemoveFilter,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetPendingPageSignalEvents,
  SetScrollPosition,
  UpdateQueueInvoiceOnUnlock,
} from '@ui-coe/avidcapture/pending/data-access';
import { PendingFilterComponent, PendingGridComponent } from '@ui-coe/avidcapture/pending/ui';
import * as testStubs from '@ui-coe/avidcapture/shared/test';
import { getAdvancedFilterStub, getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import {
  AdvancedFiltersKeys,
  AppPages,
  BatchActions,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import {
  DocumentCardSetComponent,
  LoadingSpinnerComponent,
  SnackbarBatchActionsComponent,
} from '@ui-coe/avidcapture/shared/ui';
import { ToastHorizontalPositions, ToastVerticalPositions } from '@ui-coe/shared/types';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { PendingPageComponent } from './pending-page.component';

const viewPortStub = {
  getScrollPosition: jest.fn(),
};
const dialogStub = {
  open: jest.fn(),
};
const pageHelperServiceStub = {
  setTimeoutForPageRefresh: jest.fn(),
  setPresortedColumnData: jest.fn(),
} as any;
const matSnackBarStub = {
  dismiss: jest.fn(),
  openFromComponent: jest.fn(() => ({
    afterDismissed: (): any => of(null),
  })),
};

const toastServiceSpy = {
  success: jest.fn(),
};

describe('PendingPageComponent', () => {
  let component: PendingPageComponent;
  let fixture: ComponentFixture<PendingPageComponent>;
  let store: Store;
  let fields: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PendingPageComponent,
        MockComponent(LoadingSpinnerComponent),
        MockComponent(PendingFilterComponent),
        MockComponent(PendingGridComponent),
        MockComponent(DocumentCardSetComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [
        HttpClientTestingModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        NgxsModule.forRoot([testStubs.CoreStateMock, PendingPageState], { developmentMode: true }),
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
        {
          provide: ToastService,
          useValue: toastServiceSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    store.reset({
      core: {
        userAccount: {
          preferred_username: 'mocktest',
        },
        filteredBuyers: [{ id: '25', name: 'test' }],
        orgNames: [{ id: '25', name: 'test' }],
      },
      pendingPage: {
        invoices: [],
      },
    });

    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when filteredBuyersCore has a length greater than 0', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: testStubs.singleOrgTokenStub,
            userAccount: {
              preferred_username: 'mocktest',
            },
            filteredBuyers: [{ id: '25', name: 'test' }],
            orgsId: ['25'],
            orgNames: [{ id: '25', name: 'test' }],
          },
          pendingPage: {
            pageNumber: 0,
            filteredBuyers: ['1'],
            sortedColumnData: {},
            invoices: [],
          },
        });
        jest.spyOn(component, 'loadPage');
        fixture.detectChanges();
      });

      it('should call the loadPage fn', () => expect(component.loadPage).toHaveBeenCalledTimes(1));

      it('should dispatch a set of actions', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new SetCurrentPage(AppPages.Queue),
          new ResetPageNumber(),
          new QueryQueueInvoices(),
          new EnablePageRefresh(),
          new QueryDocumentCardSetCounts(),
          new SetPendingPageSignalEvents(),
        ]);
      });
    });

    describe('when filteredBuyersCore has a length equal to 0', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: testStubs.singleOrgTokenStub,
            userAccount: {
              preferred_username: 'mocktest',
            },
            filteredBuyers: [],
            orgsId: ['25'],
            orgNames: [{ id: '25', name: 'test' }],
          },
          pendingPage: {
            pageNumber: 0,
            filteredBuyers: ['1'],
            sortedColumnData: {},
            invoices: [],
          },
        });
        jest.spyOn(component, 'loadPage');
        fixture.detectChanges();
      });

      it('should NOT call the loadPage fn', () =>
        expect(component.loadPage).not.toHaveBeenCalled());

      it('should NOT dispatch a set of actions', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe('when filteredBuyersCore has a length greater than 0 but username is null', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: testStubs.singleOrgTokenStub,
            userAccount: {
              preferred_username: null,
            },
            filteredBuyers: [{ id: '25', name: 'test' }],
            orgsId: ['25'],
            orgNames: [{ id: '25', name: 'test' }],
          },
          pendingPage: {
            pageNumber: 0,
            filteredBuyers: ['1'],
            sortedColumnData: {},
            invoices: [],
          },
        });
        jest.spyOn(component, 'loadPage');
        fixture.detectChanges();
      });

      it('should call the loadPage fn', () => expect(component.loadPage).toHaveBeenCalledTimes(1));

      it('should NOT dispatch a set of actions', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      component['snackBarRef'] = { dismiss: jest.fn() } as any;
      fixture.destroy();
    });

    it('should dismiss the snackBar if it is defined', () =>
      expect(component['snackBarRef'].dismiss).toHaveBeenCalledTimes(1));
  });

  describe('openInvoice()', () => {
    const pageFilters = getAdvancedFilterStub();

    beforeEach(() => {
      store.reset({
        core: {
          token: testStubs.singleOrgTokenStub,
          userMenuOptions: [],
          userAccount: {
            preferred_username: 'mocktest',
          },
        },
        pendingPage: {
          filters: pageFilters,
        },
      });
      viewPortStub.getScrollPosition.mockReturnValue([0, 2000]);
      component.openInvoice(testStubs.getDocuments()[0]);
    });

    it('should dispatch queryUnindexedDocument and SetScrollPosition actions', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new QueryUnindexedDocument(testStubs.getDocuments()[0].documentId),
        new SetScrollPosition([0, 2000]),
        new StorePageFilters(pageFilters),
      ]));
  });

  describe('searchCustomers()', () => {
    describe('search with no value', () => {
      beforeEach(() => {
        jest.spyOn(store, 'dispatch').mockImplementation();
        component.searchCustomers('', false);
      });

      it('should not call action', () =>
        expect(store.dispatch).not.toHaveBeenNthCalledWith(1, new QueryBuyerLookAhead('te')));
    });

    describe('search with only 1 char', () => {
      beforeEach(() => {
        jest.spyOn(store, 'dispatch').mockImplementation();
        component.searchCustomers('t', false);
      });

      it('should not call action', () =>
        expect(store.dispatch).not.toHaveBeenNthCalledWith(1, new QueryBuyerLookAhead('te')));
    });

    describe('search with at least 2 char', () => {
      beforeEach(() => {
        jest.spyOn(store, 'dispatch').mockImplementation();
        component.searchCustomers('te', false);
      });

      it('should call action QueryBuyerLookAhead', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryBuyerLookAhead('te')));
    });

    describe('when user is a Sponsor User', () => {
      beforeEach(() => {
        jest.spyOn(store, 'dispatch').mockImplementation();
        component.searchCustomers('te', true);
      });

      it('should call action QueryAllBuyersLookAhead', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryAllBuyersLookAhead('te')));
    });
  });

  describe('filteredBuyerAdded()', () => {
    describe('when user is a Sponsor User', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.filteredBuyerAdded(buyerStub, true);
      });

      it('should dispatch AddFilteredBuyer for Core State & ResetPageNumber & QueryQueueInvoices actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new AddFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryQueueInvoices(),
        ]));
    });

    describe('when user is NOT a Sponsor User', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.filteredBuyerAdded(buyerStub, false);
      });

      it('should NOT dispatch any actions', () => expect(store.dispatch).not.toHaveBeenCalled());
    });
  });

  describe('filteredBuyerRemoved()', () => {
    describe('when user is a Sponsor User', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.filteredBuyerRemoved(buyerStub, true);
      });

      it('should dispatch RemoveFilteredBuyer for Core State & ResetPageNumber & QueryQueueInvoices actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new RemoveFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryQueueInvoices(),
        ]));
    });

    describe('when user is NOT a Sponsor User', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.filteredBuyerRemoved(buyerStub, false);
      });

      it('should NOT dispatch any actions', () => expect(store.dispatch).not.toHaveBeenCalled());
    });
  });

  describe('loadNextPage()', () => {
    describe('when advanceFilters is enabled', () => {
      beforeEach(() => {
        component.loadNextPage();
      });

      it('should get invoices filtered by buyer', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryQueueInvoices()));
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

  describe('advanceSearchApplied()', () => {
    const formValues = testStubs.getAdvancedFilterStub();
    beforeEach(() => {
      component.advanceSearchApplied(formValues);
    });

    it('should dispatch SetAdvanceFilters action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetAdvanceFilters(formValues)));
  });

  describe('filterRemoved()', () => {
    beforeEach(() => {
      component.filterRemoved(AdvancedFiltersKeys.InvoiceNumber);
    });

    it('should dispatch RemoveFilter action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new RemoveFilter(AdvancedFiltersKeys.InvoiceNumber)
      ));
  });

  describe('refreshPage()', () => {
    beforeEach(() => {
      component.refreshPage();
    });

    it('should dispatch multiple actions to refresh data', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new ResetPageNumber(),
        new QueryQueueInvoices(),
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

  describe('batchSelect()', () => {
    const documentsStub = testStubs.getDocuments();

    describe('when snackBarRef is NULL & user selects the delete action', () => {
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
        expect(component['snackBarRef']).toBeNull();
      });
    });

    describe('when snackBarRef is NULL & user selects the download action', () => {
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
        expect(component['snackBarRef']).toBeNull();
      });
    });

    describe('when snackBarRef is opened and rows returned are 0', () => {
      beforeEach(() => {
        component['snackBarRef'] = matSnackBarStub as any;
        component.batchSelect([]);
      });

      it('should set snackBarRef to null when snackBar is dismissed', () => {
        expect(matSnackBarStub.dismiss).toHaveBeenCalledTimes(1);
        expect(component['snackBarRef']).toBeNull();
      });
    });

    describe('when snackBarRef is NOT NULL', () => {
      beforeEach(() => {
        component['snackBarRef'] = matSnackBarStub as any;
        component.batchSelect(documentsStub);
      });

      it('should NOT open up the batch action snackbar', () =>
        expect(matSnackBarStub.openFromComponent).not.toHaveBeenCalled());
    });
  });

  describe('unlockDocumentManually', () => {
    const document = testStubs.getDocuments()[0];
    describe('After modal has been close and value returned is true', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        component.unlockDocumentManually(document);
      });

      it('should call UnlockDocument & UpdateQueueInvoiceOnUnlock action', () => {
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new UnlockDocument(document.documentId, document.buyerId),
          new UpdateQueueInvoiceOnUnlock(document.documentId),
        ]);
      });
    });
  });
});
