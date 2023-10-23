import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectorSettingsComponent } from './components/container/connector-settings/connector-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { SettingsSideBarComponent } from './components/presentation/settings-side-bar/settings-side-bar.component';
import { ConnectorSettingsState } from './connector-settings.state';
import { CoreState } from '../core/state/core.state';
import { PropertyGroupComponent } from './components/presentation/property-group/property-group.component';
import { PropertyItemComponent } from './components/presentation/property-item/property-item.component';
import { PropertyTypeComponent } from './components/presentation/property-type/property-type.component';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { ChoicePropertyComponent } from './components/presentation/choice-property/choice-property.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ComplexPropertyComponent } from './components/presentation/complex-property/complex-property.component';
import { MatButtonModule } from '@angular/material/button';
import { ComplexPropertyModalComponent } from './components/presentation/complex-property/complex-property-modal/complex-property-modal.component';
import { HostnameSettingsComponent } from './components/presentation/hostname-settings/hostname-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HostnameSettingsModalComponent } from './components/presentation/hostname-settings/hostname-settings-modal/hostname-settings-modal.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ConfirmationModalComponent } from './components/presentation/confirmation-modal/confirmation-modal.component';
import { AuthPropertyComponent } from './components/presentation/auth-property/auth-property.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgentListComponent } from './components/presentation/agent-list/agent-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivateAgentDialogComponent } from './components/presentation/activate-agent-dialog/activate-agent-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeactivateAgentDialogComponent } from './components/presentation/deactivate-agent-dialog/deactivate-agent-dialog.component';
import { ActivateCodeDirective } from './directives/activate-code.directive';
import { AgentRegistrationComponent } from './components/presentation/agent-registration/agent-registration.component';

const routes: Routes = [
  {
    path: '',
    component: ConnectorSettingsComponent,
  },
];

@NgModule({
  declarations: [
    AgentListComponent,
    ActivateAgentDialogComponent,
    DeactivateAgentDialogComponent,
    ConnectorSettingsComponent,
    SettingsSideBarComponent,
    PropertyGroupComponent,
    PropertyItemComponent,
    PropertyTypeComponent,
    ChoicePropertyComponent,
    AuthPropertyComponent,
    ComplexPropertyComponent,
    ComplexPropertyModalComponent,
    HostnameSettingsComponent,
    HostnameSettingsModalComponent,
    ConfirmationModalComponent,
    ActivateCodeDirective,
    AgentRegistrationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgxsModule.forFeature([ConnectorSettingsState, CoreState]),
    SharedModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
  ],
})
export class ConnectorSettingsModule {}
