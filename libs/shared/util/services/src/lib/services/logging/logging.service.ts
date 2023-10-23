import { Injectable } from '@angular/core';
import { ApplicationInsights, ITelemetryItem, Tags } from '@microsoft/applicationinsights-web';
@Injectable()
export class LoggingService {
  appInsights: ApplicationInsights;
  private appTag: string;

  telemetryInitializer = (envelope: any) => {
    if (!envelope || !envelope.baseData) {
      return false;
    }

    if (envelope.baseData['responseCode'] === 0) {
      return false;
    } else {
      const newTags: Tags[] = [];

      Array.isArray(envelope.tags)
        ? newTags.push(...envelope.tags)
        : newTags.push(envelope.tags as unknown as Tags);

      newTags.push({ 'ai.cloud.role': this.appTag }); // TODO: make tag name dynamic

      envelope.tags = newTags;
      return true;
    }
  };

  /**
   * Creates and initializes an instance of ApplicationInsights using Instrumentation key from config file
   */
  init(appTag: string, instrumentationKey: string) {
    if (!instrumentationKey) {
      console.error(
        'No instrumentation key was provided. Logging has not been activated for ',
        appTag
      );
      return;
    }

    this.appTag = appTag;

    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: instrumentationKey,
        enableAutoRouteTracking: true,
        enableCorsCorrelation: false,
      },
    });

    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
    this.appInsights.addTelemetryInitializer(this.telemetryInitializer);
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    this.appInsights.trackEvent({ name: name }, properties);
  }

  logException(exception: Error) {
    console.error('Error: ', exception);
    this.appInsights.trackException({ exception: exception });
  }
}
