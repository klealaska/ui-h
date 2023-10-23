import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';

import { SharedUiV2Module } from '../shared-ui-v2.module';
import { ListComponent } from './list.component';

export default {
  title: 'Components/List',
  component: ListComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, SharedUiV2Module],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta<ListComponent>;

const Template: Story<ListComponent> = (args: ListComponent) => ({
  props: {
    ...args,
    itemEvent: DefaultEvent.itemEvent,
  },
});

export const Primary = Template.bind({});
Primary.args = {
  unordered: true,
  items: ['lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum', 'lorem ipsum'],
  disabled: false,
};

const DefaultEvent = {
  itemEvent: action('buttonEvent'),
};
