import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
  AppConfigurationClient,
  ConfigurationSettingParam,
  GetConfigurationSettingResponse,
} from '@azure/app-configuration';
import { from, Observable } from 'rxjs';
import { scan, startWith, take } from 'rxjs/operators';

interface Environment {
  featureFlagUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  constructor(private http: HttpClient, @Inject('environment') private environment: Environment) {}

  getFeatureFlag(conn: string, featureFlag: string): Observable<GetConfigurationSettingResponse> {
    const client = new AppConfigurationClient(conn);

    return from(
      client.getConfigurationSetting({
        key: featureFlag,
      })
    );
  }

  getAllFeatureFlags(conn: string): Observable<ConfigurationSettingParam[]> {
    const client = new AppConfigurationClient(conn);
    const settings = client.listConfigurationSettings();

    return new Observable(
      observer =>
        void (async (): Promise<void> => {
          try {
            for await (const setting of settings as AsyncIterable<ConfigurationSettingParam>) {
              if (observer.closed) {
                return;
              }
              observer.next(setting);
            }
            observer.complete();
          } catch (e) {
            observer.error(e);
          }
        })()
    ).pipe(
      scan<any, ConfigurationSettingParam[]>((acc, setting) => [...acc, setting], []),
      startWith([] as ConfigurationSettingParam[])
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFlag(featureFlag: string, url: string): Observable<any> {
    const featureFlagUrl = url || this.environment.featureFlagUrl;
    return this.http.get(`${featureFlagUrl}?flagname=${featureFlag}`).pipe(take(1));
  }
}
