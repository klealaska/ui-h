import { CommonModule } from '@angular/common';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { AvatarComponent } from '../../src/lib/avatar/avatar.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MinmaxPipe } from '@ui-coe/shared/util/pipes';

@Component({
  selector: 'badge',
  template: `
    <ax-avatar
      [size]="avatarSize"
      [name]="{ first: 'John', last: 'Doe' }"
      [matBadgeSize]="badgeSize"
      [matBadge]="badgeCount | minmax: 1:999:(badgeCount > 0 ? '999+' : '')"
      [matBadgeColor]="badgeColor"
      matBadgePosition="above after"
      matBadgeOverlap="true"
    ></ax-avatar>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
    `,
  ],
})
class MatBadgeComponent {
  @Input() vertical: boolean;
  @Input() avatarSize = 'md';
  @Input() badgeCount: string | number;
}

export default {
  component: MatBadgeComponent,
  title: 'Components/Material/Badge',
  argTypes: {
    avatarSize: {
      options: ['lg', 'md', 'sm', 'xs'],
      control: { type: 'radio' },
    },
    badgeCount: {
      control: { type: 'number' },
    },
    badgeSize: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
    badgeColor: {
      options: [
        'informational',
        'dark',
        'light',
        'informational-stroked',
        'dark-stroked',
        'light-stroked',
      ],
      control: { type: 'radio' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, AvatarComponent, MatBadgeModule],
      declarations: [MinmaxPipe],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta;

const Template: Story<MatBadgeComponent> = (args: MatBadgeComponent) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {
  avatarSize: 'lg',
  badgeSize: 'large',
  badgeCount: 1,
  badgeColor: 'informational',
};
