export enum AlertStatus {
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
}
export type AlertTypes =
  | AlertStatus.WARNING
  | AlertStatus.INFO
  | AlertStatus.SUCCESS
  | AlertStatus.ERROR;
