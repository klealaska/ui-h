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
        ErrorHandlerService,
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
    it('should log exception', () => {
      const error: Error = new Error('Error');
      service.handleError(error);

      expect(loggingServiceSpy.logException).toHaveBeenNthCalledWith(1, error);
    });
  });
});
