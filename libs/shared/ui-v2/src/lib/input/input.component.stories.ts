import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { FormControl, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { InputComponent } from './input.component';
import { SharedUiV2Module } from '../shared-ui-v2.module';

export default {
  title: 'Components/Input',
  component: InputComponent,
  argTypes: {
    fixed: {
      control: {
        type: 'boolean',
      },
    },
    label: {
      control: {
        type: 'text',
      },
    },
    optional: {
      control: {
        type: 'boolean',
      },
    },
    readonly: {
      control: {
        type: 'boolean',
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    hintMessage: {
      control: {
        type: 'text',
      },
    },
    id: {
      control: {
        type: 'text',
      },
    },
    inputType: {
      options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
      control: { type: 'select' },
    },
    maxLength: {
      control: {
        type: 'number',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule, SharedUiV2Module],
    }),
  ],
} as Meta<InputComponent>;

const Template: Story<InputComponent> = (args: InputComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: false }),
    leftIconButtonEvent: DefaultEvents.leftIconButtonEvent,
    rightIconButtonEvent: DefaultEvents.rightIconButtonEvent,
    inputValueEvent: DefaultEvents.inputValueEvent,
  },
});

const ErrorTemplate: Story<InputComponent> = (args: InputComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.email,
    ]),
    leftIconButtonEvent: DefaultEvents.leftIconButtonEvent,
    rightIconButtonEvent: DefaultEvents.rightIconButtonEvent,
    inputValueEvent: DefaultEvents.inputValueEvent,
  },
});

const DisabledTemplate: Story<InputComponent> = (args: InputComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: 'User Input', disabled: true }),
  },
});

const ReadOnlyTemplate: Story<InputComponent> = (args: InputComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: 'User Input', disabled: args.readonly }),
  },
});

export const Default = Template.bind({});
Default.args = {
  fixed: false,
  optional: false,
  label: 'Default Label',
  tooltip: {
    tooltipText: 'This is a tooltip',
  },
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'defaultInput',
  leftIcon: 'add',
  rightIcon: 'add',
  leftIconButton: false,
  rightIconButton: false,
  inputType: 'text',
};

export const Error = ErrorTemplate.bind({});
Error.args = {
  fixed: false,
  optional: false,
  label: 'Error Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'errorInput',
  error: {
    message: 'Error Message',
    icon: 'warning',
  },
  leftIcon: 'add',
  rightIcon: 'add',
  leftIconButton: false,
  rightIconButton: false,
  inputType: 'text',
};

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  fixed: false,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'disabledInput',
  leftIcon: 'add',
  rightIcon: 'add',
  leftIconButton: false,
  rightIconButton: false,
  inputType: 'text',
};

export const ReadOnly = ReadOnlyTemplate.bind({});
ReadOnly.args = {
  fixed: false,
  readonly: true,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'disabledInput',
  leftIcon: 'add',
  rightIcon: 'add',
  leftIconButton: false,
  rightIconButton: false,
  inputType: 'text',
};

const DefaultEvents = {
  leftIconButtonEvent: action('leftIconButtonEvent'),
  rightIconButtonEvent: action('rightIconButtonEvent'),
  inputValueEvent: action('inputValueEvent'),
};
