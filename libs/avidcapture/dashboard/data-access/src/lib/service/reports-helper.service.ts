import { Injectable } from '@angular/core';
import { ToastService } from '@ui-coe/avidcapture/core/util';

@Injectable({
  providedIn: 'root',
})
export class ReportHelperService {
  constructor(private toast: ToastService) {}

  handleNoReportsFound(reportName: string): void {
    this.toast.error(`No invoices found for ${reportName}`);
  }
}
