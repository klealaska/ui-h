import { TestBed } from '@angular/core/testing';

import { DashboardHelperService } from './dashboard-helper.service';

describe('DashboardHelperService', () => {
  let service: DashboardHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWeekendTime()', () => {
    describe('when interval passed in is Hours', () => {
      it('should return number of weekend hours between two dates', () => {
        expect(service.getWeekendTime('January 1, 2022', 'January 31, 2022')).toEqual(864000);
      });

      it('should break execution after 100 attempts', () => {
        expect(service.getWeekendTime('January 1, 2021', 'January 31, 2022')).toEqual(2505600);
      });
    });
  });
});
