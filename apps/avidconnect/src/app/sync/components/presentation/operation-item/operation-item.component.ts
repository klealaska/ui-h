import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RegistrationEnablement } from '../../../../models';
import { SyncUploadedFile } from '../../../sync.state';

@Component({
  selector: 'avc-operation-item',
  templateUrl: './operation-item.component.html',
  styleUrls: ['./operation-item.component.scss'],
})
export class OperationItemComponent {
  @Input() enablement: RegistrationEnablement;
  @Input() selectedFile: SyncUploadedFile;
  @Output() checkBoxChanged = new EventEmitter<boolean>();
  @Output() uploadClick = new EventEmitter<RegistrationEnablement>();

  get dataSourceText(): string {
    if (
      this.enablement.operationTypeName !== 'CompanyInvoice' &&
      this.enablement.operationTypeName !== 'GlobalInvoice'
    ) {
      return 'Will be extracted directly from the accounting system';
    } else {
      return 'Will be extracted from AvidXchange';
    }
  }
  disableUpload = true;

  handleCheckboxChange(checked: boolean): void {
    this.checkBoxChanged.emit(checked);
    this.disableUpload = !checked;
  }
}
