import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { map, Observable, of } from 'rxjs';

import { IGetTenant, ITenantMapped, SortDirection, SortLabels } from '@ui-coe/tenant/shared/types';

import { TenantService } from '../services';

@Injectable({ providedIn: 'root' })
export class SiteNameValidator implements AsyncValidator {
  constructor(private tenantService: TenantService) {}

  private _originalValue: string = '';

  validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
    /**
     * if the control is focused, but the text has not changed
     * we don't want to show an error.
     * we also record the original value to use in the next check
     */
    if (control.pristine) {
      this._originalValue = control.value;
      return of(null);
    }

    /**
     * if the user types something in the control, but then reverts the text
     * back to the original value,
     * we don't want to show an error. we just want the submit button to still
     * be disabled
     */
    if (this._originalValue.toLowerCase() === control.value.toLowerCase()) {
      return of(null);
    }

    return this.tenantService
      .getTenantData({
        siteName: control.value,
        sortBy: `${SortDirection.ASCENDING}:${SortLabels.SITE_NAME}`,
        limit: 1,
      })
      .pipe(
        map((res: IGetTenant<ITenantMapped>) => {
          /**
           * since we're only getting zero or one result back in `items`,
           * we can check it directly instead of iterating
           */
          const siteNameExists =
            res.items[0]?.siteName.toLowerCase() === control.value.toLowerCase();

          return siteNameExists ? { siteNameExists: true } : null;
        })
      );
  }
}
