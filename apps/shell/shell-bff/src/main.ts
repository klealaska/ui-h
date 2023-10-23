/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import appInsights = require('applicationinsights');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  const port = process.env.PORT || 3333;
  const appInsightsConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

  if (appInsightsConnectionString?.length > 0) {
    appInsights
      .setup(appInsightsConnectionString)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(true)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
      .setAutoDependencyCorrelation(true);

    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] =
      'shell-bff';
  }

  try {
    await app.listen(port);
  } catch (exception) {
    appInsights.defaultClient.trackException({ exception });

    appInsights.defaultClient.flush({
      isAppCrashing: false,
    });
  }

  appInsights.start();
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
