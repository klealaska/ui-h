import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChevronItem, Connector, Customer, Operation, Platform, Registration } from '../../models';
import { OperationState } from '../../operation-details/operation.state';
import { AvidPage } from '../enums';
import { CoreState } from '../state/core.state';

@Injectable({
  providedIn: 'root',
})
export class NavigationChevronService {
  constructor(private store: Store) {}

  getNavigationChevron(page: AvidPage): ChevronItem[] {
    const customer = this.store.selectSnapshot<Customer>(CoreState.customer);
    const platform = this.store.selectSnapshot<Platform>(CoreState.platform);
    const registration = this.store.selectSnapshot<Registration>(CoreState.registration);
    const connector = this.store.selectSnapshot<Connector>(CoreState.connector);
    const operation = this.store.selectSnapshot<Operation>(OperationState.operation);

    const baseNavigation: ChevronItem[] = [
      { title: platform?.name, tooltip: 'Platform' },
      { title: customer?.name, url: '/customer-dashboard/activity' },
    ];

    switch (page) {
      case AvidPage.CustomerRecentActivity:
        return [
          { title: platform.name, tooltip: 'Platform' },
          { title: customer.name },
          { title: 'Recent Activity' },
        ];
      case AvidPage.CustomerConnectors:
        return [...baseNavigation, { title: 'Connectors' }];
      case AvidPage.CustomerDataSelection:
        return customer && registration
          ? [
              ...baseNavigation,
              {
                title: 'Data Selections',
              },
              { title: registration.description, tooltip: 'Accounting system' },
            ]
          : [];
      case AvidPage.CustomerScheduleSync:
        return customer && registration
          ? [
              ...baseNavigation,
              {
                title: 'Schedule Sync',
              },
              { title: registration.description, tooltip: 'Accounting system' },
            ]
          : [];
      case AvidPage.CustomerSync:
        return customer && registration
          ? [
              ...baseNavigation,
              {
                title: 'Sync Now',
              },
              { title: registration.description, tooltip: 'Accounting system' },
            ]
          : [];
      case AvidPage.CustomerSettings:
        return customer && registration && connector
          ? [
              ...baseNavigation,
              {
                title: 'Settings',
              },
              {
                title: registration.description,
                tooltip: 'Accounting system',
              },
            ]
          : customer && connector
          ? [
              ...baseNavigation,
              {
                title: 'Settings',
              },
              {
                title: connector.displayName,
                tooltip: 'Platform Connector',
              },
            ]
          : [];
      case AvidPage.OperationDetails:
        return customer && registration
          ? [
              ...baseNavigation,
              {
                title: 'Operation Details',
              },
              {
                title: operation.registrationDescription,
                tooltip: 'Accounting system',
              },
              {
                title: operation.id.toString(),
                tooltip: 'Operation ID',
              },
            ]
          : [];
      default:
        return [];
    }
  }
}
