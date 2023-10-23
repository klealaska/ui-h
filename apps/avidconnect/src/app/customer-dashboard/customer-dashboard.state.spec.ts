import { of, throwError } from 'rxjs';
import {
  connectorStub,
  customerStub,
  operationServiceStub,
  operationStub,
  registrationServiceStub,
  registrationStub,
  stateContextStub,
} from '../../test/test-stubs';
import * as actions from './customer-dashboard.actions';
import { CustomerDashboardState } from './customer-dashboard.state';

describe('CustomerDashboardState', () => {
  const CustomerDashboardStateStub = new CustomerDashboardState(
    operationServiceStub as any,
    registrationServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    const CustomerDashboardStateStub = {
      customer: customerStub,
      connectors: [connectorStub],
      registrations: [registrationStub],
      customerId: 1,
      operations: operationStub,
      isLoadingOperations: false,
    };

    it('should select operations from state', () =>
      expect(CustomerDashboardState.operations(CustomerDashboardStateStub as any)).toBe(
        CustomerDashboardStateStub.operations
      ));

    it('should select registrations from state', () =>
      expect(CustomerDashboardState.registrations(CustomerDashboardStateStub as any)).toBe(
        CustomerDashboardStateStub.registrations
      ));

    it('should select isLoadingOperations from state', () =>
      expect(CustomerDashboardState.isLoadingOperations(CustomerDashboardStateStub as any)).toBe(
        CustomerDashboardStateStub.isLoadingOperations
      ));
  });

  describe('Action: QueryOperations', () => {
    const operations = [operationStub];

    describe('when getByCustomer returns data', () => {
      beforeEach(() => {
        operationServiceStub.getByCustomer.mockReturnValue(of({ items: operations }));
        CustomerDashboardStateStub.queryOperations(stateContextStub, { customerId: 1 }).subscribe();
      });

      it('should patchState operations with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ operations }));

      it('should call LoadingOperations  action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.LoadingOperations(true)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        operationServiceStub.getByCustomer.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState customers with empty array', () => {
        CustomerDashboardStateStub.queryOperations(stateContextStub, { customerId: 1 }).subscribe(
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

  describe('Action: LoadingConnectorsState', () => {
    beforeEach(() => {
      CustomerDashboardStateStub.loadingOperations(stateContextStub, {
        isLoadingOperations: true,
      });
    });

    it('should patchState isLoadingOperations with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoadingOperations: true,
      }));
  });

  describe('Action: QueryRegistrations', () => {
    const registrations = [registrationStub];

    describe('when getRegistrationsDetail returns data', () => {
      beforeEach(() => {
        registrationServiceStub.getRegistrationsDetail.mockReturnValue(
          of({ items: registrations })
        );
        CustomerDashboardStateStub.queryRegistrations(stateContextStub, {
          customerId: 1,
        }).subscribe();
      });

      it('should patchState registrations with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ registrations }));

      it('should call LoadingRegistrations  action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.LoadingRegistrations(true)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        registrationServiceStub.getRegistrationsDetail.mockReturnValue(
          throwError({ errorCode: '404' })
        );
      });

      it('should patchState customers with empty array', () => {
        CustomerDashboardStateStub.queryRegistrations(stateContextStub, {
          customerId: 1,
        }).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { registrations: [] });
          }
        );
      });
    });
  });

  describe('Action: LoadingRegistrations', () => {
    beforeEach(() => {
      CustomerDashboardStateStub.loadingRegistrations(stateContextStub, {
        isLoadingRegistrations: true,
      });
    });

    it('should patchState isLoadingRegistrations with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoadingRegistrations: true,
      }));
  });

  describe('Action: ClearRegistrations', () => {
    beforeEach(() => {
      CustomerDashboardStateStub.clearRegistrations(stateContextStub);
    });

    it('should patchState registrations with empty value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        registrations: [],
      }));
  });
});
