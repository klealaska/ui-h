import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { EntitlementsEffects } from './entitlements.effects';
import * as EntitlementsActions from './entitlements.actions';
import { EntitlementsService } from '../../services';
import { IProductEntitlementMapped, ITenantEntitlementMapped } from '@ui-coe/tenant/shared/types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@ui-coe/shared/util/services';
const id = '7hp0nqlpvwg0dyyehi1m';
const tenantEntitlements: ITenantEntitlementMapped[] = [
  {
    tenantId: id,
    productEntitlementId: 'z1vmx2pqms4erx6doaxd',
    productEntitlementName: 'Invoice AP Workflow Automation',
    tenantEntitlementStatus: 'Active',
  },
];

describe('EntitlementsEffects', () => {
  let actions$: Observable<any>;
  let effects: EntitlementsEffects;
  let service: EntitlementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntitlementsEffects, ConfigService, provideMockActions(() => actions$)],
      imports: [HttpClientTestingModule],
    });

    effects = TestBed.inject(EntitlementsEffects);
    service = TestBed.inject(EntitlementsService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('load Entitlements', () => {
    it('should load Entitlements when loadEntitlements action is dispached', () => {
      const getEntitlementsResponse: IProductEntitlementMapped[] = [
        { id: id, name: 'foo', status: 'Active' },
      ];
      actions$ = hot('-a', { a: EntitlementsActions.loadEntitlements({}) });
      const response = cold('-a|', { a: getEntitlementsResponse });
      const expected = cold('--b', {
        b: EntitlementsActions.loadEntitlementsSuccess({ response: getEntitlementsResponse }),
      });
      service.getEntitlementsData = jest.fn(() => response);
      expect(effects.loadEntitlements$).toBeObservable(expected);
    });

    it('should dispatch loadEntitlementsFailure upon error', () => {
      actions$ = hot('-a', { a: EntitlementsActions.loadEntitlements({}) });
      const response = cold('-#|', {}, 'error');
      const expected = cold('--b', {
        b: EntitlementsActions.loadEntitlementsFailure({ error: 'error' }),
      });

      service.getEntitlementsData = jest.fn(() => response);

      expect(effects.loadEntitlements$).toBeObservable(expected);
    });
  });

  describe('getEntitlementsByTenantId', () => {
    it('should dispatch getEntitlementsByTenantIdSuccess action with tenantEntitlement object', () => {
      actions$ = hot('-a', { a: EntitlementsActions.getEntitlementsByTenantId({ id }) });
      const response = cold('-a|', { a: tenantEntitlements });
      const expected = cold('--b', {
        b: EntitlementsActions.getEntitlementsByTenantIdSuccess({ response: tenantEntitlements }),
      });
      service.getEntitlementsByTenantId = jest.fn(() => response);

      expect(effects.getEntitlementsByTenantId$).toBeObservable(expected);
    });

    it('should dispatch getEntitlementsByTenantIdFailure upon error', () => {
      actions$ = hot('-a', { a: EntitlementsActions.getEntitlementsByTenantId({ id }) });
      const response = cold('-#|', {}, 'error');
      const expected = cold('--b', {
        b: EntitlementsActions.getEntitlementsByTenantIdFailure({ error: 'error' }),
      });

      service.getEntitlementsByTenantId = jest.fn(() => response);

      expect(effects.getEntitlementsByTenantId$).toBeObservable(expected);
    });
  });

  describe('assignProductEntitlement', () => {
    it('should dispatch the assignProductEntitlementSuccess action', () => {
      actions$ = hot('-a', {
        a: EntitlementsActions.assignProductEntitlement({
          productId: 'a',
          tenantId: 'b',
          reqBody: {
            assignmentDate: 'now',
            assignmentSource: 'somewhere',
            amount: 1000,
            sourceSystem: 'nowhere',
          },
        }),
      });

      const response = cold('-a|', { a: tenantEntitlements[0] });
      const expected = cold('--b', {
        b: EntitlementsActions.assignProductEntitlementSuccess({ response: tenantEntitlements[0] }),
      });

      service.assignProductEntitlement = jest.fn(() => response);

      expect(effects.assignProductEntitlementToTenant$).toBeObservable(expected);
    });

    it('should dispatch the assignProductEntitlementFailure action', () => {
      actions$ = hot('-a', {
        a: EntitlementsActions.assignProductEntitlement({
          productId: 'a',
          tenantId: 'b',
          reqBody: {
            assignmentDate: 'now',
            assignmentSource: 'somewhere',
            amount: 1000,
            sourceSystem: 'nowhere',
          },
        }),
      });

      const response = cold('#', {}, 'error');
      const expected = cold('-b', {
        b: EntitlementsActions.assignProductEntitlementFailure({ error: 'error' }),
      });

      service.assignProductEntitlement = jest.fn(() => response);

      expect(effects.assignProductEntitlementToTenant$).toBeObservable(expected);
    });
  });
});
