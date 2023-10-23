import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeaderComponent } from './components/page-header/page-header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoadingWrapperComponent } from './components/loading-wrapper/loading-wrapper.component';
import { AddRegistrationComponent } from './components/modals/add-registration/add-registration.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LogoComponent } from './components/logo/logo.component';
import { MatIconModule } from '@angular/material/icon';
import { ConnectorHeaderComponent } from './components/connector-header/connector-header.component';
import { NoContentComponent } from './components/no-content/no-content.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateComponent } from './components/date/date.component';
import { LoginCallbackComponent } from './components/login-callback/login-callback.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    LoadingSpinnerComponent,
    LoadingWrapperComponent,
    AddRegistrationComponent,
    LogoComponent,
    ConnectorHeaderComponent,
    NoContentComponent,
    DateComponent,
    LoginCallbackComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  exports: [
    PageHeaderComponent,
    LoadingSpinnerComponent,
    LoadingWrapperComponent,
    AddRegistrationComponent,
    LogoComponent,
    ConnectorHeaderComponent,
    NoContentComponent,
    DateComponent,
  ],
})
export class SharedModule {}
