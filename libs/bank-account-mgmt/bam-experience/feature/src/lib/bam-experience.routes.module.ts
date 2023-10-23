import { RouterModule, Routes } from '@angular/router';
import { BamExperienceComponent } from './bam-experience.component';
import { NgModule } from '@angular/core';
import { POP_LIST } from '@ui-coe/bank-account-mgmt/shared/types';

const routes: Routes = [
  {
    path: '',
    component: BamExperienceComponent,
    children: [
      {
        path: POP_LIST,
        loadChildren: () =>
          import('@ui-coe/bank-account-mgmt/pop-list/feature').then(
            m => m.BankAccountMgmtPopListFeatureModule
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BamExperienceRoutingModule {}
