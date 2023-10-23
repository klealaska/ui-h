import { Selector } from '@ngxs/store';
import {
  CustomerEscalationTypes,
  EscalationCategoryTypes,
  IndexerEscalationTypes,
  IndexerQAEscalationType,
  UserMarkAsPermissions,
  UserPermissions,
  UserRoles,
} from '@ui-coe/avidcapture/shared/types';
import jwt_decode from 'jwt-decode';

import { CoreSelectors } from '../+state/core.selectors';

export class ClaimsQueries {
  //#region PAGES
  @Selector([CoreSelectors.token])
  static canViewAdmin(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.CanViewAdmin] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewDashboard(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.Dashboard] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewPending(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.Pending] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewResearch(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.Research] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewArchive(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.Archive] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewRecycleBin(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.RecycleBin] ? true : false;
  }
  //#endregion

  //#region GENERAL FEATURES
  @Selector([CoreSelectors.token])
  static canUseAdvancedFilter(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.AdvancedFilter] ? true : false;
  }

  // For Buyer Filter
  @Selector([CoreSelectors.token])
  static canViewAllBuyers(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.SponsorUser] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canUpload(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.Upload] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canDownloadPdf(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.Download] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canSwapImage(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.SwapImage] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewClientGuidelines(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.SponsorUser] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewAvidInvoice(token: string): boolean {
    const roles = this.rolesList(token);
    return (
      roles?.indexOf(UserRoles.InternalOps) > -1 ||
      roles?.indexOf(UserRoles.Customer) > -1 ||
      roles?.indexOf(UserRoles.UploadAndSubmit) > -1
    );
  }

  @Selector([CoreSelectors.token])
  static canViewAvidInbox(token: string): boolean {
    const roles = this.rolesList(token);
    return (
      roles?.indexOf(UserRoles.InternalOps) > -1 ||
      roles?.indexOf(UserRoles.Customer) > -1 ||
      roles?.indexOf(UserRoles.UploadAndSubmit) > -1
    );
  }

  @Selector([CoreSelectors.token])
  static canCreateAccount(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.CanCreateAccount] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canSeeSaveButton(token: string): boolean {
    const roles = this.rolesList(token);
    const condition = [UserRoles.InternalOps, UserRoles.Customer, UserRoles.UploadAndSubmit];
    return token && condition.some(cond => roles.includes(cond)) ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canSeeMoreActions(token: string): boolean {
    const roles = this.rolesList(token);
    const condition = [UserRoles.InternalOps, UserRoles.Customer, UserRoles.UploadAndSubmit];
    return token && condition.some(cond => roles.includes(cond)) ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canSeeExposedFilters(token: string): boolean {
    const roles = this.rolesList(token);
    const condition = [UserRoles.InternalOps, UserRoles.Customer];
    return token && condition.some(cond => roles.includes(cond)) ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewGetNextDocument(token: string): boolean {
    const roles = this.rolesList(token);

    const condition = [
      UserRoles.InternalOps,
      UserRoles.Manager,
      UserRoles.QualityControl,
      UserRoles.Customer,
    ];

    return token && condition.some(cond => roles.includes(cond)) ? true : false;
  }

  @Selector([CoreSelectors.token])
  static editWorkflow(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.EditWorkflow] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canViewNavigationBar(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.CanViewNavigationBar] ? true : false;
  }
  //#endregion

  //#region MARK AS
  @Selector([CoreSelectors.token])
  static markAsList(token: string): string[] {
    if (!token) {
      return [];
    }

    const escalationCategories: string[] = [];
    const decodedToken = jwt_decode(token);
    const rolesList = this.rolesList(token);
    const markAsList = Object.values(UserMarkAsPermissions).reduce(
      (acc, x) =>
        (acc = {
          ...acc,
          [x]: decodedToken[x]?.length > 0 ? true : false,
        }),
      {}
    );

    if (markAsList[UserPermissions.DataException]) {
      escalationCategories.push(EscalationCategoryTypes.DataExceptionAU);
    }
    if (markAsList[UserPermissions.ScanningOps]) {
      escalationCategories.push(EscalationCategoryTypes.ScanningOpsQC);
    }
    if (markAsList[UserPermissions.IndexerQa]) {
      escalationCategories.push(EscalationCategoryTypes.IndexerQa);
    }
    if (markAsList[UserPermissions.IndexingOps]) {
      escalationCategories.push(EscalationCategoryTypes.IndexingOpsQc);
    }
    if (markAsList[UserPermissions.RecycleBinMarkAs]) {
      escalationCategories.push(EscalationCategoryTypes.RecycleBin);
    }
    if (markAsList[UserPermissions.DuplicateResearch]) {
      escalationCategories.push(EscalationCategoryTypes.DuplicateResearch);
    }
    if (markAsList[UserPermissions.ImageIssue]) {
      escalationCategories.push(EscalationCategoryTypes.ImageIssue);
    }
    if (markAsList[UserPermissions.NonInvoiceDocument]) {
      escalationCategories.push(EscalationCategoryTypes.NonInvoiceDocument);
    }
    if (
      rolesList?.indexOf(UserRoles.InternalOps) > -1 ||
      rolesList?.indexOf(UserRoles.Customer) > -1
    ) {
      escalationCategories.push(EscalationCategoryTypes.RejectToSender);
    }
    if (markAsList[UserPermissions.ShipToResearch]) {
      escalationCategories.push(EscalationCategoryTypes.ShipToResearch);
    }
    if (markAsList[UserPermissions.SupplierResearch]) {
      escalationCategories.push(EscalationCategoryTypes.SupplierResearch);
    }

    return escalationCategories;
  }

  @Selector([CoreSelectors.token])
  static escalationCategoryList(token: string): string[] {
    const rolesList = this.rolesList(token);
    const escalationCategories: string[] = [];

    if (!rolesList) {
      Object.values(EscalationCategoryTypes).forEach(x => escalationCategories.push(`-${x}`));
      return escalationCategories;
    }

    if (rolesList.indexOf(UserRoles.InternalOps) < 0 && rolesList.indexOf(UserRoles.Customer) < 0) {
      Object.values(CustomerEscalationTypes).forEach(x => escalationCategories.push(`-${x}`));
    }

    if (rolesList.indexOf(UserRoles.InternalOps) < 0) {
      Object.values(IndexerEscalationTypes).forEach(x => escalationCategories.push(`-${x}`));
    }

    if (rolesList.indexOf(UserRoles.InternalOps) < 0 && rolesList.indexOf(UserRoles.Manager) < 0) {
      Object.values(IndexerQAEscalationType).forEach(x => escalationCategories.push(`-${x}`));
    }

    if (rolesList.indexOf(UserRoles.Customer) > -1) {
      const categories = this.markAsList(token);
      const missingCategories = Object.values(CustomerEscalationTypes).filter(x => {
        return !categories.includes(x);
      });

      missingCategories.forEach(x => escalationCategories.push(`-${x}`));
    }

    return escalationCategories;
  }

  @Selector([CoreSelectors.token])
  static canRecycleDocument(token: string): boolean {
    const roles = this.rolesList(token);
    return roles?.indexOf(UserRoles.InternalOps) > -1 || roles?.indexOf(UserRoles.Customer) > -1;
  }

  @Selector([CoreSelectors.token])
  static canRejectToSender(token: string): boolean {
    const roles = this.rolesList(token);
    return roles?.indexOf(UserRoles.Customer) > -1;
  }
  //#endregion

  //#region ADMIN
  @Selector([CoreSelectors.token])
  static canCreateUser(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.CanCreateUser] ? true : false;
  }

  @Selector([CoreSelectors.token])
  static canManageRoles(token: string): boolean {
    return token && jwt_decode(token)[UserPermissions.CanManageRoles] ? true : false;
  }
  //#endregion

  @Selector([CoreSelectors.token])
  static canEditPredictedValues(token: string): boolean {
    const roles = this.rolesList(token);
    return roles?.indexOf(UserRoles.InternalOps) > -1;
  }

  @Selector([CoreSelectors.token])
  static canUnlockDocumentManually(token: string): boolean {
    const roles = this.rolesList(token);
    return roles?.indexOf(UserRoles.InternalOps) > -1;
  }

  @Selector([CoreSelectors.token])
  static rolesList(token: string): Array<string> {
    if (!token) {
      return null;
    }

    return jwt_decode(token)['roles'] as Array<string>;
  }
}
