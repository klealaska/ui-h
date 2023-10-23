export interface IEnvironment {
  local: boolean;
  production: boolean;
  mock: boolean;
  apiSettings: IApiSettings;
  appInsightsSettings: IAppInsightsSettings;
}

export interface IApiSettings {
  baseUrl: string;
  baseUrlSuffix: string;
  testUrl: string;
  notificationUrl: string;
}

export interface IAppInsightsSettings {
  instrumentationKey: string;
}
