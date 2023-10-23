import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  Connector,
  Customer,
  OrganizationOption,
  OrganizationAccountingSystem,
  Platform,
} from '../../../../models';
import { Observable } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime, finalize } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';
import * as catalogsActions from '../../../../core/actions/catalogs.actions';
import * as portalDashboardActions from '../../../../portal-dashboard/portal-dashboard.actions';
import * as customerDashboardActions from '../../../../customer-dashboard/customer-dashboard.actions';
import { CatalogsState } from '../../../../core/state/catalogs.state';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { CoreState } from '../../../../core/state/core.state';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'avc-add-registration',
  templateUrl: './add-registration.component.html',
  styleUrls: ['./add-registration.component.scss'],
})
//todo review and clean up subscriptions
export class AddRegistrationComponent implements OnInit {
  @Select(CatalogsState.organizationOptions) organizationOptions$: Observable<OrganizationOption[]>;
  @Select(CatalogsState.platforms) platforms$: Observable<Platform[]>;
  @Select(CatalogsState.connectorLookup) connectorLookup$: Observable<Connector[]>;
  @Select(CatalogsState.organizationAccountingSystems) organizationAccountingSystems$: Observable<
    OrganizationAccountingSystem[]
  >;
  @Select(CoreState.customerId) customerId$: Observable<number>;

  registrationForm: UntypedFormGroup;
  isOrganizationSelected = false;
  isConnectorSelected = false;
  isLoadingForm = false;
  selectedPlatform = 1;
  customerId: number;

  constructor(
    private dialogRef: MatDialogRef<AddRegistrationComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      customer: Customer;
    },
    private router: Router,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      platform: [this.selectedPlatform, Validators.required],
      customer: ['', [Validators.required]],
      registration: ['', Validators.required],
      connector: ['', Validators.required],
    });

    this.registrationForm
      .get('customer')
      .valueChanges.pipe(debounceTime(700))
      .subscribe(name => {
        if (typeof name === 'string') {
          this.isLoadingForm = true;
          this.store
            .dispatch(new catalogsActions.QueryPlatformOrganizations(name))
            .subscribe(() => (this.isLoadingForm = false));
        }
      });

    this.registrationForm
      .get('connector')
      .valueChanges.pipe(debounceTime(700))
      .subscribe(name => {
        const platformId = this.registrationForm.get('platform').value;
        if (typeof name === 'string') {
          this.store.dispatch(new catalogsActions.QueryConnectorsLookup(name, platformId));
        }
      });

    if (this.data?.customer) {
      this.customerId = this.data.customer.id;
      this.registrationForm.get('customer').setValue({});
      this.getOrganizationAccountingSystems(this.data.customer.externalKey);
    } else {
      this.getPlatformOrganizations();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onPlatformSelected(event: MatOptionSelectionChange): void {
    const platformId = event.source.value;
    this.store.dispatch(new catalogsActions.QueryConnectorsLookup('', platformId));
  }

  onOrganizationSelected(event: MatAutocompleteSelectedEvent): void {
    this.getOrganizationAccountingSystems(event.option.value.id);
  }

  displayAutocompleteFn(organization: OrganizationOption): string {
    return organization && organization.displayName;
  }

  displayConnectorAutocompleteFn(connector: Connector): string {
    return connector && `${connector.displayName} - (${connector.id})`;
  }

  clearCustomerInformation(): void {
    this.registrationForm.get('customer').reset();
    this.registrationForm.get('registration').reset();
    this.isOrganizationSelected = false;
    this.store.dispatch(new catalogsActions.ClearOrganizationAccountingSystems());
  }

  submitRegistrationForm(): void {
    if (this.registrationForm.valid) {
      this.isLoadingForm = true;
      if (this.data?.customer) {
        this.postRegistration()
          .pipe(finalize(() => (this.isLoadingForm = false)))
          .subscribe({
            next: this.onRegistrationCreated.bind(this),
            error: console.log,
          });
      } else {
        this.addCustomer();
      }
    }
  }

  private addCustomer(): void {
    const customer: Customer = {
      externalKey: this.registrationForm.get('customer').value.id,
      name: this.registrationForm.get('customer').value.name,
      platformId: this.registrationForm.get('platform').value,
      isActive: true,
    };

    this.store
      .dispatch(new portalDashboardActions.PostCustomer(customer))
      .pipe(finalize(() => (this.isLoadingForm = false)))
      .subscribe({
        next: this.addCustomerRegistration.bind(this),
        error: console.log,
      });
  }

  private addCustomerRegistration(): void {
    this.customerId = this.store.selectSnapshot<number>(CoreState.customerId);
    this.postRegistration();
    this.router.navigate(['customer-dashboard/connectors']);
    this.close();
  }

  private getOrganizationAccountingSystems(orgId: string): void {
    this.isOrganizationSelected = true;
    this.store.dispatch(
      new catalogsActions.QueryOrganizationAccountingSystems(orgId, this.selectedPlatform)
    );
  }

  private getUserName(): string {
    return this.store.selectSnapshot<string>(CoreState.userAccountName);
  }

  private postRegistration(): Observable<any> {
    const userName = this.getUserName();
    const registration = {
      externalKey: this.registrationForm.get('registration').value.id,
      description: this.registrationForm.get('registration').value.name,
      connectorId: this.registrationForm.get('connector').value.id,
      isActive: true,
      modifiedBy: userName,
      createdBy: userName,
    };

    this.isLoadingForm = true;
    return this.store.dispatch(
      new portalDashboardActions.PostRegistration(this.customerId, registration)
    );
  }

  private onRegistrationCreated(): void {
    this.close();
    this.store.dispatch(new customerDashboardActions.QueryRegistrations(this.customerId));
  }

  private getPlatformOrganizations(): void {
    this.isLoadingForm = true;
    this.store
      .dispatch(
        new catalogsActions.GetPlatformOrganizations(this.registrationForm.get('platform').value)
      )
      .subscribe(() => (this.isLoadingForm = false));
  }
}
