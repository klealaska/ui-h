export interface ISnackBarData {
  title?: string;
  message: string;
  url?: string;
  type?: SnackBarTypeEnum;
  icon?: string;
}

export enum SnackBarTypeEnum {
  STANDARD = 'standard',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  PRODUCT_UPDATE = 'product-update',
  FINANCE_NOTIFICATION = 'finance-notification',
}
