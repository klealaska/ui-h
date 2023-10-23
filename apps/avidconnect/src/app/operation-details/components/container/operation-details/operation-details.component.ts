import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Connector, ExecutionEvent, Operation } from '../../../../models';
import { Observable } from 'rxjs';
import { OperationState } from '../../../operation.state';
import * as actions from '../../../operation.actions';
import { CoreState } from '../../../../core/state/core.state';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'avc-operation-details',
  templateUrl: './operation-details.component.html',
  styleUrls: ['./operation-details.component.scss'],
})
export class OperationDetailsComponent implements OnInit, OnDestroy {
  @Select(OperationState.operation) operation$: Observable<Operation>;
  @Select(OperationState.connector) connector$: Observable<Connector>;
  @Select(OperationState.details) details$: Observable<any[]>;
  @Select(OperationState.detailsColumns) detailsColumns$: Observable<string[]>;
  @Select(OperationState.executionEvents) executionEvents$: Observable<ExecutionEvent[]>;
  @Select(CoreState.platform) platform$: Observable<Operation>;

  @ViewChild('tabGroup') tabGroup: MatTabGroup;

  customerId: number;
  operationId: number;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.customerId = this.store.selectSnapshot<number>(CoreState.customerId);
    this.operationId = this.store.selectSnapshot<number>(CoreState.operationId);

    this.details$.subscribe(() => setTimeout(() => (this.tabGroup.selectedIndex = 0)));

    this.store.dispatch([new actions.GetOperation()]);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new actions.ClearOperation());
  }

  downloadArtifactClicked(executionId: number): void {
    this.store.dispatch(new actions.GetArtifacts(this.customerId, executionId));
  }

  downloadReportClicked(): void {
    this.store.dispatch(new actions.GetDetails(this.customerId, this.operationId, true));
  }

  downloadLogClicked(executionId: number): void {
    this.store.dispatch(new actions.GetEvents(this.customerId, executionId, true));
  }
}
