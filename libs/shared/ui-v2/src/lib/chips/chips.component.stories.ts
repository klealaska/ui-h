import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { ChipsComponent } from './chips.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Chips',
  component: ChipsComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ChipsComponent],
    }),
  ],
  argTypes: {
    style: {
      options: ['filled', 'outline'],
      control: { type: 'radio' },
    },
    type: {
      options: ['default', 'error'],
      control: { type: 'radio' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    avatarInput: {
      img: {
        option: ['https://www.fillmurray.com/140/140'],
        control: { type: 'text' },
      },
      name: '',
    },
    chipsLabel: {
      control: { type: 'text' },
    },
    removable: { control: 'boolean' },
    selected: { control: 'boolean' },
    selectable: { control: 'boolean' },
    filterText: {
      control: { type: 'text' },
    },
    disabled: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<ChipsComponent>;

const Template: Story<ChipsComponent> = (args: ChipsComponent) => ({
  props: {
    ...args,
    selectedState: DefaultEvents.selectedState,
    onremove: DefaultEvents.onremove,
  },
});

const DefaultEvents = {
  selectedState: action('selectedState'),
  onremove: action('onremove'),
};

const defaultProps = {
  style: 'filled',
  type: 'default',
  size: 'lg',
  avatarInput: {
    img: 'https://mdbcdn.b-cdn.net/img/new/avatars/8.webp',
    name: {
      first: 'hari',
      last: 'kumar',
    },
  },
  chipsLabel: 'Chips text',
  removable: true,
  selected: false,
  selectable: true,
  filterText: 'Filter text',
  disabled: false,
};

export const Default = Template.bind({});
Default.args = {
  ...defaultProps,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...defaultProps,
  type: 'disabled',
};
