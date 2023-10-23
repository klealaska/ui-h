import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'menu',
  template: `<button mat-flat-button color="primary" class="lg" [matMenuTriggerFor]="menu">
      Primary
    </button>
    <mat-menu #menu="matMenu" class="ax-menu">
      <button mat-menu-item>Option 1</button>
      <button mat-menu-item>Option 2</button>
      <button mat-menu-item>Option 3</button>
      <button mat-menu-item>Option 4</button>
      <button mat-menu-item>Option 5</button>
      <button mat-menu-item>Option 6</button>
      <button mat-menu-item>Option 7</button>
      <button mat-menu-item>Option 8</button>
    </mat-menu>`,
})
class MatMenuComponent {}

export default {
  component: MatMenuComponent,
  title: 'Components/Material/Menu',
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, MatButtonModule, MatMenuModule],
    }),
  ],
} as Meta;

const Template: Story<MatMenuComponent> = (args: MatMenuComponent) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {};
