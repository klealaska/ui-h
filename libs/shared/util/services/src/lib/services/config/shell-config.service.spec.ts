import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { ShellConfigService } from './shell-config.service';

describe('ShellConfigService', () => {
  let service: ShellConfigService;

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
        {
          provide: HttpClient,
          useValue: httpClientSpy,
        },
      ],
    });
    service = TestBed.inject(ShellConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadShellConfig()', () => {
    beforeEach(() => {
      httpClientSpy.get.mockReturnValue(of(config));
      service.loadShellConfig();
    });
    it('should load the appConfig', () => {
      expect(service['shellConfig']).toEqual(config);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      httpClientSpy.get.mockReturnValue(of(config));
      service.loadShellConfig();
    });
    it('should return the first config value', () => {
      expect(service.get('key1')).toEqual('value1');
    });
  });
});
