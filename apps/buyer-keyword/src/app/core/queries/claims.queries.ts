import { Selector } from '@ngxs/store';
import { UserPermissions } from '../../shared/enums';
import { CoreSelectors } from '../state/core.selectors';

export class ClaimsQueries {
  @Selector([CoreSelectors.userRoles])
  static canViewMassVoid(roles: string[]): boolean {
    const permissionsToCheck = [
      UserPermissions.PortalAdmin.toString(),
      UserPermissions.Engineering.toString(),
      UserPermissions.CustomerCareLeadership.toString(),
    ];

    return roles.some(role => permissionsToCheck.includes(role.trim()));
  }

  @Selector([CoreSelectors.userRoles])
  static canViewAttributeFunctions(roles: string[]): boolean {
    const permissionsToCheck = [
      UserPermissions.Engineering.toString(),
      UserPermissions.CustomerCareLeadership.toString(),
    ];

    return roles.some(role => permissionsToCheck.includes(role.trim()));
  }

  @Selector([CoreSelectors.userRoles])
  static canViewThreshold(roles: string[]): boolean {
    const permissionsToCheck = [
      UserPermissions.Engineering.toString(),
      UserPermissions.IndexingSponsorManager.toString(),
    ];

    return roles.some(role => permissionsToCheck.includes(role.trim()));
  }

  @Selector([CoreSelectors.userRoles])
  static canViewBuyerGoLive(roles: string[]): boolean {
    const permissionsToCheck = [
      UserPermissions.PortalAdmin.toString(),
      UserPermissions.Engineering.toString(),
      UserPermissions.CustomerCareLeadership.toString(),
    ];

    return roles.some(role => permissionsToCheck.includes(role.trim()));
  }
}
