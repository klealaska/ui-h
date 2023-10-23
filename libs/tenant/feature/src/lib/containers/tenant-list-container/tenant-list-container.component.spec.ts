import { Location } from '@angular/common';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sort } from '@angular/material/sort';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { TenantUiModule } from '@ui-coe/tenant/ui';
import { FakeLoader, translations } from '@ui-coe/tenant/shared/util';
import { TenantEffects } from '@ui-coe/tenant/data-access';
import { AxTranslateMockPipe } from '@ui-coe/shared/util/testing';
import { TableComponent } from '@ui-coe/shared/ui-v2';
import { IGetTenantParams } from '@ui-coe/tenant/shared/types';

import { TenantListContainerComponent } from './tenant-list-container.component';
import { TenantAddContainerComponent } from '../tenant-add-container/tenant-add-container.component';
import { ADD_TENANT } from '../../routing';
import { TenantManageContainerComponent } from '../tenant-manage-container/tenant-manage-container.component';

describe('TenantListContainerComponent', () => {
  let component: TenantListContainerComponent;
  let fixture: ComponentFixture<TenantListContainerComponent>;
  let location: Location;
  let actions$: Observable<any>;
  let tenantListComponent: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantListContainerComponent],
      imports: [
        TableComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
        NoopAnimationsModule,
        TenantUiModule,
        RouterTestingModule.withRoutes([
          { path: ADD_TENANT, component: TenantAddContainerComponent },
          { path: ':id', component: TenantManageContainerComponent },
        ]),
        AxTranslateMockPipe,
      ],
      providers: [
        provideMockStore(),
        {
          provide: 'TRANSLATIONS',
          useValue: translations,
        },
        TenantEffects,
        provideMockActions(() => actions$),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantListContainerComponent);
    component = fixture.componentInstance;
    tenantListComponent = fixture.debugElement.query(By.css('ui-coe-tenant-list'));
    location = TestBed.get(Location);

    tenantListComponent.componentInstance['element'] = {
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

  it('should call getTenants when filter/sort params are updated', done => {
    const filterParams = { siteName: 'foo' };
    const getTenantsSpy = jest.spyOn(component['tenantFacade'], 'getTenants').mockImplementation();

    component.filterSort$ = of(filterParams);
    component.ngOnInit();

    component.filterSort$.subscribe(params => {
      expect(getTenantsSpy).toHaveBeenCalledWith(params);
      done();
    });
  });

  it('should navigate to add tenant', async () => {
    jest.spyOn(component['router'], 'navigate');
    await fixture.ngZone.run(() => component.addSiteClick());
    expect(location.path()).toBe(`/${ADD_TENANT}`);
    expect(component['router'].navigate).toHaveBeenCalledWith([`../${ADD_TENANT}`], {
      relativeTo: component['route'],
    });
  });

  it('should naviate to /tenant/:id', async () => {
    jest.spyOn(component['router'], 'navigate');
    await fixture.ngZone.run(() => component.onTenantId('id'));
    expect(location.path()).toBe(`/id`);
    expect(component['router'].navigate).toHaveBeenCalledWith(['../id'], {
      relativeTo: component['route'],
    });
  });

  it('should call facade filterSortTenantList', () => {
    const spyFacade = jest.spyOn(component['tenantFacade'], 'filterSortTenantList');
    const params: IGetTenantParams = { siteName: 'BAR' };
    component.onFilterValue(params);
    expect(spyFacade).toBeCalledWith(params);
  });

  describe('onSortChange', () => {
    it('should call getTenants with a sort', () => {
      const spyFacade = jest.spyOn(component['tenantFacade'], 'filterSortTenantList');
      const sort: Sort = { direction: 'asc', active: 'tenant_status' };
      component.onSortChange(sort);
      expect(spyFacade).toHaveBeenCalledWith({ sortBy: `${sort.direction}:${sort.active}` });
    });

    it('should call getTenants without a sort', () => {
      const spyFacade = jest.spyOn(component['tenantFacade'], 'filterSortTenantList');
      const sort: Sort = { direction: '', active: '' };
      component.onSortChange(sort);
      expect(spyFacade).toHaveBeenCalledWith({ sortBy: null });
    });
  });
});
