import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Customer, Operation } from '../../../../models';
import { Observable } from 'rxjs';
import { CustomerDashboardState } from '../../../customer-dashboard.state';
import { CoreState } from '../../../../core/state/core.state';
import * as actions from '../../../customer-dashboard.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { Router } from '@angular/router';
import { AvidPage } from '../../../../core/enums';

@Component({
  selector: 'avc-recent-activity',
  templateUrl: './recent-activity.component.html',
  styleUrls: ['./recent-activity.component.scss'],
})
export class RecentActivityComponent implements OnInit {
  @Select(CustomerDashboardState.operations) operations$: Observable<Operation[]>;
  @Select(CustomerDashboardState.isLoadingOperations) isLoadingOperations$: Observable<Operation[]>;

  customer: Customer;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.customer = this.store.selectSnapshot<Customer>(CoreState.customer);
    this.store.dispatch([
      new actions.QueryOperations(this.customer.id),
      new coreActions.GetNavigationChevron(AvidPage.CustomerRecentActivity),
    ]);
  }

  syncOperations(): void {
    this.store.dispatch(new actions.QueryOperations(this.customer.id));
  }

  operationSelected(operationId: number): void {
    this.store.dispatch(new coreActions.SetOperationId(operationId));
    this.router.navigate(['operation-details']);
  }
}
