import { ComponentFixture, TestBed } from '@angular/core/testing';
import { customerStub } from '../../../../../test/test-stubs';
import { of } from 'rxjs';

import { CustomersListComponent } from './customers-list.component';
import { MockComponents } from 'ng-mocks';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

describe('CustomersListComponent', () => {
  let component: CustomersListComponent;
  let fixture: ComponentFixture<CustomersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomersListComponent, MockComponents(MatPaginator, MatSelect)],
      imports: [MatTableModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersListComponent);
    component = fixture.componentInstance;
    component.customers = of([customerStub]);
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
    describe('if searchText value or showInactive changed', () => {
      beforeEach(() => {
        const changes = {
          searchText: 'test',
          showInactive: true,
        } as any;

        component.searchText = 'test';
        component.ngOnChanges(changes);
      });
      it('should set dataSource filter to searchText value', () =>
        expect(component.dataSource.filter).toBe('{"name":"test","isActive":true,"platforms":[]}'));
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

  describe('platformFilterChanged()', () => {
    beforeEach(() => {
      component.customersFilterChanged();
    });

    describe('when there is no platforms selected', () => {
      beforeEach(() => {
        component.searchText = 'test';
        component.platformsSelected = [];
        component.customersFilterChanged();
        component.dataSource.filterPredicate(
          { name: 'test' } as any,
          '{"name":"test","isActive":true,"platforms":[]}'
        );
      });

      it('should set dataSource filter to json object with empty platforms', () =>
        expect(component.dataSource.filter).toBe('{"name":"test","isActive":true,"platforms":[]}'));
    });

    describe('when there is platforms filter selected', () => {
      beforeEach(() => {
        component.searchText = 'test';
        component.platformsSelected = ['avid', 'lock'];
        component.customersFilterChanged();
        component.dataSource.filterPredicate(
          { name: 'test', isActive: true } as any,
          '{"name":"test","isActive":true,"platforms":["avid","lock"]}'
        );
      });

      it('should set dataSource filter to json object with platforms information', () =>
        expect(component.dataSource.filter).toBe(
          '{"name":"test","isActive":true,"platforms":["avid","lock"]}'
        ));
    });
  });
});
