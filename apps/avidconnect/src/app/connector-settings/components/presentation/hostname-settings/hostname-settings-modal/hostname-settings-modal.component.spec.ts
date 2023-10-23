import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { HostnameSettings } from '../../../../../../app/models';
import { MockComponents } from 'ng-mocks';
import { dialogRefStub, storeStub, toastServiceStub } from '../../../../../../test/test-stubs';

import { HostnameSettingsModalComponent } from './hostname-settings-modal.component';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import * as actions from '../../../../connector-settings.actions';
import { of } from 'rxjs';
import { ToastService } from '../../../../../core/services/toast.service';

describe('HostnameSettingsModalComponent', () => {
  let component: HostnameSettingsModalComponent;
  let fixture: ComponentFixture<HostnameSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HostnameSettingsModalComponent,
        MockComponents(MatFormField, MatLabel, MatError, MatSlideToggle),
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            hostname: new HostnameSettings(),
            editMode: false,
            hostnames: [],
          },
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostnameSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('saveHostname()', () => {
    beforeEach(() => {
      component.data.hostname = new HostnameSettings();
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue(1);
      // jest.spyOn(storeStub, 'dispatch').mockReturnValue(of(null));
    });
    describe('if hostname object is valid', () => {
      beforeEach(() => {
        component.hostnameForm.get('name').setValue('Machine');
        component.hostnameForm.get('machine').setValue('Test');
      });

      describe('if editMode is true and machine name is not the same', () => {
        beforeEach(() => {
          component.editMode = true;
          component.saveHostname();
        });

        it('should push both old and new hostname to hostnames array', () =>
          expect(storeStub.dispatch).toHaveBeenNthCalledWith(
            1,
            new actions.PostHostnameSettings(1, 1, [
              {
                name: '',
                value: {
                  description: '',
                  enabled: false,
                },
              },
              {
                name: 'Test',
                value: {
                  description: 'Machine',
                  enabled: true,
                },
              },
            ])
          ));
      });

      describe('if editMode is false', () => {
        describe('and hostname is not duplicated', () => {
          beforeEach(() => {
            component.saveHostname();
          });

          it('should post new hostname created', () =>
            expect(storeStub.dispatch).toHaveBeenNthCalledWith(
              1,
              new actions.PostHostnameSettings(1, 1, [
                {
                  name: 'Test',
                  value: {
                    description: 'Machine',
                    enabled: true,
                  },
                },
              ])
            ));
        });

        describe('and hostname is duplicated', () => {
          beforeEach(() => {
            component.data.hostnames = ['Test', 'test'];
            component.saveHostname();
          });

          it('should post new hostname created', () =>
            expect(storeStub.dispatch).not.toHaveBeenCalled());
        });
      });
    });

    describe('if hostname form is not valid', () => {
      beforeEach(() => {
        component.saveHostname();
      });

      it('should not post hostname setting object', () =>
        expect(storeStub.dispatch).not.toHaveBeenCalled());
    });
  });
});
