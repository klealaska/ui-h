import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'mat-button',
  template: ` <div class="button__container">
      <button mat-flat-button [disabled]="disabled" color="primary" [ngClass]="size">
        Primary
        <mat-icon *ngIf="icon">control_point_duplicate</mat-icon>
      </button>
      <button
        [disabled]="disabled"
        mat-flat-button
        mat-icon-button
        color="primary"
        [ngClass]="size"
      >
        <mat-icon [ngClass]="size">add</mat-icon>
      </button>
    </div>
    <div class="button__container">
      <button mat-stroked-button [disabled]="disabled" color="primary" [ngClass]="size">
        Primary
        <mat-icon *ngIf="icon">add</mat-icon>
      </button>
      <button
        [disabled]="disabled"
        mat-stroked-button
        mat-icon-button
        color="primary"
        [ngClass]="size"
      >
        <mat-icon [class]="size">add</mat-icon>
      </button>
    </div>

    <div class="button__container">
      <button [disabled]="disabled" mat-button color="primary" [ngClass]="size">
        Primary <mat-icon *ngIf="icon">add</mat-icon>
      </button>
      <button [disabled]="disabled" mat-icon-button color="primary" [ngClass]="size">
        <mat-icon [ngClass]="size">add</mat-icon>
      </button>
    </div>`,
  styles: [
    `
      .button__container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      button {
        margin-right: 10px;
      }
    `,
  ],
})
class MatButton {
  @Input() disabled: boolean;
  @Input() icon: boolean;
}

export default {
  component: MatButton,
  title: 'Components/Material/Button',
  argTypes: {
    disabled: {
      options: [true, false],
      control: 'boolean',
    },
    size: {
      options: ['lg', 'md', 'sm'],
      control: { type: 'radio' },
    },
    icon: {
      control: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        MatIconModule,
        CommonModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonModule,
        FontAwesomeModule,
        RouterTestingModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<MatButton> = (args: MatButton) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  icon: true,
  size: 'lg',
};
