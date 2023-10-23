import { createReducer, on } from '@ngrx/store';
import { AddressType, IDetails, IEntity } from '@ui-coe/bus-hier/shared/types';
import * as DetailsActions from './details.actions';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { IToastConfigData } from '@ui-coe/shared/types';

export const detailsFeatureKey = 'details';

export interface DetailsState {
  details?: IDetails;
  items?: IEntity[];
  loading: boolean;
  error: unknown;
  editDetailsMode: boolean;
  toast: MatSnackBarConfig<IToastConfigData>;
}

export const InitialDetailsState: DetailsState = {
  details: null,
  loading: false,
  error: null,
  items: null,
  toast: null,
  editDetailsMode: false,
};

export const reducer = createReducer(
  InitialDetailsState,

  on(DetailsActions.loadDetails, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(DetailsActions.loadDetailsSuccess, (state, action) => {
    return {
      ...state,
      details: action.response,
      items: null,
      loading: false,
      error: null,
    };
  }),
  on(DetailsActions.loadDetailsFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(DetailsActions.loadEntities, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(DetailsActions.loadEntitiesSuccess, (state, action) => {
    return {
      ...state,
      items: action.response,
      loading: false,
      details: null,
      error: null,
    };
  }),
  on(DetailsActions.loadEntitiesFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(DetailsActions.activateItem, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(DetailsActions.editDetails, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(DetailsActions.editDetailsSuccess, (state, action) => {
    return {
      ...state,
      details: action.response,
      loading: false,
      error: null,
    };
  }),
  on(DetailsActions.editDetailsFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  }),
  on(DetailsActions.displayToast, (state, action) => {
    return {
      ...state,
      toast: action.config,
    };
  }),
  on(DetailsActions.dismissToast, state => {
    return {
      ...state,
      toast: null,
    };
  }),
  on(DetailsActions.deactivateItem, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(DetailsActions.activateItemSuccess, DetailsActions.deactivateItemSuccess, (state, action) => {
    return {
      ...state,
      loading: false,
      details: {
        ...state.details,
        status: action.status,
      },
    };
  }),
  on(DetailsActions.activateItemFailure, DetailsActions.deactivateItemFailure, state => {
    return {
      ...state,
      loading: false,
    };
  }),
  on(DetailsActions.resetDetails, state => {
    return {
      ...state,
      loading: false,
      details: null,
    };
  }),
  on(DetailsActions.toggleEditDetailsMode, state => {
    return {
      ...state,
      editDetailsMode: !state.editDetailsMode,
    };
  }),
  on(DetailsActions.activateAddress, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(
    DetailsActions.activateAddressSuccess,
    DetailsActions.deactivateAddressSuccess,
    (state, action) => {
      let shipToAddresses;
      let billToAddresses;
      switch (action.addressType) {
        case AddressType.BILL_TO:
          billToAddresses = state.details.billToAddresses.map(a => {
            if (a.addressId === action.addressId) {
              return { ...a, isActive: action.isActive };
            } else {
              return a;
            }
          });
          break;
        case AddressType.SHIP_TO:
          shipToAddresses = state.details.shipToAddresses.map(a => {
            if (a.addressId === action.addressId) {
              return { ...a, isActive: action.isActive };
            } else {
              return a;
            }
          });
          break;
      }
      return {
        ...state,
        loading: false,
        details: {
          ...state.details,
          shipToAddresses:
            action.addressType === AddressType.SHIP_TO
              ? shipToAddresses
              : state.details?.shipToAddresses,
          billToAddresses:
            action.addressType === AddressType.BILL_TO
              ? billToAddresses
              : state.details?.billToAddresses,
        },
      };
    }
  ),
  on(DetailsActions.activateAddress, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(DetailsActions.editAddressSuccess, (state, action) => {
    let shipToAddresses;
    let billToAddresses;
    switch (action.addressType) {
      case AddressType.BILL_TO:
        billToAddresses = state.details.billToAddresses.map(a => {
          if (a.addressId === action.payload.addressId) {
            return action.payload;
          } else {
            return a;
          }
        });
        break;
      case AddressType.SHIP_TO:
        shipToAddresses = state.details.shipToAddresses.map(a => {
          if (a.addressId === action.payload.addressId) {
            return action.payload;
          } else {
            return a;
          }
        });
        break;
    }
    return {
      ...state,
      loading: false,
      details: {
        ...state.details,
        shipToAddresses:
          action.addressType === AddressType.SHIP_TO
            ? shipToAddresses
            : state.details?.shipToAddresses,
        billToAddresses:
          action.addressType === AddressType.BILL_TO
            ? billToAddresses
            : state.details?.billToAddresses,
      },
    };
  }),
  on(DetailsActions.editAddress, state => {
    return {
      ...state,
      loading: true,
    };
  }),
  on(DetailsActions.editAddressFailure, (state, action) => {
    return {
      ...state,
      loading: false,
      error: action.error,
    };
  })
);
