import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { action } from '@storybook/addon-actions';
import { Component } from '@angular/core';
import { AlertComponent } from './alert.component';

@Component({
  selector: 'ax-alertcomponent',
  template: `
    <div>
      <ax-alert
        [type]="type"
        [title]="title"
        [message]="message"
        [closable]="closable"
        [showIcon]="showIcon"
        (onhide)="onhide($event)"
      ></ax-alert>
    </div>
    <div>
      <h5>Action button example using ng-template</h5>
      <ax-alert
        [type]="type"
        [title]="title"
        [message]="message"
        [closable]="closable"
        [showIcon]="showIcon"
        [action]="actionTemplate"
        (onhide)="onhide($event)"
      >
        <ng-template #actionTemplate>
          <button mat-flat-button color="primary" class="md" (click)="actionClick()">Button</button>
        </ng-template>
      </ax-alert>
    </div>
  `,
})
class AlertStoryComponent {}

export default {
  title: 'Components/Alert',
  component: AlertStoryComponent,
  argTypes: {
    type: {
      options: ['success', 'error', 'info', 'warning'],
      control: { type: 'radio' },
    },
    title: {
      option: ['Alert Title'],
      control: { type: 'text' },
    },
    message: {
      option: ['Some Alert Description'],
      control: { type: 'text' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule, AlertComponent],
    }),
  ],
} as Meta<AlertStoryComponent>;
const Template: Story<AlertStoryComponent> = (args: AlertStoryComponent) => ({
  props: {
    ...args,
    onhide: DefaultEvent.onhide,
    actionClick: DefaultEvent.actionClick,
  },
});
export const Default = Template.bind({});
Default.args = {
  type: 'success',
  title: 'Alert Title',
  message: 'Some Alert Description',
  closable: true,
  showIcon: true,
};
const DefaultEvent = {
  onhide: action('onhide'),
  actionClick: action('actionClick'),
};
