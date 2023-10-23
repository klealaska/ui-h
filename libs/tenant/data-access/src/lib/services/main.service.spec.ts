import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@ui-coe/shared/util/services';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { MainService } from './main.service';

describe('MainService', () => {
  let service: MainService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mockUrl'),
          },
        },
      ],
    });
    service = TestBed.inject(MainService);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAppData()', () => {
    it('should return observable of string', () => {
      const returnData: string = 'Test data';
      const expected = cold('(a|)', { a: returnData });

      jest.spyOn(httpClient, 'get').mockReturnValue(of(returnData));
      service.getAppData();

      expect(httpClient.get).toHaveBeenNthCalledWith(1, 'mockUrl');
      expect(service.getAppData()).toBeObservable(expected);
    });
  });
});
