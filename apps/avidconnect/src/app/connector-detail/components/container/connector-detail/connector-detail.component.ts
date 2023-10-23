import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { CoreState } from '../../../../core/state/core.state';
import { ConnectorDetailState } from '../../../connector-detail.state';
import { Observable } from 'rxjs';
import { Customer, Operation } from '../../../../models';
import * as actions from '../../../connector-detail.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'avc-global-connectors',
  templateUrl: './connector-detail.component.html',
  styleUrls: ['./connector-detail.component.scss'],
})
export class ConnectorDetailComponent implements OnInit, OnDestroy {
  @Select(ConnectorDetailState.operations) operations$: Observable<Operation[]>;
  @Select(ConnectorDetailState.customers) customers$: Observable<Customer[]>;
  @Select(ConnectorDetailState.isLoadingCustomers) isLoadingCustomers$: Observable<boolean>;
  @Select(ConnectorDetailState.isLoadingOperations) isLoadingOperations$: Observable<boolean>;

  connectorId: number;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.connectorId = this.store.selectSnapshot<number>(CoreState.connectorId);
    this.store.dispatch([
      new actions.GetOperations(this.connectorId),
      new actions.GetCustomers(this.connectorId),
    ]);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actions.ClearConnectorDetails());
  }

  customerSelected(customerId: number): void {
    this.store.dispatch(new coreActions.SetCustomerId(customerId));
    this.router.navigate(['/customer-dashboard/activity']);
  }
}
