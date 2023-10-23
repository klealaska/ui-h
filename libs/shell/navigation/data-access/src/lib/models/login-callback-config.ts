import { AppName } from '../enums';

export interface AuthConfig {
  avidAuthLoginUrl: string;
  avidAuthBaseUrl: string;
  appName: AppName;
  redirectUrl: string;
}

export interface CallbackData {
  avidAuthBaseUrl: string;
  state: string;
  code: string;
  redirectUrl: string;
}
