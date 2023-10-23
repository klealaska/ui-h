import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { createMockStore, MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';

import { selectProductEntitlements, selectTenantEntitlements } from '@ui-coe/tenant/data-access';
import { MatSnackBarStub } from '@ui-coe/tenant/shared/util';
import { ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';
import { ToastComponent } from '@ui-coe/shared/ui-v2';

import { LIST_TENANTS } from '../../routing';
import { TenantListContainerComponent } from '../tenant-list-container/tenant-list-container.component';
import { TenantManageContainerComponent } from './tenant-manage-container.component';
import { ConfigService } from '@ui-coe/shared/util/services';

const toastConfig = {
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: 'top',
  data: {
    title: 'New Site ID Created',
    type: ToastTypeEnum.SUCCESS,
    icon: ToastIcon.CHECK_CIRCLE,
    close: true,
  },
};

describe('TenantManageContainerComponent', () => {
  let component: TenantManageContainerComponent;
  let fixture: ComponentFixture<TenantManageContainerComponent>;
  let location: Location;
  let store: MockStore;
  const initialState = {
    productEntitlements: [],
    tenantEntitlements: [],
    loading: false,
    error: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: LIST_TENANTS, component: TenantListContainerComponent },
        ]),
      ],
      declarations: [TenantManageContainerComponent],
      providers: [
        ConfigService,
        provideMockStore(),
        {
          provide: MatSnackBar,
          useClass: MatSnackBarStub,
        },
      ],
    }).compileComponents();

    store = createMockStore({
      initialState,
      selectors: [
        {
          selector: selectProductEntitlements,
          value: [
            {
              id: 'string',
              name: 'string',
              status: 'Active',
            },
            {
              id: 'string2',
              name: 'string',
              status: 'Active',
            },
          ],
        },
        {
          selector: selectTenantEntitlements,
          value: [
            {
              tenantId: 'string',
              productEntitlementId: 'string',
              productEntitlementName: 'string',
              tenantEntitlementStatus: 'Active',
            },
            {
              tenantId: 'string3',
              productEntitlementId: 'string',
              productEntitlementName: 'string',
              tenantEntitlementStatus: 'Active',
            },
          ],
        },
      ],
    });
    fixture = TestBed.createComponent(TenantManageContainerComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to tenants list', () => {
    jest.spyOn(component['router'], 'navigate');
    fixture.ngZone.run(() => {
      component.onBackBtnClick();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toBe(`/${LIST_TENANTS}`);
        expect(component['router'].navigate).toHaveBeenCalledWith([`../${LIST_TENANTS}`], {
          relativeTo: component['route'],
        });
      });
    });
  });

  it('should set the value of enableSubmitButton correctly', () => {
    component.onSiteNameUpdated('foo', 'foo');
    expect(component.enableSubmitButton).toBe(false);

    component.onSiteNameUpdated('foo', 'bar');
    expect(component.enableSubmitButton).toBe(true);
  });

  it('should call facade when submit button is clicked', () => {
    const facadeSpy = jest.spyOn(component['tenantFacade'], 'updateTenant');

    component.onSubmitButtonClick('foo', { value: { siteName: 'bar' } } as any);
    expect(facadeSpy).toHaveBeenCalledWith('foo', { siteName: 'bar' });
  });

  it('should handle displaying toast', () => {
    const snackbarSpy = jest.spyOn(component['snackBar'], 'openFromComponent');

    component['tenantFacade'].toast$ = of(toastConfig) as any;
    component.ngOnInit();

    expect(snackbarSpy).toHaveBeenCalledWith(ToastComponent, toastConfig);
  });

  it('should handle dismissing the toast', () => {
    const snackbarSpy = jest.spyOn(
      component['snackBar'].openFromComponent(null, null),
      'afterDismissed'
    );
    const facadeSpy = jest.spyOn(component['tenantFacade'], 'dismissToast');

    component['tenantFacade'].toast$ = of(toastConfig) as any;
    component.ngOnInit();

    expect(snackbarSpy).toHaveBeenCalled();
    expect(facadeSpy).toHaveBeenCalled();
  });

  it('should map add the isDisabled flag to the product entitlements if assigned', () => {
    const expected = cold('a', {
      a: [
        {
          id: 'string',
          name: 'string',
          status: 'Active',
          isDisabled: true,
        },
        {
          id: 'string2',
          name: 'string',
          status: 'Active',
          isDisabled: false,
        },
      ],
    });

    expect(component.combinedEntitlements$).toBeObservable(expected);
  });

  it('should return the product entitlements if tenantEntitlements is falsy', () => {
    store = createMockStore({
      initialState,
      selectors: [
        {
          selector: selectProductEntitlements,
          value: [
            {
              id: 'string',
              name: 'string',
              status: 'Active',
            },
            {
              id: 'string2',
              name: 'string',
              status: 'Active',
            },
          ],
        },
        {
          selector: selectTenantEntitlements,
          value: null,
        },
      ],
    });

    const expected = cold('a', {
      a: [
        {
          id: 'string',
          name: 'string',
          status: 'Active',
          isDisabled: false,
        },
        {
          id: 'string2',
          name: 'string',
          status: 'Active',
          isDisabled: false,
        },
      ],
    });

    expect(component.combinedEntitlements$).toBeObservable(expected);
  });

  it('should call  assignProductEntitlementToTenant', () => {
    component.tenantId = 'foo';
    jest
      .spyOn(component['entitlementFacade'], 'assignProductEntitlementToTenant')
      .mockImplementation();

    component.onProductEntitlementChecked('bar');
    expect(component['entitlementFacade'].assignProductEntitlementToTenant).toHaveBeenCalledWith(
      'bar',
      'foo',
      {
        amount: 0,
        assignmentDate: new Date().toISOString().split('T')[0],
        assignmentSource: 'somewhere',
        sourceSystem: 'somewhere else',
      }
    );
  });
});
