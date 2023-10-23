import { CommonModule } from '@angular/common';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';

export default {
  title: 'Components/Avatar',
  component: AvatarComponent,
  argTypes: {
    size: {
      options: ['lg', 'md', 'sm', 'xs'],
      control: { type: 'radio' },
    },
    img: {
      option: ['https://www.fillmurray.com/140/140'],
      control: { type: 'text' },
    },

    name: {
      option: [{ first: 'John', last: 'Doe' }],
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, AvatarComponent],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta<AvatarComponent>;
const Template: Story<AvatarComponent> = (args: AvatarComponent) => ({
  props: {
    ...args,
  },
});
export const Default = Template.bind({});
Default.args = {
  size: 'md',
  img: 'https://mdbcdn.b-cdn.net/img/new/avatars/8.webp',
  name: { first: 'hari', last: 'kumar' },
};
