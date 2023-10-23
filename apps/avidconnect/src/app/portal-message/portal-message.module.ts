import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalMessageComponent } from './portal-message.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: PortalMessageComponent,
    canActivate: [AdminGuard],
  },
];

@NgModule({
  declarations: [PortalMessageComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PortalMessageModule {}
