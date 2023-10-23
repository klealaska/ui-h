import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { storeStub } from '../../../../../test/test-stubs';
import { SharedModule } from '../../../../shared/shared.module';
import { ConnectorCustomersComponent } from '../../presentation/connector-customers/connector-customers.component';
import { ConnectorOperationsComponent } from '../../presentation/connector-operations/connector-operations.component';
import { ConnectorDetailComponent } from './connector-detail.component';
import * as actions from '../../../connector-detail.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { CustomerDashboardComponent } from '../../../../customer-dashboard/components/container/customer-dashboard/customer-dashboard.component';

describe('ConnectorDetailComponent', () => {
  let component: ConnectorDetailComponent;
  let fixture: ComponentFixture<ConnectorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConnectorDetailComponent,
        MockComponents(
          ConnectorOperationsComponent,
          ConnectorCustomersComponent,
          MatTabGroup,
          MatTab
        ),
      ],
      imports: [
        SharedModule,
        NgxsModule.forRoot([]),
        RouterTestingModule.withRoutes([
          { path: 'customer-dashboard/activity', component: CustomerDashboardComponent },
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
    fixture = TestBed.createComponent(ConnectorDetailComponent);
    component = fixture.componentInstance;

    jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1);
    jest.spyOn(storeStub, 'dispatch');
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should get customers and operations from store', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith([
        new actions.GetOperations(1),
        new actions.GetCustomers(1),
      ]);
    });
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });
    it('should call ClearConnectorDetails from store', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.ClearConnectorDetails());
    });
  });

  describe('customerSelected()', () => {
    beforeEach(() => {
      component.customerSelected(1);
    });
    it('should set customer Id on core state', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(new coreActions.SetCustomerId(1));
    });
  });
});
