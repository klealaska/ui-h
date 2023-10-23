import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents } from 'ng-mocks';

import { PortalDashboardCustomersComponent } from './portal-dashboard-customers.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { CustomersListComponent } from '../../presentation/customers-list/customers-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FormsModule } from '@angular/forms';
import { LoadingWrapperComponent } from '../../../../shared/components/loading-wrapper/loading-wrapper.component';
import { customerStub, storeStub } from '../../../../../test/test-stubs';
import * as actions from '../../../portal-dashboard.actions';
import { RouterTestingModule } from '@angular/router/testing';

describe('PortalDashboardCustomersComponent', () => {
  let component: PortalDashboardCustomersComponent;
  let fixture: ComponentFixture<PortalDashboardCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PortalDashboardCustomersComponent,
        MockComponents(
          LoadingWrapperComponent,
          CustomersListComponent,
          MatFormField,
          MatIcon,
          MatCheckbox,
          MatLabel
        ),
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NgxsModule.forRoot([]),
        RouterTestingModule.withRoutes([
          { path: 'customer-dashboard/activity', component: PortalDashboardCustomersComponent },
        ]),
      ],
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalDashboardCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should dispatch QueryCustomers action', () =>
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryCustomers()));
  });

  describe('showInactiveChanged()', () => {
    beforeEach(() => {
      component.showInactive = false;
      component.showInactiveChanged(true);
    });
    it('should set showInactive flag as true', () => {
      expect(component.showInactive).toBe(true);
    });
  });

  describe('customerSelected()', () => {
    const customer = customerStub;
    beforeEach(() => {
      jest.spyOn(storeStub, 'dispatch');
      component.customerSelected(customer);
    });
    it('should set showInactive flag as true', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith({ customerId: customer.id });
    });
  });
});
