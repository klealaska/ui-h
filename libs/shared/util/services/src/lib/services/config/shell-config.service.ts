import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { setRemoteDefinitions } from '@nrwl/angular/mf';
import { Observable, from } from 'rxjs';
import { AuthConfig } from '@ui-coe/shared/util/auth';

@Injectable({
  providedIn: 'root',
})
export class ShellConfigService {
  mfeManifest: any;
  shellConfig: any;
  cmsUrl: any;
  authConfig: AuthConfig;

  constructor(private http: HttpClient) {}

  getMfeManifest(key: string): string {
    return this.mfeManifest ? this.mfeManifest[key] : '';
  }

  get(key: string): string {
    return this.shellConfig ? this.shellConfig[key] : '';
  }

  loadShellConfig(): Observable<any> {
    return from(
      this.http
        .get('/assets/config/app.config.json')
        .toPromise()
        .then(config => {
          this.shellConfig = config;
          this.cmsUrl = this.shellConfig['cmsUrl'] ? this.shellConfig['cmsUrl'] : '';
          return true;
        })
    );
  }

  loadRoutes(isLocal = false): Promise<any> {
    return fetch(
      isLocal
        ? '/assets/manifest/module-federation.manifest.json'
        : this.shellConfig['cmsUrl'] + '/home'
    )
      .then(res => {
        // Handle Error Scenarios
        if (!res.ok) {
          // If we get an error fetching the data use the local manifest
          if (isLocal === false) {
            return this.loadRoutes(true);
          } else {
            throw Error(res.statusText);
          }
        } else {
          return res.json();
        }
      })
      .then(res => (isLocal ? res : res?.data?.attributes?.data?.manifestData))
      .then(config => {
        // Reload the Remote Defination and return the config only when there is a valid data.
        // In case of empty config object check if we previously had a valid mfemanifest and use that.
        if (config) {
          this.mfeManifest = config;
          setRemoteDefinitions(config);
          return config;
        } else if (this.mfeManifest) {
          return this.mfeManifest;
        }
      });
  }
}
