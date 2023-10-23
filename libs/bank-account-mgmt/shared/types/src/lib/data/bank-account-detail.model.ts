import { IBankAccountMapped } from './bank-account.model';

export interface IBamDetailButtonConfig {
  // displayEdit: boolean;
  label: string;
  buttonType?: string;
  buttonColor?: string;
  updatedStatus?: string;
}

export interface IDetailBtnEmitEvent {
  account: IBankAccountMapped;
  updatedStatus?: string;
}
