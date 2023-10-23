import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { FormControl, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { TextareaComponent } from './textarea.component';

export default {
  title: 'Components/Textarea',
  component: TextareaComponent,
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
} as Meta<TextareaComponent>;

const Template: Story<TextareaComponent> = (args: TextareaComponent) => ({
  props: {
    ...args,
    textareaValueEvent: DefaultEvents.textareaValueEvent,
    control: new FormControl({ value: '', disabled: false }),
  },
});

const ErrorTemplate: Story<TextareaComponent> = (args: TextareaComponent) => ({
  props: {
    ...args,
    textareaValueEvent: DefaultEvents.textareaValueEvent,
    control: new FormControl({ value: '', disabled: false }, [Validators.required]),
  },
});

const DisabledTemplate: Story<TextareaComponent> = (args: TextareaComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: true }),
  },
});

const ReadOnlyTemplate: Story<TextareaComponent> = (args: TextareaComponent) => ({
  props: {
    ...args,
    control: new FormControl({ value: '', disabled: args.readonly }),
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
    message: 'Required',
    icon: 'warning',
  },
};

export const Disabled = DisabledTemplate.bind({});
Disabled.args = {
  fixed: false,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'defaultInput',
};

export const ReadOnly = ReadOnlyTemplate.bind({});
ReadOnly.args = {
  readonly: true,
  fixed: false,
  optional: false,
  label: 'Disabled Label',
  placeholder: 'Placeholder',
  hintMessage: 'Hint',
  id: 'defaultInput',
};

const DefaultEvents = {
  textareaValueEvent: action('textareaValueEvent'),
};
