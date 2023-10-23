import { HubConnection } from '@microsoft/signalr';
import { Buyer, UserMenuOption } from '@ui-coe/avidcapture/shared/types';

export class SetToken {
  static readonly type = '[CoreState] SetToken';
}

export class QueryUserAccount {
  static readonly type = '[CoreState] QueryUserAccount';
}

export class QueryUserRoles {
  static readonly type = '[CoreState] QueryUserRoles';
}

export class QueryOrgNames {
  static readonly type = '[CoreState] QueryOrgNames';
}

export class QueryAllOrgNames {
  static readonly type = '[CoreState] QueryAllOrgNames';
}

export class HandleSponsorUser {
  static readonly type = '[CoreState] HandleSponsorUser';
}

export class Logout {
  static readonly type = '[CoreState] Logout';
}

export class HttpRequestActive {
  static readonly type = '[CoreState] HttpRequestActive';
}

export class HttpRequestComplete {
  static readonly type = '[CoreState] HttpRequestComplete';
}

export class QueryDocumentCardSetCounts {
  static readonly type = '[CoreState] QueryDocumentCardSetCounts';
}

export class StartWebSockets {
  static readonly type = '[CoreState] StartWebSockets';
}

export class UpdateWebSocketConnection {
  static readonly type = '[CoreState] UpdateWebSocketConnection';
  constructor(public hubConnection: HubConnection) {}
}

export class ConfigureWebSocketGroups {
  static readonly type = '[CoreState] ConfigureWebSocketGroups';
}

export class AddUsernameToWebSocketsGroup {
  static readonly type = '[CoreState] AddUsernameToWebSocketsGroup';
}

export class AddBuyerToWebSocketsGroup {
  static readonly type = '[CoreState] AddBuyerToWebSocketsGroup';
  constructor(public buyerIds: string[]) {}
}

export class RemoveBuyerFromWebSocketsGroup {
  static readonly type = '[CoreState] RemoveBuyerFromWebSocketsGroup';
  constructor(public buyerId: string) {}
}

export class StartLockHeartbeat {
  static readonly type = '[CoreState] StartLockHeartbeat';
  constructor(public documentId: string, public buyerId: string) {}
}

export class RemoveExpiredLocks {
  static readonly type = '[CoreState] RemoveExpiredLocks';
}

export class UpdatePendingDocumentCount {
  static readonly type = '[CoreState] UpdatePendingDocumentCount';
  constructor(public documentCount: number) {}
}

export class UpdateEscalationDocumentCount {
  static readonly type = '[CoreState] UpdateEscalationDocumentCount';
  constructor(public escalationCount: number) {}
}

export class UpdateUploadsDocumentCount {
  static readonly type = '[CoreState] UpdateUploadsDocumentCount';
  constructor(public myUploadsCount: number) {}
}

export class UpdateRecycleBinDocumentCount {
  static readonly type = '[CoreState] UpdateRecycleBinDocumentCount';
  constructor(public recycleBinCount: number) {}
}

export class SendLockMessage {
  static readonly type = '[CoreState] SendLockMessage';
  constructor(public username: string, public documentId: string, public buyerId: string) {}
}

export class SendUnlockMessage {
  static readonly type = '[CoreState] SendUnlockMessage';
  constructor(public documentId: string, public buyerId: string) {}
}

export class StartChameleon {
  static readonly type = '[CoreState] StartChameleon';
}

export class AddMenuOptions {
  static readonly type = '[CoreState] AddMenuOptions';
  constructor(public menuOption: UserMenuOption) {}
}

export class RemoveMenuOptions {
  static readonly type = '[CoreState] RemoveMenuOptions';
  constructor(public menuOption: UserMenuOption) {}
}

export class QueryAllFeatureFlags {
  static readonly type = '[CoreState] QueryAllFeatureFlags';
}

export class SetCurrentPage {
  static readonly type = '[CoreState] SetCurrentPage';
  constructor(public currentPage: string) {}
}

export class RefreshToken {
  static readonly type = '[CoreState] RefreshToken';
}

export class AddFilteredBuyer {
  static readonly type = '[CoreState] AddFilteredBuyer';
  constructor(public buyer: Buyer) {}
}

export class RemoveFilteredBuyer {
  static readonly type = '[CoreState] RemoveFilteredBuyer';
  constructor(public buyer: Buyer) {}
}

export class OpenFilteredBuyersModal {
  static readonly type = '[CoreState] OpenFilteredBuyersModal';
}

export class SetResearchPageEscalationCategoryList {
  static readonly type = '[CoreState] SetResearchPageEscalationCategoryList';
  constructor(public researchPageEscalationCategoryList: string[]) {}
}

export class GetPaymentTerms {
  static readonly type = '[CoreState] GetPaymentTerms';
}

export class UpdatePendingQueueCount {
  static readonly type = '[CoreState] UpdatePendingQueueCount';
}

export class UpdateResearchQueueCount {
  static readonly type = '[CoreState] UpdateResearchQueueCount';
}

export class UpdateUploadsQueueCount {
  static readonly type = '[CoreState] UpdateUploadsQueueCount';
}

export class UpdateRecycleBinQueueCount {
  static readonly type = '[CoreState] UpdateRecycleBinQueueCount';
}

export class UnlockDocument {
  static readonly type = '[CoreState] UnlockDocument';
  constructor(public documentId: string, public buyerId: string = '') {}
}
