import { CommonModule } from '@angular/common';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { EmptyStateComponent } from './empty-state.component';
import { ButtonComponent } from '../button/button.component';

export default {
  title: 'Components/EmptyState',
  component: EmptyStateComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ButtonComponent],
    }),
  ],
  argTypes: {
    icon: {
      control: {
        type: 'text',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    text: {
      control: {
        type: 'text',
      },
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    background: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<EmptyStateComponent>;

const Template: Story<EmptyStateComponent> = (args: EmptyStateComponent) => ({
  template: `
    <div class="grid grid-cols-12">
    <ax-empty-state
    class="col-start-4 col-span-6"
    [icon]="icon"
    [title]="title"
    [text]="text"
    [size]="size"
    [background]="background"
    >
        <ax-button
            [fixed]="false"
            [type]="'secondary'"
            [color]="'default'"
            [size]="'sm'"
            [disabled]="false"
        >
            Action 1
        </ax-button>
        <ax-button
            [fixed]="false"
            [type]="'primary'"
            [color]="'default'"
            [size]="'sm'"
            [disabled]="false"
        >
            Action 2
        </ax-button>
    </ax-empty-state>
    </div>
    `,
  props: {
    ...args,
    fileEvent: DefaultEvent.clickEvent,
  },
});

export const Primary = Template.bind({});
Primary.args = {
  icon: 'error',
  title: 'Empty state title',
  text: 'Put the empty state message here. Clearly state what caused the empty state and/or what the user can do to see data.',
  size: 'lg',
  background: true,
};

const DefaultEvent = {
  clickEvent: action('clickEvent'),
};
