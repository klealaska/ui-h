import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ButtonToggleComponent } from './button-toggle.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

export default {
  title: 'Components/Button toggle',
  component: ButtonToggleComponent,
  argTypes: {
    size: {
      options: ['lg', 'md', 'sm'],
      control: { type: 'radio' },
    },
    disabled: { control: 'boolean' },
    multiSelect: { control: 'boolean' },
    fixedWidth: { control: 'boolean' },
    iconPosition: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MatIconModule, MatButtonToggleModule],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta<ButtonToggleComponent>;
const Template: Story<ButtonToggleComponent> = (args: ButtonToggleComponent) => ({
  props: {
    ...args,
    selectedEvent: DefaultEvent.selectedEvent,
  },
});
export const Default = Template.bind({});
Default.args = {
  size: 'md',
  disabled: false,
  multiSelect: false,
  fixedWidth: false,
  iconPosition: 'left',
  content: [
    {
      text: 'Left',
      icon: 'add',
    },
    {
      text: 'Middle',
      icon: 'done',
    },
    {
      text: 'Right',
      icon: 'close',
    },
  ],
};

const DefaultEvent = {
  selectedEvent: action('buttonEvent'),
};
