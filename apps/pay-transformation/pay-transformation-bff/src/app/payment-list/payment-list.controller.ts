import { Controller, Get, Query } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PaymentListService } from './payment-list.service';
import { IPaymentDetail } from '@ui-coe/pay-transformation/shared/types';

@Controller('payments')
export class PaymentListController {
  constructor(private readonly _paymentListService: PaymentListService) {}

  @Get()
  getPayments(@Query('vendorName') vendorName?: string): Observable<IPaymentDetail[]> {
    return this._paymentListService.getPayments(vendorName?.toUpperCase().replace(/\s/g, ''));
  }
}
