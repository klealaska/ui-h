import { ComponentFixture, TestBed } from '@angular/core/testing';
import { connectorStub } from '../../../../../test/test-stubs';
import { of } from 'rxjs';

import { ConnectorsListComponent } from './connectors-list.component';
import { MatTableModule } from '@angular/material/table';
import { MockComponents } from 'ng-mocks';
import { MatPaginator } from '@angular/material/paginator';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

describe('ConnectorsListComponent', () => {
  let component: ConnectorsListComponent;
  let fixture: ComponentFixture<ConnectorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorsListComponent, MockComponents(MatPaginator, LogoComponent)],
      imports: [MatTableModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorsListComponent);
    component = fixture.componentInstance;
    component.connectors = of([connectorStub]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set table dataSource initial values', () => {
      expect(component.dataSource).toBeDefined();
    });
  });

  describe('ngOnChanges()', () => {
    describe('if searchText value changed', () => {
      beforeEach(() => {
        const changes = {
          searchText: 'test',
        } as any;

        component.searchText = 'test';

        component.ngOnChanges(changes);
      });
      it('should set dataSource filter to searchText value', () =>
        expect(component.dataSource.filter).toBe(
          JSON.stringify({ displayName: component.searchText })
        ));
    });

    describe('if searchText value did not change', () => {
      beforeEach(() => {
        const changes = {} as any;

        component.searchText = 'test';

        component.ngOnChanges(changes);
      });
      it('should not set dataSource filter to searchText value', () =>
        expect(component.dataSource.filter).not.toBe(component.searchText));
    });
  });
});
