import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TableComponent } from '@ui-coe/shared/ui-v2';
import { ITenantMapped, TenantsStatusType } from '@ui-coe/tenant/shared/types';
import { TenantListComponent } from './tenant-list.component';

describe('TenantListComponent', () => {
  const row: ITenantMapped = {
    tenantId: 'foo001',
    siteName: 'bar',
    tenantStatus: 'active',
    createdDate: '2000-10-10',
  };
  let component: TenantListComponent;
  let fixture: ComponentFixture<TenantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableModule, TableComponent],
      declarations: [TenantListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantListComponent);
    component = fixture.componentInstance;
    component['element'] = {
      nativeElement: {
        offsetParent: {
          offsetTop: 208,
        },
        offsetTop: 51,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the value of displayedColumns with truthy value', () => {
    component.ngOnChanges({
      displayedColumns: {
        currentValue: {
          siteName: 'Name',
          dateCreated: 'Date Created',
          status: 'Status',
        },
      },
    });

    expect(component.displayedColumns).toEqual(['Name', 'Date Created', 'Status']);
  });

  it('should not set the value of displayedColumns when changes is falsy', () => {
    component.ngOnChanges({});

    expect(component.displayedColumns).toBe(undefined);

    component.ngOnChanges({
      displayedColumns: undefined,
    });

    expect(component.displayedColumns).toBe(undefined);
  });

  describe('onRowClick', () => {
    it('should emit a tenantId', () => {
      jest.spyOn(component.tenantId, 'emit');
      component.onRowClick(row);

      expect(component.tenantId.emit).toHaveBeenCalledWith(row.tenantId);
    });
  });

  describe('onSortChange', () => {
    it('should emit a sortEvent', () => {
      const spy = jest.spyOn(component.sortChange, 'emit').mockImplementation();
      const sort: Sort = { direction: 'asc', active: 'tenant_status' };
      component.onSortChange(sort);
      expect(spy).toHaveBeenCalledWith(sort);
    });
  });

  describe('getStatusType', () => {
    it('should return status success type when status type is Active', () => {
      const result: string = component.getStatusType(TenantsStatusType.ACTIVE);

      expect(result).toBe('success');
    });

    it('should return status  default type when status type is Inactive ', () => {
      const result: string = component.getStatusType(TenantsStatusType.INACTIVE);

      expect(result).toBe('default');
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.tenants = undefined;
    });

    it('should detect changes', () => {
      const newTenants = [
        {
          tenantId: '123',
          tenantStatus: 'fooId',
          siteName: 'fooSiteName',
          createdDate: 'fooDate',
        },
      ];
      const changes = {
        tenants: {
          currentValue: [
            {
              tenantId: '123',
              tenantStatus: 'fooId',
              siteName: 'fooSiteName',
              createdDate: 'fooDate',
            },
          ],
        },
      };
      component.ngOnChanges(changes);
      expect(component.tenants).toStrictEqual(newTenants);
      expect(component.dataSource).toBeTruthy();
      expect(component.dataSource.data).toStrictEqual(newTenants);
    });
  });
});
