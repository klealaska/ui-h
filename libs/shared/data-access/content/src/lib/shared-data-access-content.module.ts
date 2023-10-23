import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentFacade } from './+state/content.facade';
import { StoreModule } from '@ngrx/store';
import * as fromContent from './+state/content.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ContentEffects } from './+state/content.effects';
import { SharedUtilServicesModule } from '@ui-coe/shared/util/services';
import { CustomTranslateLoader } from './util/translate.loader';
import { ContentService } from './services/content.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromContent.CONTENT_FEATURE_KEY, fromContent.contentReducer),
    EffectsModule.forFeature([ContentEffects]),
    SharedUtilServicesModule,
  ],
  providers: [ContentFacade, CustomTranslateLoader, ContentService],
})
export class SharedDataAccessContentModule {}
