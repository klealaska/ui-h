import { Injectable } from '@angular/core';
import * as fullStory from '@fullstory/browser';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class FullStoryService {
  init(): void {
    if (environment.macroEnvGroup.toLowerCase() === 'prod') {
      fullStory.init({ orgId: environment.fullStory.orgId, devMode: !environment.production });
    }
  }
  identify(username: string, displayName: string, email: string): void {
    if (environment.macroEnvGroup.toLowerCase() === 'prod') {
      fullStory.identify(username, {
        displayName,
        email,
      });
    }
  }
}
