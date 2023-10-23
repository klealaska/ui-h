import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ExpansionPanelComponent } from './expansion-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';

export default {
  title: 'Components/Accordion',
  component: ExpansionPanelComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MatExpansionModule],
    }),
  ],
  argTypes: {
    type: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
    multi: {
      control: { type: 'boolean' },
    },
    title: {
      control: { type: 'text' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    expanded: {
      control: { type: 'boolean' },
    },
  },
} as Meta;

const Template: Story<ExpansionPanelComponent> = (args: ExpansionPanelComponent) => ({
  template: `
  <mat-accordion>
    <ax-expansion-panel [type]="type" [title]="title" [disabled]="disabled" [expanded]="expanded">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.</ax-expansion-panel>
  </mat-accordion>`,
  props: args,
});

const Multi: Story<ExpansionPanelComponent> = (args: ExpansionPanelComponent) => ({
  template: `
  <mat-accordion [multi]="multi">
    <ax-expansion-panel [type]="type" [title]="title" [disabled]="disabled" [expanded]="expanded">Content Projection</ax-expansion-panel>
    <ax-expansion-panel [type]="type" [title]="title" [disabled]="disabled" [expanded]="expanded">Content Projection</ax-expansion-panel>
    <ax-expansion-panel [type]="type" [title]="title" [disabled]="disabled" [expanded]="expanded">Content Projection</ax-expansion-panel>
  </mat-accordion>`,
  props: args,
});

const ExpandEvents: Story<ExpansionPanelComponent> = (args: ExpansionPanelComponent) => ({
  template: `
  <mat-accordion>
    <ax-expansion-panel
      [type]="type"
      [title]="title"
      [disabled]="disabled"
      [expanded]="expanded"
      (afterCollapse)="afterCollapse($event)"
      (afterExpand)="afterExpand($event)"
      (closed)="closed($event)"
      (destoryed)="destoryed($event)"
      (opened)="opened($event)"
    >
      Content Projection
    </ax-expansion-panel>
  </mat-accordion>`,
  props: {
    ...args,
    afterCollapse: DefaultEvents.afterCollapse,
    afterExpand: DefaultEvents.afterExpand,
    closed: DefaultEvents.closed,
    destroyed: DefaultEvents.destroyed,
    opened: DefaultEvents.opened,
  },
});

export const Default = Template.bind({});
Default.args = {
  type: 'primary',
  multi: false,
  title: 'Accordion Title',
  disabled: false,
  expanded: false,
};

export const Multiple = Multi.bind({});
Multiple.args = {
  type: 'primary',
  multi: false,
  title: 'Accordion Title',
  disabled: false,
  expanded: false,
};

export const Events = ExpandEvents.bind({});
Events.args = {
  type: 'primary',
  multi: false,
  title: 'Accordion Title',
  disabled: false,
  expanded: false,
};

const DefaultEvents = {
  afterCollapse: action('afterCollapse'),
  afterExpand: action('afterExpand'),
  closed: action('closed'),
  destroyed: action('destroyed'),
  opened: action('opened'),
};
