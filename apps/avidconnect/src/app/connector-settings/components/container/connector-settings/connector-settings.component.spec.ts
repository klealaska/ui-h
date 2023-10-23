import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { MockComponents } from 'ng-mocks';
import { of } from 'rxjs';
import {
  connectorStub,
  dialogStub,
  groupSettingsStub,
  onPremAgentsStub,
  propertyGroupStub,
  propertyStub,
  registrationStub,
  schemaHelperStub,
  settingsStub,
  settingsValueStub,
  storeStub,
} from '../../../../../test/test-stubs';
import { SharedModule } from '../../../../shared/shared.module';
import { HostnameSettingsComponent } from '../../presentation/hostname-settings/hostname-settings.component';
import { PropertyGroupComponent } from '../../presentation/property-group/property-group.component';
import { SettingsSideBarComponent } from '../../presentation/settings-side-bar/settings-side-bar.component';
import * as actions from '../../../connector-settings.actions';
import * as coreActions from '../../../../core/actions/core.actions';

import { ConnectorSettingsComponent } from './connector-settings.component';
import { ComplexSettingValue, OnPremAgentItem, SchemaSettingsValue } from '../../../../models';
import { SchemaHelperService } from '../../../services/schema-helper.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeactivateAgentDialogComponent } from '../../presentation/deactivate-agent-dialog/deactivate-agent-dialog.component';
import DoneCallback = jest.DoneCallback;
import { ActivateAgentDialogComponent } from '../../presentation/activate-agent-dialog/activate-agent-dialog.component';
import { AvidPage } from '../../../../core/enums';

