import { ViewportScroller } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import {
  AddFilteredBuyer,
  QueryDocumentCardSetCounts,
  RemoveFilteredBuyer,
  SetCurrentPage,
  UnlockDocument,
} from '@ui-coe/avidcapture/core/data-access';
import { PageHelperService } from '@ui-coe/avidcapture/core/util';
import { QueryUnindexedDocument, StorePageFilters } from '@ui-coe/avidcapture/indexing/data-access';
import {
  DisablePageRefresh,
  EnablePageRefresh,
  QueryAllBuyersLookAhead,
  QueryBuyerLookAhead,
  QueryRecycleBinDocuments,
  RecycleBinPageState,
  RemoveFilter,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetRecycleBinPageSignalEvents,
  SetScrollPosition,
} from '@ui-coe/avidcapture/recycle-bin/data-access';
import {
  RecycleBinFilterComponent,
  RecycleBinGridComponent,
} from '@ui-coe/avidcapture/recycle-bin/ui';
import {
  CoreStateMock,
  getAdvancedFilterStub,
  getBuyersStub,
  getDocuments,
  singleOrgTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import { AdvancedFiltersKeys, AppPages, SortDirection } from '@ui-coe/avidcapture/shared/types';
import { LoadingSpinnerComponent } from '@ui-coe/avidcapture/shared/ui';
import { DateTime } from 'luxon';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import * as testStubs from '@ui-coe/avidcapture/shared/test';
import { UpdateQueueInvoiceOnUnlock } from '@ui-coe/avidcapture/shared/data-access';
import { RecycleBinPageComponent } from './recycle-bin.component';

const viewPortStub = {
  getScrollPosition: jest.fn(),
};
const pageHelperServiceStub = {
  setTimeoutForPageRefresh: jest.fn(),
} as any;

const dialogStub = {
  open: jest.fn(),
};

describe('RecycleBinComponent', () => {
  let component: RecycleBinPageComponent;
  let fixture: ComponentFixture<RecycleBinPageComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecycleBinPageComponent,
        MockComponent(RecycleBinFilterComponent),
        MockComponent(RecycleBinGridComponent),
        MockComponent(LoadingSpinnerComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        NgxsModule.forRoot([CoreStateMock, RecycleBinPageState], { developmentMode: true }),
      ],
      providers: [
        {
          provide: ViewportScroller,
          useValue: viewPortStub,
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
          provide: MatDialog,
          useValue: dialogStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecycleBinPageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    store.reset({
      core: {
        token: singleOrgTokenStub,
        orgNames: [{ id: '25', name: 'test' }],
        filteredBuyers: [{ id: '25', name: 'test' }],
        userAccount: {
          preferred_username: 'mocktest',
        },
      },
      recycleBinPage: {
        invoices: [],
      },
    });

    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when filteredBuyers has length greater than 0', () => {
      beforeEach(() => {
        store.reset({
          core: {
            token: singleOrgTokenStub,
            userAccount: {
              preferred_username: 'mocktest',
            },
            filteredBuyers: [{ id: '25', name: 'test' }],
            orgsId: ['25'],
            orgNames: [{ id: '25', name: 'test' }],
          },
          recycleBinPage: {
            invoices: [],
          },
        });

        jest.spyOn(component, 'loadPage');
        fixture.detectChanges();
      });

      it('should call the loadPage fn', () => expect(component.loadPage).toHaveBeenCalledTimes(1));

      it('should dispatch QueryRecycleBinDocuments and several other actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new SetCurrentPage(AppPages.RecycleBin),
          new ResetPageNumber(),
          new QueryRecycleBinDocuments(),
          new EnablePageRefresh(),
          new QueryDocumentCardSetCounts(),
          new SetRecycleBinPageSignalEvents(),
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
          recycleBinPage: {
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
  });

  describe('searchBuyers()', () => {
    describe('when a value does NOT exists', () => {
      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.searchBuyers('', false);
      });

      it('should NOT dispatch QueryBuyerLookAhead action', () =>
        expect(store.dispatch).not.toHaveBeenCalled());
    });

    describe('when a value exists', () => {
      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.searchBuyers('bro', false);
      });

      it('should dispatch QueryBuyerLookAhead action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryBuyerLookAhead('bro')));
    });

    describe('when user is a Sponsor User', () => {
      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.searchBuyers('bro', true);
      });

      it('should dispatch QueryAllBuyersLookAhead action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryAllBuyersLookAhead('bro')));
    });
  });

  describe('filteredBuyerAdded()', () => {
    describe('when user is a Sponsor User', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.filteredBuyerAdded(buyerStub, true);
      });

      it('should dispatch AddFilteredBuyer for Core State & ResetPageNumber & QueryRecycleBinDocuments actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new AddFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryRecycleBinDocuments(),
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

      it('should dispatch RemoveFilteredBuyer for Core State & ResetPageNumber & QueryRecycleBinDocuments actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new RemoveFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryRecycleBinDocuments(),
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

  describe('openInvoice()', () => {
    const data = getDocuments()[0];
    const pageFilters = getAdvancedFilterStub();

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
        recycleBinPage: {
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

  describe('loadNextPage', () => {
    beforeEach(() => {
      component.loadNextPage();
    });

    it('should dispatch loadNexPage', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryRecycleBinDocuments());
    });
  });
  describe('AdvanceSearchApplied', () => {
    const formValuesStub = getAdvancedFilterStub();

    beforeEach(() => {
      component.advanceSearchApplied(getAdvancedFilterStub());
    });

    it('should dispatch SetAdvanceFilters action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [new SetAdvanceFilters(formValuesStub)]));
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
        new QueryRecycleBinDocuments(),
        new DisablePageRefresh(),
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

  describe('getMinDateForFilter()', () => {
    const expectedValue = DateTime.local().minus({ days: 31 }).toFormat('MMM dd y');

    it('should return a min date', () =>
      expect(component.getMinDateForFilter().toString()).toContain(expectedValue));
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
