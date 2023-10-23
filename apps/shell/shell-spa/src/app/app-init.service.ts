import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { AppName, AuthConfig, TokenGuard } from '@ui-coe/shell/navigation/data-access';
import { ShellNavigationFeatureContainerComponent } from '@ui-coe/shell/navigation/feature';
import { environment } from '../environments/environment';
import { AppGuard } from '@ui-coe/shared/util/guards';

const authConfig: AuthConfig = {
  avidAuthBaseUrl: environment.authBaseUrl,
  avidAuthLoginUrl: environment.avidAuthUrl,
  appName: AppName.Shell,
  redirectUrl: window.location.origin + '/login/callback',
};

@Injectable()
export class AppInitService {
  constructor(private router: Router) {}

  init(manifest = {}): Promise<Routes> {
    const childRoutes: Routes = [];
    for (const [k, v] of Object.entries(manifest)) {
      childRoutes.push({
        path: k,
        canMatch: [TokenGuard],
        data: authConfig,
        loadChildren: () => loadRemoteModule(k, './Module').then(m => m.RemoteEntryModule),
      });
    }

    return new Promise<any>(resolve => {
      const routes = this.router.config;
      routes.push({
        path: '',
        canMatch: [TokenGuard],
        data: authConfig,
        component: ShellNavigationFeatureContainerComponent,

        children: [
          {
            path: '',
            canMatch: [TokenGuard],
            data: authConfig,
            loadChildren: () =>
              import('@ui-coe/shell/navigation/feature').then(m => m.ShellNavigationFeatureModule),
          },
          ...childRoutes,
        ],
      });
      this.router.resetConfig(routes);
      resolve(routes);
    });
  }
}
