import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { SharedUiV2Module } from '../../src/lib/shared-ui-v2.module';
import { TooltipStyle } from '@ui-coe/shared/types';

@Component({
  selector: 'tooltip',
  template: `
    <mat-icon
      [matTooltip]="tooltipText"
      [matTooltipPosition]="tooltipPosition"
      matTooltipClass="ax-tooltip__{{ tooltipStyle }} {{ tooltipPosition }}--{{ pointerPosition }}"
      >help</mat-icon
    >
  `,
})
class MatTooltipComponent {
  @Input() tooltipText: string;
  @Input() tooltipStyle: TooltipStyle;
  @Input() tooltipPosition: TooltipPosition;
  @Input() pointerPosition: string;
}

export default {
  component: MatTooltipComponent,
  title: 'Components/Material/Tooltip',
  argTypes: {
    tooltipText: {
      control: { type: 'text' },
    },
    tooltipStyle: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
    tooltipPosition: {
      options: ['above', 'below', 'left', 'right', 'before', 'after'],
      control: { type: 'radio' },
    },
    pointerPosition: {
      options: ['none'],
      control: { type: 'radio' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [MatIconModule, CommonModule, BrowserAnimationsModule, SharedUiV2Module],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
} as Meta;

const Template: Story<MatTooltipComponent> = (args: MatTooltipComponent) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {
  tooltipText: 'Info about the action',
  tooltipStyle: 'primary',
  tooltipPosition: 'below',
  pointerPosition: 'none',
};
