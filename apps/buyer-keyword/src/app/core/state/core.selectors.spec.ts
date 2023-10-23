import { TestBed } from '@angular/core/testing';
import { UserPermissions } from '../../shared/enums';
import { CoreSelectors } from './core.selectors';

describe('CoreSelectors', () => {
  let queries: CoreSelectors;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreSelectors],
    });
    queries = TestBed.inject(CoreSelectors);
  });

  it('should be created', () => {
    expect(queries).toBeTruthy();
  });

  it('should select token from state', () => {
    expect(CoreSelectors.token({ token: '' } as any)).toBe('');
  });

  it('should select token from state', () => {
    expect(CoreSelectors.userRoles({ userRoles: [UserPermissions.PortalAdmin] } as any)).toEqual([
      UserPermissions.PortalAdmin,
    ]);
  });

  it('should select token from state', () => {
    expect(CoreSelectors.orgIds({ orgIds: ['25'] } as any)).toEqual(['25']);
  });
});
