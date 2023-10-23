import { HierarchyType } from '../enums';

export type IHistoryEventList = IHistoryEvent[][];

export interface IHistory {
  events: IHistoryEventList;
}

export interface IHistoryEvent {
  type: string;
  payload: IHistoryEventPayload;
  correlationId: string;
}

export interface IHistoryEventPayload {
  orgId?: string;
  erpId?: string;
  id?: string;
  level?: number;
  hierarchyType: HierarchyType;
  entityTypeName?: string;
  parentEntityId?: string;
  entityName?: string;
}
