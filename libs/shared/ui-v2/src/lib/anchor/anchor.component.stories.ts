import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AnchorComponent } from './anchor.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonTypes, ButtonColors, ButtonSizes } from '@ui-coe/shared/types';

export default {
  title: 'Components/Button',
  component: AnchorComponent,
  argTypes: {
    href: {
      control: { type: 'text' },
    },
    type: {
      control: 'select',
      options: ButtonTypes,
    },
    color: {
      control: 'select',
      options: ButtonColors,
    },
    size: {
      control: 'select',
      options: ButtonSizes,
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MatIconModule],
    }),
  ],
} as Meta<AnchorComponent>;
const Template: Story<AnchorComponent> = (args: AnchorComponent) => ({
  template: `
  <ax-anchor [fixed]="fixed" [href]="href" [type]="type" [color]="color" [size]="size" (btnClick)="btnClick($event)">
    {{text}}
  </ax-anchor>`,
  props: {
    ...args,
    btnClick: DefaultEvents.btnClick,
  },
});

export const Anchor = Template.bind({});
Anchor.args = {
  fixed: false,
  text: 'Anchor',
  type: 'primary',
  color: 'default',
  size: 'lg',
  href: '#',
};

const AnchorWithIconTemplate: Story<AnchorComponent> = (args: AnchorComponent) => ({
  template: `
  <ax-anchor [fixed]="fixed" [href]="href" [type]="type" [color]="color" [size]="size" (btnClick)="btnClick($event)">
    <mat-icon>add</mat-icon>
    {{text}}
  </ax-anchor>`,
  props: {
    ...args,
    btnClick: DefaultEvents.btnClick,
  },
});

export const AnchorWithIcon = AnchorWithIconTemplate.bind({});
AnchorWithIcon.args = {
  fixed: false,
  text: 'Anchor',
  type: 'primary',
  color: 'default',
  size: 'lg',
  href: '#',
};

const IconTemplate: Story<AnchorComponent> = (args: AnchorComponent) => ({
  template: `
  <ax-anchor [href]="href" [type]="type" [color]="color" [size]="size" (btnClick)="btnClick($event)">
    <mat-icon>add</mat-icon>
  </ax-anchor>`,
  props: {
    ...args,
    btnClick: DefaultEvents.btnClick,
  },
});

export const IconAnchor = IconTemplate.bind({});
IconAnchor.args = {
  type: 'primary',
  color: 'default',
  size: 'lg',
  href: '#',
};

const DefaultEvents = {
  btnClick: action('btnClick'),
};
