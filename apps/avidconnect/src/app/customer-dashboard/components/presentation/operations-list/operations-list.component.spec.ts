import { ComponentFixture, TestBed } from '@angular/core/testing';
import { operationStub } from '../../../../../test/test-stubs';

import { OperationsListComponent } from './operations-list.component';
import { MockComponents } from 'ng-mocks';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

describe('OperationsListComponent', () => {
  let component: OperationsListComponent;
  let fixture: ComponentFixture<OperationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationsListComponent, MockComponents(MatPaginator)],
      imports: [MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsListComponent);
    component = fixture.componentInstance;
    component.operations = [operationStub];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.dataSource = null;
      component.ngOnChanges();
    });

    it('should set dataSource value', () => expect(component.dataSource).toBeDefined());
  });

  describe('getOperationDuration()', () => {
    let duration;

    describe('when no end date is defined', () => {
      beforeEach(() => {
        duration = component.getOperationDuration('2021-09-07T17:10:14.9', '');
      });

      it('should return an empty value', () => expect(duration).toBe(''));
    });

    describe('when end date is defined', () => {
      beforeEach(() => {
        duration = component.getOperationDuration(
          '2021-09-07T17:10:14.9',
          '2021-09-07T17:10:20.897'
        );
      });

      it('should set duration between start and end dates', () => expect(duration).toBe('0:00:05'));
    });

    describe('when duration result digits have 2 digits', () => {
      beforeEach(() => {
        duration = component.getOperationDuration(
          '2021-09-07T17:10:14.9',
          '2021-09-10T17:22:25.897'
        );
      });

      it('should set duration format correctly', () => expect(duration).toBe('72:12:10'));
    });
  });
});
