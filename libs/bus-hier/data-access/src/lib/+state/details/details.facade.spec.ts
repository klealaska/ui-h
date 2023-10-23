import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { DetailsFacade } from './details.facade';
import * as DetailsActions from './details.actions';
import * as fromDetails from './details.reducer';
import { AddressType, HierarchyType } from '@ui-coe/bus-hier/shared/types';
import { IToastConfigData } from '@ui-coe/shared/types';

describe('DetailsFacade', () => {
  let facade: DetailsFacade;
  let store: Store;
  let actions$: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromDetails.detailsFeatureKey, fromDetails.reducer),
      ],
      providers: [DetailsFacade, provideMockActions(() => actions$)],
    });
    facade = TestBed.inject(DetailsFacade);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should get ERP details', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.getDetails({ payload: { id: '1', hierarchyType: HierarchyType.ERP } });
    expect(spy).toHaveBeenCalledWith(
      DetailsActions.loadDetails({ payload: { id: '1', hierarchyType: HierarchyType.ERP } })
    );
  });

  it('should get ORGANIZATION details', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.getDetails({ payload: { id: '1', hierarchyType: HierarchyType.ORGANIZATION } });
    expect(spy).toHaveBeenCalledWith(
      DetailsActions.loadDetails({
        payload: { id: '1', hierarchyType: HierarchyType.ORGANIZATION },
      })
    );
  });

  it('should get entities', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.getEntities({ payload: { erpId: '1', level: 12 } });
    expect(spy).toHaveBeenCalledWith(
      DetailsActions.loadEntities({
        payload: { erpId: '1', level: 12 },
      })
    );
  });

  it('should edit ORGANIZATION details', () => {
    const spy = jest.spyOn(store, 'dispatch');
    facade.editDetails({
      id: 'id',
      body: { name: 'foo', code: 'bar' },
      type: HierarchyType.ORGANIZATION,
    });
    expect(spy).toHaveBeenCalledWith(
      DetailsActions.editDetails({
        id: 'id',
        body: { name: 'foo', code: 'bar' },
        hierarchyType: HierarchyType.ORGANIZATION,
      })
    );
  });

  it('should display toast', () => {
    const spy = jest.spyOn(store, 'dispatch');
    const toastConfig: IToastConfigData = {
      title: 'foo',
      type: 'bar',
      icon: 'baz',
      close: false,
    };
    facade.displayToast({ data: toastConfig });
    expect(spy).toHaveBeenCalledWith(
      DetailsActions.displayToast({ config: { data: toastConfig } })
    );
  });

  describe('activateItem', () => {
    it('should activate an ERP', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.activateItem({ id: '1', hierarchyType: HierarchyType.ERP, name: 'test' });

      expect(spy).toHaveBeenCalledWith(
        DetailsActions.activateItem({
          id: '1',
          hierarchyType: HierarchyType.ERP,
          name: 'test',
        })
      );
    });
  });

  describe('deactivateItem', () => {
    it('should deactivate an ERP', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.deactivateItem({ id: '1', hierarchyType: HierarchyType.ERP, name: 'test' });

      expect(spy).toHaveBeenCalledWith(
        DetailsActions.deactivateItem({
          id: '1',
          hierarchyType: HierarchyType.ERP,
          name: 'test',
        })
      );
    });
  });

  describe('resetDetails', () => {
    it('should reset the details state', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.resetDetails();

      expect(spy).toHaveBeenCalledWith(DetailsActions.resetDetails());

      spy.mockRestore();
    });
  });

  describe('deactivateAddress or activateAddress', () => {
    it('should deactivate an active Address', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.deactivateAddress({
        id: '122222',
        hierarchyType: HierarchyType.ENTITIES,
        addressId: '322223',
        addressType: AddressType.BILL_TO,
      });

      expect(spy).toHaveBeenCalledWith(
        DetailsActions.deactivateAddress({
          id: '122222',
          hierarchyType: HierarchyType.ENTITIES,
          addressId: '322223',
          addressType: AddressType.BILL_TO,
        })
      );
    });

    it('should activate  a inactive address', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.activateAddress({
        id: '122222',
        hierarchyType: HierarchyType.ENTITIES,
        addressId: '322223',
        addressType: AddressType.BILL_TO,
      });

      expect(spy).toHaveBeenCalledWith(
        DetailsActions.activateAddress({
          id: '122222',
          hierarchyType: HierarchyType.ENTITIES,
          addressId: '322223',
          addressType: AddressType.BILL_TO,
        })
      );
    });
  });

  describe('Edit address', () => {
    it('should edit Org Address', () => {
      const spy = jest.spyOn(store, 'dispatch');
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
      const params = {
        id: '122222',
        hierarchyType: HierarchyType.ORGANIZATION,
        addressType: AddressType.BILL_TO,
        address,
      };
      facade.editAddress(params);

      expect(spy).toHaveBeenCalledWith(DetailsActions.editAddress(params));
    });
  });
});
