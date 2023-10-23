import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { translations } from './mock.translate';

export class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}
