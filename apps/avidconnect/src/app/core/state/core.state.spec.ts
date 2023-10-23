import { of, throwError } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { cold } from 'jasmine-marbles';
import {
  configServiceStub,
  authServiceStub,
  connectorServiceStub,
  connectorStub,
  customerServiceStub,
  customerStub,
  navigationChevronServiceStub,
  platformServiceStub,
  platformStub,
  registrationServiceStub,
  registrationStub,
  stateContextStub,
  userProfileStub,
  userServiceStub,
  toastServiceStub,
  onPremAgentsStub,
} from '../../../test/test-stubs';
import { CoreState, defaults } from './core.state';
import * as coreActions from '../actions/core.actions';
import { ChevronItem, Customer, OnPremAgent } from '../../models';
import { AvidPage, ToastStatus } from '../enums';
import DoneCallback = jest.DoneCallback;

jest.mock('jwt-decode', () => ({ default: jest.fn() }));

describe('CoreState', () => {
  const CoreStateStub = new CoreState(
    authServiceStub as any,
    toastServiceStub as any,
    userServiceStub as any,
    customerServiceStub as any,
    connectorServiceStub as any,
    registrationServiceStub as any,
    platformServiceStub as any,
    navigationChevronServiceStub as any,
    configServiceStub as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Selectors', () => {
    const CoreStateStub = {
      userProfile: userProfileStub,
      userAccount: {
        name: 'foo',
      },
      isLoading: false,
      connectorId: 1,
      customerId: 1,
      customer: customerStub,
      connector: connectorStub,
      platform: platformStub,
      registration: registrationStub,
      operationId: 1,
      token: 'abcdefg',
    };
    it('should select userDisplayName from state', () =>
      expect(CoreState.userDisplayName(CoreStateStub as any)).toBe(
        CoreStateStub.userProfile.displayName
      ));

    it('should select userAccountName from state', () => {
      expect(CoreState.userAccountName(CoreStateStub as any)).toBe(CoreStateStub.userAccount.name);
    });

    it('should select isLoading from state', () =>
      expect(CoreState.isLoading(CoreStateStub as any)).toBe(CoreStateStub.isLoading));

    it('should select connectorId from state', () =>
      expect(CoreState.connectorId(CoreStateStub as any)).toBe(CoreStateStub.connectorId));

    it('should select customerId from state', () =>
      expect(CoreState.customerId(CoreStateStub as any)).toBe(CoreStateStub.customerId));

    it('should select registrationId from state', () =>
      expect(CoreState.registrationId(CoreStateStub as any)).toBe(CoreStateStub.registration.id));

    it('should select customer from state', () =>
      expect(CoreState.customer(CoreStateStub as any)).toBe(CoreStateStub.customer));

    it('should select connector from state', () =>
      expect(CoreState.connector(CoreStateStub as any)).toBe(CoreStateStub.connector));

    it('should select registration from state', () =>
      expect(CoreState.registration(CoreStateStub as any)).toBe(CoreStateStub.registration));

    it('should select platform from state', () =>
      expect(CoreState.platform(CoreStateStub as any)).toBe(CoreStateStub.platform));

    it('should select operationId from state', () =>
      expect(CoreState.operationId(CoreStateStub as any)).toBe(CoreStateStub.operationId));

    it('should select token from state', () => {
      expect(CoreState.getToken(CoreStateStub as any)).toBe(CoreStateStub.token);
    });
  });

  describe('Action: InitApplication', () => {
    beforeEach(() => {
      CoreStateStub.initApplication(stateContextStub);
    });

    it('should dispatch QueryUserAccount action', () =>
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new coreActions.QueryUserAccount(),
        new coreActions.QueryUserRoles(),
        new coreActions.SetToken(),
      ]));
  });

  describe('Action: ClearCustomer', () => {
    beforeEach(() => {
      CoreStateStub.clearCustomer(stateContextStub);
    });

    it('should patchState customer/customerId with a empty values ', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        customer: null,
        customerId: 0,
      }));
  });

  describe('Action: SetToken', () => {
    it('should set a token when it has a value', () => {
      jest.spyOn(authServiceStub, 'getAccessToken').mockReturnValue('abcdefg');
      CoreStateStub.setToken(stateContextStub);
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { token: 'abcdefg' });
    });

    it('should not set a token when it has no value', () => {
      jest.spyOn(authServiceStub, 'getAccessToken').mockReturnValue(null);
      CoreStateStub.setToken(stateContextStub);
      expect(stateContextStub.patchState).not.toHaveBeenCalled();
    });
  });

  describe('Action: QueryUserRoles', () => {
    it('should not set userRoles when there is not a token', () => {
      jest.spyOn(authServiceStub, 'getAccessToken').mockReturnValue(null);
      CoreStateStub.querySetUserRoles(stateContextStub);
      expect(stateContextStub.patchState).not.toHaveBeenCalled();
    });

    it('should set userRoles when there is a token', () => {
      jest.spyOn(authServiceStub, 'getAccessToken').mockReturnValue('abcdefg');
      (jwt_decode as jest.Mock).mockImplementationOnce(() => ({ roles: ['role1'] }));
      CoreStateStub.querySetUserRoles(stateContextStub);
      expect(stateContextStub.patchState).toHaveBeenCalled();
    });
  });

  describe('Action: QueryUserAccount', () => {
    it('should set userAccount', () => {
      jest.spyOn(authServiceStub, 'getUserInfo').mockReturnValue('foo');
      CoreStateStub.queryUserAccount(stateContextStub);
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { userAccount: 'foo' });
    });

    it('should dispatch QueryUserProfile action', () => {
      jest.spyOn(authServiceStub, 'getUserInfo').mockReturnValue('foo');
      CoreStateStub.queryUserAccount(stateContextStub);
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(1, [
        new coreActions.QueryUserProfile(),
      ]);
    });
  });

  describe('Action: QueryUserProfile', () => {
    it('should update the state with useProfile', () => {
      jest.spyOn(userServiceStub, 'getProfile').mockReturnValue(of({ id: 'foo' }));
      CoreStateStub.queryUserProfile(stateContextStub);
      const foo = cold('(a|)', { a: { id: 'foo' } });
      expect(CoreStateStub.queryUserProfile(stateContextStub)).toBeObservable(foo);
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        userProfile: { id: 'foo' },
      });
    });
  });

  describe('Action: RefreshToken', () => {
    it('should update the state with a new token', () => {
      jest
        .spyOn(authServiceStub, 'refreshToken')
        .mockReturnValue(of({ return_data: { access_token: 'foo' } }));
      CoreStateStub.refreshToken(stateContextStub);
      const foo = cold('(a|)', { a: { return_data: { access_token: 'foo' } } });
      expect(CoreStateStub.refreshToken(stateContextStub)).toBeObservable(foo);
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        token: 'foo',
      });
    });
  });

  describe('Action: Logout', () => {
    it('should log the user out and reset the state', () => {
      jest.spyOn(authServiceStub, 'logout');
      CoreStateStub.logout(stateContextStub);
      expect(authServiceStub.logout).toHaveBeenCalled();
      expect(stateContextStub.setState).toHaveBeenNthCalledWith(1, {
        ...defaults,
      });
    });
  });

  describe('Action: GetCustomersByToken', () => {
    const customer: Customer = {
      id: 2,
      externalKey: '0001',
      isActive: true,
      name: 'Customer test',
      platformId: 1,
    };

    it('should call the customer token endpoint and dispatch the actions to update state', () => {
      jest.spyOn(customerServiceStub, 'getCustomerWithToken').mockReturnValue(of(customer));
      CoreStateStub.getCustomersByToken(stateContextStub);
      const customerObs = cold('(a|)', { a: customer });
      expect(CoreStateStub.getCustomersByToken(stateContextStub)).toBeObservable(customerObs);
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
        1,
        new coreActions.SetCustomer(customer)
      );
      expect(stateContextStub.dispatch).toHaveBeenNthCalledWith(
        2,
        new coreActions.SetCustomerId(customer.id)
      );
    });

    it('should set customer to `null` if error', () => {
      jest.spyOn(customerServiceStub, 'getCustomerWithToken').mockReturnValue(throwError('Error'));
      CoreStateStub.getCustomersByToken(stateContextStub);
      const customerError = cold('#', {}, 'Error');
      expect(CoreStateStub.getCustomersByToken(stateContextStub)).toBeObservable(customerError);
      expect(stateContextStub.patchState).toHaveBeenCalledWith({ customer: null });
    });
  });

  describe('Action: SetCustomer', () => {
    const customer: Customer = {
      id: 2,
      externalKey: '0001',
      isActive: true,
      name: 'Customer test',
      platformId: 1,
    };

    beforeEach(() => {
      CoreStateStub.setCustomer(stateContextStub, {
        customer,
      });
    });

    it('should patchState customer with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        customer,
      }));
  });

  describe('Action: SetCustomerId', () => {
    const customerId = 12345;

    beforeEach(() => {
      CoreStateStub.setCustomerId(stateContextStub, {
        customerId,
      });
    });

    it('should patchState customerId with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        customerId,
      }));
  });

  describe('Action: GetCustomer', () => {
    const customer = customerStub;

    describe('when getById returns data', () => {
      beforeEach(() => {
        customerServiceStub.getById.mockReturnValue(of(customer));
        CoreStateStub.getCustomer(stateContextStub, { customerId: 1 }).subscribe();
      });

      it('should patchState customer with response data', () =>
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ customer }));
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        customerServiceStub.getById.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState customer with null valuey', () => {
        CoreStateStub.getCustomer(stateContextStub, { customerId: 1 }).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { customer: null });
          }
        );
      });
    });
  });

  describe('Action: GetPlatform', () => {
    const platform = platformStub;

    describe('when getById returns data', () => {
      beforeEach(() => {
        platformServiceStub.getById.mockReturnValue(of(platform));
        CoreStateStub.getPlatform(stateContextStub, { platformId: 1 }).subscribe();
      });

      it('should patchstate platform with response data', () => {
        expect(stateContextStub.patchState).toHaveBeenCalledWith({ platform });
      });
    });

    describe('when receiving an error', () => {
      beforeEach(() => {
        platformServiceStub.getById.mockReturnValue(throwError({ errorCode: '404' }));
      });

      it('should patchState platform with null value', () => {
        CoreStateStub.getPlatform(stateContextStub, { platformId: 1 }).subscribe(
          () => {
            return;
          },
          () => {
            expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, { platform: null });
          }
        );
      });
    });
  });

  describe('Action: ClearConnector', () => {
    beforeEach(() => {
      CoreStateStub.clearConnector(stateContextStub);
    });

    it('should patchState connector/connectorId with a empty values ', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        connector: null,
        connectorId: 0,
      }));
  });

  describe('Action: ClearRegistration', () => {
    beforeEach(() => {
      CoreStateStub.clearRegistration(stateContextStub);
    });

    it('should patchState registration with a empty values ', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        registration: null,
      }));
  });

  describe('Action SetConnectorId', () => {
    const connectorId = 1234;
    beforeEach(() => {
      CoreStateStub.setConnectorId(stateContextStub, { connectorId });
    });

    it('should patchState connectorId with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        connectorId,
      }));
  });

  describe('Action: SetRegistration', () => {
    const registration = registrationStub;

    beforeEach(() => {
      CoreStateStub.setRegistration(stateContextStub, {
        registration,
      });
    });

    it('should patchState registration with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        registration,
      }));
  });

  describe('Action SetOperationId', () => {
    const operationId = 1234;
    beforeEach(() => {
      CoreStateStub.setOperationId(stateContextStub, { operationId });
    });

    it('should patchState OperationId with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        operationId,
      }));
  });

  describe('Action: SetNavigationChevron', () => {
    const navigation: Array<ChevronItem> = [{ title: 'customer' }, { title: 'connector' }];

    beforeEach(() => {
      CoreStateStub.setNavigationChevron(stateContextStub, {
        navigation,
      });
    });

    it('should patchState navigation with a true value', () =>
      expect(stateContextStub.patchState).toHaveBeenNthCalledWith(1, {
        navigation,
      }));
  });

  describe('Action: GetNavigationChevron', () => {
    const navigation: Array<ChevronItem> = [{ title: 'customer' }, { title: 'connector' }];

    beforeEach(() => {
      navigationChevronServiceStub.getNavigationChevron.mockReturnValue(navigation);
      CoreStateStub.getNavigationChevron(stateContextStub, {
        page: AvidPage.CustomerRecentActivity,
      });
    });

    it('should patchState navigation with response data', () =>
      expect(stateContextStub.patchState).toHaveBeenCalledWith({ navigation }));
  });

  describe('Action: AgentRegistration', () => {
    it('should call the service and display a success toast', (done: DoneCallback) => {
      jest.spyOn(customerServiceStub, 'agentRegistration').mockReturnValue(of({}));
      CoreStateStub.agentRegistration(stateContextStub, {
        customerId: 3358,
        registrationId: 1234,
        agent: onPremAgentsStub.items[0],
        registration: registrationStub,
      }).subscribe((res: OnPremAgent) => {
        expect(toastServiceStub.open).toHaveBeenCalledWith(
          'Agent association successful',
          ToastStatus.Success
        );
        done();
      });
    });

    it('should display a toast when there is an error', (done: DoneCallback) => {
      jest
        .spyOn(customerServiceStub, 'agentRegistration')
        .mockReturnValueOnce(throwError({ errorCode: '404' }));
      CoreStateStub.agentRegistration(stateContextStub, {
        customerId: 3358,
        registrationId: 1234,
        agent: onPremAgentsStub.items[0],
        registration: registrationStub,
      }).subscribe({
        error: () => {
          expect(toastServiceStub.open).toHaveBeenCalledWith(
            'Agent association failed',
            ToastStatus.Error
          );
          done();
        },
      });
    });
  });
});
