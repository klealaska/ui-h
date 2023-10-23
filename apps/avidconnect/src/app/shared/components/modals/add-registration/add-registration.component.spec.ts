import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ToastService } from '../../../../core/services/toast.service';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import {
  connectorStub,
  customerStub,
  dialogRefStub,
  organizationOptionStub,
  storeStub,
  toastServiceStub,
} from '../../../../../test/test-stubs';
import * as actions from '../../../../core/actions/catalogs.actions';
import * as portalDashboardActions from '../../../../portal-dashboard/portal-dashboard.actions';
import { LoadingWrapperComponent } from '../../loading-wrapper/loading-wrapper.component';

import { AddRegistrationComponent } from './add-registration.component';

describe('AddRegistrationComponent', () => {
  let component: AddRegistrationComponent;
  let fixture: ComponentFixture<AddRegistrationComponent>;

  const tb_base = {
    declarations: [
      AddRegistrationComponent,
      MockComponents(LoadingWrapperComponent, MatFormField, MatLabel, MatError),
    ],
    imports: [
      ReactiveFormsModule,
      NgxsModule.forRoot([]),
      MatAutocompleteModule,
      RouterTestingModule,
    ],
    providers: [
      { provide: MatDialogRef, useValue: dialogRefStub },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {},
      },

      {
        provide: Store,
        useValue: storeStub,
      },
      {
        provide: ToastService,
        useValue: toastServiceStub,
      },
    ],
  };
  describe('Enroll new Customer', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule(tb_base).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AddRegistrationComponent);
      component = fixture.componentInstance;

      jest.spyOn(storeStub, 'dispatch').mockReturnValue(of());

      fixture.detectChanges();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('ngOnInit()', () => {
      describe('customerAutoComplete', () => {
        describe('when user type on customer autocomplete input ', () => {
          it('should dispatch QueryPlatformOrganizations action when text criteria is valid', fakeAsync(() => {
            const element = fixture.nativeElement.querySelector('input[name="customer"]');
            element.dispatchEvent(new Event('focusin'));
            element.value = 'text';
            element.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            tick(700);
            expect(storeStub.dispatch).toHaveBeenCalledWith(
              new actions.QueryPlatformOrganizations(element.value)
            );
          }));
        });
      });

      describe('connectorAutoComplete', () => {
        describe('when user type on connector autocomplete input ', () => {
          it('should dispatch QueryConnectorsLookup action when text criteria is valid', fakeAsync(() => {
            const element = fixture.nativeElement.querySelector('input[name="connector"]');
            element.dispatchEvent(new Event('focusin'));
            element.value = 'text';
            const platformId = 1;
            element.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            tick(700);
            expect(storeStub.dispatch).toHaveBeenCalledWith(
              new actions.QueryConnectorsLookup(element.value, platformId)
            );
          }));
        });
      });

      describe('null data', () => {
        it('should null component data', () => {
          component.data = null;
          component.ngOnInit();
          expect(component.data).toBe(null);
        });
      });
    });

    describe('close()', () => {
      beforeEach(() => {
        component.close();
      });
      it('should call dialog ref close', () => {
        expect(dialogRefStub.close).toHaveBeenCalled();
      });
    });

    describe('onPlatformSelected()', () => {
      beforeEach(() => {
        const eventStub = {
          source: {
            value: 1,
          },
        } as any;

        component.onPlatformSelected(eventStub);
      });

      it('should dispatch QueryConnectorsLookUp action', () =>
        expect(storeStub.dispatch).toHaveBeenCalledWith(new actions.QueryConnectorsLookup('', 1)));
    });

    describe('onOrganizationSelected()', () => {
      beforeEach(() => {
        const eventStub = {
          option: {
            value: {
              id: '1',
            },
          },
        } as any;

        component.isOrganizationSelected = false;
        component.onOrganizationSelected(eventStub);
      });
      it('should set isOrganizationSelected flag to true ', () =>
        expect(component.isOrganizationSelected).toBe(true));

      it('should dispatch  QueryOrganizationAccountingSystems action', () =>
        expect(storeStub.dispatch).toHaveBeenCalledWith(
          new actions.QueryOrganizationAccountingSystems('1', 1)
        ));
    });

    describe('displayAutocompleteFn()', () => {
      it('should return organization name ', () =>
        expect(component.displayAutocompleteFn(organizationOptionStub)).toBe(
          organizationOptionStub.displayName
        ));
    });

    describe('displayConnectorAutocompleteFn()', () => {
      it('should return formatted connector information ', () =>
        expect(component.displayConnectorAutocompleteFn(connectorStub)).toBe(
          `${connectorStub.displayName} - (${connectorStub.id})`
        ));
    });

    describe('clearCustomerInformation()', () => {
      beforeEach(() => {
        component.isOrganizationSelected = true;
        component.clearCustomerInformation();
      });
      it('should clear organization accounting systems', () =>
        expect(storeStub.dispatch).toHaveBeenCalledWith({}));

      it('should set isOrganizationSelected flag to falses', () =>
        expect(component.isOrganizationSelected).toBe(false));
    });

    describe('submitRegistrationForm() - Enroll Customer', () => {
      describe('when registration form is not valid', () => {
        beforeEach(() => {
          component.submitRegistrationForm();
        });

        it('should not post customer', () =>
          expect(storeStub.dispatch).not.toHaveBeenCalledWith(
            new portalDashboardActions.PostCustomer({
              externalKey: '123',
              name: 'test',
              platformId: 1,
              isActive: true,
            })
          ));
      });

      describe('when registration form is valid', () => {
        it('should post customer', () => {
          jest.clearAllMocks();
          component.registrationForm.get('customer').setValue({ id: '123', name: 'test' });
          component.registrationForm.get('registration').setValue({ id: 1, name: 'test' });
          component.registrationForm.get('connector').setValue({ id: 1, name: 'test' });
          component.submitRegistrationForm();
          expect(storeStub.dispatch).toHaveBeenCalledWith(
            new portalDashboardActions.PostCustomer({
              externalKey: '123',
              name: 'test',
              platformId: 1,
              isActive: true,
            })
          );
        });

        describe('when data is null', () => {
          it('should be nullable', () => {
            component.data = null;
            component.registrationForm.get('customer').setValue({ id: '123', name: 'test' });
            component.registrationForm.get('registration').setValue({ id: 1, name: 'test' });
            component.registrationForm.get('connector').setValue({ id: 1, name: 'test' });
            component.submitRegistrationForm();
            expect(component.data).toBe(null);
          });
        });
      });
    });
  });

  describe('Add New Registration', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule(tb_base);
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { customer: customerStub } });
      TestBed.compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(AddRegistrationComponent);
      component = fixture.componentInstance;

      jest.spyOn(storeStub, 'dispatch').mockReturnValue(of());

      fixture.detectChanges();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set customerId', () => expect(component.customerId).toBe(customerStub.id));

    describe('submitRegistrationForm()', () => {
      beforeEach(() => {
        component.registrationForm.get('customer').setValue({ id: 1, name: 'test' });
        component.registrationForm.get('registration').setValue({ id: 1, name: 'test' });
        component.registrationForm.get('connector').setValue({ id: 1, name: 'test' });

        component.submitRegistrationForm();
      });

      it('should Add new registration instance', () => {
        expect(storeStub.dispatch).toHaveBeenCalledWith({
          registration: {
            externalKey: 1,
            description: 'test',
            connectorId: 1,
            isActive: true,
          },
          customerId: customerStub.id,
        });
      });
    });
  });
});
