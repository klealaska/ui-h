import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ConnectorItem, Customer, Platform, Registration } from '../../../../models';
import { CustomerDashboardState } from '../../../customer-dashboard.state';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddRegistrationComponent } from '../../../../shared/components/modals/add-registration/add-registration.component';
import { CoreState } from '../../../../core/state/core.state';
import * as actions from '../../../customer-dashboard.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { Router } from '@angular/router';
import { AvidPage } from '../../../../core/enums';

@Component({
  selector: 'avc-customer-connectors',
  templateUrl: './customer-connectors.component.html',
  styleUrls: ['./customer-connectors.component.scss'],
})
export class CustomerConnectorsComponent implements OnInit, OnDestroy {
  @Select(CustomerDashboardState.registrations) registrations$: Observable<Registration[]>;
  @Select(CustomerDashboardState.isLoadingRegistrations) isLoadingRegistrations$: Observable<
    Registration[]
  >;

  customer: Customer;
  connectors: ConnectorItem[];
  subscription: Subscription;

  constructor(private store: Store, private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    this.customer = this.store.selectSnapshot<Customer>(CoreState.customer);
    this.store.dispatch([
      new actions.QueryRegistrations(this.customer.id),
      new coreActions.GetNavigationChevron(AvidPage.CustomerConnectors),
    ]);

    this.subscription = this.registrations$.subscribe(registrations => {
      this.getRegistrationsConnectors(registrations);
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actions.ClearRegistrations());
    this.subscription.unsubscribe();
  }

  openNewRegistrationModal(): void {
    this.dialog.open(AddRegistrationComponent, {
      data: {
        customer: this.store.selectSnapshot<Customer>(CoreState.customer),
      },
    });
  }

  getCustomerSettings(): void {
    const platform = this.store.selectSnapshot<Platform>(CoreState.platform);
    this.store.dispatch([
      new coreActions.SetConnectorId(platform.connectorId),
      new coreActions.ClearRegistration(),
    ]);

    this.router.navigate(['/customer-dashboard/connectors/settings']);
  }

  private getRegistrationsConnectors(registrations: Registration[]): void {
    const activeConnectors = registrations.filter(
      registration => registration.isActive && registration.connector?.isActive
    );
    this.connectors = activeConnectors.reduce((acc, registration) => {
      const connector: ConnectorItem = acc.find(item => item.id === registration.connectorId);

      if (connector) {
        connector.registrations.push(registration);
      } else {
        acc.push({
          name: registration.connectorName,
          id: registration.connectorId,
          description: registration.description,
          registrations: [registration],
          ...registration.connector,
        });
      }

      return acc;
    }, []);
  }
}
