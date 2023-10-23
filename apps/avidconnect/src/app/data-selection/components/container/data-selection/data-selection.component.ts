import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Registration, RegistrationEnablement } from '../../../../models';
import { Observable } from 'rxjs';
import * as actions from '../../../data-selection.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { DataSelectionState } from '../../../data-selection.state';
import { CoreState } from '../../../../core/state/core.state';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AvidPage } from '../../../../core/enums';

@Component({
  selector: 'avc-data-selection',
  templateUrl: './data-selection.component.html',
  styleUrls: ['./data-selection.component.scss'],
})
export class DataSelectionComponent implements OnInit, OnDestroy {
  @Select(DataSelectionState.registrationEnablements) registrationEnablements$: Observable<
    RegistrationEnablement[]
  >;
  @Select(DataSelectionState.isLoading) isLoading$: Observable<boolean>;

  registration: Registration;
  isOperationSelected: boolean;
  isValid: boolean;

  constructor(private store: Store, private http: HttpClient) {}

  ngOnInit(): void {
    this.store.dispatch([
      new actions.GetOperationTypes(),
      new coreActions.GetNavigationChevron(AvidPage.CustomerDataSelection),
    ]);
    this.registration = this.store.selectSnapshot<Registration>(CoreState.registration);
    this.registrationEnablements$.subscribe(() => this.validateSelectedData());
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actions.ClearDataSelection());
  }

  saveChanges(): void {
    if (this.isOperationSelected) {
      window.history.back();
    } else {
      this.isOperationSelected = true;
      this.store.dispatch(new actions.SaveRegistrationEnablements());
    }
  }

  cancelChanges(): void {
    this.isOperationSelected ? (this.isOperationSelected = false) : window.history.back();
  }

  enablementChanged(enablement: RegistrationEnablement): void {
    this.store.dispatch(new actions.UpdateRegistrationEnablement(enablement));
    this.validateSelectedData();
  }

  fileUploaded({ file, operationTypeId }): void {
    this.store.dispatch(new actions.PostMappingFile(operationTypeId, file));
  }

  downloadFile(enablement: RegistrationEnablement): void {
    this.http
      .get<any>(enablement.registrationEnablementUrl, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        responseType: 'application/json' as any,
      })
      .subscribe(data => {
        const bb = new Blob([data], { type: 'text/plain' });
        const dlAnchorElem: HTMLAnchorElement = document.createElement('a');
        dlAnchorElem.setAttribute('href', window.URL.createObjectURL(bb));
        dlAnchorElem.setAttribute('download', `${enablement.operationTypeName}.xslt`);
        dlAnchorElem.click();
      });
  }

  private validateSelectedData(): void {
    const enablements = this.store.selectSnapshot<RegistrationEnablement[]>(
      DataSelectionState.registrationEnablements
    );

    this.isValid = enablements.some(enablement => enablement.isActive);
  }
}
