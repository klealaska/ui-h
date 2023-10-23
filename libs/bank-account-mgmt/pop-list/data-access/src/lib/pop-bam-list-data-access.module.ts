import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  popBamListEffects,
  popBamListReducers,
  popBamStateListFeatureKey,
} from './pop-bam-state-model';
import { PopBamListFacade } from './+state/bank-account-list';
import { PopBamService } from './services/bank-account.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(popBamStateListFeatureKey, popBamListReducers),
    EffectsModule.forFeature(popBamListEffects),
  ],
  providers: [PopBamService, PopBamListFacade],
})
export class PopBamListDataAccessModule {}
