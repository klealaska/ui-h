import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConnectorService } from '../core/services/connector.service';
import { ExecutionService } from '../core/services/execution.service';
import { OperationService } from '../core/services/operation.service';
import { CoreState } from '../core/state/core.state';
import {
  AvidConnectDataSource,
  Connector,
  ExecutionEvent,
  Operation,
  OperationDetail,
} from '../models';
import * as actions from './operation.actions';
import * as coreActions from '../core/actions/core.actions';
import { AvidPage } from '../core/enums';

export interface OperationStateModel {
  operation: Operation;
  connector: Connector;
  artifacts: string;
  avidAuthLogoutUrl: string;
  executionEvents: ExecutionEvent[];
  details: any[];
  detailsColumns: string[];
}

const defaults: OperationStateModel = {
  operation: null,
  connector: null,
  artifacts: null,
  executionEvents: [],
  details: [],
  detailsColumns: [],
  avidAuthLogoutUrl: '',
};

@State({
  name: 'operation',
  defaults,
})
@Injectable()
export class OperationState {
  constructor(
    private operationService: OperationService,
    private connectorService: ConnectorService,
    private executionService: ExecutionService,
    private store: Store
  ) {}

  @Selector()
  static operation(state: OperationStateModel): Operation {
    return state.operation;
  }

  @Selector()
  static connector(state: OperationStateModel): Connector {
    return state.connector;
  }

  @Selector()
  static artifacts(state: OperationStateModel): string {
    return state.artifacts;
  }

  @Selector()
  static executionEvents(state: OperationStateModel): ExecutionEvent[] {
    return state.executionEvents;
  }

  @Selector()
  static details(state: OperationStateModel): any[] {
    return state.details;
  }

  @Selector()
  static detailsColumns(state: OperationStateModel): string[] {
    return state.detailsColumns;
  }

  @Action(actions.GetOperation)
  getOperation({ patchState, dispatch }: StateContext<OperationStateModel>): Observable<Operation> {
    const customerId = this.store.selectSnapshot(CoreState.customerId);
    const operationId = this.store.selectSnapshot(CoreState.operationId);

    return this.operationService.getById(customerId, operationId).pipe(
      tap(operation => {
        patchState({ operation });
        dispatch([
          new actions.GetConnector(operation.connectorId),
          new actions.GetEvents(customerId, operation.executionId),
          new actions.GetDetails(customerId, operation.id),
          new coreActions.GetNavigationChevron(AvidPage.OperationDetails),
        ]);
      }),
      catchError(err => {
        patchState({ operation: null });
        throw err;
      })
    );
  }

  @Action(actions.GetConnector)
  getConnector(
    { patchState }: StateContext<OperationStateModel>,
    { connectorId }: actions.GetConnector
  ): Observable<Connector> {
    return this.connectorService.getById(connectorId).pipe(
      tap(connector => patchState({ connector })),
      catchError(err => {
        patchState({ connector: null });
        throw err;
      })
    );
  }

  @Action(actions.GetEvents)
  getEvents(
    { patchState }: StateContext<OperationStateModel>,
    { customerId, executionId, isReport }: actions.GetEvents
  ): Observable<AvidConnectDataSource<ExecutionEvent>> {
    return this.executionService.getEvents(customerId, executionId, isReport).pipe(
      tap(response => {
        if (isReport) {
          this.generateCSVFile(response, `Execution ${executionId} Events.csv`);
        } else {
          patchState({ executionEvents: response.items });
        }
      }),
      catchError(err => {
        patchState({ executionEvents: [] });
        throw err;
      })
    );
  }

  @Action(actions.GetArtifacts)
  getArtifacts(
    { patchState }: StateContext<OperationStateModel>,
    { customerId, executionId }: actions.GetArtifacts
  ): Observable<ArrayBuffer> {
    return this.executionService.getArtifacts(customerId, executionId).pipe(
      tap(response => {
        this.generateZipFile(response, `Execution${executionId}Artifact`);
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  @Action(actions.GetDetails)
  getDetails(
    { patchState }: StateContext<OperationStateModel>,
    { customerId, operationId, isReport }: actions.GetDetails
  ): Observable<OperationDetail<any>> {
    return this.operationService.getDetails(customerId, operationId, isReport).pipe(
      tap(response => {
        if (isReport) {
          this.generateCSVFile(response, `Operation ${operationId} Detail.csv`);
        } else {
          const model = response.data?.[0];
          if (model) {
            // define which columns should be the first rendered on dynamic grid
            const firstColumns = ['Status', 'StatusMessage', 'OperationId'];
            patchState({
              detailsColumns: Object.keys(model).sort((x, y) => {
                return firstColumns.includes(x) ? -1 : firstColumns.includes(y) ? 1 : 0;
              }),
            });
          }
          patchState({ details: response.data });
        }
      }),
      catchError(err => {
        patchState({ details: [], detailsColumns: [] });
        throw err;
      })
    );
  }

  @Action(actions.ClearOperation)
  clearRegistrations({ patchState }: StateContext<OperationStateModel>): void {
    patchState({
      operation: null,
      connector: null,
      detailsColumns: [],
      details: [],
      executionEvents: [],
    });
  }

  private generateCSVFile(data: any, fileName: string): void {
    const fileURL = window.URL.createObjectURL(new Blob([data]));
    const fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', fileName);
    document.body.appendChild(fileLink);
    fileLink.click();
    fileLink.remove();
  }

  private generateZipFile(data: any, fileName: string): void {
    const fileURL = window.URL.createObjectURL(new Blob([data], { type: data.type }));
    const fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', fileName);
    document.body.appendChild(fileLink);
    fileLink.click();
    fileLink.remove();
  }
}
