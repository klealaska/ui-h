import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { LinkComponent } from './link.component';
import { MatIconModule } from '@angular/material/icon';
import { ComponentSizes } from '@ui-coe/shared/types';

export default {
  title: 'Components/Link',
  component: LinkComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, MatIconModule],
    }),
  ],
  argTypes: {
    text: {
      control: { type: 'text' },
    },
    href: {
      control: { type: 'text' },
    },
    icon: {
      control: { type: 'text' },
    },
    disabled: {
      options: ['true', 'false'],
      control: { type: 'boolean' },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<LinkComponent>;

const Template: Story<LinkComponent> = (args: LinkComponent) => ({
  template: `
  <ax-link [size]="size" [disabled]="disabled">
    <a href="{{href}}"> {{ text }}
      <mat-icon>
        {{ icon }}
      </mat-icon>
    </a>
  </ax-link>
  `,
  props: {
    ...args,
  },
});

export const IconLink = Template.bind({});
IconLink.args = {
  text: 'Learn more',
  href: 'https://www.google.com',
  icon: 'open_in_new',
  disabled: false,
  size: ComponentSizes.sm,
};

const PlainLink: Story<LinkComponent> = (args: LinkComponent) => ({
  template: `
  <ax-link [size]="size" [disabled]="disabled">
    <a href="{{href}}">{{ text }}</a>
  </ax-link>
  `,
  props: {
    ...args,
  },
});
export const SimpleLink = PlainLink.bind({});
SimpleLink.args = {
  text: 'Learn more',
  href: 'https://www.google.com',
  disabled: false,
  size: ComponentSizes.sm,
};
