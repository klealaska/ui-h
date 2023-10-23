import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Environment } from '@ui-coe/avidcapture/shared/types';
import { AuthService } from '@ui-coe/shared/util/auth';
import jwt_decode from 'jwt-decode';
import { filter, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  appInsights: ApplicationInsights;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject('environment') private environment: Environment
  ) {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: this.environment.appInsights.instrumentationKey,
        enableAutoRouteTracking: true,
      },
    });
    this.appInsights.loadAppInsights();
    this.excludeUrls();
    this.createRouterSubscription();
  }

  logPageView(name?: string, url?: string): void {
    const userProperties = this.getUserProperties();

    this.appInsights.context.telemetryTrace.name = `${name} - ${userProperties.username}`;

    this.appInsights.trackPageView({
      name,
      uri: url,
      properties: userProperties,
    });
  }

  logEvent(name: string, properties?: { [key: string]: any }): void {
    this.appInsights.trackEvent({ name }, { ...properties, ...this.getUserProperties() });
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }): void {
    this.appInsights.trackMetric({ name, average }, properties);
  }

  logException(exception: Error, severityLevel?: number): void {
    this.appInsights.trackException({
      exception,
      severityLevel,
      properties: this.getUserProperties(),
    });
  }

  logTrace(message: string, properties?: { [key: string]: any }): void {
    this.appInsights.trackTrace({ message }, properties);
  }

  private createRouterSubscription(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => {
          this.logPageView(this.router.url, event.url);
        })
      )
      .subscribe();
  }

  private getUserProperties(): { [key: string]: any } {
    const token = this.authService.getAccessToken();
    return {
      username: this.authService.getUserInfo()?.preferred_username,
      bearerToken: token ? jwt_decode(token) : 'No Access Token',
    };
  }

  private excludeUrls(): void {
    const excludedNames: string[] = ['chameleon', 'fullstory'];
    const excludedResultCodes: string[] = ['401', '404', '406'];

    this.appInsights.addTelemetryInitializer(envelope => {
      if (
        envelope?.baseData?.name?.includes(excludedNames) ||
        envelope?.baseData?.resultCode?.includes(excludedResultCodes)
      ) {
        return;
      }
    });
  }
}
