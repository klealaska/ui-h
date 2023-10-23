import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy } from '@angular/router';
import { AvidPartners, Cookie } from '@ui-coe/avidcapture/shared/types';

import { CookieService } from '../services/cookie.service';

@Injectable({ providedIn: 'root' })
export class TitlePageStrategy extends TitleStrategy {
  constructor(private readonly title: Title, private cookieService: CookieService) {
    super();
  }

  override updateTitle(): void {
    if (this.cookieService.getCookie(Cookie.AvidPartner) !== AvidPartners.AvidXChange) {
      this.title.setTitle(`Powered by AvidXchange\u2122`);
    }
  }
}
