import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { action } from '@storybook/addon-actions';
import { CheckboxComponent } from './checkbox.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ax-alone-checkbox',
  template: `
    <div>
      <ax-checkbox
        [indeterminate]="indeterminate"
        [disabled]="disabled"
        [noText]="noText"
        [(ngModel)]="selectedValueA"
        value="optionA"
        [fixed]="fixed"
      ></ax-checkbox>
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
class CheckboxNoLabel {
  @Input() noText: string;
  @Input() indeterminate: boolean;
  @Input() disabled: boolean;
  selectedValueA: boolean = false;
  selectedValueB: boolean = false;
}

export default {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule, CheckboxComponent],
    }),
  ],
} as Meta<CheckboxComponent>;
const Template: Story<CheckboxComponent> = (args: CheckboxComponent) => ({
  props: {
    ...args,
    checkedChange: DefaultEvent.checkedChange,
  },
});
export const Default = Template.bind({});
Default.args = {
  label: 'Checkbox Label',
  disabled: false,
  indeterminate: false,
  fixed: false,
};
const DefaultEvent = {
  checkedChange: action('checkedChange'),
};

const NoLabelCheckboxTemplate: Story<CheckboxNoLabel> = (args: CheckboxNoLabel) => ({
  props: {
    ...args,
    checkedChange: DefaultEvent.checkedChange,
  },
  component: CheckboxNoLabel,
  decorators: [
    moduleMetadata({
      imports: [CheckboxComponent],
    }),
  ],
});
export const NoLabelCheckbox = NoLabelCheckboxTemplate.bind({});
NoLabelCheckbox.args = {
  disabled: false,
  indeterminate: false,
  noText: true,
};
