import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MockComponents } from 'ng-mocks';

import { ConnectorCustomersComponent } from './connector-customers.component';

describe('ConnectorCustomersComponent', () => {
  let component: ConnectorCustomersComponent;
  let fixture: ComponentFixture<ConnectorCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorCustomersComponent, MockComponents(MatPaginator)],
      imports: [MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorCustomersComponent);
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
  });
});
