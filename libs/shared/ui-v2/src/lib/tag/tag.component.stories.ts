import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { TagComponent } from './tag.component';

export default {
  title: 'Components/Tag',
  component: TagComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, TagComponent],
    }),
  ],
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    type: {
      options: ['default', 'success', 'warning', 'critical', 'informational'],
      control: { type: 'radio' },
    },
    style: {
      options: ['filled', 'border'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<TagComponent>;

const Template: Story<TagComponent> = (args: TagComponent) => ({
  props: {
    ...args,
  },
});

export const Default = Template.bind({});
Default.args = {
  size: 'md',
  type: 'success',
  style: 'filled',
  icon: 'check',
  text: 'success',
};
