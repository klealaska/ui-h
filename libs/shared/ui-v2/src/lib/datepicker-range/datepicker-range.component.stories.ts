import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { FormControl, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DatepickerRangeComponent } from './datepicker-range.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

export default {
  title: 'Components/DatepickerRange',
  component: DatepickerRangeComponent,
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
} as Meta<DatepickerRangeComponent>;

const Template: Story<DatepickerRangeComponent> = (args: DatepickerRangeComponent) => ({
  props: {
    ...args,
    startDataChange: DefaultEvents.startDataChange,
    startDateInput: DefaultEvents.startDateInput,
    endDataChange: DefaultEvents.endDataChange,
    endDateInput: DefaultEvents.endDateInput,
  },
});

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  fixed: false,
  optional: false,
  label: 'Date Label',
  tooltip: {
    tooltipText: 'This is a tooltip',
  },
  hintMessage: 'MM/DD/YYYY',
};

const ErrorTemplate: Story<DatepickerRangeComponent> = (args: DatepickerRangeComponent) => ({
  props: {
    ...args,
    startControl: new FormControl('', [Validators.required]),
    endControl: new FormControl('', [Validators.required]),
    startDataChange: DefaultEvents.startDataChange,
    startDateInput: DefaultEvents.startDateInput,
    endDataChange: DefaultEvents.endDataChange,
    endDateInput: DefaultEvents.endDateInput,
  },
});

export const Error = ErrorTemplate.bind({});
Error.args = {
  fixed: false,
  optional: false,
  label: 'Date Label',
  hintMessage: 'MM/DD/YYYY',
  error: {
    message: 'Error message',
    icon: 'error',
  },
};

const DisabledTemplate: Story<DatepickerRangeComponent> = (args: DatepickerRangeComponent) => ({
  props: {
    ...args,
  },
});

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  disabled: true,
  fixed: false,
  optional: false,
  label: 'Date Label',
  hintMessage: 'MM/DD/YYYY',
};

const ReadOnlyTemplate: Story<DatepickerRangeComponent> = (args: DatepickerRangeComponent) => ({
  props: {
    ...args,
  },
});

export const ReadOnly = ReadOnlyTemplate.bind({});
ReadOnly.args = {
  disabled: true,
  readonly: true,
  fixed: false,
  optional: false,
  label: 'Date Label',
  hintMessage: 'MM/DD/YYYY',
};

const DefaultEvents = {
  startDataChange: action('startDataChange'),
  startDateInput: action('startDateInput'),
  endDataChange: action('endDataChange'),
  endDateInput: action('endDateInput'),
};
