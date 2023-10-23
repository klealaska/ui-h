import { HubConnection } from '@microsoft/signalr';
import { Buyer, UserMenuOption } from '@ui-coe/avidcapture/shared/types';
import { UserAccount } from '@ui-coe/shared/util/auth';
import { FeatureFlagValue } from '@ui-coe/shared/types';

export interface CoreStateModel {
  token: string;
  userRoles: string[];
  userAccount: UserAccount;
  orgIds: string[];
  orgNames: Buyer[];
  isLoading: boolean;
  escalationCount: number;
  buyerCount: number;
  documentCount: number;
  myUploadsCount: number;
  recycleBinCount: number;
  userMenuOptions: UserMenuOption[];
  featureFlags: FeatureFlagValue[];
  currentPage: string;
  filteredBuyers: Buyer[];
  researchPageEscalationCategoryList: string[];
  buyerModalOpenedCount: number;
  hubConnection: HubConnection;
}
