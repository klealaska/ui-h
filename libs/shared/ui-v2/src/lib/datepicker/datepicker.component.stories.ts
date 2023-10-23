import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { FormControl, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DatepickerComponent } from './datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

export default {
  title: 'Components/Datepicker',
  component: DatepickerComponent,
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
    hintMessage: {
      control: {
        type: 'text',
      },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MatDatepickerModule],
    }),
  ],
} as Meta<DatepickerComponent>;

const Template: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
  props: {
    ...args,
    dataChange: DefaultEvents.dataChange,
    dataInput: DefaultEvents.dateInput,
    control: new FormControl({ value: '', disabled: false }),
  },
});

const ErrorTemplate: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
  props: {
    ...args,
    dataChange: DefaultEvents.dataChange,
    dataInput: DefaultEvents.dateInput,
    control: new FormControl({ value: '', disabled: false }, [Validators.required]),
  },
});

const DisabledTemplate: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
  props: {
    ...args,
    dataChange: DefaultEvents.dataChange,
    dataInput: DefaultEvents.dateInput,
    control: new FormControl({ value: '', disabled: true }),
  },
});

const ReadOnlyTemplate: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
  props: {
    ...args,
    dataChange: DefaultEvents.dataChange,
    dataInput: DefaultEvents.dateInput,
    control: new FormControl({ value: '', disabled: args.readonly }),
  },
});

export const Default = Template.bind({});
Default.args = {
  fixed: false,
  optional: false,
  label: 'Date Label',
  tooltip: {
    tooltipText: 'This is a tooltip',
  },
  placeholder: 'Enter a date',
  hintMessage: 'MM/DD/YYYY',
};

export const Error = ErrorTemplate.bind({});
Error.args = {
  fixed: false,
  optional: false,
  label: 'Date Label',
  placeholder: 'Enter a date',
  hintMessage: 'MM/DD/YYYY',
  error: {
    message: 'Error message',
    icon: 'error',
  },
};

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  fixed: false,
  optional: false,
  label: 'Date Label',
  placeholder: 'Enter a date',
  hintMessage: 'MM/DD/YYYY',
};

export const ReadOnly = ReadOnlyTemplate.bind({});
ReadOnly.args = {
  readonly: true,
  fixed: false,
  optional: false,
  label: 'Date Label',
  placeholder: 'Enter a date',
  hintMessage: 'MM/DD/YYYY',
};

const DefaultEvents = {
  dataChange: action('dataChange'),
  dateInput: action('dateInput'),
};
