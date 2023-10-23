import * as fromRoles from './roles.reducer';
import { selectRolesState } from './roles.selectors';

describe('Roles Selectors', () => {
  it('should select the feature state', () => {
    const result = selectRolesState({
      [fromRoles.rolesFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
});
