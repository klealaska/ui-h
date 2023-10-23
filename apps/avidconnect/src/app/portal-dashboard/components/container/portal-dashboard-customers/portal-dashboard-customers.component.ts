import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PortalDashboardState } from '../../../portal-dashboard.state';
import { Customer } from '../../../../models';
import { CatalogsState } from '../../../../core/state/catalogs.state';
import { Platform } from '@angular/cdk/platform';
import * as portalDashboardActions from '../../../portal-dashboard.actions';
import * as coreActions from '../../../../core/actions/core.actions';

@Component({
  selector: 'avc-portal-dashboard-customers',
  templateUrl: './portal-dashboard-customers.component.html',
  styleUrls: ['./portal-dashboard-customers.component.scss'],
})
export class PortalDashboardCustomersComponent implements OnInit {
  searchCustomerText = '';
  showInactive = false;
  @Select(PortalDashboardState.customers) customers$: Observable<Customer[]>;
  @Select(PortalDashboardState.isLoadingCustomers) isLoadingCustomers$: Observable<boolean>;
  @Select(CatalogsState.platforms) platforms$: Observable<Platform[]>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.store.dispatch(new portalDashboardActions.QueryCustomers());
  }

  showInactiveChanged(checked: boolean): void {
    this.showInactive = checked;
  }

  customerSelected(customer: Customer): void {
    this.store.dispatch(new coreActions.SetCustomerId(customer.id));
    console.log('customer selected');
    this.router.navigate(['customer-dashboard/activity']);
  }
}
