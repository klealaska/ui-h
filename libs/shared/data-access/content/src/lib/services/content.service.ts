import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ConfigService, ShellConfigService } from '@ui-coe/shared/util/services';
import { Observable } from 'rxjs';
import { AllContentResponse } from '../+state/content.models';

interface Environment {
  cmsFeatureFlag: string;
  cmsProductId: string;
  baseUrl: string;
  cmsUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private shellConfigService: ShellConfigService,
    @Inject('environment') private environment: Environment
  ) {}

  loadShellContent(locale: string): Observable<AllContentResponse> {
    return this.http.get<AllContentResponse>(
      this.shellConfigService.get('cmsUrl') + `all?locale=${locale}`
    );
  }

  loadContent(locale: string): Observable<AllContentResponse> {
    return this.http.get<AllContentResponse>(
      this.configService.cmsUrl
        ? this.configService.cmsUrl + `all?locale=${locale}`
        : this.configService.get('cmsUrl') + `all?locale=${locale}`
    );
  }

  loadContentById(id: string, locale = 'en'): Observable<unknown> {
    const cmsUrl = this.configService.get('cmsUrl') || this.environment.cmsUrl;
    const productId = id || this.environment.cmsProductId;

    return this.http.get(cmsUrl + `products?productId=${productId}&locale=${locale}`);
  }
}
