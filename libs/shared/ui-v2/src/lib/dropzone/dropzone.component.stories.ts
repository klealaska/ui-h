import { CommonModule } from '@angular/common';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { DropzoneComponent } from './dropzone.component';
import { SharedUiV2Module } from '../shared-ui-v2.module';

export default {
  title: 'Components/Dropzone',
  component: DropzoneComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SharedUiV2Module],
    }),
  ],
  argTypes: {
    content: {
      control: { type: 'object' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<DropzoneComponent>;

const Template: Story<DropzoneComponent> = (args: DropzoneComponent) => ({
  props: {
    ...args,
    fileEvent: DefaultEvent.fileEvent,
  },
});

export const Primary = Template.bind({});
Primary.args = {
  content: {
    linkText: 'Select files',
    icon: 'description',
    message: 'or drop here to upload',
  },
  supportedFileTypes: '.png, .jpeg, .pdf',
  maxFileSize: 5,
  error: false,
  disabled: false,
};

const DefaultEvent = {
  fileEvent: action('fileEvent'),
};
