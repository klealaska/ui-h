import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { HostnameSettings } from '../../../../models';
import { MockComponents } from 'ng-mocks';
import { dialogStub, hostnamePropertyStub } from '../../../../../test/test-stubs';
import { HostnameSettingsModalComponent } from './hostname-settings-modal/hostname-settings-modal.component';

import { HostnameSettingsComponent } from './hostname-settings.component';
import { MatIconModule } from '@angular/material/icon';

describe('HostnameSettingsComponent', () => {
  let component: HostnameSettingsComponent;
  let fixture: ComponentFixture<HostnameSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        HostnameSettingsComponent,
        MockComponents(MatLabel, MatFormField, MatSelect, MatOption),
      ],
      imports: [MatDialogModule, ReactiveFormsModule, MatIconModule],
      providers: [
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostnameSettingsComponent);
    component = fixture.componentInstance;
    component.hostname = new FormControl();
    component.hostname.setValue('default');
    component.hostnames = [hostnamePropertyStub, { ...hostnamePropertyStub, name: null }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openHostnameSettingsModal(true)', () => {
    beforeEach(() => component.openHostnameSettingsModal(true));

    it('should open hostname settings value', () =>
      expect(dialogStub.open).toHaveBeenNthCalledWith(1, HostnameSettingsModalComponent, {
        data: { hostname: 'default', editMode: true, hostnames: ['test', undefined] },
      }));
  });

  describe('openHostnameSettingsModal()', () => {
    beforeEach(() => component.openHostnameSettingsModal());

    it('should open hostname settings value', () =>
      expect(dialogStub.open).toHaveBeenNthCalledWith(1, HostnameSettingsModalComponent, {
        data: { hostname: new HostnameSettings(), editMode: false, hostnames: ['test', undefined] },
      }));
  });
});
