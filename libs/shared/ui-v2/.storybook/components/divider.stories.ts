import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'divider',
  template: `
    <mat-divider></mat-divider>
    <br />
    <hr />
    <br />
    <mat-divider [vertical]="vertical"></mat-divider>
  `,
})
class MatDividerComponent {
  @Input() vertical: boolean;
}

export default {
  component: MatDividerComponent,
  title: 'Components/Material/Divider',
  argTypes: {
    vertical: {
      options: [false, true],
      control: { type: 'radio' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [MatIconModule, CommonModule, BrowserAnimationsModule, MatDividerModule],
    }),
  ],
} as Meta;

const Template: Story<MatDividerComponent> = (args: MatDividerComponent) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {
  vertical: false,
};
