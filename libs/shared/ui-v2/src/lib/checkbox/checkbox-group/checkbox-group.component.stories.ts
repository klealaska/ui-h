import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../../material-ui.module';
import { action } from '@storybook/addon-actions';
import { Component, Input } from '@angular/core';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxComponent } from '../checkbox.component';

@Component({
  selector: 'ax-checkboxgroup',
  template: `
    <div>
      <ax-checkbox-group
        [layout]="layout"
        [labelHeading]="labelHeading"
        [disabled]="disabled"
        name="checkboxButton2"
        [showRequired]="showRequired"
        (checkedChange)="checkedChange($event)"
      >
        <ax-checkbox
          [labelPosition]="labelPosition"
          [(ngModel)]="selectedValueA"
          value="optionA"
          [fixed]="fixed"
        >
          {{ label }}
        </ax-checkbox>
        <ax-checkbox
          [labelPosition]="labelPosition"
          [(ngModel)]="selectedValueB"
          value="optionB"
          [fixed]="fixed"
        >
          {{ label }}
        </ax-checkbox>
        <ax-checkbox
          [labelPosition]="labelPosition"
          [(ngModel)]="selectedValueC"
          value="optionC"
          [fixed]="fixed"
        >
          {{ label }}
        </ax-checkbox>
        <ax-checkbox
          [labelPosition]="labelPosition"
          [(ngModel)]="selectedValueD"
          value="optionD"
          [fixed]="fixed"
        >
          {{ label }}
        </ax-checkbox>
      </ax-checkbox-group>
    </div>
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
class CheckboxGroupButton {
  @Input() labelPosition: string;
  @Input() layout: string;
  @Input() labelHeading: string;
  @Input() label: string;
  @Input() fixed: boolean;
  @Input() showRequired: boolean;
  selectedValueA: boolean = false;
  selectedValueB: boolean = false;
  selectedValueC: boolean = false;
  selectedValueD: boolean = false;
}
export default {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroupButton,
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
      option: ['Checkbox Button Heading Label'],
      control: { type: 'text' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialUiModule,
        CheckboxGroupComponent,
        CheckboxComponent,
      ],
    }),
  ],
} as Meta<CheckboxGroupButton>;
const Template: Story<CheckboxGroupButton> = (args: CheckboxGroupButton) => ({
  props: {
    ...args,
    checkedChange: DefaultEvent.checkedChange,
  },
});
export const Default = Template.bind({});
Default.args = {
  labelPosition: 'right',
  labelHeading: 'Checkbox Group Button Heading Label',
  label: 'Checkbox Button Label',
  layout: 'horizontal',
  disabled: false,
  showRequired: false,
  fixed: false,
};
const DefaultEvent = {
  checkedChange: action('checkedChange'),
};
