import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ButtonComponent } from './button.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonTypes, ButtonColors, ButtonSizes } from '@ui-coe/shared/types';

export default {
  title: 'Components/Button',
  component: ButtonComponent,
  argTypes: {
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
    disabled: { control: 'boolean' },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MatIconModule],
    }),
  ],
} as Meta<ButtonComponent>;
const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  template: `
  <ax-button [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
    {{text}}
  </ax-button>`,
  props: {
    ...args,
  },
});

export const Button = Template.bind({});
Button.args = {
  fixed: false,
  text: 'Button',
  type: 'primary',
  color: 'default',
  size: 'lg',
  disabled: false,
};

const BtnWithIconTemplate: Story<ButtonComponent> = (args: ButtonComponent) => ({
  template: `
    <ax-button [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
      <mat-icon>add</mat-icon>
      {{text}}
    </ax-button>`,
  props: {
    ...args,
  },
});

export const ButtonWithIcon = BtnWithIconTemplate.bind({});
ButtonWithIcon.args = {
  fixed: false,
  text: 'Button',
  type: 'primary',
  color: 'default',
  size: 'lg',
  disabled: false,
};

const IconTemplate: Story<ButtonComponent> = (args: ButtonComponent) => ({
  template: `
  <ax-button [type]="type" [color]="color" [disabled]="disabled" [size]="size">
    <mat-icon>add</mat-icon>
  </ax-button>`,
  props: {
    ...args,
  },
});

export const IconButton = IconTemplate.bind({});
IconButton.args = {
  type: 'primary',
  color: 'default',
  size: 'lg',
  disabled: false,
};

const ButtonGroupTemplate: Story<ButtonComponent> = (args: ButtonComponent) => ({
  template: `
    <h1 style="font-weight: bold; margin: 10px 0px">Button group is purely a visual example and not a button variant</h1>

    <div style="margin: 5px 0px;">
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
    </div>

    <div style="margin: 5px 0px;">
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
    </div>

    <div style="margin: 5px 0px;">
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
    </div>

    <div style="margin: 5px 0px;">
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
    </div>

    <div style="margin: 5px 0px;">
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
    </div>

    <div style="margin: 5px 0px;">
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
      <ax-button style="margin: 0px 2.5px" [fixed]="fixed" [type]="type" [color]="color" [disabled]="disabled" [size]="size">
        {{text}}
      </ax-button>
    </div>
  `,
  props: {
    ...args,
  },
});

export const ButtonGroup = ButtonGroupTemplate.bind({});
ButtonGroup.args = {
  text: 'Button',
  type: 'primary',
  color: 'default',
  size: 'lg',
  fixed: false,
  disabled: false,
};
