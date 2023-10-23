import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BusHierService } from './bus-hier.service';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('BusHierService', () => {
  let service: BusHierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mockURL'),
          },
        },
      ],
    });
    service = TestBed.inject(BusHierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be call getTree', () => {
    const spy = jest.spyOn(service, 'getTree');
    service.getTree({ payload: { orgId: '122', erpId: '234' } });
    expect(spy).toHaveBeenCalled();
  });
});
