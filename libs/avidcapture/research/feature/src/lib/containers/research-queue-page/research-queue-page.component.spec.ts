import { ViewportScroller } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
import { PageHelperService } from '@ui-coe/avidcapture/core/util';
import { QueryUnindexedDocument, StorePageFilters } from '@ui-coe/avidcapture/indexing/data-access';
import {
  BatchDeletion,
  BatchDownload,
  CreateQueuesNotAllowedList,
  DisablePageRefresh,
  EnablePageRefresh,
  QueryAllBuyersLookAhead,
  QueryBuyerLookAhead,
  QueryExposedFiltersCounts,
  QueryResearchInvoices,
  RemoveEscalationFilter,
  RemoveExposedFilter,
  RemoveFilter,
  RemoveResearchPageSignalEvents,
  ResearchPageState,
  ResetPageNumber,
  SetAdvanceFilters,
  SetColumnSortedData,
  SetResearchPageSignalEvents,
  SetScrollPosition,
} from '@ui-coe/avidcapture/research/data-access';
import { ResearchFilterComponent, ResearchGridComponent } from '@ui-coe/avidcapture/research/ui';
import {
  CoreStateMock,
  getAdvancedFilterStub,
  getBuyersStub,
  getDocuments,
  getResearchDocuments,
  hasAllTheClaimsTokenStub,
  singleOrgTokenStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  AdvancedFiltersKeys,
  AppPages,
  BatchActions,
  EscalationCategoryTypes,
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
import * as testStubs from '@ui-coe/avidcapture/shared/test';
import { ResearchQueuePageComponent } from './research-queue-page.component';
import { UpdateQueueInvoiceOnUnlock } from '@ui-coe/avidcapture/shared/data-access';

const viewPortStub = {
  getScrollPosition: jest.fn(),
};
const paramStub = {
  data: getResearchDocuments()[0],
} as any;
const pageHelperServiceStub = {
  setTimeoutForPageRefresh: jest.fn(),
} as any;

const matSnackBarStub = {
  dismiss: jest.fn(),
  openFromComponent: jest.fn(() => ({
    afterDismissed: (): any => of(null),
  })),
};

const dialogStub = {
  open: jest.fn(),
};

describe('ResearchQueuePageComponent', () => {
  let component: ResearchQueuePageComponent;
  let fixture: ComponentFixture<ResearchQueuePageComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ResearchQueuePageComponent,
        MockComponent(ResearchFilterComponent),
        MockComponent(ResearchGridComponent),
        MockComponent(DocumentCardSetComponent),
        MockComponent(LoadingSpinnerComponent),
        MockPipe(TranslatePipe),
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        NgxsModule.forRoot([CoreStateMock, ResearchPageState], { developmentMode: true }),
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
    fixture = TestBed.createComponent(ResearchQueuePageComponent);
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
        store.reset({
          core: {
            orgNames: [{ id: '25', name: 'test' }],
            orgsId: ['25'],
            filteredBuyers: [{ id: '25', name: 'test' }],
            userAccount: {
              preferred_username: 'mocktest',
            },
          },
        });
        jest.spyOn(component, 'loadPage');
        fixture.detectChanges();
      });

      it('should call loadPage fn', () =>
        expect(component.loadPage).toHaveBeenNthCalledWith(
          1,
          Object.values(EscalationCategoryTypes).map(x => `-${x}`)
        ));

      it('should dispatch a set of actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new SetCurrentPage(AppPages.Research),
          new CreateQueuesNotAllowedList([
            ...Object.values(EscalationCategoryTypes).map(x => `-${x}`),
            `-${EscalationCategoryTypes.RejectToSender}`,
          ]),
          new ResetPageNumber(),
          new QueryResearchInvoices(),
          new EnablePageRefresh(),
          new QueryDocumentCardSetCounts(),
          new SetResearchPageSignalEvents(),
          new QueryExposedFiltersCounts(),
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
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      component['batchSnackBarRef'] = { dismiss: jest.fn() } as any;
      fixture.destroy();
    });

    it('should dismiss the batchSnackBarRef if it is defined', () =>
      expect(component['batchSnackBarRef'].dismiss).toHaveBeenCalledTimes(1));

    it('should dispatch RemoveResearchPageSignalEvents', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new RemoveResearchPageSignalEvents());
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
        researchPage: {
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

  describe('filteredBuyerAdded()', () => {
    describe('when user is a Sponsor User', () => {
      const buyerStub = getBuyersStub()[0];

      beforeEach(() => {
        jest.spyOn(store, 'dispatch');
        component.filteredBuyerAdded(buyerStub, true);
      });

      it('should dispatch AddFilteredBuyer for Core State & ResetPageNumber & QueryResearchInvoices actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new AddFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryResearchInvoices(),
          new QueryExposedFiltersCounts(),
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

      it('should dispatch RemoveFilteredBuyer for Core State & ResetPageNumber & QueryResearchInvoices actions', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, [
          new RemoveFilteredBuyer(buyerStub),
          new ResetPageNumber(),
          new QueryResearchInvoices(),
          new QueryExposedFiltersCounts(),
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

    it('should dispatch QueryResearchInvoices action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new QueryResearchInvoices()));
  });

  describe('advanceSearchApplied()', () => {
    describe('when escalationCategoryIssue has values in the array', () => {
      const formValuesStub = getAdvancedFilterStub();

      beforeEach(() => {
        component.advanceSearchApplied(formValuesStub);
      });

      it('should dispatch SetAdvanceFilters action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetAdvanceFilters(formValuesStub)));
    });

    describe('when escalationCategoryIssue has values in the array', () => {
      const formValuesStub = getAdvancedFilterStub();

      formValuesStub.escalationCategoryIssue.push(EscalationCategoryTypes.SupplierResearch);

      beforeEach(() => {
        component.advanceSearchApplied(formValuesStub);
      });

      it('should dispatch SetAdvanceFilters action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetAdvanceFilters(formValuesStub)));

      it('should dispatch RemoveExposedFilter action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(
          2,
          new RemoveExposedFilter(EscalationCategoryTypes.SupplierResearch)
        ));
    });

    describe('when escalationCategoryIssue does not has values in the array', () => {
      const formValuesStub = getAdvancedFilterStub();

      formValuesStub.escalationCategoryIssue = [];

      beforeEach(() => {
        component.advanceSearchApplied(formValuesStub);
      });

      it('should dispatch SetAdvanceFilters action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(1, new SetAdvanceFilters(formValuesStub)));

      it('should dispatch RemoveExposedFilter action', () =>
        expect(store.dispatch).toHaveBeenNthCalledWith(2, new RemoveExposedFilter()));
    });
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
        new QueryResearchInvoices(),
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

  describe('escalationFilterRemoved()', () => {
    beforeEach(() => {
      component.escalationFilterRemoved(EscalationCategoryTypes.IndexingOpsQc);
    });

    it('should dispatch RemoveFilter action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new RemoveEscalationFilter(EscalationCategoryTypes.IndexingOpsQc)
      ));
  });

  describe('exposedFilterSelected()', () => {
    beforeEach(() => {
      store.reset({
        researchPage: {
          filters: {
            escalationCategoryIssue: [EscalationCategoryTypes.IndexingOpsQc],
          },
        },
      });
      component.exposedFilterSelected(EscalationCategoryTypes.SupplierResearch);
    });

    it('should dispatch RemoveFilter action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, [
        new RemoveExposedFilter(EscalationCategoryTypes.SupplierResearch),
        new SetAdvanceFilters({
          escalationCategoryIssue: [
            EscalationCategoryTypes.IndexingOpsQc,
            EscalationCategoryTypes.SupplierResearch,
          ],
        }),
      ]));
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
