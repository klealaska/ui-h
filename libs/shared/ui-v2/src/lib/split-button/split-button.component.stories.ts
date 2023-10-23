import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { SplitButtonComponent } from './split-button.component';
import { MaterialUiModule } from '../material-ui.module';

export default {
  title: 'Components/SplitButton',
  component: SplitButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule],
    }),
  ],
  argTypes: {
    text: {
      control: { type: 'text' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    type: {
      options: ['primary', 'secondary', 'tertiary'],
      control: { type: 'radio' },
    },
    color: {
      options: ['default', 'critical', 'neutral'],
      control: { type: 'radio' },
    },
    yPosition: {
      options: ['above', 'below'],
      control: { type: 'radio' },
    },
    fixed: {
      options: ['true', 'false'],
      control: { type: 'boolean' },
    },
    disabled: {
      options: ['true', 'false'],
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<SplitButtonComponent>;

const Template: Story<SplitButtonComponent> = (args: SplitButtonComponent) => ({
  template: `
  <ax-split-button
    [dropdown]="dropdown"
    [type]="type"
    [color]="color"
    [disabled]="disabled"
    [fixed]="fixed"
    [yPosition]="yPosition"
    [size]="size">
    {{text}}
  </ax-split-button>
  `,
  props: {
    ...args,
    buttonEvent: DefaultEvent.buttonEvent,
  },
});

export const Default = Template.bind({});
Default.args = {
  text: 'Split button',
  dropdown: ['Suggestion', 'Suggestion', 'Suggestion'],
  size: 'sm',
  type: 'primary',
  color: 'default',
  yPosition: 'below',
  fixed: false,
  disabled: false,
};

const DefaultEvent = {
  buttonEvent: action('buttonEvent'),
};
