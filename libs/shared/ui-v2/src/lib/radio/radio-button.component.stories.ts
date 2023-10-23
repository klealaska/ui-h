import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { action } from '@storybook/addon-actions';
import { RadioButtonComponent } from './radio-button.component';
import { Component, Input } from '@angular/core';
import { MarkAsteriskDirective } from '@ui-coe/shared/util/directives';
@Component({
  selector: 'ax-alone-radio',
  template: `
    <div>
      <ax-radio-button
        [labelPosition]="labelPosition"
        value="optionD"
        [noText]="noText"
        [disabled]="disabled"
        (valueChange)="onChange($event)"
        >Label Inside</ax-radio-button
      >
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
class RadioNoLabel {
  @Input() noText: string;
  @Input() disabled: boolean;
  @Input() labelPosition: string;
  @Input() label: string;
}

export default {
  title: 'Components/RadioButton',
  component: RadioButtonComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialUiModule,
        RadioButtonComponent,
        MarkAsteriskDirective,
      ],
    }),
  ],
} as Meta<RadioButtonComponent>;
const Template: Story<RadioButtonComponent> = (args: RadioButtonComponent) => ({
  props: {
    ...args,
    onChange: DefaultEvent.valueChange,
  },
});
export const Default = Template.bind({});
Default.args = {
  label: 'Radio Label',
  disabled: false,
  fixed: false,
};

const DefaultEvent = {
  valueChange: action('valeChange'),
};

const NoLabelRadioTemplate: Story<RadioNoLabel> = (args: RadioNoLabel) => ({
  props: {
    ...args,
    onChange: DefaultEvent.valueChange,
  },
  component: RadioNoLabel,
  decorators: [
    moduleMetadata({
      imports: [RadioButtonComponent],
    }),
  ],
});
export const NoLabelRadioButton = NoLabelRadioTemplate.bind({});
NoLabelRadioButton.args = {
  disabled: false,
  noText: true,
};
