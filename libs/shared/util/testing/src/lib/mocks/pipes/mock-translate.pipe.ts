import { Inject, Pipe, PipeTransform } from '@angular/core';
import { get } from 'lodash';

@Pipe({
  name: 'axTranslate',
  standalone: true,
})
export class AxTranslateMockPipe implements PipeTransform {
  /**
   * @description this is a mocked version of the axTranslate pipe for testing.
   *              you will need to provide a value for the `TRANSLATIONS` injection token within your spec files
   *              that will be the translation values the pipe will receive
   * @param translationsObj the typescript version of your en.json (or other language files)
   */
  constructor(@Inject('TRANSLATIONS') private translationsObj: any) {}

  /**
   * @method transform
   * @description this mocks out the regular transform method in the ngx-translate pipe
   *              and returns the value from the translationsObj at the given path directly
   * @param query string - represents the dot delimited path to the appropriate value in the translationsObj
   * @returns any - the value within the translationsObj at the given path
   */
  public transform(query: string): any {
    return get(this.translationsObj, query);
  }
}
