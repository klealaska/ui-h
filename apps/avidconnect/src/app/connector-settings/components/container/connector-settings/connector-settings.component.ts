import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  ComplexSettingValue,
  Connector,
  Errors,
  GroupSettings,
  OnPremAgent,
  OnPremAgentItem,
  Platform,
  Property,
  PropertyComplexRef,
  PropertyError,
  PropertyGroup,
  Registration,
} from '../../../../models';
import { Observable } from 'rxjs';
import { CoreState } from '../../../../core/state/core.state';
import { ConnectorSettingsState } from '../../../connector-settings.state';
import * as actions from '../../../connector-settings.actions';
import * as coreActions from '../../../../core/actions/core.actions';
import { SchemaHelperService } from '../../../services/schema-helper.service';
import { AvidPage } from '../../../../core/enums';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../../presentation/confirmation-modal/confirmation-modal.component';
import { take, tap, withLatestFrom } from 'rxjs/operators';
import { ActivateAgentDialogComponent } from '../../presentation/activate-agent-dialog/activate-agent-dialog.component';
import { DeactivateAgentDialogComponent } from '../../presentation/deactivate-agent-dialog/deactivate-agent-dialog.component';

@Component({
  selector: 'avc-connector-settings',
  templateUrl: './connector-settings.component.html',
  styleUrls: ['./connector-settings.component.scss'],
})
export class ConnectorSettingsComponent implements OnInit, OnDestroy {
  @Select(ConnectorSettingsState.propertyGroups) propertyGroups$: Observable<PropertyGroup[]>;
  @Select(ConnectorSettingsState.hostnames) hostnames$: Observable<PropertyGroup[]>;
  @Select(ConnectorSettingsState.changedSettings) changedSettings$: Observable<PropertyGroup[]>;
  @Select(ConnectorSettingsState.onPremAgents) onPremAgents$: Observable<OnPremAgent>;
  @Select(ConnectorSettingsState.errors) errors$: Observable<Errors>;

  @Select(CoreState.connector) connector$: Observable<Connector>;
  @Select(CoreState.registration) registration$: Observable<Registration>;
  @Select(CoreState.platform) platform$: Observable<Platform>;

  registrationId: number;
  customerId: number;
  groupSelected: PropertyGroup;
  hostnameSelected: string = null;
  groupSettingValues: GroupSettings;
  schemaIsValid = true;
  dialogRef: MatDialogRef<ConfirmationModalComponent>;
  activateAgentDialogRef: MatDialogRef<ActivateAgentDialogComponent>;
  deactivateAgentDialogRef: MatDialogRef<DeactivateAgentDialogComponent>;

