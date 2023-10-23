import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { FormControl, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { AutocompleteComponent } from './autocomplete.component';

export default {
  title: 'Components/Autocomplete',
  component: AutocompleteComponent,
  argTypes: {
    fixed: {
      control: {
        type: 'boolean',
      },
    },
    optional: {
      control: {
        type: 'boolean',
      },
    },
    label: {
      control: {
        type: 'text',
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
    maxLength: {
      control: {
        type: 'number',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule],
    }),
  ],
} as Meta<AutocompleteComponent>;

const Template: Story<AutocompleteComponent> = (args: AutocompleteComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: false }),
    selectEvent: DefaultEvents.selectEvent,
  },
});

const ErrorTemplate: Story<AutocompleteComponent> = (args: AutocompleteComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: false }, Validators.required),
    selectEvent: DefaultEvents.selectEvent,
  },
});

const DisabledTemplate: Story<AutocompleteComponent> = (args: AutocompleteComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: true }),
  },
});

const ReadOnlyTemplate: Story<AutocompleteComponent> = (args: AutocompleteComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: 'User Input', disabled: args.readonly }),
  },
});

export const Default = Template.bind({});
Default.args = {
  fixed: false,
  optional: false,
  label: 'Basic Label',
  tooltip: {
    tooltipText: 'This is a tooltip',
  },
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'defaultAutocomplete',
  options: [
    {
      text: 'Option 1',
      value: 'Option 1',
    },
    {
      text: 'Option 2',
      value: 'Option 2',
    },
    {
      text: 'Option 3',
      value: 'Option 3',
    },
    {
      text: 'Option 4',
      value: 'Option 4',
    },
    {
      text: 'Option 5',
      value: 'Option 5',
    },
    {
      text: 'Option 6',
      value: 'Option 6',
    },
    {
      text: 'Option 7',
      value: 'Option 7',
    },
    {
      text: 'Option 8',
      value: 'Option 8',
    },
  ],
};

export const Error = ErrorTemplate.bind({});
Error.args = {
  fixed: false,
  optional: false,
  label: 'Error Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'errorAutocomplete',
  error: {
    message: 'Error Message',
    icon: 'warning',
  },
  options: [
    {
      text: 'Option 1',
      value: 'Option 1',
    },
    {
      text: 'Option 2',
      value: 'Option 2',
    },
  ],
};

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  fixed: false,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'disabledAutocomplete',
};

export const ReadOnly = ReadOnlyTemplate.bind({});
ReadOnly.args = {
  fixed: false,
  readonly: true,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'disabledAutocomplete',
};

const DefaultEvents = {
  selectEvent: action('selectEvent'),
};
