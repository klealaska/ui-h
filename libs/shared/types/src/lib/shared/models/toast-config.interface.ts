export interface IToastConfigData {
  title: string;
  type: string;
  icon: string;
  close: boolean;
}

export interface IGetToastOptions {
  title: string;
  type?: string;
  icon?: string;
}
