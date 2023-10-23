import { Selector } from '@ngxs/store';
import {
  Buyer,
  DocumentCardText,
  UserMenuOption,
  UserPermissions,
  UserQueuePermissions,
} from '@ui-coe/avidcapture/shared/types';
import { DashboardCard } from '@ui-coe/shared/ui';
import { FeatureFlagValue } from '@ui-coe/shared/types';
import jwt_decode from 'jwt-decode';

import { CoreStateModel } from './core.model';
import { CoreState } from './core.state';

export class CoreSelectors {
  @Selector([CoreState.data])
  static userDisplayName(state: CoreStateModel): string {
    return state.userAccount?.name.replace(
      /\w+/g,
      name => `${name.charAt(0).toUpperCase()}${name.slice(1).toLowerCase()}`
    );
  }

  @Selector([CoreState.data])
  static currentUsername(state: CoreStateModel): string {
    return state.userAccount?.preferred_username;
  }

  @Selector([CoreState.data])
  static currentUserEmail(state: CoreStateModel): string {
    return state.userAccount?.email;
  }

  @Selector([CoreState.data])
  static isLoading(state: CoreStateModel): boolean {
    return state.isLoading;
  }

  @Selector([CoreState.data])
  static pendingDocumentCount(state: CoreStateModel): number {
    return state.documentCount > 0 ? state.documentCount : 0;
  }

  @Selector([CoreState.data])
  static researchDocumentCount(state: CoreStateModel): number {
    return state.escalationCount > 0 ? state.escalationCount : 0;
  }

  @Selector([CoreState.data])
  static myUploadsDocumentCount(state: CoreStateModel): number {
    return state.myUploadsCount > 0 ? state.myUploadsCount : 0;
  }

  @Selector([CoreState.data])
  static recycleBinDocumentCount(state: CoreStateModel): number {
    return state.recycleBinCount > 0 ? state.recycleBinCount : 0;
  }

  @Selector([CoreState.data])
  static documentCards(state: CoreStateModel): DashboardCard[] {
    if (!state.token) {
      return [];
    }
    const decodedToken = jwt_decode(state.token);
    const isEscalationUser = Object.values(UserQueuePermissions).some(x => decodedToken[x])
      ? true
      : false;
    const cards = [];

    if (decodedToken[UserPermissions.Pending])
      cards.push({
        count: state.documentCount,
        text: DocumentCardText.TotalInvoices,
        icon: 'description',
      });

    if (isEscalationUser) {
      cards.push({
        count: state.escalationCount,
        text: DocumentCardText.Escalations,
        icon: 'warning',
      });
    }

    if (decodedToken.hasOwnProperty(UserPermissions.SponsorUser)) {
      cards.push({
        count: state.buyerCount,
        text: DocumentCardText.Customers,
        icon: 'group',
      });
    }
    return cards;
  }

  @Selector([CoreState.data])
  static userMenuOptions(state: CoreStateModel): UserMenuOption[] {
    return state.userMenuOptions;
  }

  @Selector([CoreState.data])
  static featureFlags(state: CoreStateModel): FeatureFlagValue[] {
    return state.featureFlags;
  }

  @Selector([CoreState.data])
  static userRoles(state: CoreStateModel): string[] {
    return state.userRoles;
  }

  @Selector([CoreState.data])
  static token(state: CoreStateModel): string {
    return state.token;
  }

  @Selector([CoreState.data])
  static orgIds(state: CoreStateModel): string[] {
    return state.orgIds;
  }

  @Selector([CoreState.data])
  static orgNames(state: CoreStateModel): Buyer[] {
    return state.orgNames;
  }

  @Selector([CoreState.data])
  static filteredBuyers(state: CoreStateModel): Buyer[] {
    return state.filteredBuyers;
  }
}
