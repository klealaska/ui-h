import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  const config: any = {
    key1: 'value1',
    key2: 'value2',
  };

  const httpClientSpy = {
    get: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConfigService,
        {
          provide: HttpClient,
          useValue: httpClientSpy,
        },
      ],
    });
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadAppConfig()', () => {
    beforeEach(() => {
      httpClientSpy.get.mockReturnValue(of(config));
      service.loadAppConfig();
    });
    it('should load the appConfig', () => {
      expect(service['appConfig']).toEqual(config);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      httpClientSpy.get.mockReturnValue(of(config));
      service.loadAppConfig();
    });
    it('should return the first config value', () => {
      expect(service.get('key1')).toEqual('value1');
    });
  });
});
