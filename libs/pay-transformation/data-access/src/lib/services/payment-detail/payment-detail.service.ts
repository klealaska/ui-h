import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@ui-coe/shared/util/services';
import { Observable, of } from 'rxjs';
import {
  IPaymentDetail,
  IStopPayment,
  PaymentStatus,
} from '@ui-coe/pay-transformation/shared/types';
@Injectable()
export class PaymentDetailService {
  constructor(private _httpClient: HttpClient, private _configService: ConfigService) {}
  private readonly _baseUrl: string = this._configService.get('payApiBaseUrl');

  public getPaymentDetails(id: string): Observable<IPaymentDetail> {
    return this._httpClient.get<IPaymentDetail>(`${this._baseUrl}/payments/${id}`);
  }

  public stopPayment(stopPayment: IStopPayment): Observable<IPaymentDetail> {
    return this._httpClient.post<IPaymentDetail>(
      `${this._baseUrl}/payments/${stopPayment.paymentId}/stop`,
      stopPayment
    );
  }

  // Do we know the endpoint or return data type?
  public cancelPayment(id: string): Observable<IPaymentDetail> {
    console.log('mock cancel hit');
    // return this._httpClient.post<unknown>(`${this._baseUrl}/cancelPayment/${id}`, {});
    return of({
      id: 'TRE7183659',
      amount: 2000,
      date: new Date('2022-08-22T19:19:36.971Z'),
      vendorName: 'JR Plumbing LLC',
      status: 'CANCELLED',
      batchId: '123',
      entityId: '123',
      fundingAccount: '1234567',
      vendorId: '123',
      remitAddress: '1 Canal St., New Orleans, LA 70131',
      lastUpdatedBy: 'jdoe@example.com',
      lastUpdatedOn: new Date('2022-08-22T19:19:36.971Z'),
      distributions: [
        {
          id: '1',
          amount: 5000,
          paymentMethod: 'mask',
          paymentType: '1234 56 7890',
          date: new Date('2022-08-22T19:19:36.971Z'),
          status: PaymentStatus.exampleStatus,
        },
        {
          id: '2',
          amount: 5000,
          paymentMethod: 'standard',
          paymentType: 'APD - Account 5321',
          date: new Date('2022-08-22T19:19:36.971Z'),
          status: PaymentStatus.exampleStatus,
        },
      ],
    });
  }
}
