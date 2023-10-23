import { TestBed } from '@angular/core/testing';
import { AppConfigurationClient } from '@azure/app-configuration';

import { FeatureFlagService } from './feature-flag.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const mockFeatureFlagValue = {
  value: JSON.stringify({
    id: 'Indexing.Xdc.InvoiceUploadIsActive',
    description: '',
    enabled: false,
    conditions: { client_filters: [] },
  }),
};

const mockAllFeatureFlagsValue = {
  contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
  value: JSON.stringify({
    id: 'Indexing.Xdc.InvoiceUploadIsActive',
    description: '',
    enabled: false,
    conditions: { client_filters: [] },
  }),
};

const appConfigClientStub = {
  getConfigurationSetting: jest.fn(() => mockFeatureFlagValue),
  listConfigurationSettings: jest.fn(() => [mockAllFeatureFlagsValue]),
};

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  const httpClientSpy = {
    get: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AppConfigurationClient,
          useValue: appConfigClientStub,
        },
        {
          provide: HttpClient,
          useValue: httpClientSpy,
        },
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(FeatureFlagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getFeatureFlag()', () => {
    it('should return json object of feature flag', () => {
      const mockConnectionString = 'Endpoint=mockEndpoint;Id=mockId;Secret=mockSecret=';
      service.getFeatureFlag(mockConnectionString, 'mockFeatureFlagSetting').subscribe(res => {
        expect(res).toEqual(mockFeatureFlagValue);
      });
    });
  });

  describe('getAllFeatureFlags()', () => {
    it('should return an array of feature flag configurations', () => {
      const mockConnectionString = 'Endpoint=mockEndpoint;Id=mockId;Secret=mockSecret=';
      service.getAllFeatureFlags(mockConnectionString).subscribe(res => {
        expect(res).toEqual([mockAllFeatureFlagsValue]);
      });
    });
  });
});
