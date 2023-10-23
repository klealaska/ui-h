import { Selector } from '@ngxs/store';
import { Buyer, FeatureFlags, FeatureFlagsManager } from '@ui-coe/avidcapture/shared/types';
import { FeatureFlagGroups, FeatureFlagParameters, FeatureFlagValue } from '@ui-coe/shared/types';
import jwt_decode from 'jwt-decode';
import { DateTime } from 'luxon';

import { CoreSelectors } from '../+state/core.selectors';

export class FeatureFlagTargetQueries {
  @Selector([CoreSelectors.featureFlags, CoreSelectors.token, CoreSelectors.currentUsername])
  static adminPageIsActive(
    featureFlags: FeatureFlagValue[],
    token: string,
    username: string
  ): boolean {
    const flag = featureFlags.find(ff => ff.id === FeatureFlags.adminIsActive);

    return makeFlagChecks(flag, token, username);
  }

  @Selector([CoreSelectors.featureFlags, CoreSelectors.token, CoreSelectors.currentUsername])
  static avidBillProxyV2PropertyIsActive(
    featureFlags: FeatureFlagValue[],
    token: string,
    username: string
  ): boolean {
    const flag = featureFlags.find(ff => ff.id === FeatureFlags.avidBillProxyV2PropertyIsActive);

    return makeFlagChecks(flag, token, username);
  }

  @Selector([CoreSelectors.featureFlags, CoreSelectors.token, CoreSelectors.currentUsername])
  static avidBillProxyV2SupplierIsActive(
    featureFlags: FeatureFlagValue[],
    token: string,
    username: string
  ): boolean {
    const flag = featureFlags.find(ff => ff.id === FeatureFlags.avidBillProxyV2SupplierIsActive);

    return makeFlagChecks(flag, token, username);
  }

  @Selector([
    CoreSelectors.featureFlags,
    CoreSelectors.token,
    CoreSelectors.currentUsername,
    CoreSelectors.filteredBuyers,
  ])
  static batchSelectIsActive(
    featureFlags: FeatureFlagValue[],
    token: string,
    username: string,
    filteredBuyers?: Buyer[]
  ): boolean {
    const flag = featureFlags.find(ff => ff.id === FeatureFlags.batchSelectIsActive);

    return makeFlagChecks(flag, token, username, filteredBuyers);
  }

  @Selector([
    CoreSelectors.featureFlags,
    CoreSelectors.token,
    CoreSelectors.currentUsername,
    CoreSelectors.filteredBuyers,
  ])
  static multipleDisplayThresholdsIsActive(
    featureFlags: FeatureFlagValue[],
    token: string,
    username: string,
    filteredBuyers?: Buyer[]
  ): boolean {
    const flag = featureFlags.find(ff => ff.id === FeatureFlags.multipleDisplayThresholdsIsActive);

    return makeFlagChecks(flag, token, username, filteredBuyers);
  }

  @Selector([
    CoreSelectors.featureFlags,
    CoreSelectors.token,
    CoreSelectors.currentUsername,
    CoreSelectors.filteredBuyers,
  ])
  static supplierPredictionIsActive(
    featureFlags: FeatureFlagValue[],
    token: string,
    username: string,
    filteredBuyers?: Buyer[]
  ): boolean {
    const flag = featureFlags.find(ff => ff.id === FeatureFlags.supplierPredictionIsActive);

    return makeFlagChecks(flag, token, username, filteredBuyers);
  }

  @Selector([CoreSelectors.featureFlags, CoreSelectors.token, CoreSelectors.currentUsername])
  static emailHubIsActive(
    featureFlags: FeatureFlagValue[],
    token: string,
    username: string
  ): boolean {
    const flag = featureFlags.find(ff => ff.id === FeatureFlags.emailHubIsActive);
    return makeFlagChecks(flag, token, username);
  }
}

/**
 * Functions for the feature flag selectors
 */

export function makeFlagChecks(
  flag: FeatureFlagValue,
  token: string,
  username: string,
  filteredBuyers?: Buyer[]
): boolean {
  if (!flag?.enabled) {
    return false;
  } else {
    if (flag.conditions.client_filters.length === 0) {
      return true;
    }

    const target = flag.conditions.client_filters.find(
      cf => cf.name === FeatureFlagsManager.Targeting
    );

    const timeWindow = flag.conditions.client_filters.find(
      cf => cf.name === FeatureFlagsManager.TimeWindow
    );

    const organizationId = flag.conditions.client_filters.find(
      cf => cf.name === FeatureFlagsManager.OrganizationIds
    );

    if (timeWindow) {
      return isInsideTimeWindow(timeWindow.parameters.Start, timeWindow.parameters.End);
    }

    return (
      hasClaimInGroups(target?.parameters.Audience.Groups, token) ||
      hasRoleInGroups(target?.parameters.Audience.Groups, token) ||
      usernameFound(target?.parameters.Audience.Users, username) ||
      organizationIdFound(organizationId?.parameters, filteredBuyers)
    );
  }
}

function hasClaimInGroups(groups: FeatureFlagGroups[], token: string): boolean {
  return groups?.some(group => (jwt_decode(token)[group.Name] ? true : false));
}

function hasRoleInGroups(groups: FeatureFlagGroups[], token: string): boolean {
  return groups?.some(group => jwt_decode(token)['roles']?.indexOf(group.Name) > -1);
}

function usernameFound(users: string[], username: string): boolean {
  return users?.find(user => user.toLowerCase() === username.toLowerCase()) ? true : false;
}

function organizationIdFound(parameters: FeatureFlagParameters, filteredBuyers: Buyer[]): boolean {
  if (!filteredBuyers || filteredBuyers?.length < 1) {
    return false;
  }
  return parameters?.OrganizationIds?.some(orgId =>
    filteredBuyers.some(buyer => buyer.id === orgId.toString())
  );
}

function isInsideTimeWindow(startTime: string, endTime: string): boolean {
  const start = DateTime.fromHTTP(startTime);
  const today = DateTime.now();

  if (!endTime) {
    return today >= start;
  } else {
    const end = DateTime.fromHTTP(endTime);

    return today >= start && today <= end;
  }
}
