/**
 * @file This file was generated by ax-lib generator.
 * @copyright AvidXchange Inc.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromRoles from './+state/roles/roles.reducer';
import { RolesEffects } from './+state/roles/roles.effects';
@NgModule({
  imports: [
    CommonModule,
    // add your reducer below
    StoreModule.forFeature(fromRoles.rolesFeatureKey, fromRoles.reducer),
    // add your effects below
    EffectsModule.forFeature(RolesEffects),
  ],
})
export class UsrRolesDataAccessModule {}