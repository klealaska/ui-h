export interface MfeEventInterface {
  eventType: MfeEvents;
  data: any;
}

export enum MfeEvents {
  Refresh,
}
