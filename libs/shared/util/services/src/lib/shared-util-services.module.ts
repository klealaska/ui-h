import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ErrorHandlerService,
  FeatureFlagService,
  LoggingService,
  ShellConfigService,
  ToggleService,
} from './services';

@NgModule({
  imports: [CommonModule],
  providers: [
    ShellConfigService,
    FeatureFlagService,
    LoggingService,
    ToggleService,
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
  ],
})
export class SharedUtilServicesModule {}
