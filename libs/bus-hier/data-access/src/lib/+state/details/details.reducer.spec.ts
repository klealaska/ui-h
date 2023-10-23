import { reducer, InitialDetailsState } from './details.reducer';
import * as DetailsAction from './details.actions';
import { AddressType, HierarchyType, IDetails, IEntity } from '@ui-coe/bus-hier/shared/types';

describe('Details Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(InitialDetailsState, action);

      expect(result).toEqual(InitialDetailsState);
    });
  });

  it('should update the state when loadDetails is dispatched', () => {
    const action = DetailsAction.loadDetails({
      payload: { id: '1', hierarchyType: HierarchyType.ERP },
    });
    const state = {
      ...InitialDetailsState,
      loading: true,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadDetails is dispatched and succeeds', () => {
    const details: IDetails = {
      id: '1',
      name: 'foo',
      code: '123',
      status: 'Active',
      type: HierarchyType.ERP,
    };
    const action = DetailsAction.loadDetailsSuccess({ response: details });
    const state = {
      ...InitialDetailsState,
      details,
      items: null,
      loading: false,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadDetails is dispatched and fails', () => {
    const action = DetailsAction.loadDetailsFailure({ error: 'error' });
    const state = {
      ...InitialDetailsState,
      loading: false,
      error: 'error',
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadEntities is dispatched', () => {
    const action = DetailsAction.loadEntities({
      payload: { erpId: '1', level: 2 },
    });
    const state = {
      ...InitialDetailsState,
      loading: true,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadEntities is dispatched and succeeds', () => {
    const items: IEntity[] = [
      {
        name: { singular: '', plural: '' },
        id: '1234',
        isActive: true,
      },
    ];
    const action = DetailsAction.loadEntitiesSuccess({ response: items });
    const state = {
      ...InitialDetailsState,
      items,
      details: null,
      loading: false,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadEntities is dispatched and fails', () => {
    const action = DetailsAction.loadEntitiesFailure({ error: 'error' });
    const state = {
      ...InitialDetailsState,
      loading: false,
      error: 'error',
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  describe('activateItem', () => {
    it('should update the state when activateItem is dispatched', () => {
      const action = DetailsAction.activateItem({
        id: '123',
        name: 'foo',
        hierarchyType: HierarchyType.ERP,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
      };
      const result = reducer(InitialDetailsState, action);

      expect(result).toEqual(state);
    });
  });

  describe('deactivateItem', () => {
    it('should update the state when deactivateItem is dispatched', () => {
      const action = DetailsAction.deactivateItem({
        id: '123',
        name: 'foo',
        hierarchyType: HierarchyType.ERP,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
      };
      const result = reducer(InitialDetailsState, action);

      expect(result).toEqual(state);
    });
  });

  describe('activateItemSuccess', () => {
    it('should update the status with "active"', () => {
      const details: IDetails = {
        id: '1',
        name: 'foo',
        code: '123',
        status: 'Inactive',
        type: HierarchyType.ERP,
      };

      const action = DetailsAction.activateItemSuccess({
        status: 'Active',
        itemName: details.name,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
        details,
      };
      const expectedState = {
        ...state,
        details: { ...state.details, status: action.status },
        loading: false,
      };

      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe('deactivateItemSuccess', () => {
    it('it should update the status with "Inactive"', () => {
      const details: IDetails = {
        id: '1',
        name: 'foo',
        code: '123',
        status: 'Active',
        type: HierarchyType.ORGANIZATION,
      };

      const action = DetailsAction.deactivateItemSuccess({
        status: 'Inactive',
        itemName: details.name,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
        details,
      };
      const expectedState = {
        ...state,
        details: { ...state.details, status: action.status },
        loading: false,
      };

      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe('activateItemFailure', () => {
    it('should update the state when activateItemFailure is dispatched', () => {
      const action = DetailsAction.activateItemFailure({
        error: 'error',
        itemName: 'foo',
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
      };

      const expectedState = { ...state, loading: false };
      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe('deactivateItemFailure', () => {
    it('should update the state when deactivateItemFailure is dispatched', () => {
      const action = DetailsAction.deactivateItemFailure({
        error: 'error',
        itemName: 'foo',
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
      };

      const expectedState = { ...state, loading: false };
      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });
  });

  it('should update the state when editDetails is dispatched', () => {
    const action = DetailsAction.editDetails({
      id: 'foo',
      body: { name: 'foo', code: 'bar' },
      hierarchyType: HierarchyType.ORGANIZATION,
    });
    const state = {
      ...InitialDetailsState,
      loading: true,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadEntities is dispatched and succeeds', () => {
    const items: IEntity[] = [
      {
        name: { singular: '', plural: '' },
        id: '1234',
        isActive: true,
      },
    ];
    const action = DetailsAction.loadEntitiesSuccess({ response: items });
    const state = {
      ...InitialDetailsState,
      items,
      details: null,
      loading: false,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when editDetails is dispatched and succeeds', () => {
    const details: IDetails = {
      id: '1',
      name: 'foo',
      code: '123',
      status: 'Active',
      type: HierarchyType.ERP,
    };
    const action = DetailsAction.editDetailsSuccess({ response: details });
    const state = {
      ...InitialDetailsState,
      details,
      loading: false,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when loadEntities is dispatched and fails', () => {
    const action = DetailsAction.loadEntitiesFailure({ error: 'error' });
    const state = {
      ...InitialDetailsState,
      loading: false,
      error: 'error',
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when editDetails is dispatched and fails', () => {
    const action = DetailsAction.editDetailsFailure({ error: 'error' });
    const state = {
      ...InitialDetailsState,
      loading: false,
      error: 'error',
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when displayToast is dispatched', () => {
    const action = DetailsAction.displayToast({
      config: null,
    });
    const state = {
      ...InitialDetailsState,
      toast: action.config,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when dismissToast is dispatched', () => {
    const action = DetailsAction.dismissToast();
    const state = {
      ...InitialDetailsState,
      toast: null,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  it('should update the state when toggleEditDetailsMode is dispatched', () => {
    const action = DetailsAction.toggleEditDetailsMode();
    const state = {
      ...InitialDetailsState,
      editDetailsMode: !InitialDetailsState.editDetailsMode,
    };
    const result = reducer(InitialDetailsState, action);

    expect(result).toEqual(state);
  });

  describe('resetDetails', () => {
    it('should update the state when resetDetails is dispatched', () => {
      const action = DetailsAction.resetDetails();
      const state = {
        ...InitialDetailsState,
        loading: false,
      };
      const result = reducer(InitialDetailsState, action);

      expect(result).toEqual(state);
    });
  });

  describe('deactivate Activate Address', () => {
    it('it should update the isActivate state with false when deactivate address success action', () => {
      const details: IDetails = {
        id: '1',
        name: 'foo',
        code: '123',
        status: 'Active',
        type: HierarchyType.ENTITIES,
        billToAddresses: [
          {
            isActive: true,
            addressId: '1',
            addressLine1: '123 WElm Street',
            locality: 'Charlotte',
            region: 'NC',
            postalCode: '12344',
            country: 'USA',
            isPrimary: true,
            addressType: AddressType.BILL_TO,
            addressCode: '123',
          },
        ],
      };

      const action = DetailsAction.deactivateAddressSuccess({
        isActive: false,
        addressId: '1',
        addressType: AddressType.BILL_TO,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
        details,
      };
      const expectedState = {
        ...state,
        details: {
          ...state.details,
          billToAddresses: [
            {
              isActive: false,
              addressId: '1',
              addressLine1: '123 WElm Street',
              locality: 'Charlotte',
              region: 'NC',
              postalCode: '12344',
              country: 'USA',
              isPrimary: true,
              addressType: AddressType.BILL_TO,
              addressCode: '123',
            },
          ],
        },
        loading: false,
      };

      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });

    it('it should update the isActivate state with false when deactivate address success action', () => {
      const details: IDetails = {
        id: '1',
        name: 'foo',
        code: '123',
        status: 'Active',
        type: HierarchyType.ENTITIES,
        billToAddresses: [
          {
            isActive: false,
            addressId: '1',
            addressLine1: '123 WElm Street',
            locality: 'Charlotte',
            region: 'NC',
            postalCode: '12344',
            country: 'USA',
            isPrimary: true,
            addressType: AddressType.BILL_TO,
            addressCode: '123',
          },
        ],
      };

      const action = DetailsAction.activateAddressSuccess({
        isActive: true,
        addressId: '1',
        addressType: AddressType.BILL_TO,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
        details,
      };
      const expectedState = {
        ...state,
        details: {
          ...state.details,
          billToAddresses: [
            {
              isActive: true,
              addressId: '1',
              addressLine1: '123 WElm Street',
              locality: 'Charlotte',
              region: 'NC',
              postalCode: '12344',
              country: 'USA',
              isPrimary: true,
              addressType: AddressType.BILL_TO,
              addressCode: '123',
            },
          ],
        },
        loading: false,
      };

      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe('edit Address', () => {
    it('it should update state with edit billto address success action', () => {
      const details: IDetails = {
        id: '1',
        name: 'foo',
        code: '123',
        status: 'Active',
        type: HierarchyType.ORGANIZATION,
        billToAddresses: [
          {
            isActive: true,
            addressId: '1',
            addressLine1: '123 WElm Street',
            locality: 'Charlotte',
            region: 'NC',
            postalCode: '12344',
            country: 'USA',
            isPrimary: true,
            addressType: AddressType.BILL_TO,
            addressCode: '123',
          },
        ],
      };
      const address = {
        addressId: '1',
        addressCode: '222',
        addressLine1: '123 Elm Street',
        locality: 'sandiego',
        region: 'CA',
        postalCode: '12344',
        isActive: true,
        addressType: 'BillTo',
        country: 'USA',
        isPrimary: true,
      };
      const action = DetailsAction.editAddressSuccess({
        addressType: AddressType.BILL_TO,
        payload: address,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
        details,
      };
      const expectedState = {
        ...state,
        details: {
          ...state.details,
          billToAddresses: [address],
        },
        loading: false,
      };

      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });
    it('it should update state with edit ship to address success action', () => {
      const details: IDetails = {
        id: '1',
        name: 'foo',
        code: '123',
        status: 'Active',
        type: HierarchyType.ORGANIZATION,
        shipToAddresses: [
          {
            isActive: true,
            addressId: '1',
            addressLine1: '123 WElm Street',
            locality: 'Charlotte',
            region: 'NC',
            postalCode: '12344',
            country: 'USA',
            isPrimary: true,
            addressType: AddressType.SHIP_TO,
            addressCode: '123',
          },
        ],
      };
      const address = {
        addressId: '1',
        addressCode: '222',
        addressLine1: '123 Elm Street',
        locality: 'sandiego',
        region: 'CA',
        postalCode: '12344',
        isActive: true,
        addressType: 'ShipTo',
        country: 'USA',
        isPrimary: true,
      };
      const action = DetailsAction.editAddressSuccess({
        addressType: AddressType.SHIP_TO,
        payload: address,
      });
      const state = {
        ...InitialDetailsState,
        loading: true,
        details,
      };
      const expectedState = {
        ...state,
        details: {
          ...state.details,
          shipToAddresses: [address],
        },
        loading: false,
      };

      const result = reducer(state, action);

      expect(result).toEqual(expectedState);
    });
  });
});
