import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { ErrorHandlerService } from './error-handler.service';
import { LoggingService } from './logging.service';

const loggingServiceSpy = {
  logException: jest.fn(),
};

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoggingService,
          useValue: loggingServiceSpy,
        },
      ],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError()', () => {
    it('correctly handles error', () => {
      const error: Error = new Error('ERROR');
      service.handleError(error);
      expect(loggingServiceSpy.logException).toHaveBeenNthCalledWith(1, error);
    });
  });

  it('correctly ignores search', () => {
    const error: Error = new HttpErrorResponse({ status: 404, url: 'idcapi.com/search/aggregate' });
    service.handleError(error);
    expect(loggingServiceSpy.logException).not.toHaveBeenCalled();
  });

  it('correctly handles other urls search', () => {
    const error: Error = new HttpErrorResponse({
      status: 404,
      url: 'idcapi.com/lookup/getproperties',
    });
    service.handleError(error);
    expect(loggingServiceSpy.logException).toHaveBeenNthCalledWith(1, error);
  });
});
