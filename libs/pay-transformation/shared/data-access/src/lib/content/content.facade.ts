import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IPaymentListFeatureView } from '@ui-coe/pay-transformation/shared/types';

@Injectable()
export class ContentFacade {
  constructor(private readonly _translateService: TranslateService) {}

  public getPaymentListViewContent(): Observable<IPaymentListFeatureView> {
    return this._translateService.get('paymentListFeature');
  }
}
