import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanMatch } from '@angular/router';
import { ConfigService, ShellConfigService, LoggingService } from '@ui-coe/shared/util/services';

@Injectable()
export class AppGuard implements CanMatch {
  constructor(
    private configService: ConfigService,
    private shellConfigService: ShellConfigService,
    private loggingService: LoggingService
  ) {}

  async canMatch(route: ActivatedRouteSnapshot): Promise<boolean> {
    const appKey = route.data.app;

    if (this.configService.currentAppKey !== appKey || this.configService.appConfig === undefined) {
      await this.configService.loadAppConfig(
        this.shellConfigService.getMfeManifest(route.data.app) + '/assets/config/app.config.json',
        appKey
      );
      await this.loggingService.init(
        route.data.app,
        this.configService.get('appInsightsInstrumentationKey')
      );
    }
    return !!this.configService.appConfig;
  }
}
