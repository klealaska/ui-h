import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPaymentDetail, IPaymentListTableView } from '@ui-coe/pay-transformation/shared/types';

@Component({
  selector: 'ui-coe-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent {
  @Input() public view!: IPaymentListTableView;
  @Input() public payments: IPaymentDetail[];
  @Output() public viewPaymentDetails: EventEmitter<string> = new EventEmitter<string>();

  public displayedColumns: string[] = ['vendorId', 'date', 'amount', 'id', 'status'];

  public onViewPaymentDetails(row: IPaymentDetail): void {
    this.viewPaymentDetails.emit(row.id);
  }
}
