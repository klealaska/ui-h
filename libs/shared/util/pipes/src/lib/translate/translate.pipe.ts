import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'axTranslate',
  pure: false,
  standalone: true,
})
export class AxTranslatePipe extends TranslatePipe implements PipeTransform {
  readonly _translateService: TranslateService;
  constructor(translate: TranslateService, _ref: ChangeDetectorRef) {
    super(translate, _ref);
    this._translateService = translate;
  }

  override transform(query: any, ...args: any[]) {
    return this.ngxObjectInterpolation(super.transform(query, args), args ? args[0] : '');
  }

  ngxObjectInterpolation(translationObject: any, interpolationObject): any {
    switch (typeof translationObject) {
      case 'object':
        return Object.fromEntries(
          Object.entries(translationObject).map(([key, value]) => [
            key,
            this.ngxObjectInterpolation(value, interpolationObject),
          ])
        );
      case 'string':
        return this._translateService.parser.interpolate(translationObject, interpolationObject);
      default:
        return translationObject;
    }
  }
}
