import { Component, OnInit } from '@angular/core';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { ConfigService } from '@ui-coe/shared/util/services';
import { Settings } from 'luxon';

@Component({
  selector: 'xdc-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private configService: ConfigService, private contentFacade: ContentFacade) {}

  ngOnInit(): void {
    this.contentFacade.initProduct(this.configService.get('cmsProductId'));
  }
}

Settings.defaultZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
Settings.defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale;
