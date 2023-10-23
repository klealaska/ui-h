import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponent } from 'ng-mocks';

import { getBuyerPayloadStub, massVoidPayload } from '../../../../../testing/test-stubs';
import { BuyerPayload } from '../../../../shared/interfaces';
import * as homeActions from '../../../state/home.actions';
import { HomeBuyerFilterComponent } from '../../presentation/home-buyer-filter/home-buyer-filter.component';
import { HomePanelComponent } from '../../presentation/home-panel/home-panel.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockComponent(HomePanelComponent),
        MockComponent(HomeBuyerFilterComponent),
      ],
      imports: [NgxsModule.forRoot([], { developmentMode: true })],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    jest.spyOn(store, 'dispatch').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => fixture.detectChanges());

    it('should dispatch QueryBuyers action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new homeActions.QueryBuyers()));

    it('should not call loadPageEvent when scrolling has not hit bottom of page', () => {
      jest.spyOn(component, 'loadMore').mockImplementation();
      window.dispatchEvent(new Event('scroll'));
      expect(component.loadMore).not.toHaveBeenCalled();
    });
  });

  describe('updateBuyerValues()', () => {
    const formValuesStub: BuyerPayload = getBuyerPayloadStub();

    beforeEach(() => {
      component.updateBuyerValues(formValuesStub);
    });

    it('should dispatch UpdateBuyer action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        new homeActions.UpdateBuyer(formValuesStub)
      ));
  });

  describe('loadMore()', () => {
    beforeEach(() => {
      component.loadMore();
    });

    it('should dispatch QueryBuyers action', () =>
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new homeActions.QueryBuyers()));
  });

  describe('searchBuyers()', () => {
    beforeEach(() => {
      component.searchBuyers('mock');
    });

    it('should dispatch GetBuyersLookahead action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new homeActions.GetBuyersLookahead('mock'));
    });
  });

  describe('buyerSelected()', () => {
    beforeEach(() => {
      component.buyerSelected('mock');
    });

    it('should dispatch SetFilterBuyers action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new homeActions.SetFilterBuyers('mock'));
    });
  });

  describe('clearFilterBuyers()', () => {
    beforeEach(() => {
      component.clearFilterBuyers();
    });

    it('should dispatch ClearFilterBuyers action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new homeActions.ClearFilterBuyers());
    });
  });

  describe('executeMassVoid', () => {
    beforeEach(() => {
      component.executeMassVoid(massVoidPayload);
    });

    it('should dispatch MassVoid action', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new homeActions.MassVoid(massVoidPayload));
    });
  });

  describe('updateFormStatus', () => {
    beforeEach(() => {
      component.updateFormStatus(false);
    });

    it('should dispatch UpdateFormStatus action with passed in status', () => {
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new homeActions.UpdateFormStatus(false));
    });
  });
});
