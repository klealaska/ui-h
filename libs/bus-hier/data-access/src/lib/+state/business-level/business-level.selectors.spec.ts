import { selectBusinessLevelState } from './business-level.selectors';
import * as fromBusinessLevel from './business-level.reducer';
import * as selectors from './business-level.selectors';

describe('BusinessLevel Selectors', () => {
  it('should select the feature state', () => {
    const result = selectBusinessLevelState({
      [fromBusinessLevel.businessLevelFeatureKey]: fromBusinessLevel.InitialBusinessLevelState,
    });

    expect(result).toEqual(fromBusinessLevel.InitialBusinessLevelState);
  });

  it('should select the businessLevelNamePlural', () => {
    const state: fromBusinessLevel.BusinessLevelState = {
      businessLevel: {
        businessLevelId: '',
        erpId: '',
        businessLevelNameSingular: '',
        businessLevelNamePlural: 'abcd',
        level: 123,
        isActive: true,
        createdTimestamp: '',
        createdByUserId: '',
        lastModifiedTimestamp: '',
        lastModifiedByUserId: '',
      },
      loading: false,
      error: null,
      toast: {},
    };

    const result = selectors.selectBusinessLevelNamePlural.projector(state);

    expect(result).toEqual('abcd');
  });
});
