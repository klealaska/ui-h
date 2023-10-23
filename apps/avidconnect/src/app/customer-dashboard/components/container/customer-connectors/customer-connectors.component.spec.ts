import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingWrapperComponent } from '../../../../shared/components/loading-wrapper/loading-wrapper.component';
import { MockComponents } from 'ng-mocks';

import { CustomerConnectorsComponent } from './customer-connectors.component';
import { NgxsModule, Store } from '@ngxs/store';
import {
  customerStub,
  dialogStub,
  registrationStub,
  storeStub,
} from '../../../../../test/test-stubs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('CustomerConnectorsComponent', () => {
  let component: CustomerConnectorsComponent;
  let fixture: ComponentFixture<CustomerConnectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerConnectorsComponent, MockComponents(LoadingWrapperComponent)],
      imports: [NgxsModule.forRoot([]), MatDialogModule, RouterTestingModule],
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
    fixture = TestBed.createComponent(CustomerConnectorsComponent);
    component = fixture.componentInstance;

    const store: Store = TestBed.get(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(customerStub);

    component.connectors = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getRegistrationsConnectors()', () => {
    beforeEach(() => {
      const registrations = [registrationStub, { ...registrationStub }];
      component['getRegistrationsConnectors'](registrations);
    });

    it('should create connectors from registrations objects', () => {
      expect(component.connectors.length).toBe(1);
    });
  });

  describe('openNewRegistrationModal()', () => {
    beforeEach(() => {
      component.openNewRegistrationModal();
    });

    it('should open New Registration Modal', () => {
      expect(dialogStub.open).toHaveBeenCalled();
    });
  });
});
