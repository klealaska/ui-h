import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MaterialUiModule } from '../material-ui.module';
import { SlideToggleComponent } from './slide-toggle.component';
import { SharedUiV2Module } from '../shared-ui-v2.module';
import { FormsModule } from '@angular/forms';

export default {
  title: 'Components/SlideToggle',
  component: SlideToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialUiModule,
        FormsModule,
        SharedUiV2Module,
      ],
    }),
  ],
  argTypes: {
    labelPosition: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<SlideToggleComponent>;

const Template: Story<SlideToggleComponent> = (args: SlideToggleComponent) => ({
  props: {
    ...args,
    buttonEvent: DefaultEvent.buttonEvent,
  },
});

export const Default = Template.bind({});
Default.args = {
  labelPosition: 'left',
  disabled: false,
  readonly: false,
  subLabelConfig: {
    active: 'Yes',
    inactive: 'No',
  },
  label: 'Label',
};

const DefaultEvent = {
  buttonEvent: action('buttonEvent'),
};
