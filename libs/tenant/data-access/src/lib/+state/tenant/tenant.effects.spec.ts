import { TestBed } from '@angular/core/testing';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';

import { ConfigService } from '@ui-coe/shared/util/services';
import { IGetTenant, ITenant, ITenantMapped } from '@ui-coe/tenant/shared/types';

import { TenantEffects } from './tenant.effects';
import * as TenantActions from './tenant.actions';
import { TenantService } from '../../services';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';

const id = '7hp0nqlpvwg0dyyehi1m';
const tenant: ITenant = {
  tenantId: id,
  siteName: 'Burger Bling',
  storageRegion: 'eastus',
  tenantType: 'Buyer',
  tenantStatus: 'Active',
  cmpId: 'c5szq6tsto075wstvi9m',
  customerName: 'Burger King Franchise',
  partnerName: 'Mastercard',
  sourceSystem: 'Swagger-UI',
  createdDate: '2022-09-16T16:00:33Z',
  lastModifiedDate: '2022-09-16T16:00:33Z',
  createdByUserId: 'jg4nh6in638l29wxur4e',
  lastModifiedByUserId: 'fhh9rgm0qhn8pgaq0u28',
};

describe('TenantEffects', () => {
  let actions$: Observable<any>;
  let effects: TenantEffects;
  let tenantService: TenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TenantEffects,
        provideMockActions(() => actions$),
        {
          provide: TenantService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ContentFacade,
          useValue: {
            get: jest.fn(),
            getContentById: jest.fn(),
          },
        },
        {
          provide: TranslateService,
          useValue: {
            get: jest.fn(() =>
              of({
                'customerDetails.toaster': {
                  create: {
                    title: {
                      success: 'New Site ID Created',
                      error: 'Site ID Creation Failed',
                    },
                    body: {},
                  },
                  update: {
                    title: {
                      success: 'Customer Details Updated',
                      error: 'Customer Details Update Failed',
                    },
                    body: {},
                  },
                },
              })
            ),
          },
        },
      ],
    });

    effects = TestBed.inject(TenantEffects);
    tenantService = TestBed.inject(TenantService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('load tenants', () => {
    it('should load tenants when loadTenants action is dispached', () => {
      const getTenantResponse: IGetTenant<ITenantMapped> = {
        itemsRequested: 10,
        itemsReturned: 10,
        itemsTotal: 20,
        offset: 0,
        items: [],
      };
      actions$ = hot('-a', { a: TenantActions.loadTenants({}) });
      const response = cold('-a|', { a: getTenantResponse });
      const expected = cold('--b', {
        b: TenantActions.loadTenantsSuccess({ response: getTenantResponse }),
      });

      tenantService.getTenantData = jest.fn(() => response);
      expect(effects.loadTenants$).toBeObservable(expected);
    });

    it('should dispatch loadTenantsFailure upon error', () => {
      actions$ = hot('-a', { a: TenantActions.loadTenants({}) });
      const response = cold('-#|', {}, 'error');
      const expected = cold('--b', { b: TenantActions.loadTenantsFailure({ error: 'error' }) });

      tenantService.getTenantData = jest.fn(() => response);

      expect(effects.loadTenants$).toBeObservable(expected);
    });
  });

  describe('getTenantById', () => {
    it('should dispatch getTenantByIdSuccess action with tenant object', () => {
      actions$ = hot('-a', { a: TenantActions.getTenantById({ id }) });
      const response = cold('-a|', { a: tenant });
      const expected = cold('--b', {
        b: TenantActions.getTenantByIdSuccess({ response: tenant }),
      });
      tenantService.getTenantById = jest.fn(() => response);

      expect(effects.getTenantById$).toBeObservable(expected);
    });

    it('should dispatch getTenantByIdFailure action on error', () => {
      actions$ = hot('-a', { a: TenantActions.getTenantById({ id }) });
      const response = cold('-#', {}, 'error');
      const expected = cold('--b', { b: TenantActions.getTenantByIdFailure({ error: 'error' }) });
      tenantService.getTenantById = jest.fn(() => response);

      expect(effects.getTenantById$).toBeObservable(expected);
    });
  });

  describe('post tenant', () => {
    it('should post tenant when postTenant action is dispached', () => {
      actions$ = hot('-a', { a: TenantActions.postTenant({ request: null }) });
      const response = cold('-a|', { a: tenant });
      const expected = cold('--b', {
        b: TenantActions.postTenantSuccess({ response: tenant }),
      });

      tenantService.postTenantData = jest.fn(() => response);
      expect(effects.postTenant$).toBeObservable(expected);
    });

    it('should dispatch postTenantFailure upon error', () => {
      actions$ = hot('-a', { a: TenantActions.postTenant({ request: null }) });
      const response = cold('-#|', {}, 'error');
      const expected = cold('--b', { b: TenantActions.postTenantFailure({ error: 'error' }) });

      tenantService.postTenantData = jest.fn(() => response);

      expect(effects.postTenant$).toBeObservable(expected);
    });
  });

  describe('update tenant', () => {
    it('should update tenant when updateTenant action is dispached', () => {
      actions$ = hot('-a', { a: TenantActions.updateTenant({ id: 'foo', body: null }) });
      const response = cold('-a|', { a: tenant });
      const expected = cold('--b', {
        b: TenantActions.updateTenantSuccess({ tenant: tenant }),
      });

      tenantService.updateTenant = jest.fn(() => response);
      expect(effects.updateTenant$).toBeObservable(expected);
    });

    it('should dispatch updateTenantFailure upon error', () => {
      actions$ = hot('-a', { a: TenantActions.updateTenant({ id: 'foo', body: null }) });
      const response = cold('-#|', {}, 'error');
      const expected = cold('--b', { b: TenantActions.updateTenantFailure({ error: 'error' }) });

      tenantService.updateTenant = jest.fn(() => response);

      expect(effects.updateTenant$).toBeObservable(expected);
    });
  });

  describe('displayToast', () => {
    const toastConfig = {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    };

    it('should dispatch displayToast action with the success config', () => {
      actions$ = hot('-a', { a: TenantActions.postTenantSuccess({ response: tenant }) });
      const expected = cold('-b', {
        b: TenantActions.displayToast({
          config: {
            ...toastConfig,
            data: {
              title: 'New Site ID Created',
              type: ToastTypeEnum.SUCCESS,
              icon: ToastIcon.CHECK_CIRCLE,
              close: true,
            },
          } as MatSnackBarConfig,
        }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });

    it('should dispatch displayToast action with the error config', () => {
      actions$ = hot('-a', { a: TenantActions.postTenantFailure({ error: 'error' }) });
      const expected = cold('-b', {
        b: TenantActions.displayToast({
          config: {
            ...toastConfig,
            data: {
              title: 'Site ID Creation Failed',
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
              close: true,
            },
          } as MatSnackBarConfig,
        }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });

    it('should dispatch displayToast action with the update success config', () => {
      actions$ = hot('-a', { a: TenantActions.updateTenantSuccess({ tenant: null }) });
      const expected = cold('-b', {
        b: TenantActions.displayToast({
          config: {
            ...toastConfig,
            data: {
              title: 'Customer Details Updated',
              type: ToastTypeEnum.SUCCESS,
              icon: ToastIcon.CHECK_CIRCLE,
              close: true,
            },
          } as MatSnackBarConfig,
        }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });

    it('should dispatch displayToast action with the update error config', () => {
      actions$ = hot('-a', { a: TenantActions.updateTenantFailure({ error: 'error' }) });
      const expected = cold('-b', {
        b: TenantActions.displayToast({
          config: {
            ...toastConfig,
            data: {
              title: 'Customer Details Update Failed',
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
              close: true,
            },
          } as MatSnackBarConfig,
        }),
      });

      expect(effects.displayToast$).toBeObservable(expected);
    });
  });
});
