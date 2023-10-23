import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { AppConfig } from './assets/config/app.config.model';

fetch('/assets/config/app.config.json')
  .then(response => response.json())
  .then((config: AppConfig) => {
    if (config.production) {
      enableProdMode();
    }

    platformBrowserDynamic([{ provide: AppConfig, useValue: config }])
      .bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
