import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents } from 'ng-mocks';

import { PortalDashboardComponent } from './portal-dashboard.component';
import { MatTab, MatTabLink } from '@angular/material/tabs';
import { CustomersListComponent } from '../../presentation/customers-list/customers-list.component';
import { MatButton } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NgxsModule, Store } from '@ngxs/store';
import { dialogStub, storeStub } from '../../../../../test/test-stubs';
import * as actions from '../../../portal-dashboard.actions';
import { MatIcon } from '@angular/material/icon';

describe('PortalDashboardComponent', () => {
  let component: PortalDashboardComponent;
  let fixture: ComponentFixture<PortalDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PortalDashboardComponent,
        MockComponents(
          PageHeaderComponent,
          CustomersListComponent,
          MatTab,
          MatButton,
          MatTabLink,
          MatIcon
        ),
      ],
      imports: [RouterTestingModule, NgxsModule.forRoot([]), MatDialogModule],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: Store,
          useValue: storeStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalDashboardComponent);
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
    it('should dispatch QueryPlatforms action', () => {
      expect(storeStub.dispatch).toHaveBeenNthCalledWith(1, new actions.QueryPlatforms());
    });
  });

  describe('openEnrollCustomerModal()', () => {
    beforeEach(() => {
      component.openEnrollCustomerModal();
    });

    it('should open up AddRegistrationComponent modal', () => {
      expect(dialogStub.open).toHaveBeenCalled();
    });
  });
});
