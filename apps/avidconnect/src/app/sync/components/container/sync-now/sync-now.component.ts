import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CoreState } from '../../../../core/state/core.state';
import { Customer, Execution, Registration, RegistrationEnablement } from '../../../../models';
import * as actions from '../../../sync.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { SyncState, SyncUploadedFile } from '../../../sync.state';
import { AvidPage, ToastStatus } from '../../../../core/enums';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'avc-sync-now',
  templateUrl: './sync-now.component.html',
  styleUrls: ['./sync-now.component.scss'],
})
export class SyncNowComponent implements OnInit {
  @Select(SyncState.activeRegisrtationEnablements) registrationEnablements$: Observable<
    RegistrationEnablement[]
  >;
  @Select(SyncState.isLoading) isLoading$: Observable<boolean>;
  @Select(SyncState.operations) operations$: Observable<string[]>;
  @Select(SyncState.uploadedFiles) uploadedFiles$: Observable<{
    [key: string]: SyncUploadedFile;
  }>;

  isPreview = false;
  registration: Registration;
  operations: { operationTypeId: number; operationTypeName: string }[] = [];
  operationTypesNotAllowedPreview = ['CompanyInvoice'];

  constructor(private store: Store, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    const customer: Customer = this.store.selectSnapshot(CoreState.customer);
    if (!customer) {
      const customerId: number = this.store.selectSnapshot(CoreState.customerId);
      this.store.dispatch(new coreActions.GetCustomer(customerId));
    }

    this.store.dispatch([
      new actions.GetRegistrationEnablements(),
      new coreActions.GetNavigationChevron(AvidPage.CustomerSync),
    ]);
    this.registration = this.store.selectSnapshot<Registration>(CoreState.registration);
  }

  checkBoxChanged(checked: boolean, enablement: RegistrationEnablement): void {
    if (checked) {
      if (this.verifySelectedOperationCanPreview(enablement.operationTypeName) && this.isPreview) {
        this.toast.open('Invoice sync is not allowed in preview mode', ToastStatus.Warning);
        this.isPreview = false;
      }

      if (enablement.isApibased) {
        this.store.dispatch(new actions.AddOperation(enablement.operationTypeName));
      }
    } else {
      this.store.dispatch(new actions.RemoveOperation(enablement.operationTypeName));
    }
  }

  onIsPreviewClick(event: any) {
    const operations = this.store.selectSnapshot(SyncState.operations);

    operations.forEach(operation => {
      if (this.verifySelectedOperationCanPreview(operation)) {
        event.preventDefault();
        this.toast.open('Invoice sync is not allowed in preview mode', ToastStatus.Warning);
        this.isPreview = false;
      }
    });
  }

  verifySelectedOperationCanPreview(operationTypeName: string): boolean {
    return this.operationTypesNotAllowedPreview.includes(operationTypeName);
  }

  syncOperations(): void {
    const uploadedFiles = this.store.selectSnapshot(SyncState.uploadedFiles);
    const operations = this.store.selectSnapshot(SyncState.operations);
    const platform = this.store.selectSnapshot(CoreState.platform);
    const customer = this.store.selectSnapshot(CoreState.customer);
    const registration = this.store.selectSnapshot(CoreState.registration);
    const userAccountName = this.store.selectSnapshot(CoreState.userAccountName);

    const execution: Execution = {
      origin: 'ac-portal-sync-now',
      isPreview: this.isPreview,
      createdBy: userAccountName,
      platformKey: platform?.externalKey,
      customerKey: customer?.externalKey,
      registrationKey: registration?.externalKey,
      operations,
    };

    if (uploadedFiles) {
      const locations = Object.keys(uploadedFiles)
        .filter(operationType => !!uploadedFiles[operationType]?.fileId)
        .map(operationType => ({
          operationType,
          path: `ac-blob://${uploadedFiles[operationType].fileId}`,
        }));

      if (locations?.length) {
        execution.parameters = {
          system: {
            locations,
          },
        };
      }
    }

    this.store
      .dispatch(new actions.PostExecution(execution))
      .subscribe(() => this.router.navigate(['/customer-dashboard/activity']));
  }

  goBack(): void {
    window.history.back();
  }

  uploadFile(file: File, enablement: RegistrationEnablement): void {
    if (file) {
      this.store.dispatch(new actions.PostFileUpload(enablement.operationTypeName, file));
    }
  }

  openFileDialog(enablement: RegistrationEnablement): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .txt';
    input.onchange = () => this.handleFileSelect(input.files, enablement);
    input.click();
  }

  handleFileSelect(files: FileList, enablement: RegistrationEnablement): void {
    if (files?.length) {
      const file = files[0];

      if (this.checkFileSize(file)) {
        this.uploadFile(file, enablement);
      } else {
        this.toast.open('File size is larger than the maximum supported size', ToastStatus.Error);
      }
    }
  }

  checkFileSize(file: File): boolean {
    // max file size 250 MB
    return file.size < 262144000;
  }
}
