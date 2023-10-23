import { TestBed } from '@angular/core/testing';
import { hasAllTheClaimsTokenStub, hasNoClaimsTokenStub } from '@ui-coe/avidcapture/shared/test';
import { FeatureFlags, FeatureFlagsManager } from '@ui-coe/avidcapture/shared/types';
import { DateTime } from 'luxon';

import { FeatureFlagTargetQueries, makeFlagChecks } from './feature-flag-target.queries';

describe('FeatureFlagTargetQueries', () => {
  let queries: FeatureFlagTargetQueries;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeatureFlagTargetQueries],
    });
    queries = TestBed.inject(FeatureFlagTargetQueries);
  });

  it('should be created', () => {
    expect(queries).toBeTruthy();
  });

  describe('adminPageIsActive', () => {
    const featureFlag = {
      id: FeatureFlags.adminIsActive,
      description: '',
      enabled: true,
      conditions: {
        client_filters: [],
      },
    };

    it('should make flag checks', () => {
      expect(FeatureFlagTargetQueries.adminPageIsActive([featureFlag], '', '')).toBeTruthy();
    });
  });

  describe('avidBillProxyV2PropertyIsActive', () => {
    const featureFlag = {
      id: FeatureFlags.avidBillProxyV2PropertyIsActive,
      description: '',
      enabled: true,
      conditions: {
        client_filters: [],
      },
    };

    it('should make flag checks', () => {
      expect(
        FeatureFlagTargetQueries.avidBillProxyV2PropertyIsActive([featureFlag], '', '')
      ).toBeTruthy();
    });
  });

  describe('avidBillProxyV2SupplierIsActive', () => {
    const featureFlag = {
      id: FeatureFlags.avidBillProxyV2SupplierIsActive,
      description: '',
      enabled: true,
      conditions: {
        client_filters: [],
      },
    };

    it('should make flag checks', () => {
      expect(
        FeatureFlagTargetQueries.avidBillProxyV2SupplierIsActive([featureFlag], '', '')
      ).toBeTruthy();
    });
  });

  describe('batchSelectIsActive', () => {
    const featureFlag = {
      id: FeatureFlags.batchSelectIsActive,
      description: '',
      enabled: true,
      conditions: {
        client_filters: [],
      },
    };

    it('should make flag checks', () => {
      expect(FeatureFlagTargetQueries.batchSelectIsActive([featureFlag], '', '')).toBeTruthy();
    });
  });

  describe('multipleDisplayThresholdsIsActive', () => {
    const featureFlag = {
      id: FeatureFlags.multipleDisplayThresholdsIsActive,
      description: '',
      enabled: true,
      conditions: {
        client_filters: [],
      },
    };

    it('should make flag checks', () => {
      expect(
        FeatureFlagTargetQueries.multipleDisplayThresholdsIsActive([featureFlag], '', '')
      ).toBeTruthy();
    });
  });

  describe('supplierPredictionIsActive', () => {
    const featureFlag = {
      id: FeatureFlags.supplierPredictionIsActive,
      description: '',
      enabled: true,
      conditions: {
        client_filters: [],
      },
    };

    it('should make flag checks', () => {
      expect(
        FeatureFlagTargetQueries.supplierPredictionIsActive([featureFlag], '', '')
      ).toBeTruthy();
    });
  });

  describe('emailHubIsActive', () => {
    const featureFlag = {
      id: FeatureFlags.emailHubIsActive,
      description: '',
      enabled: true,
      conditions: {
        client_filters: [],
      },
    };

    it('should make flag checks', () => {
      expect(FeatureFlagTargetQueries.emailHubIsActive([featureFlag], '', '')).toBeTruthy();
    });
  });

  describe('makeFlagChecks()', () => {
    describe('when flag is NULL', () => {
      it('should return false', () => expect(makeFlagChecks(null, '', '')).toBeFalsy());
    });

    describe('when flag is NOT enabled', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: false,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.Targeting,
              parameters: {
                Audience: {
                  Groups: [
                    {
                      Name: 'SponsorMgr',
                      RolloutPercentage: 100,
                    },
                  ],
                  Users: ['mock'],
                },
              },
            },
          ],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'notAllowed';

      it('should return false', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeFalsy());
    });

    describe('when flag is enabled & there are NO client filters', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'notAllowed';

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeTruthy());
    });

    describe('when flag is enabled, has TimeWindow Filter with only a Start time that is in the future', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.TimeWindow,
              parameters: {
                Start: DateTime.now().plus({ days: 1 }).toHTTP(),
              },
            },
          ],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'notAllowed';

      it('should return false', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeFalsy());
    });

    describe('when flag is enabled, has TimeWindow Filter with only a Start time that has passed', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.TimeWindow,
              parameters: {
                Start: 'Thu, 09 Feb 2023 20:00:00 GMT',
              },
            },
          ],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'notAllowed';

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeTruthy());
    });

    describe('when flag is enabled, has TimeWindow Filter with a Start time that has passed but an End time that is in the future', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.TimeWindow,
              parameters: {
                Start: 'Thu, 09 Feb 2023 20:00:00 GMT',
                End: DateTime.now().plus({ days: 1 }).toHTTP(),
              },
            },
          ],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'notAllowed';

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeTruthy());
    });

    describe('when flag is enabled, has TimeWindow Filter with a Start & End time that have both passed ', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.TimeWindow,
              parameters: {
                Start: 'Thu, 09 Feb 2023 20:00:00 GMT',
                End: 'Thu, 09 Feb 2023 20:10:00 GMT',
              },
            },
          ],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'notAllowed';

      it('should return false', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeFalsy());
    });

    describe('when adminIsActive flag exists and is enabled and user has claim in target', () => {
      const featureFlag = {
        id: FeatureFlags.adminIsActive,
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.Targeting,
              parameters: {
                Audience: {
                  Groups: [
                    {
                      Name: 'adm.su',
                      RolloutPercentage: 100,
                    },
                  ],
                  Users: [],
                },
              },
            },
          ],
        },
      };
      const token = hasAllTheClaimsTokenStub;
      const username = '';

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeTruthy());
    });

    describe('when adminIsActive flag exists and is enabled and user does NOT have claim BUT has role in target', () => {
      const featureFlag = {
        id: FeatureFlags.adminIsActive,
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.Targeting,
              parameters: {
                Audience: {
                  Groups: [
                    {
                      Name: 'SponsorMgr',
                      RolloutPercentage: 100,
                    },
                  ],
                  Users: [],
                },
              },
            },
          ],
        },
      };
      const token = hasAllTheClaimsTokenStub;
      const username = '';

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeTruthy());
    });

    describe('when adminIsActive flag exists and is enabled, and user does NOT have claim NOR has role BUT username is found in target', () => {
      const featureFlag = {
        id: FeatureFlags.adminIsActive,
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.Targeting,
              parameters: {
                Audience: {
                  Groups: [
                    {
                      Name: 'SponsorMgr',
                      RolloutPercentage: 100,
                    },
                  ],
                  Users: ['mock'],
                },
              },
            },
          ],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'mock';

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeTruthy());
    });

    describe('when adminIsActive flag exists and is enabled BUT user does NOT have required claim, role, or not in Users list in target', () => {
      const featureFlag = {
        id: FeatureFlags.adminIsActive,
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.Targeting,
              parameters: {
                Audience: {
                  Groups: [
                    {
                      Name: 'SponsorMgr',
                      RolloutPercentage: 100,
                    },
                  ],
                  Users: ['mock'],
                },
              },
            },
          ],
        },
      };
      const token = hasNoClaimsTokenStub;
      const username = 'notAllowed';

      it('should return false', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeFalsy());
    });

    describe('when OrganizationId is NOT enabled for feature flag', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.OrganizationIds,
              parameters: {
                OrganizationIds: [94934934],
              },
            },
          ],
        },
      };
      const token = hasAllTheClaimsTokenStub;
      const username = 'notAllowed';

      it('should return false', () =>
        expect(makeFlagChecks(featureFlag, token, username)).toBeFalsy());
    });

    describe('when OrganizationId is enabled for feature flag', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.OrganizationIds,
              parameters: {
                OrganizationIds: [25],
              },
            },
          ],
        },
      };
      const token = hasAllTheClaimsTokenStub;
      const username = 'notAllowed';
      const filteredBuyers = [{ id: '25', name: 'test' }];

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username, filteredBuyers)).toBeTruthy());
    });

    describe('when multiple OrganizationIds are enabled for feature flag', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.OrganizationIds,
              parameters: {
                OrganizationIds: [1, 3546, 25],
              },
            },
          ],
        },
      };
      const token = hasAllTheClaimsTokenStub;
      const username = 'notAllowed';
      const filteredBuyers = [{ id: '25', name: 'test' }];

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username, filteredBuyers)).toBeTruthy());
    });

    describe('when multiple targeting is enabled and user is targeted', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.OrganizationIds,
              parameters: {
                OrganizationIds: [1, 3546, 25],
              },
            },
            {
              name: FeatureFlagsManager.Targeting,
              parameters: {
                Audience: {
                  Groups: [],
                  Users: ['mock'],
                },
              },
            },
          ],
        },
      };
      const token = hasAllTheClaimsTokenStub;
      const username = 'mock';
      const filteredBuyers = [{ id: '987', name: 'test' }];

      it('should return true', () =>
        expect(makeFlagChecks(featureFlag, token, username, filteredBuyers)).toBeTruthy());
    });

    describe('when multiple targeting is enabled but no match', () => {
      const featureFlag = {
        id: '',
        description: '',
        enabled: true,
        conditions: {
          client_filters: [
            {
              name: FeatureFlagsManager.OrganizationIds,
              parameters: {
                OrganizationIds: [1, 3546, 25],
              },
            },
            {
              name: FeatureFlagsManager.Targeting,
              parameters: {
                Audience: {
                  Groups: [],
                  Users: ['mock'],
                },
              },
            },
          ],
        },
      };
      const token = hasAllTheClaimsTokenStub;
      const username = 'none';
      const filteredBuyers = [{ id: '987', name: 'test' }];

      it('should return false', () =>
        expect(makeFlagChecks(featureFlag, token, username, filteredBuyers)).toBeFalsy());
    });
  });
});
