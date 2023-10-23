import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { ITreeMapped, IOrgsErpsTreeMapped } from '@ui-coe/bus-hier/shared/types';
import { BusHierService } from '../../services/bus-hier.service';
import * as TreeActions from './tree.actions';
import { TreeEffects } from './tree.effects';
import { toNavigationTreeMapper } from '../../utils/tree-mapper';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('TreeEffects', () => {
  let actions$: Observable<any>;
  let effects: TreeEffects;
  let service: BusHierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeEffects, ConfigService, provideMockActions(() => actions$)],
      imports: [HttpClientTestingModule],
    });

    effects = TestBed.inject(TreeEffects);
    service = TestBed.inject(BusHierService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should load loadTrees when loadTrees action is dispatched', () => {
    const actionParams = { payload: { erpId: '123', orgId: '234' }, correlationId: undefined };
    const getTree: ITreeMapped = {
      businessLevel: {
        depth: 2,
        businessLevels: [
          {
            id: '4324234',
            isActive: true,
            level: 1,
            name: {
              singular: 'company',
              plural: 'companies',
            },
            count: 2,
            selectedEntity: null,
          },
          {
            id: '4324234',
            isActive: true,
            level: 2,
            name: {
              singular: 'department',
              plural: 'departments',
            },
            count: 60,
            selectedEntity: null,
          },
        ],
      },
      organization: { id: '213', code: '456', count: 1, name: 'ghg', isActive: true },
      erp: { id: '213', code: '456', count: 1, name: 'ghg', isActive: false },
    };
    const navTree = toNavigationTreeMapper(getTree);
    actions$ = hot('-a', { a: TreeActions.loadTree(actionParams) });
    const response = cold('-a|', { a: getTree });
    const expected = cold('--(bc)', {
      b: TreeActions.loadTreeSuccess({ response: navTree }),
      c: TreeActions.activateTreeNode({ payload: { id: undefined }, correlationId: undefined }),
    });
    service.getTree = jest.fn(() => response);
    expect(effects.loadTree$).toBeObservable(expected);
  });

  it('should load loadOrgsAndErps when loadOrgsAndErps action is dispatched', () => {
    const respMapped: IOrgsErpsTreeMapped = {
      erps: [
        {
          erpId: '233',
          organizationId: '123',
          erpCode: 'codeerp',
          erpName: 'erp name',
          isActive: true,
        },
      ],
      organizations: [
        {
          organizationId: '123',
          organizationName: 'orgName',
          organizationCode: 'code',
          isActive: true,
          createdTimestamp: '456',
          lastModifiedByUserId: '789',
          createdByUserId: '1',
          lastModifiedTimestamp: 'timeStamp',
          erps: [],
          organizationAddresses: [],
        },
      ],
    };

    // TODO: strongly type this
    const newMappedRes: any = {
      organizations: [
        {
          erps: [],
          id: '123',
          name: 'orgName',
          isActive: true,
          isDisabled: false,
          isSelected: false,
          orgCode: 'code',
        },
      ],
      erps: [
        {
          erpCode: 'codeerp',
          id: '233',
          name: 'erp name',
          isActive: true,
          isDisabled: false,
          isSelected: false,
          orgId: '123',
        },
      ],
    };

    actions$ = hot('-a', { a: TreeActions.loadOrgsAndErps() });
    const response = cold('-a|', { a: respMapped });
    const expected = cold('--b', {
      b: TreeActions.loadOrgsAndErpsSuccess({ response: newMappedRes }),
    });
    service.getOrgsAndErps = jest.fn(() => response);
    expect(effects.loadOrgsAndErps$).toBeObservable(expected);
  });

  it('should fail loadOrgsAndErps when loadOrgsAndErps action is dispatched', () => {
    actions$ = hot('-a', { a: TreeActions.loadOrgsAndErps() });
    const response = cold('-#|)', {}, 'network error');
    service.getOrgsAndErps = jest.fn(() => response);
    const expected = cold('--b', {
      b: TreeActions.loadOrgsAndErpsFailure({ error: 'network error' }),
    });
    expect(effects.loadOrgsAndErps$).toBeObservable(expected);
  });
});