describe('ConnectorSettingsComponent', () => {
  let component: ConnectorSettingsComponent;
  let fixture: ComponentFixture<ConnectorSettingsComponent>;

  const mockOnPremAgentItem: OnPremAgentItem = {
    id: 1,
    customerId: 32325,
    agentSID: 'a37a1310-d718-27b3-8180-769a55d25cb0',
    isDeactivated: false,
    isLockedOut: false,
    hostName: 'G6KQRQ2.AvidXchange.com',
    topic: 'Customer-32325',
    subscription: 'SID-a37a1310-d718-27b3-8180-769a55d25cb0',
    createdDate: '2023-02-22T09:04:26.9',
    createdBy: 'N/A',
    deactivatedDate: '0001-01-01T00:00:00',
    deactivatedBy: null,
    lastAccess: '2023-02-22T09:04:26.9',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConnectorSettingsComponent,
        MockComponents(HostnameSettingsComponent, SettingsSideBarComponent, PropertyGroupComponent),
      ],
      imports: [SharedModule, NgxsModule.forRoot([])],
      providers: [
        {
          provide: Store,
          useValue: storeStub,
        },
        {
          provide: MatDialog,
          useValue: dialogStub,
        },
        {
          provide: SchemaHelperService,
          useValue: schemaHelperStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorSettingsComponent);
    component = fixture.componentInstance;
    component.groupSelected = propertyGroupStub;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      jest.spyOn(component, 'getOnPremAgents');
      jest
        .spyOn(storeStub, 'selectSnapshot')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(propertyGroupStub)
        .mockReturnValueOnce([propertyGroupStub])
        .mockReturnValueOnce([groupSettingsStub]);
      component.ngOnInit();
    });
    it('should call connection settings and registration settings', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith([
        new coreActions.GetConnector(),
        new actions.GetConnectorSettings(),
        new actions.GetSettings(),
        new coreActions.GetNavigationChevron(AvidPage.CustomerSettings),
        new coreActions.GetRegistration(1),
      ]);
      expect(component.getOnPremAgents).toHaveBeenCalled();
    });
  });

  describe('propertyGroupSelected()', () => {
    beforeEach(() => {
      component.hostnameSelected = 'tester';
      jest
        .spyOn(storeStub, 'selectSnapshot')
        .mockReturnValue([
          settingsStub,
          { ...settingsStub, hostname: 'tester' },
        ] as SchemaSettingsValue[]);
      component.propertyGroupSelected(propertyGroupStub);
    });

    it('should map groupSelected', () => expect(component.groupSelected).toBe(propertyGroupStub));
  });

  describe('propertyValueChanged()', () => {
    const settings = { group: 'test', settings: {} as any };
    beforeEach(() => {
      // jest.spyOn(storeStub, 'dispatch').mockReturnValue(of({}));
      component.propertyValueChanged(settings);
    });

    it('should dispatch UpdateChangedSettings action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.UpdateChangedSettings(settings.group, settings.settings)
      );
    });
  });

  describe('saveSettings()', () => {
    beforeEach(() => {
      jest.spyOn(storeStub, 'selectSnapshot').mockReturnValue([groupSettingsStub]);
      component.registrationId = 1;
      component.saveSettings();
    });

    it('should call PostConnectorSettings action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.PostConnectorSettings([groupSettingsStub], 1)
      );
    });
  });

  describe('clearComplexErrors()', () => {
    const settings = { group: 'test', property: 'test' };

    beforeEach(() => {
      jest.spyOn(storeStub, 'dispatch');

      jest
        .spyOn(storeStub, 'selectSnapshot')
        .mockReturnValue([propertyGroupStub, groupSettingsStub]);

      component.clearComplexErrors(settings);
    });

    it('should dispatch ClearErrorMessage action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.ClearErrorMessage(settings.group, settings.property)
      );
    });
  });

  describe('submitSettingsChanges()', () => {
    describe('if there are new changes', () => {
      beforeEach(() => {
        jest
          .spyOn(storeStub, 'selectSnapshot')
          .mockReturnValueOnce(connectorStub)
          .mockReturnValueOnce([groupSettingsStub]);

        jest.spyOn(component, 'saveSettings').mockImplementation();

        component.submitSettingsChanges();
      });

      it('should call save settings', () => {
        expect(component.saveSettings).toBeCalled();
      });
    });
  });

  describe('complexPropertyChanged()', () => {
    const complexSettings: ComplexSettingValue = {
      propertyGroupName: 'groupName',
      field: propertyStub,
      settings: settingsValueStub,
    };

    beforeEach(() => {
      jest.spyOn(schemaHelperStub, 'validatePropertyValue');
      component.complexPropertyChanged(complexSettings);
    });

    it('should validate complex Property changes', () => {
      expect(schemaHelperStub.validatePropertyValue).toHaveBeenCalledWith(
        complexSettings.propertyGroupName,
        complexSettings.field,
        complexSettings.settings.value,
        complexSettings.complexType
      );
    });
  });

  describe('getGroupErrors()', () => {
    const errors = { [propertyGroupStub.Name]: 'error' };
    let errorMessage;
    beforeEach(() => {
      component.groupSelected = propertyGroupStub;
      errorMessage = component.getGroupErrors(errors);
    });

    it('should return error message', () => {
      expect(errorMessage).toBe('error');
    });
  });

  describe('goBack()', () => {
    beforeEach(() => {
      jest.spyOn(window.history, 'back');
      component.goBack();
    });

    it('should redirect to previous page', () => {
      expect(window.history.back).toHaveBeenCalled();
    });
  });

  describe('validatePropertyValue()', () => {
    const params = {
      propertyGroupName: 'string',
      property: propertyStub,
      value: 'string',
    };

    beforeEach(() => {
      jest.spyOn(schemaHelperStub, 'validatePropertyValue').mockReturnValue(true);
      component['validatePropertyValue'](params.propertyGroupName, params.property, params.value);
    });

    it('should dispatch ClearErrorMessage action', () => {
      expect(storeStub.dispatch).toHaveBeenCalledWith(
        new actions.ClearErrorMessage(params.propertyGroupName, params.property.Name)
      );
    });
  });

  describe('deactivate dialog', () => {
    it('should handle deactivate submit', (done: DoneCallback) => {
      dialogStub.open.mockReturnValue({
        afterClosed: () => of('submit'),
      } as MatDialogRef<DeactivateAgentDialogComponent>);
      component.handleAgentDeactivation(mockOnPremAgentItem);
      component.deactivateAgentDialogRef.afterClosed().subscribe(() => {
        jest.spyOn(storeStub, 'dispatch');
        expect(storeStub.dispatch).toHaveBeenCalledWith(
          new actions.DeactivateAgent(mockOnPremAgentItem.id, mockOnPremAgentItem.customerId)
        );
        done();
      });
    });

    it('should handle deactivate cancel', (done: DoneCallback) => {
      dialogStub.open.mockReturnValue({
        afterClosed: () => of('cancel'),
      } as MatDialogRef<DeactivateAgentDialogComponent>);
      component.handleAgentDeactivation(mockOnPremAgentItem);
      component.deactivateAgentDialogRef.afterClosed().subscribe(() => {
        jest.spyOn(storeStub, 'dispatch');
        expect(storeStub.dispatch).not.toHaveBeenCalledWith(
          new actions.DeactivateAgent(mockOnPremAgentItem.id, mockOnPremAgentItem.customerId)
        );
        done();
      });
    });
  });

  describe('activate dialog', () => {
    it('should handle activate confirm', (done: DoneCallback) => {
      dialogStub.open.mockReturnValue({
        afterClosed: () => of('1111 1111 1111 1111'),
      } as MatDialogRef<ActivateAgentDialogComponent>);
      component.handleMachineActivation();
      component.activateAgentDialogRef.afterClosed().subscribe((res: string) => {
        jest.spyOn(storeStub, 'dispatch');
        expect(storeStub.dispatch).toHaveBeenCalled();
        done();
      });
    });

    it('should handle activate cancel', (done: DoneCallback) => {
      dialogStub.open.mockReturnValue({
        afterClosed: () => of(false),
      } as MatDialogRef<ActivateAgentDialogComponent>);
      component.handleMachineActivation();
      component.activateAgentDialogRef.afterClosed().subscribe((res: string) => {
        jest.spyOn(storeStub, 'dispatch');
        expect(storeStub.dispatch).not.toHaveBeenCalledWith(
          new actions.ActivateAgent(undefined, res)
        );
        done();
      });
    });
  });

  describe('agent registration', () => {
    it('should dispatch the agent registration', () => {
      jest.spyOn(storeStub, 'dispatch');
      component.handleAgentSelection(onPremAgentsStub.items[0]);
      expect(storeStub.dispatch).toHaveBeenCalled();
    });
  });
});
