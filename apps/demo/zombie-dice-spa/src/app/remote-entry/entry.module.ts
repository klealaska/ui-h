import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedUiModule } from '@ui-coe/shared/ui';
import { DemoSharedDataAccessModule } from '@ui-coe/demo/shared/data-access';
import { DemoRoutes } from '@ui-coe/demo/shared/util';
import { AppGuard } from '@ui-coe/shared/util/guards';

const routes: Routes = [
  {
    path: '',
    component: RemoteEntryComponent,

    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: DemoRoutes.MENU,
      },
      {
        path: DemoRoutes.MENU,
        canMatch: [AppGuard],
        data: { app: 'demo-zombie-dice-spa' },
        loadChildren: () => import('@ui-coe/demo/menu/feature').then(m => m.DemoMenuFeatureModule),
      },
      {
        path: DemoRoutes.GAME,
        loadChildren: () => import('@ui-coe/demo/game/feature').then(m => m.DemoGameFeatureModule),
      },
    ],
  },
];

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    SharedUiModule,
    DemoSharedDataAccessModule,
  ],
  providers: [
    AppGuard,
    // {
    //   provide: ENVIRONMENT_INITIALIZER,
    //   multi: true,
    //   deps: [ConfigService],
    //   useFactory: (configService: ConfigService) => async (): Promise<void> =>
    //     await configService.loadAppConfig(
    //       (await configService.getMfeManifest('demo-zombie-dice-spa')) +
    //         '/assets/config/app.config.json'
    //     ),
    // },
  ],
})
export class RemoteEntryModule {}
