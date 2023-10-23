import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { getBuyersStub } from '@ui-coe/avidcapture/shared/test';
import { of } from 'rxjs';

import { PageHelperService } from './page-helper.service';
import { ToastService } from './toast.service';

const dialogStub = {
  open: jest.fn(),
};
const environmentStub = {
  apiBaseUri: 'mock/',
};
const toastServiceStub = {
  error: jest.fn(),
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
        {
          provide: ToastService,
          useValue: toastServiceStub,
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

  describe('openUploadErrorToast()', () => {
    beforeEach(() => {
      service.openUploadErrorToast('message');
    });

    it('should open up an error toast', () => {
      expect(toastServiceStub.error).toHaveBeenNthCalledWith(1, 'message');
    });
  });

  describe('openUnlockDocumentModal', () => {
    describe('After modal has been close and value returned is true', () => {
      beforeEach(() => {
        dialogStub.open.mockReturnValue({ afterClosed: () => of(true) });
        service.openUnlockDocumentModal();
      });

      it('should call return the value selected', done => {
        service.openUnlockDocumentModal().subscribe(val => {
          expect(val).toBeTruthy();
          done();
        });
      });
    });
  });
});
