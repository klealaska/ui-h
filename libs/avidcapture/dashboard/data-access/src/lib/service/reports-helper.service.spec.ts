import { TestBed } from '@angular/core/testing';
import { ToastService } from '@ui-coe/avidcapture/core/util';
import { getArchivedDocumentsStub } from '@ui-coe/avidcapture/shared/test';
import { EscalationCategoryTypes, InvoiceStatus } from '@ui-coe/avidcapture/shared/types';

import { ReportHelperService } from './reports-helper.service';

const toastServiceSpy = {
  error: jest.fn(),
};

describe('ReportsHelperService', () => {
  let service: ReportHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastService,
          useValue: toastServiceSpy,
        },
      ],
    });
    service = TestBed.inject(ReportHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleNoReportsFound()', () => {
    beforeEach(() => {
      service.handleNoReportsFound('mock report name');
    });

    it('should of opened an error toast message', () =>
      expect(toastServiceSpy.error).toHaveBeenCalledTimes(1));
  });
});
