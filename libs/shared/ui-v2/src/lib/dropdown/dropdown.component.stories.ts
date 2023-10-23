import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { FormControl, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { DropdownComponent } from './dropdown.component';

export default {
  title: 'Components/Dropdown',
  component: DropdownComponent,
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
    id: {
      control: {
        type: 'text',
      },
    },
    label: {
      control: {
        type: 'text',
      },
    },
    hintMessage: {
      control: {
        type: 'text',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule],
    }),
  ],
} as Meta<DropdownComponent>;

const Template: Story<DropdownComponent> = (args: DropdownComponent) => ({
  props: {
    ...args,
    multiple: false,
    control: new FormControl({ value: '', disabled: false }),
    selectEvent: DefaultEvents.selectEvent,
    options: [
      {
        text: 'Option 1',
        value: '1',
      },
      {
        text: 'Option 2',
        value: '2',
      },
      {
        text: 'Option 3',
        value: '3',
      },
      {
        text: 'Option 4',
        value: '4',
      },
      {
        text: 'Option 5',
        value: '5',
      },
      {
        text: 'Option 6',
        value: '6',
      },
      {
        text: 'Option 7',
        value: '7',
      },
    ],
  },
});

const Multiple: Story<DropdownComponent> = (args: DropdownComponent) => ({
  props: {
    ...args,
    multiple: true,
    options: [
      {
        text: 'Option 1',
        value: '1',
      },
      {
        text: 'Option 2',
        value: '2',
      },
      {
        text: 'Option 3',
        value: '3',
      },
      {
        text: 'Option 4',
        value: '4',
      },
    ],
    selectEvent: DefaultEvents.selectEvent,
    control: new FormControl({ value: '', disabled: false }),
  },
});

const ErrorTemplate: Story<DropdownComponent> = (args: DropdownComponent) => ({
  props: {
    ...args,
    options: [
      {
        text: 'Option 1',
        value: '1',
      },
      {
        text: 'Option 2',
        value: '2',
      },
    ],
    control: new FormControl({ value: '', disabled: false }, Validators.required),
  },
});

const DisabledTemplate: Story<DropdownComponent> = (args: DropdownComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: true }),
  },
});

const ReadOnlyTemplate: Story<DropdownComponent> = (args: DropdownComponent) => ({
  props: {
    ...args,
    options: [
      {
        text: 'Option 1',
        value: '1',
      },
    ],
    control: new FormControl({ value: '1', disabled: args.readonly }),
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
  id: 'defaultDropdown',
};

export const Multiselect = Multiple.bind({});
Multiselect.args = {
  fixed: false,
  optional: false,
  label: 'Multiselect Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'MultiselectDropdown',
};

export const Error = ErrorTemplate.bind({});
Error.args = {
  fixed: false,
  label: 'Error Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'errorDropdown',
  error: {
    message: 'Error Message',
    icon: 'warning',
  },
  buttonIcon: '',
  DropdownIcon: '',
  DropdownType: 'text',
};

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  fixed: false,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'disabledDropdown',
};

export const ReadOnly = ReadOnlyTemplate.bind({});
ReadOnly.args = {
  readonly: true,
  fixed: false,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'disabledDropdown',
};

const DefaultEvents = {
  selectEvent: action('selectEvent'),
};
