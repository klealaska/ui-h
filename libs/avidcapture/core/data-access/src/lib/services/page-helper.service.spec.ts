import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  getBuyersStub,
  getDocuments,
  getPendingPageFiltersStub,
  getRecycleBinPageFiltersStub,
  getResearchPageFiltersStub,
  getUploadsPageFiltersStub,
} from '@ui-coe/avidcapture/shared/test';
import {
  EscalationCategoryTypes,
  IngestionTypes,
  SortDirection,
} from '@ui-coe/avidcapture/shared/types';
import { of } from 'rxjs';

import { PageHelperService } from './page-helper.service';

const paramStub = {
  data: getDocuments()[0],
} as any;

const dialogStub = {
  open: jest.fn(),
};
const environmentStub = {
  apiBaseUri: 'mock/',
};

describe('PageHelperService', () => {
  let service: PageHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: 'environment',
          useValue: environmentStub,
        },
      ],
    });

    service = TestBed.inject(PageHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setTimeoutForPageRefresh()', () => {
    it('should return an observable of 3000 ms', () => {
      service.setTimeoutForPageRefresh().subscribe(val => expect(val).toBe(3000));
    });
  });

  describe('setPresortedColumnData()', () => {
    describe('when NO presorted information is passed in', () => {
      const sortedColumnStub = { buyerId: [] } as any;
      const columnDataStub = [
        {
          sortIndex: 3,
          colId: 'dateReceived',
          sort: null,
          headerName: 'Upload Date',
          field: 'DateReceived',
          sortable: true,
          type: 'dateColumn',
        },
      ];

      it('should return columnDataStub back', () =>
        expect(service.setPresortedColumnData(sortedColumnStub, columnDataStub)).toEqual(
          columnDataStub
        ));
    });

    describe('when presorted information is passed in', () => {
      const sortedColumnStub = { dateReceived: SortDirection.Ascending } as any;
      const columnDataStub = [
        {
          sortIndex: 0,
          colId: 'dateReceived',
          sort: null,
          headerName: 'Upload Date',
          field: 'DateReceived',
          sortable: true,
          type: 'dateColumn',
        },
      ];
      const expectedValue = [
        {
          sortIndex: 0,
          colId: 'dateReceived',
          sort: SortDirection.Ascending,
          headerName: 'Upload Date',
          field: 'DateReceived',
          sortable: true,
          type: 'dateColumn',
        },
      ];

      it('should return columnDataStub back', () =>
        expect(service.setPresortedColumnData(sortedColumnStub, columnDataStub)).toEqual(
          expectedValue
        ));
    });
  });

  describe('getDateRange()', () => {
    it('should return an array of date strings', () => {
      expect(service.getDateRange(30)).toEqual([expect.anything(), expect.anything()]);
    });

    it('should set startDate to beginning of the day', () => {
      expect(service.getDateRange(30)[0]).toContain('T00:00:00');
    });

    it('should set endDate to the end of the day', () => {
      expect(service.getDateRange(30)[1]).toContain('T23:59:59');
    });
  });

  describe('getPdfFileRequest', () => {
    it('should return back a PdfJsRequest', () => {
      expect(service.getPdfFileRequest('mockDocId', 'mockToken')).toEqual(
        expect.objectContaining({
          url: `${environmentStub.apiBaseUri}api/file/mockDocId`,
          httpHeaders: { Authorization: 'Bearer mockToken' },
          withCredentials: true,
        })
      );
    });
  });

  describe('openFilteredBuyersModal()', () => {
    beforeEach(() => {
      dialogStub.open.mockReturnValue({
        afterClosed: () => of(getBuyersStub()),
      });
    });

    it('should return an observable of selectedBuyers', done => {
      service.openFilteredBuyersModal(getBuyersStub()).subscribe(val => {
        expect(val).toEqual(getBuyersStub());
        done();
      });
    });
  });

  describe('getAllMonthsBetweenDates()', () => {
    describe('when only a single months days are passed in', () => {
      it('should return only a month back', () => {
        expect(service.getAllMonthsBetweenDates(['January 1, 2022', 'January 31, 2022'])).toEqual([
          '2022/01',
        ]);
      });
    });

    describe('when date range spans across multiple months', () => {
      it('should all those months back', () => {
        expect(service.getAllMonthsBetweenDates(['January 1, 2022', 'April 30, 2022'])).toEqual([
          '2022/01',
          '2022/02',
          '2022/03',
          '2022/04',
        ]);
      });
    });
  });

  describe('getPendingPageFilters()', () => {
    describe('when pending page filters are defined', () => {
      const stateStub = {
        pendingPage: {
          filters: {
            buyerId: [{ id: '25', name: 'avid' }],
          },
          aggregateFilters: {
            escalationCategoryIssue: [EscalationCategoryTypes.None],
          },
        },
      };
      it('should return the filters set in state', () => {
        expect(service.getPendingPageFilters(stateStub, ['25'])).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        });
      });
    });

    describe('when pending page filters are defined but there are no filterd buyerIds', () => {
      const stateStub = {
        pendingPage: {
          filters: {
            buyerId: [],
          },
          aggregateFilters: {
            escalationCategoryIssue: [EscalationCategoryTypes.None],
          },
        },
      };
      it('should return the filters set in state', () => {
        expect(service.getPendingPageFilters(stateStub, ['25'])).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Email, IngestionTypes.Scan],
          isSubmitted: [0],
        });
      });
    });

    describe('when pending page filters are undefined', () => {
      it('should return the filters set in state', () => {
        expect(service.getPendingPageFilters({}, ['25'])).toEqual(getPendingPageFiltersStub());
      });
    });
  });

  describe('getResearchPageFilters()', () => {
    describe('when research page filters are defined', () => {
      const stateStub = {
        researchPage: {
          filters: {
            buyerId: [{ id: '25', name: 'avid' }],
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.None}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.RecycleBin}`,
            ],
          },
          aggregateFilters: {},
        },
      };

      it('should return the filters set in state', () => {
        expect(service.getResearchPageFilters(stateStub, ['25'], [])).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.RecycleBin}`,
          ],
        });
      });
    });

    describe('when research page filters are defined but there are no filterd buyerIds', () => {
      const stateStub = {
        researchPage: {
          filters: {
            buyerId: [],
          },
          aggregateFilters: {
            escalationCategoryIssue: [
              `-${EscalationCategoryTypes.None}`,
              `-${EscalationCategoryTypes.Void}`,
              `-${EscalationCategoryTypes.RecycleBin}`,
            ],
          },
        },
      };

      it('should return the filters set in state', () => {
        expect(service.getResearchPageFilters(stateStub, ['25'], [])).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [
            `-${EscalationCategoryTypes.None}`,
            `-${EscalationCategoryTypes.Void}`,
            `-${EscalationCategoryTypes.RecycleBin}`,
          ],
        });
      });
    });

    describe('when research page filters are undefined', () => {
      it('should return the filters set in state', () => {
        expect(service.getResearchPageFilters({}, ['25'], [])).toEqual(
          getResearchPageFiltersStub()
        );
      });
    });
  });

  describe('getRecycleBinPageFilters()', () => {
    describe('when recycleBin page filters are defined', () => {
      const stateStub = {
        recycleBinPage: {
          filters: {
            buyerId: [{ id: '25', name: 'avid' }],
            escalationCategoryIssue: [`${EscalationCategoryTypes.RecycleBin}`],
          },
          aggregateFilters: {},
        },
      };

      it('should return the filters set in state', () => {
        expect(
          service.getRecycleBinPageFilters(stateStub, ['25'], ['1/1/2021', '2/1/2021'])
        ).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [`${EscalationCategoryTypes.RecycleBin}`],
          dateRecycled: ['1/1/2021', '2/1/2021'],
        });
      });
    });

    describe('when recycleBin page filters are defined but there are no filterd buyerIds', () => {
      const stateStub = {
        recycleBinPage: {
          filters: {
            buyerId: [],
          },
          aggregateFilters: {
            escalationCategoryIssue: [`${EscalationCategoryTypes.RecycleBin}`],
          },
        },
      };

      it('should return the filters set in state', () => {
        expect(
          service.getRecycleBinPageFilters(stateStub, ['25'], ['1/1/2021', '2/1/2021'])
        ).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [`${EscalationCategoryTypes.RecycleBin}`],
          dateRecycled: ['1/1/2021', '2/1/2021'],
        });
      });
    });

    describe('when recycleBin page filters are undefined', () => {
      it('should return the filters set in state', () => {
        expect(service.getRecycleBinPageFilters({}, ['25'], [])).toEqual(
          getRecycleBinPageFiltersStub()
        );
      });
    });
  });

  describe('getUploadsPageFilters()', () => {
    describe('when my uploads page filters are defined', () => {
      const stateStub = {
        uploadsQueuePage: {
          filters: {
            buyerId: [{ id: '25', name: 'avid' }],
            escalationCategoryIssue: [EscalationCategoryTypes.None],
            ingestionType: [IngestionTypes.Api],
          },
        },
      };

      it('should return the filters set in state', () => {
        expect(service.getUploadsPageFilters(stateStub, ['25'], 'mockemail')).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
        });
      });
    });

    describe('when my uploads page filters are defined but there are no filterd buyerIds', () => {
      const stateStub = {
        uploadsQueuePage: {
          filters: {
            buyerId: [],
            escalationCategoryIssue: [EscalationCategoryTypes.None],
            ingestionType: [IngestionTypes.Api],
          },
        },
      };

      it('should return the filters set in state', () => {
        expect(service.getUploadsPageFilters(stateStub, ['25'], 'mockemail')).toEqual({
          buyerId: ['25'],
          escalationCategoryIssue: [EscalationCategoryTypes.None],
          ingestionType: [IngestionTypes.Api],
        });
      });
    });

    describe('when my uploads page filters are undefined', () => {
      it('should return the filters set in state', () => {
        expect(service.getUploadsPageFilters({}, ['25'], 'mockemail')).toEqual(
          getUploadsPageFiltersStub()
        );
      });
    });
  });
});
