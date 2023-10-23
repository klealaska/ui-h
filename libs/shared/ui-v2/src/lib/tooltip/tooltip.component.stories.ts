import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MatIconModule } from '@angular/material/icon';
import { PointerPosition, TooltipPosition, TooltipStyle } from '@ui-coe/shared/types';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

export default {
  title: 'Components/Tooltip',
  component: TooltipComponent,
  decorators: [
    moduleMetadata({
      imports: [
        MatTooltipModule,
        CommonModule,
        BrowserAnimationsModule,
        TooltipComponent,
        TooltipDirective,
        MatIconModule,
      ],
    }),
  ],
  argTypes: {
    tooltipText: {
      control: { type: 'text' },
    },
    tooltipStyle: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
    tooltipImage: {
      option: ['http://via.placeholder.com/271x95'],
      control: { type: 'text' },
    },
    tooltipPosition: {
      options: ['above', 'below', 'left', 'right'],
      control: { type: 'radio' },
    },
    pointerPosition: {
      options: ['start', 'center', 'end'],
      control: { type: 'radio' },
    },
    dynamicOverflow: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<TooltipComponent>;

const Template: Story<TooltipComponent> = (args: TooltipComponent) => ({
  template: `
  <div style="display : flex; align-items: center; flex-direction: column;">
    <h1>
      Click the refresh button next to "DOCS" after updating tooltip position to see changes.
    </h1>
    <mat-icon
      [axTooltip]="tooltipText"
      [axTooltipStyle]="tooltipStyle"
      [axTooltipImage]="tooltipImage"
      [axTooltipPosition]="tooltipPosition"
      [axTooltipPointerPosition]="pointerPosition"
      >help</mat-icon
    >
  </div>
  `,
  props: { ...args },
});

export const Primary = Template.bind({});
Primary.args = {
  tooltipText:
    'Info about the action. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  tooltipStyle: 'primary',
  tooltipImage: 'http://via.placeholder.com/271x95',
  tooltipPosition: 'left',
  pointerPosition: 'end',
};

const overflowExample: Story<TooltipComponent> = (args: TooltipComponent) => ({
  template: `
  <div style="display: flex; align-items: center; flex-direction: column;">
    <div style="max-width: 850px; font-weight: bold;">The text below gets truncated when it overflows. Setting dynamicOverflow to true will display a tooltip showing the entire value when truncated and removing tooltip when not. Modify tooltipText below to see this in action.</div>
    <br>
    <div 
      [axTooltip]="tooltipText"
      [axTooltipStyle]="tooltipStyle"
      [axTooltipPosition]="tooltipPosition"
      [axTooltipPointerPosition]="pointerPosition"
      [axDynamicOverflow]="true"
      class="truncate"
      style="max-width: 250px">
        {{tooltipText}}
    </div>
    </div>
  `,
  props: {
    ...args,
  },
});
export const overflowTooltip = overflowExample.bind({});
overflowTooltip.args = {
  tooltipText:
    'This is really long text that gets truncated so we use tooltip to display the rest of the value',
  tooltipStyle: 'primary',
  tooltipPosition: 'below',
  pointerPosition: 'center',
  dynamicOverflow: true,
};
