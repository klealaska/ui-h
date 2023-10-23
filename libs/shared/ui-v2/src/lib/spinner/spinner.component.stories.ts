import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta } from '@storybook/angular';
import { SpinnerComponent } from './spinner.component';
import { SpinnerColors, SpinnerSizes } from '@ui-coe/shared/types';

export default {
  title: 'Components/Spinner',
  component: SpinnerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, SpinnerComponent],
    }),
  ],
  argTypes: {
    size: {
      options: SpinnerSizes,
      control: { type: 'radio' },
    },
    color: {
      options: SpinnerColors,
      control: { type: 'radio' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<SpinnerComponent>;

const Template = (args: SpinnerComponent) => ({
  props: {
    ...args,
  },
});

export const Primary = Template.bind({});
Primary.args = {
  size: 'lg',
  color: 'default',
};
