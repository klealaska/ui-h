// loader/customTranslate.loader.ts
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { ConfigService, FeatureFlagService } from '@ui-coe/shared/util/services';
import { Inject, Injectable } from '@angular/core';
import { ContentFacade } from '../+state/content.facade';
import { ContentEntity } from '../+state/content.models';

interface Environment {
  cmsFeatureFlag: string;
  cmsProductId: string;
  baseUrl: string;
  featureFlagUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private httpClient: HttpClient,
    private featureFlagService: FeatureFlagService,
    private configService: ConfigService,
    private contentFacade: ContentFacade,
    @Inject('environment') private environment: Environment
  ) {}

  /**
   *
   * @param _lang
   * @returns
   * @description This function gets invoked when the Translate module is injected in the
   * app module. It checks if there is a feature flag set to fetch the content
   * from CMS , if yes then it calls the content service else it loads up the local json content file
   */

  getTranslation(_lang: string): Observable<any> {
    const cmsFeatureFlag =
      this.configService.get('cmsFeatureFlag') || this.environment.cmsFeatureFlag;
    const featureFlagUrl =
      this.configService.get('featureFlagUrl') || this.environment.featureFlagUrl;
    const cmsProductId = this.configService.get('cmsProductId') || this.environment.cmsProductId;
    const baseUrl = this.configService.get('baseUrl') || this.environment.baseUrl;

    return this.featureFlagService.getFlag(cmsFeatureFlag, featureFlagUrl).pipe(
      switchMap(featureFlagData => {
        if (featureFlagData[cmsFeatureFlag]) {
          return combineLatest([
            this.contentFacade.isContentLoaded(),
            this.contentFacade.getContentById(cmsProductId),
          ]).pipe(
            filter(this.isContentLoadedAndDefined),
            map(([, content]) => content?.attributes?.data)
          );
        } else {
          if (baseUrl) {
            return this.httpClient.get(`${baseUrl}/assets/i18n/${_lang}.json`);
          } else {
            return this.httpClient.get(`/assets/i18n/${_lang}.json`);
          }
        }
      })
    );
  }

  private isContentLoadedAndDefined([isContentLoaded, content]: [boolean, ContentEntity]): boolean {
    return isContentLoaded && content != undefined;
  }
}
