import { AppName } from '@ui-coe/shared/util/auth';

export class AppConfig {
  avidAuthBaseUri: string;
  avidAuthLoginUrl: string;
  avidAuthOktaUrl: string;
  avidAuthLogoutUrl: string;
  apiBaseUrl: string;
  production: boolean;
  appName: AppName;
  redirectUrl: string;
}