  constructor(
    private store: Store,
    private schemaHelper: SchemaHelperService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const initActions = [
      new coreActions.GetConnector(),
      new actions.GetConnectorSettings(),
      new actions.GetSettings(),
      new coreActions.GetNavigationChevron(AvidPage.CustomerSettings),
    ];

    this.registrationId = this.store.selectSnapshot<number>(CoreState.registrationId);
    this.customerId = this.store.selectSnapshot(CoreState.customerId);

    this.getOnPremAgents();

    if (this.registrationId) {
      initActions.push(new coreActions.GetRegistration(this.registrationId));
    }

    this.store.dispatch(initActions).subscribe(() => {
      const groupSelected = this.store.selectSnapshot<PropertyGroup[]>(
        ConnectorSettingsState.propertyGroups
      )[0];

      const propertyGroups = this.store.selectSnapshot<PropertyGroup[]>(
        ConnectorSettingsState.propertyGroups
      );

      propertyGroups.forEach(group => {
        const groupsSettings = this.store
          .selectSnapshot<GroupSettings[]>(ConnectorSettingsState.groupsSettingValues)
          .find(settings => settings.name === group.Name);

        if (groupsSettings) {
          group.Properties.forEach(property => {
            const value =
              groupsSettings.properties.find(prop => prop.name === property.Name)?.value ||
              property.DefaultValue;

            this.schemaHelper.validatePropertyValue(group.Name, property, value);
          });
        }
      });

      this.propertyGroupSelected(groupSelected);
    });

    this.errors$?.subscribe(errors => {
      this.schemaIsValid = !!Object.keys(errors).length;
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch([new actions.ClearChangedSettings(), new actions.ClearChangedSettings()]);
  }

  propertyGroupSelected(propertyGroup: PropertyGroup): void {
    this.groupSelected = propertyGroup;
    this.getGroupSettingsValues();
  }

  propertyValueChanged({ group, settings }): void {
    this.store
      .dispatch(new actions.UpdateChangedSettings(group, settings))
      .subscribe(() => this.getGroupSettingsValues());

    this.validatePropertyValue(group, settings.property, settings.value);
  }

  saveSettings(): void {
    const changedSettings = this.store.selectSnapshot<GroupSettings[]>(
      ConnectorSettingsState.changedSettings
    );
    this.store
      .dispatch(new actions.PostConnectorSettings(changedSettings, this.registrationId))
      .pipe(
        withLatestFrom(this.store.select(ConnectorSettingsState)),
        tap(([_]) => {
          /*
           Hacky fix to allow DOM to detect changes of success http request
          If you remove this, the success toaster will not show up all the time
          */
          setTimeout(() => {
            return;
          }, 1);
        })
      )
      .subscribe();
  }

  submitSettingsChanges(): void {
    const connector = this.store.selectSnapshot<Connector>(CoreState.connector);
    const changedSettings = this.store.selectSnapshot<GroupSettings[]>(
      ConnectorSettingsState.changedSettings
    );

    this.saveSettings();

    /*if (changedSettings.length > 0) {
      this.dialogRef = this.dialog.open(ConfirmationModalComponent, {
        data: { connector, changedSettings },
      });

      this.dialogRef.componentInstance.settingsUpdated.subscribe(() => {
        this.saveSettings();
        this.dialogRef.close();
      });
    } else {
      this.saveSettings();
    }*/
  }

  complexPropertyChanged(complexSettings: ComplexSettingValue): void {
    this.validatePropertyValue(
      complexSettings.propertyGroupName,
      complexSettings.field,
      complexSettings.settings.value,
      complexSettings.complexType
    );
  }

  getGroupErrors(errors: PropertyError): PropertyError | string {
    return errors && errors[this.groupSelected?.Name];
  }

  handleMachineActivation(): void {
    this.activateAgentDialogRef = this.dialog.open(ActivateAgentDialogComponent, {
      autoFocus: false,
    });

    this.activateAgentDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((userCode: string) => {
        if (userCode) {
          this.store.dispatch(
            new actions.ActivateAgent(
              this.store.selectSnapshot<number>(CoreState.customerId),
              userCode
            )
          );
        }
      });
  }

  handleAgentDeactivation(agent: OnPremAgentItem): void {
    this.deactivateAgentDialogRef = this.dialog.open(DeactivateAgentDialogComponent, {
      data: { agentHostName: agent },
      autoFocus: false,
    });

    this.deactivateAgentDialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res: string) => {
        if (res === 'submit') {
          this.store.dispatch(new actions.DeactivateAgent(agent.id, agent.customerId));
        }
      });
  }

  handleAgentSelection(agent: OnPremAgentItem): void {
    const registration: Registration = this.store.selectSnapshot(CoreState.registration);
    this.store.dispatch(
      new coreActions.AgentRegistration(this.customerId, this.registrationId, agent, registration)
    );
  }

  clearComplexErrors({ group, property }): void {
    this.store.dispatch(new actions.ClearErrorMessage(group, property));

    this.validateComplexProperty(group, property);
  }

  goBack(): void {
    window.history.back();
    this.store.dispatch(new actions.ClearErrors());
  }

  private getGroupSettingsValues(): void {
    this.groupSettingValues = this.store
      .selectSnapshot<GroupSettings[]>(ConnectorSettingsState.groupsSettingValues)
      .find(group => group.name === this.groupSelected.Name);
  }

  private validatePropertyValue(
    propertyGroupName: string,
    property: Property,
    value: string,
    complexRef?: PropertyComplexRef
  ): void {
    const isValid = this.schemaHelper.validatePropertyValue(
      propertyGroupName,
      property,
      value,
      complexRef
    );
    if (isValid) {
      this.store.dispatch(
        new actions.ClearErrorMessage(propertyGroupName, property.Name, complexRef)
      );
    }
  }

  private validateComplexProperty(group, property): void {
    const propertyGroup = this.store
      .selectSnapshot<PropertyGroup[]>(ConnectorSettingsState.propertyGroups)
      .find(item => item.Name === group);

    const complexProperty = propertyGroup.Properties.find(prop => prop.Name === property);

    const groupSettings = this.store
      .selectSnapshot<GroupSettings[]>(ConnectorSettingsState.groupsSettingValues)
      .find(groupSetting => groupSetting.name === group);

    const propertyValue =
      groupSettings.properties.find(prop => prop.name === property).value ||
      complexProperty.DefaultValue;

    this.schemaHelper.validatePropertyValue(group, complexProperty, propertyValue);
  }

  public getOnPremAgents(): void {
    this.store.dispatch(new actions.GetOnPremAgents(this.customerId));
  }
}
