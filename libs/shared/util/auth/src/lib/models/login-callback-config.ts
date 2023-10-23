import { AppName } from '../enums';

export interface AuthConfig {
  avidAuthLoginUrl: string;
  avidAuthBaseUrl: string;
  appName: AppName;
  redirectUrl: string;
}
