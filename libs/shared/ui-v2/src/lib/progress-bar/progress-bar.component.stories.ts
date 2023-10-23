import { CommonModule } from '@angular/common';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ProgressBarComponent } from './progress-bar.component';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBarComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ProgressBarComponent],
    }),
  ],
  argTypes: {
    label: {
      control: { type: 'text' },
    },
    icon: {
      control: { type: 'text' },
    },
    text: {
      control: { type: 'text' },
    },
    percentage: {
      control: { type: 'number' },
    },
    showPercentage: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'text' },
    },
    size: {
      options: ['small', 'large'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<ProgressBarComponent>;

const Template: Story<ProgressBarComponent> = (args: ProgressBarComponent) => ({
  props: {
    ...args,
    iconEvent: clickEvent.iconEvent,
  },
});

export const Primary = Template.bind({});
Primary.args = {
  label: 'Progresss Bar Label',
  icon: 'delete',
  text: 'Helper text',
  percentage: 25,
  showPercentage: true,
  error: 'error message',
  size: 'small',
};

const clickEvent = {
  iconEvent: action('clickEvent'),
};
