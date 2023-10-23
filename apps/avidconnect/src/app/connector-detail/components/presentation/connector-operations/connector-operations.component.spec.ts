import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MockComponents } from 'ng-mocks';

import { ConnectorOperationsComponent } from './connector-operations.component';

describe('ConnectorOperationsComponent', () => {
  let component: ConnectorOperationsComponent;
  let fixture: ComponentFixture<ConnectorOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorOperationsComponent, MockComponents(MatPaginator)],
      imports: [MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges()', () => {
    beforeEach(() => {
      component.ngOnChanges();
    });

    it('should initialize dataSource value', () => {
      expect(component.dataSource).toBeDefined();
    });

    it('should initialize paginator ', () => {
      expect(component['paginator']).toBeDefined();
    });
    6;
  });

  describe('getOperationDuration', () => {
    let time = '';

    describe('No end time given', () => {
      beforeEach(() => {
        time = component.getOperationDuration('01-01-2019 12:45:23', '');
      });

      it('should return empty string', () => expect(time).toBe(''));
    });

    describe('no zero format needed', () => {
      beforeEach(() => {
        time = component.getOperationDuration('01-01-2019 12:45:23', '02-02-2019 11:43:12');
      });

      it('should get duration from two given dates', () => expect(time).toBe('766:57:49'));
    });

    describe('when zero format is needed', () => {
      beforeEach(() => {
        time = component.getOperationDuration('01-01-2019 10:00:01', '01-01-2019 10:00:04');
      });

      it('should get duration from two given dates adding zero to parsed time', () =>
        expect(time).toBe('0:00:03'));
    });
  });
});
