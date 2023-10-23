import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { MockComponents } from 'ng-mocks';
import { cold } from 'jasmine-marbles';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { customerStub } from '../../../../../test/test-stubs';
import { CustomerDashboardComponent } from './customer-dashboard.component';
import { UserRoles } from '../../../../core/enums/user-roles';
import * as coreActions from '../../../../core/actions/core.actions';

describe('CustomerDashboardComponent', () => {
  let component: CustomerDashboardComponent;
  let fixture: ComponentFixture<CustomerDashboardComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerDashboardComponent, MockComponents(PageHeaderComponent)],
      imports: [NgxsModule.forRoot([], { developmentMode: true }), RouterTestingModule],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  describe('PortalAdmin', () => {
    beforeEach(() => {
      // instantiating the component at this level so that we can
      // use different values for the roles
      store = TestBed.inject(Store);
      jest.spyOn(store, 'select').mockReturnValueOnce(of([UserRoles.PortalAdmin]));
      fixture = TestBed.createComponent(CustomerDashboardComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
      jest.spyOn(store, 'selectSnapshot').mockReturnValue(customerStub);
      jest.spyOn(store, 'dispatch').mockReturnValue(of(customerStub));
      jest
        .spyOn(store, 'select')
        .mockReturnValueOnce(of([UserRoles.PortalAdmin]))
        .mockReturnValueOnce(of(customerStub.id));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should dispatch GetCustomer action', () => {
      component.ngOnInit();
      expect(component.customer).toEqual(customerStub);
      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenNthCalledWith(1, new coreActions.GetCustomer(24));
      expect(store.dispatch).toHaveBeenNthCalledWith(2, new coreActions.GetPlatform(1));
    });

    it('should set value for displayBackButton$', () => {
      const expected = cold('(a|)', { a: true });
      expect(component.displayBackButton$).toBeObservable(expected);
    });
  });

  describe('CustomerAdmin', () => {
    beforeEach(() => {
      // instantiating the component at this level so that we can
      // use different values for the roles
      store = TestBed.inject(Store);
      jest.spyOn(store, 'select').mockReturnValueOnce(of([UserRoles.CustomerAdmin]));
      fixture = TestBed.createComponent(CustomerDashboardComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
      jest.spyOn(store, 'dispatch').mockReturnValue(of(customerStub));
      jest
        .spyOn(store, 'select')
        .mockReturnValueOnce(of([UserRoles.CustomerAdmin]))
        .mockReturnValueOnce(of(0));
    });

    it('should dispatch GetCustomer action', () => {
      component.ngOnInit();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(new coreActions.GetCustomersByToken());
    });

    it('should set value for displayBackButton$', () => {
      const expected = cold('(a|)', { a: false });
      expect(component.displayBackButton$).toBeObservable(expected);
    });
  });
});
