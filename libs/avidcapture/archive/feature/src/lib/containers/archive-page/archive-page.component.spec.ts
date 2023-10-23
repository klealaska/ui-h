import { ViewportScroller } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import {
  ArchivePageState,
  DisablePageRefresh,
  EnablePageRefresh,
  QueryAllBuyersLookAhead,
  QueryArchivedDocument,
  QueryArchivedInvoices,
  QueryBuyerLookAhead,
  RemoveFilter,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetScrollPosition,
} from '@ui-coe/avidcapture/archive/data-access';
import { ArchiveFilterComponent, ArchiveGridComponent } from '@ui-coe/avidcapture/archive/ui';
import {
  AddFilteredBuyer,
  QueryDocumentCardSetCounts,
  RemoveFilteredBuyer,
  SetCurrentPage,
} from '@ui-coe/avidcapture/core/data-access';
import { PageHelperService } from '@ui-coe/avidcapture/core/util';
import {
  CoreStateMock,
  getAdvancedFilterStub,
  getBuyersStub,
  getDocuments,
  singleOrgTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import { AdvancedFiltersKeys, AppPages, SortDirection } from '@ui-coe/avidcapture/shared/types';
import { LoadingSpinnerAppComponent } from '@ui-coe/avidcapture/shared/ui';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';

import { ArchivePageComponent } from './archive-page.component';

const viewPortStub = {
  getScrollPosition: jest.fn(),
};
const pageHelperServiceStub = {
  setTimeoutForPageRefresh: jest.fn(),
} as any;

describe('ArchivePageComponent', () => {
  let component: ArchivePageComponent;
  let fixture: ComponentFixture<ArchivePageComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ArchivePageComponent,
        MockComponent(ArchiveFilterComponent),
        MockComponent(ArchiveGridComponent),
        MockComponent(LoadingSpinnerAppComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        NgxsModule.forRoot([CoreStateMock, ArchivePageState], { developmentMode: true }),
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivePageComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    describe('when filteredBuyers has a length greater than 0', () => {
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
        });
        fixture.detectChanges();
      });

      it('should dispatch ResetPageNumber & QueryArchivedInvoices actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new SetCurrentPage(AppPages.Archive),
          new ResetPageNumber(),
          new QueryArchivedInvoices(),
          new QueryDocumentCardSetCounts(),
          new EnablePageRefresh(),
        ]));
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
            token: singleOrgTokenStub,
            userAccount: {
              preferred_username: null,
            },
            filteredBuyers: [{ id: '25', name: 'test' }],
            orgsId: ['25'],
            orgNames: [{ id: '25', name: 'test' }],
          },
        });
        jest.spyOn(component, 'loadPage');
        fixture.detectChanges();
      });

      it('should call the loadPage fn', () => expect(component.loadPage).not.toHaveBeenCalled());

      it('should NOT dispatch a set of actions', () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe('openInvoice()', () => {
    const data = getDocuments()[0];

    beforeEach(() => {
      viewPortStub.getScrollPosition.mockReturnValue([0, 2000]);
      component.openInvoice(data);
    });

    it('should dispatch QueryArchivedDocument & SetScrollPosition actions', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new QueryArchivedDocument(data.documentId),
        new SetScrollPosition([0, 2000]),
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

  describe('filteredBuyerAdded()', () => {
    describe('when user is a Sponsor User', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.filteredBuyerAdded(buyerStub, true);
      });

      it('should dispatch AddFilteredBuyer for Core State & ResetPageNumber & QueryArchivedInvoices actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new AddFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryArchivedInvoices(),
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

      it('should dispatch RemoveFilteredBuyer for Core State & ResetPageNumber & QueryArchivedInvoices actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new RemoveFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryArchivedInvoices(),
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

  describe('loadNextPage()', () => {
    beforeEach(() => {
      component.loadNextPage();
    });

    it('should dispatch QueryArchivedInvoices action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryArchivedInvoices()));
  });

  describe('advanceSearchApplied()', () => {
    const formValuesStub = getAdvancedFilterStub();

    beforeEach(() => {
      component.advanceSearchApplied(formValuesStub);
    });

    it('should dispatch QueryArchivedInvoices action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetAdvanceFilters(formValuesStub)));
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

    it('should dispatch multiple actions to refresh the data', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new ResetPageNumber(),
        new QueryArchivedInvoices(),
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
});
