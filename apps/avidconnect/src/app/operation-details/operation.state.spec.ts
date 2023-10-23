import { of, throwError } from 'rxjs';
import {
  artifactStub,
  connectorServiceStub,
  connectorStub,
  executionServiceStub,
  executionStub,
  operationServiceStub,
  operationStub,
  stateContextStub,
  storeStub,
} from '../../test/test-stubs';
import { OperationStateModel, OperationState } from './operation.state';
import * as actions from './operation.actions';
import * as coreActions from '../core/actions/core.actions';
import { AvidPage } from '../core/enums';
import DoneCallback = jest.DoneCallback;
describe('OperationState', () => {
  afterEach(() => jest.clearAllMocks());

  describe('Selectors', () => {
    const OperationStateStub: OperationStateModel = {
      operation: operationStub,
      connector: connectorStub,
      artifacts: null,
      executionEvents: [],
      details: [],
      detailsColumns: [],
      avidAuthLogoutUrl: '',
    };

    it('should select operation from state', () =>
      expect(OperationState.operation(OperationStateStub as any)).toBe(
        OperationStateStub.operation
      ));

    it('should select connector from state', () =>
      expect(OperationState.connector(OperationStateStub as any)).toBe(
        OperationStateStub.connector
      ));

    it('should select artifacts from state', () =>
      expect(OperationState.artifacts(OperationStateStub as any)).toBe(
        OperationStateStub.artifacts
      ));

    it('should select executionEvents from state', () =>
      expect(OperationState.executionEvents(OperationStateStub as any)).toBe(
        OperationStateStub.executionEvents
      ));

    it('should select details from state', () =>
      expect(OperationState.details(OperationStateStub as any)).toBe(OperationStateStub.details));

    it('should select detailsColumns from state', () =>
      expect(OperationState.detailsColumns(OperationStateStub as any)).toBe(
        OperationStateStub.detailsColumns
      ));
  });

  const OperationStateStub = new OperationState(
    operationServiceStub as any,
    connectorServiceStub as any,
    executionServiceStub as any,
    storeStub as any
  );

  describe('Action: GetOperation ', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValueOnce(1).mockReturnValueOnce(2);
    });

    describe('when getById returns data', () => {
      beforeEach(() => {
        jest.spyOn(operationServiceStub, 'getById').mockReturnValue(of(operationStub));
        OperationStateStub.getOperation(stateContextStub).subscribe();
      });

      it('should patchState operation with data', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ operation: operationStub });
      });

      it('should dispatch GetConnector, GetEvents, GetDetails, GetNavigationChevron actions', () => {
        expect(stateContextStub.dispatch).toHaveBeenCalledWith([
          new actions.GetConnector(operationStub.connectorId),
          new actions.GetEvents(1, operationStub.executionId),
          new actions.GetDetails(1, operationStub.id),
          new coreActions.GetNavigationChevron(AvidPage.OperationDetails),
        ]);
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest.spyOn(operationServiceStub, 'getById').mockReturnValue(throwError({ error: 'error' }));
        OperationStateStub.getOperation(stateContextStub).subscribe();
      });

      it('should patchState operation with null', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ operation: null });
      });
    });
  });

  describe('Action: GetConnector ', () => {
    describe('when getById returns data', () => {
      beforeEach(() => {
        jest.spyOn(connectorServiceStub, 'getById').mockReturnValue(of(connectorStub));
        OperationStateStub.getConnector(stateContextStub, { connectorId: 1 }).subscribe();
      });

      it('should patchState connector with data', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ connector: connectorStub });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest.spyOn(connectorServiceStub, 'getById').mockReturnValue(throwError({ error: 'error' }));
        OperationStateStub.getConnector(stateContextStub, { connectorId: 1 }).subscribe();
      });

      it('should patchState connector with null', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ connector: null });
      });
    });
  });

  describe('Action: GetArtifacts ', () => {
    describe('when getById returns data', () => {
      beforeEach(() => {
        jest
          .spyOn(executionServiceStub, 'getArtifacts')
          .mockReturnValue(of({ data: artifactStub }));
        window.URL.createObjectURL = jest.fn();
        OperationStateStub.getArtifacts(stateContextStub, {
          customerId: 1,
          executionId: 1,
        }).subscribe();
      });

      it('should return with data', () => {
        expect(window.URL.name).toEqual('URL');
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(executionServiceStub, 'getArtifacts')
          .mockReturnValue(throwError({ error: 'error' }));
        OperationStateStub.getArtifacts(stateContextStub, {
          customerId: 1,
          executionId: 1,
        }).subscribe();
      });

      it('should throw error', () => {
        expect(executionServiceStub).toThrowError;
      });
    });
  });

  describe('Action: GetEvents ', () => {
    describe('when getById returns data', () => {
      describe('when is not a report call', () => {
        beforeEach(() => {
          jest
            .spyOn(executionServiceStub, 'getEvents')
            .mockReturnValue(of({ items: [executionStub] }));
          OperationStateStub.getEvents(stateContextStub, {
            customerId: 1,
            executionId: 1,
          }).subscribe();
        });

        it('should patchState executionEvents with data', () => {
          expect(stateContextStub.patchState).toHaveBeenCalledWith({
            executionEvents: [executionStub],
          });
        });
      });

      describe('when is a report call', () => {
        beforeEach(() => {
          jest
            .spyOn(executionServiceStub, 'getEvents')
            .mockReturnValue(of({ items: [executionStub] }));
          OperationStateStub.getEvents(stateContextStub, {
            customerId: 1,
            executionId: 1,
            isReport: true,
          }).subscribe();
        });

        it('should not patchState executionEvents with data', () => {
          expect(stateContextStub.patchState).not.toHaveBeenCalledWith({
            executionEvents: [executionStub],
          });
        });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(executionServiceStub, 'getEvents')
          .mockReturnValue(throwError({ error: 'error' }));
        OperationStateStub.getEvents(stateContextStub, {
          customerId: 1,
          executionId: 1,
        }).subscribe();
      });

      it('should patchState executionEvents with null', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ executionEvents: [] });
      });
    });
  });

  describe('Action: GetDetails ', () => {
    describe('when getDetails returns data', () => {
      describe('when is not a report call', () => {
        it('should patchState detailsColumns with columns data', (done: DoneCallback) => {
          jest
            .spyOn(operationServiceStub, 'getDetails')
            .mockReturnValue(of({ data: [executionStub] }));
          OperationStateStub.getDetails(stateContextStub, {
            customerId: 1,
            operationId: 1,
          }).subscribe(() => {
            expect(stateContextStub.patchState).toHaveBeenCalledWith({
              detailsColumns: ['executionTriggerTypeId', 'isPreview', 'operations'],
            });
            done();
          });
        });

        it('should patch state with no data', (done: DoneCallback) => {
          jest.spyOn(operationServiceStub, 'getDetails').mockReturnValue(of({}));
          OperationStateStub.getDetails(stateContextStub, {
            customerId: 1,
            operationId: 1,
          }).subscribe(() => {
            expect(stateContextStub.patchState).toHaveBeenCalledWith({});
            done();
          });
        });

        it('should patchState details with data', (done: DoneCallback) => {
          jest
            .spyOn(operationServiceStub, 'getDetails')
            .mockReturnValue(of({ data: [executionStub] }));
          OperationStateStub.getDetails(stateContextStub, {
            customerId: 1,
            operationId: 1,
          }).subscribe(() => {
            expect(stateContextStub.patchState).toHaveBeenCalledWith({
              details: [executionStub],
            });
            done();
          });
        });
      });

      describe('when is a report call', () => {
        beforeEach(() => {
          jest
            .spyOn(operationServiceStub, 'getDetails')
            .mockReturnValue(of({ items: [executionStub] }));
          window.URL.createObjectURL = jest.fn();
          OperationStateStub.getDetails(stateContextStub, {
            customerId: 1,
            operationId: 1,
            isReport: true,
          }).subscribe();
        });

        it('should not patchState details with data', () => {
          expect(stateContextStub.patchState).not.toHaveBeenCalledWith({
            details: [],
            detailsColumns: [],
          });
        });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        jest
          .spyOn(operationServiceStub, 'getDetails')
          .mockReturnValue(throwError({ error: 'error' }));
        OperationStateStub.getDetails(stateContextStub, {
          customerId: 1,
          operationId: 1,
        }).subscribe();
      });

      it('should patchState detailsColumns and details with empty array', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({
          details: [],
          detailsColumns: [],
        });
      });
    });
  });

  describe('Action: ClearOperation', () => {
    beforeEach(() => {
      OperationStateStub.clearRegistrations(stateContextStub);
    });

    it('should patchState operation details state properties with empty values', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        operation: null,
        connector: null,
        detailsColumns: [],
        details: [],
        executionEvents: [],
      }));
  });

  describe('Action: ClearOperation', () => {
    beforeEach(() => {
      OperationStateStub.clearRegistrations(stateContextStub);
    });

    it('should patchState operation details state properties with empty values', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        operation: null,
        connector: null,
        detailsColumns: [],
        details: [],
        executionEvents: [],
      }));
  });
});
