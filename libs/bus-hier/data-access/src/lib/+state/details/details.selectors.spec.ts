import { DetailsType, HierarchyType } from '@ui-coe/bus-hier/shared/types';
import * as fromDetails from './details.reducer';
import * as selectors from './details.selectors';

describe('Details Selectors', () => {
  const state: fromDetails.DetailsState = {
    details: {
      id: '1',
      name: 'foo',
      code: '123',
      status: 'Active',
      type: HierarchyType.ERP,
    },
    editDetailsMode: false,
    loading: false,
    error: null,
    toast: null,
  };
  it('should select the feature state', () => {
    const result = selectors.selectDetailsState({
      [fromDetails.detailsFeatureKey]: {},
    });

    expect(result).toEqual({});
  });

  it('should select the Details', () => {
    const result = selectors.selectDetails.projector(state);
    expect(result).toBe(state.details);
  });

  it('should select isDetailsloading', () => {
    const result = selectors.isDetailsLoading.projector(state);
    expect(result).toBe(state.loading);
  });

  it('should select selectToast', () => {
    const result = selectors.selectToast.projector(state);
    expect(result).toBe(state.toast);
  });

  it('should selectType be details', () => {
    const result = selectors.selectType.projector(state);
    expect(result).toBe(DetailsType.DETAILS);
  });

  it('should selectType be landing', () => {
    const newState = {
      details: null,
      loading: false,
      error: null,
      toast: null,
      editDetailsMode: false,
    };
    const result = selectors.selectType.projector(newState);
    expect(result).toBe(DetailsType.LANDING);
  });

  it('should selectType be list', () => {
    const newState = {
      details: null,
      items: [],
      loading: false,
      error: null,
      toast: null,
      editDetailsMode: false,
    };
    const result = selectors.selectType.projector(newState);
    expect(result).toBe(DetailsType.LIST);
  });
});
