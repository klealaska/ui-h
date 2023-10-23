import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { MaterialUiModule } from '@ui-coe/shared/ui-v2';
import { RadioButtonComponent } from '../radio-button.component';
import { RadioGroupComponent } from './radio-group.component';

@Component({
  selector: 'ax-radiogroup',
  template: `
    <ax-radio-group
      [layout]="layout"
      [labelHeading]="labelHeading"
      (valueChange)="onChange($event)"
      [(ngModel)]="selectedValue"
      [disabled]="disabled"
      name="radioButton2"
      [showRequired]="showRequired"
    >
      <ax-radio-button [labelPosition]="labelPosition" value="optionA" [fixed]="fixed">
        {{ label }}
      </ax-radio-button>
      <ax-radio-button [labelPosition]="labelPosition" value="optionB" [fixed]="fixed">
        {{ label }}
      </ax-radio-button>
      <ax-radio-button [labelPosition]="labelPosition" value="optionC" [fixed]="fixed">
        {{ label }}
      </ax-radio-button>
      <ax-radio-button [labelPosition]="labelPosition" value="optionD" [fixed]="fixed">
        {{ label }}
      </ax-radio-button>
      <ax-radio-button [labelPosition]="labelPosition" value="optionF" [fixed]="fixed">
        {{ label }}
      </ax-radio-button>
    </ax-radio-group>
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
class RadioGroup {
  @Input() labelPosition: string;
  @Input() layout: string;
  @Input() labelHeading: string;
  @Input() label: string;
  @Input() fixed: boolean;
  @Input() showRequired: boolean;
  selectedValue: string = 'optionA';
}

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  argTypes: {
    labelPosition: {
      options: ['left', 'right'],
      control: { type: 'radio' },
    },
    layout: {
      options: ['vertical', 'horizontal'],
      control: { type: 'radio' },
    },
    labelHeading: {
      option: ['Radio Button Heading Label'],
      control: { type: 'text' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialUiModule,
        RadioButtonComponent,
        RadioGroupComponent,
      ],
    }),
  ],
} as Meta<RadioGroup>;
const Template: Story<RadioGroup> = (args: RadioGroup) => ({
  props: {
    ...args,
    onChange: DefaultEvent.valueChange,
  },
});
export const Default = Template.bind({});
Default.args = {
  labelPosition: 'right',
  labelHeading: 'Radio Button Heading Label',
  label: 'Radio Button Label',
  layout: 'horizontal',
  disabled: false,
  fixed: false,
  showRequired: false,
};

const DefaultEvent = {
  valueChange: action('valeChange'),
};
