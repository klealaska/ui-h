import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { operationTypeStub, scheduleStub } from '../../../../../test/test-stubs';
import { MockComponents } from 'ng-mocks';

import { ScheduleListComponent } from './schedule-list.component';

describe('ScheduleListComponent', () => {
  let component: ScheduleListComponent;
  let fixture: ComponentFixture<ScheduleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleListComponent, MockComponents(MatPaginator)],
      imports: [MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    beforeEach(() => {
      component.schedules = [scheduleStub];
      component.ngOnChanges();
    });

    it('should set dataSource value', () => {
      expect(component.dataSource).toBeDefined();
    });
  });

  describe('getScheduleStatus()', () => {
    describe('when status isActive', () => {
      let status;
      beforeEach(() => {
        status = component.getScheduleStatus(true);
      });

      it('should set status to Active', () => {
        expect(status).toBe('Active');
      });
    });

    describe('when status is not active', () => {
      let status;
      beforeEach(() => {
        status = component.getScheduleStatus(false);
      });

      it('should set status to Inactive', () => {
        expect(status).toBe('Inactive');
      });
    });
  });

  describe('getCronFormat()', () => {
    let crontext;
    beforeEach(() => {
      crontext = component.getCronFormat('0 0 11 29 * ?');
    });

    it('should set text format from crontext input', () => {
      expect(crontext).toBe('At 11:00 AM, on day 29 of the month');
    });
  });

  describe('getOperationTypes()', () => {
    let operationTypes;
    beforeEach(() => {
      operationTypes = component.getOperationTypes([operationTypeStub, operationTypeStub]);
    });

    it('should format operation types', () => {
      expect(operationTypes).toBe('Operation Test | Operation Test');
    });
  });
});
