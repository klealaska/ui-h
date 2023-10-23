import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  GroupSettings,
  PropertyGroup,
  SettingValue,
  PropertyError,
  ComplexSettingValue,
  OnPremAgent,
  OnPremAgentItem,
  Registration,
} from '../../../../models';

@Component({
  selector: 'avc-property-group',
  templateUrl: './property-group.component.html',
  styleUrls: ['./property-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyGroupComponent {
  @Input() propertyGroup: PropertyGroup;
  @Input() settings: GroupSettings;
  @Input() errors: PropertyError;
  @Input() agentList: OnPremAgent;
  @Input() registration: Registration;
  @Output() propertyValueChanged = new EventEmitter<SettingValue>();
  @Output() complexPropertyChanged = new EventEmitter<ComplexSettingValue>();
  @Output() clearComplexErrors = new EventEmitter<{ group: string; property: string }>();
  @Output() agentDeactivationClick: EventEmitter<OnPremAgentItem> =
    new EventEmitter<OnPremAgentItem>();
  @Output() activateNewMachineClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() agentSelected: EventEmitter<OnPremAgentItem> = new EventEmitter<OnPremAgentItem>();
  @Output() agentRegCancel: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('ActivatedMachines') ActivatedMachines: TemplateRef<any>;
  @ViewChild('AgentRegistration') AgentRegistration: TemplateRef<any>;

  getPropertyValue(name: string): any {
    return this.settings?.properties.find(property => property.name === name)?.value;
  }

  getPropertyError(name: string, b: boolean): string | PropertyError {
    return this.errors && this.errors[name];
  }

  complexChanged(settings: ComplexSettingValue): void {
    this.complexPropertyChanged.emit({ ...settings, propertyGroupName: this.propertyGroup.Name });
  }

  getTemplateRef(): TemplateRef<any> {
    return this.propertyGroup && this.propertyGroup.Name === 'ActivatedMachines'
      ? this.ActivatedMachines
      : this.AgentRegistration;
  }
}
