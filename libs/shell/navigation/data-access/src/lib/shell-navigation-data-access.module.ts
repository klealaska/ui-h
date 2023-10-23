/**
 * @file This file was generated by ax-lib generator.
 * @copyright AvidXchange Inc.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import * as fromAuth from './+state/auth/auth.reducer';
import { AuthFacade } from './+state/auth/auth.facade';
import * as fromShell from './+state/shell/shell.reducer';
import { ShellFacade } from './+state/shell/shell.facade';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule.forFeature(fromAuth.AUTH_FEATURE_KEY, fromAuth.authReducer),
    StoreModule.forFeature(fromShell.SHELL_FEATURE_KEY, fromShell.shellReducer),
  ],
  providers: [AuthService, AuthFacade, ShellFacade],
})
export class ShellNavigationDataAccessModule {}
