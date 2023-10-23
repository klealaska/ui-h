import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ITelemetryItem } from '@microsoft/applicationinsights-web';
import { LoggingService } from './logging.service';

const mockTelemetryItem: ITelemetryItem = {
  name: 'Microsoft.ApplicationInsights.{0}.RemoteDependency',
  time: '2023-03-30T16:42:03.961Z',
  iKey: '6efcdfed-77cf-47f2-928f-8707b6e93e93',
  ext: {
    trace: {
      traceID: '2ea065e5e8be48c695257a8badf4255f',
      name: '/list',
    },
    app: {
      sesId: 'jUscR5LkOsqGzv7gDDqwGi',
    },
    device: {
      localId: 'browser',
      deviceClass: 'Browser',
    },
    user: {
      id: 'oUPJ5aCBiRyM9yMGvK0vrO',
    },
  },
  tags: [],
  data: {},
  baseType: 'RemoteDependencyData',
  baseData: {
    id: '|2ea065e5e8be48c695257a8badf4255f.b29d2e17889149b9.',
    target: 'http://localhost:3333/api/tenant?siteName=sjsjsjsjsj&limit=100',
    name: 'GET http://localhost:3333/api/tenant?siteName=sjsjsjsjsj&limit=100',
    type: 'Ajax',
    startTime: '2023-03-30T16:42:03.801Z',
    duration: 164.2,
    success: true,
    responseCode: 200,
    properties: {
      HttpMethod: 'GET',
    },
  },
  ver: '4.0',
};

describe('LoggingService', () => {
  let service: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggingService],
    });

    service = TestBed.inject(LoggingService);
    service.init('test-spa', 'appinsightskey-12345');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('telemetryInitialzer', () => {
    it('is called with null should return false', () => {
      expect(service.telemetryInitializer(null)).toBeFalsy;
    });

    it('is called with response code is not 0 should return true', () => {
      expect(service.telemetryInitializer(mockTelemetryItem)).toBe(true);
    });

    it('is called with response code 0 should return false', () => {
      mockTelemetryItem.baseData.responseCode = 0;
      expect(service.telemetryInitializer(mockTelemetryItem)).toBe(false);
    });
  });

  describe('init()', () => {
    it('should have instrumentation key', () => {
      expect(service.appInsights.config.instrumentationKey).toBe('appinsightskey-12345');
    });
  });

  describe('logException()', () => {
    const error: Error = new Error('ERROR');
    beforeEach(() => {
      jest.spyOn(service.appInsights, 'trackException').mockImplementation();
      service.logException(error);
    });

    it('should log exception', () => {
      expect(service.appInsights.trackException).toHaveBeenNthCalledWith(1, { exception: error });
    });
  });

  describe('logEvent', () => {
    const properties = { name: 'test' };

    beforeEach(() => {
      jest.spyOn(service.appInsights, 'trackEvent').mockImplementation();
      service.logEvent('randomevent', properties);
    });

    it('should log event', () => {
      expect(service.appInsights.trackEvent).toHaveBeenNthCalledWith(
        1,
        { name: 'randomevent' },
        properties
      );
    });
  });
});
