import { map, Observable } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { HttpConfigService } from '../../services/http-config.service';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';
import { MockHttpService } from '@ui-coe/shared/bff/data-access';

@Injectable()
export class PaymentListService {
  constructor(
    private readonly _httpConfigService: HttpConfigService,
    private readonly _mockHttpService: MockHttpService,
    private readonly _httpService: HttpService
  ) {}

  public getPayments(vendorName?: string): Observable<IPaymentDetail[]> {
    return this._httpService
      .get<IPaymentDetail[]>(`${this._httpConfigService.getPayments()}`)
      .pipe(
        map((response: AxiosResponse<IPaymentDetail[]>) =>
          !vendorName
            ? response.data
            : response.data.filter((payment: IPaymentDetail) =>
                payment.vendorName.toUpperCase().replace(/\s/g, '').includes(vendorName)
              )
        )
      );
  }
}
