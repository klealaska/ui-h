import { of, throwError } from 'rxjs';
import {
  connectorServiceStub,
  customerStub,
  operationStub,
  stateContextStub,
  toastServiceStub,
} from '../../test/test-stubs';
import { ConnectorDetailState, ConnectorDetailStateModel } from './connector-detail.state';

describe('ConnectorDetailState', () => {
  const ConnectorDetailStateStub = new ConnectorDetailState(
    connectorServiceStub as any,
    toastServiceStub as any
  );
  describe('Selectors', () => {
    const ConnectorDetailStateStub: ConnectorDetailStateModel = {
      customers: [customerStub],
      operations: [operationStub],
      isLoadingCustomers: false,
      isLoadingOperations: false,
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should select customers from state', () => {
      expect(ConnectorDetailState.customers(ConnectorDetailStateStub as any)).toBe(
        ConnectorDetailStateStub.customers
      );
    });

    it('should select operations from state', () => {
      expect(ConnectorDetailState.operations(ConnectorDetailStateStub as any)).toBe(
        ConnectorDetailStateStub.operations
      );
    });

    it('should select isLoadingCustomers from state', () => {
      expect(ConnectorDetailState.isLoadingCustomers(ConnectorDetailStateStub as any)).toBe(
        ConnectorDetailStateStub.isLoadingCustomers
      );
    });

    it('should select isLoadingOperations from state', () => {
      expect(ConnectorDetailState.isLoadingOperations(ConnectorDetailStateStub as any)).toBe(
        ConnectorDetailStateStub.isLoadingOperations
      );
    });
  });

  describe('Action: GetOperations', () => {
    describe('when service returns data', () => {
      beforeEach(() => {
        connectorServiceStub.getOperations.mockReturnValue(of({ items: [operationStub] }));
        ConnectorDetailStateStub.getOperations(stateContextStub, { connectorId: 1 }).subscribe();
      });

      it('should patchState operations with response data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ operations: [operationStub] }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        connectorServiceStub.getOperations.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState operations with empty valuey', () => {
        ConnectorDetailStateStub.getOperations(stateContextStub, { connectorId: 1 }).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { operations: [] });
          }
        );
      });
    });
  });

  describe('Action: GetCustomers', () => {
    describe('when service returns data', () => {
      beforeEach(() => {
        connectorServiceStub.getCustomers.mockReturnValue(of({ items: [customerStub] }));
        ConnectorDetailStateStub.getCustomers(stateContextStub, { connectorId: 1 }).subscribe();
      });

      it('should patchState customers with response data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ customers: [customerStub] }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        connectorServiceStub.getCustomers.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState customers with empty valuey', () => {
        ConnectorDetailStateStub.getCustomers(stateContextStub, { connectorId: 1 }).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { customers: [] });
          }
        );
      });
    });
  });

  describe('Action: ClearConnectorDetails', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      ConnectorDetailStateStub.clearConnectorDetails(stateContextStub);
    });

    it('should patchState registrations and customers with a empty values ', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        operations: [],
        customers: [],
      }));
  });
});
