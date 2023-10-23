import { of, throwError } from 'rxjs';
import {
  connectorServiceStub,
  connectorStub,
  customerServiceStub,
  customerStub,
  registrationServiceStub,
  registrationStub,
  stateContextStub,
  toastServiceStub,
} from '../../test/test-stubs';
import { PortalDashboardState } from './portal-dashboard.state';
import * as actions from './portal-dashboard.actions';
import * as coreActions from '../core/actions/core.actions';
describe('PortalDashboardState', () => {
  const portalDashboardStateStub = new PortalDashboardState(
    customerServiceStub as any,
    connectorServiceStub as any,
    registrationServiceStub as any,
    toastServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    const PortalDashboardStateStub = {
      customers: [customerStub],
      connectors: [connectorStub],
      isLoadingConnectors: false,
      isLoadingCustomers: false,
      isLoadingCustomer: false,
    };

    it('should select customers from state', () =>
      expect(PortalDashboardState.customers(PortalDashboardStateStub as any)).toBe(
        PortalDashboardStateStub.customers
      ));

    it('should select connectors from state', () =>
      expect(PortalDashboardState.connectors(PortalDashboardStateStub as any)).toBe(
        PortalDashboardStateStub.connectors
      ));

    it('should select isLoadingConnectors from state', () =>
      expect(PortalDashboardState.isLoadingConnectors(PortalDashboardStateStub as any)).toBe(
        PortalDashboardStateStub.isLoadingConnectors
      ));

    it('should select isLoadingCustomers from state', () =>
      expect(PortalDashboardState.isLoadingCustomers(PortalDashboardStateStub as any)).toBe(
        PortalDashboardStateStub.isLoadingCustomers
      ));

    it('should select isLoadingCustomer from state', () =>
      expect(PortalDashboardState.isLoadingCustomer(PortalDashboardStateStub as any)).toBe(
        PortalDashboardStateStub.isLoadingCustomer
      ));
  });

  describe('Action: QueryCustomers', () => {
    const customers = [customerStub];

    describe('when getAll returns data', () => {
      beforeEach(() => {
        customerServiceStub.getAll.mockReturnValue(of({ items: customers }));
        portalDashboardStateStub.queryCustomers(stateContextStub).subscribe();
      });

      it('should patchState customers with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { customers }));

      it('should call LoadingCustomersState  action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.LoadingCustomersState(true)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        customerServiceStub.getAll.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState customers with empty array', () => {
        portalDashboardStateStub.queryCustomers(stateContextStub).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { customers: [] });
          }
        );
      });
    });

    describe('when the error is null', () => {
      beforeEach(() => {
        customerServiceStub.getAll.mockReturnValue(throwError(null));
      });

      it('should patchState customers with empty array', () => {
        portalDashboardStateStub.queryCustomers(stateContextStub).subscribe(
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

  describe('Action: QueryConnectors', () => {
    const connectors = [connectorStub];

    describe('when getAll returns data', () => {
      beforeEach(() => {
        connectorServiceStub.getAll.mockReturnValue(of({ items: connectors }));
        portalDashboardStateStub.queryConnectors(stateContextStub).subscribe();
      });

      it('should patchState connectors with items data', () =>
        expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { connectors }));

      it('should call LoadingConnectorsState  action', () =>
        expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
          1,
          new actions.LoadingConnectorsState(true)
        ));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        connectorServiceStub.getAll.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState connectors with empty array', () => {
        portalDashboardStateStub.queryConnectors(stateContextStub).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { connectors: [] });
          }
        );
      });
    });
  });

  describe('Action: PostCustomer', () => {
    const customer = customerStub;

    describe('when succesfully call post customer', () => {
      beforeEach(() => {
        jest.spyOn(customerServiceStub, 'addCustomer').mockReturnValue(of(1));
        portalDashboardStateStub.postCustomer(stateContextStub, { customer }).subscribe();
      });

      it('should call addCustomer', () =>
        expect(customerServiceStub.addCustomer).toHaveBeenNthCalledWith(1, customer));

      it('should patch customerId', () =>
        expect(stateContextStub.dispatch).toHaveBeenCalledWith(new coreActions.SetCustomerId(1)));
    });

    describe('when there is an error on customer post', () => {
      beforeEach(() => {
        customerServiceStub.addCustomer.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should handle error callback', () => {
        portalDashboardStateStub.postCustomer(stateContextStub, { customer }).subscribe({
          error: () => {
            expect(customerServiceStub.addCustomer).toThrow();
          },
        });
      });
    });
  });

  describe('Action: PostRegistration', () => {
    const customerId = 1;
    const registration = registrationStub;

    describe('when succesfully call post registration', () => {
      beforeEach(() => {
        jest.spyOn(registrationServiceStub, 'addRegistration').mockReturnValue(of(1));
        portalDashboardStateStub.postRegistration(stateContextStub, { customerId, registration });
      });

      it('should call addRegistration', () =>
        expect(registrationServiceStub.addRegistration).toHaveBeenNthCalledWith(
          1,
          customerId,
          registration
        ));
    });

    describe('when there is an error on registration post', () => {
      beforeEach(() => {
        registrationServiceStub.addRegistration.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should handle error callback', () => {
        portalDashboardStateStub
          .postRegistration(stateContextStub, { customerId, registration })
          .subscribe({
            error: () => {
              expect(registrationServiceStub.addRegistration).toThrow();
            },
          });
      });
    });
  });

  describe('Action: LoadingConnectorsState', () => {
    beforeEach(() => {
      portalDashboardStateStub.loadingConnectorsState(stateContextStub, {
        isLoadingConnectors: true,
      });
    });

    it('should patchState isLoadingConnectors with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoadingConnectors: true,
      }));
  });

  describe('Action: LoadingCustomersState', () => {
    beforeEach(() => {
      portalDashboardStateStub.loadingCustomersState(stateContextStub, {
        isLoadingCustomers: true,
      });
    });

    it('should patchState isLoadingCustomers with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoadingCustomers: true,
      }));
  });

  describe('Action: LoadingCustomerState', () => {
    beforeEach(() => {
      portalDashboardStateStub.loadingCustomerState(stateContextStub, {
        isLoadingCustomer: true,
      });
    });

    it('should patchState isLoadingCustomer with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        isLoadingCustomer: true,
      }));
  });
});
