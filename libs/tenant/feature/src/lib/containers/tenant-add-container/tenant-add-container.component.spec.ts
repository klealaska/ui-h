import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { ToastComponent } from '@ui-coe/shared/ui-v2';
import { SharedUtilDirectivesModule } from '@ui-coe/shared/util/directives';
import { TenantUiModule } from '@ui-coe/tenant/ui';
import { ICreateTenant } from '@ui-coe/tenant/shared/types';
import { postTenantSuccess, TenantEffects, postTenant } from '@ui-coe/tenant/data-access';
import { FakeLoader, id, MatSnackBarStub, tenant } from '@ui-coe/tenant/shared/util';

import { LIST_TENANTS } from '../../routing';
import { TenantListContainerComponent } from '../tenant-list-container/tenant-list-container.component';
import { TenantAddContainerComponent } from './tenant-add-container.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';
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

describe('TenantAddContainerComponent', () => {
  let component: TenantAddContainerComponent;
  let fixture: ComponentFixture<TenantAddContainerComponent>;
  let location: Location;
  let actions$: Observable<any>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantAddContainerComponent],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
        TenantUiModule,
        RouterTestingModule.withRoutes([
          { path: LIST_TENANTS, component: TenantListContainerComponent },
        ]),
        SharedUtilDirectivesModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        provideMockStore(),
        TenantEffects,
        ConfigService,
        provideMockActions(() => actions$),
        {
          provide: MatSnackBar,
          useClass: MatSnackBarStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantAddContainerComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to tenants list', () => {
    jest.spyOn(component['router'], 'navigate');
    fixture.ngZone.run(() => {
      component.backBtnClick();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(location.path()).toBe(`/${LIST_TENANTS}`);
        expect(component['router'].navigate).toHaveBeenCalledWith([`../${LIST_TENANTS}`], {
          relativeTo: component['route'],
        });
      });
    });
  });

  it('should generate side menu', done => {
    component.buildSideMenu();
    component.menuItems$.subscribe(mi => {
      expect(mi.length).toBe(1);
      done();
    });
  });

  it('should handleCustomerDetailsSubmit', () => {
    const spyFacade = jest.spyOn(component['tenantFacade'], 'postTenant');
    const spy = jest.spyOn(store, 'dispatch');
    const form = new FormGroup({
      siteName: new FormControl('test'),
      cmpId: new FormControl('avidxchange123456789'),
    });
    const postTenantPayload: ICreateTenant = {
      siteName: form.get('siteName')?.value,
      storageRegion: 'eastus',
      tenantType: 'Production',
      cmpId: form.get('cmpId')?.value,
      ownerType: 'Buyer',
      sourceSystem: 'AvidPayNetwork',
    };

    component.handleCustomerDetailsSubmit(form);

    expect(spyFacade).toHaveBeenCalledWith(postTenantPayload);
    expect(spy).toHaveBeenCalledWith(postTenant({ request: postTenantPayload }));
  });

  it('should call handleCustomerDetailsSubmit', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const form = new FormGroup({
      siteName: new FormControl('test'),
      cmpId: new FormControl('avidxchange123456789'),
    });

    actions$ = of(postTenantSuccess);

    const postTenantPayload: ICreateTenant = {
      siteName: form.get('siteName').value,
      storageRegion: 'eastus',
      tenantType: 'Production',
      cmpId: form.get('cmpId').value,
      ownerType: 'Buyer',
      sourceSystem: 'AvidPayNetwork',
    };
    component.handleCustomerDetailsSubmit(form);
    expect(spy).toHaveBeenCalledWith(postTenant({ request: postTenantPayload }));
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

  it('should navigate to the manage tenant page', () => {
    const routerSpy = jest.spyOn(component['router'], 'navigate').mockImplementation();
    component['tenantFacade'].currentTenant$ = of(tenant);
    component.ngOnInit();

    expect(routerSpy).toHaveBeenCalledWith([`../${id}`], { relativeTo: component['route'] });
  });
});
