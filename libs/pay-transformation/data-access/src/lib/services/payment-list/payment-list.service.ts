import { ConfigService } from '@ui-coe/shared/util/services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';
import { Injectable } from '@angular/core';

@Injectable()
export class PaymentListService {
  constructor(private _httpClient: HttpClient, private _configService: ConfigService) {}
  private readonly _baseUrl: string = this._configService.get('payApiBaseUrl');

  public getPayments(vendorName?: string): Observable<IPaymentDetail[]> {
    const query = vendorName ? `?vendorName=${vendorName}` : '';
    return this._httpClient.get<IPaymentDetail[]>(`${this._baseUrl}/payments${query}`);
  }
}
