import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ToastComponent } from './toast.component';
import { SharedUiV2Module } from '../shared-ui-v2.module';
import { Component, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import {
  ToastHorizontalPositions,
  ToastIconTypes,
  ToastTypes,
  ToastVerticalPositions,
} from '@ui-coe/shared/types';

@Component({
  selector: 'ax-toast-launcher',
  template: `
    <div>
      <button mat-flat-button color="primary" class="lg" (click)="openToastComponent()">
        Open Toast Component
      </button>
    </div>
  `,
})
class LaunchToastComponent {
  @Input() title = '';
  @Input() message? = '';
  @Input() icon = '';
  @Input() action = { text: '', link: '' };
  @Input() type = '';
  @Input() close = true;
  @Input() duration = 3000;
  @Input() horizontalPosition: ToastHorizontalPositions.Start;
  @Input() verticalPosition: ToastVerticalPositions.Bottom;
  snackbarRef: MatSnackBarRef<ToastComponent> | undefined;

  constructor(private snackBar: MatSnackBar) {}

  openToastComponent(): void {
    this.snackbarRef = this.snackBar.openFromComponent(ToastComponent, {
      duration: this.duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      data: {
        title: this.title,
        message: this.message,
        icon: this.icon,
        action: this.action,
        type: this.type,
        close: this.close,
      },
    });
  }
}

export default {
  title: 'Components/Toast',
  component: LaunchToastComponent,
  decorators: [
    moduleMetadata({
      declarations: [LaunchToastComponent],
      imports: [CommonModule, BrowserAnimationsModule, SharedUiV2Module],
      providers: [{ provide: OverlayContainer }],
    }),
  ],
  argTypes: {
    close: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'select' },
      options: [
        ToastIconTypes.Success,
        ToastIconTypes.Critical,
        ToastIconTypes.Warning,
        ToastIconTypes.Informational,
      ],
    },
    type: {
      control: { type: 'radio' },
      options: [
        ToastTypes.Success,
        ToastTypes.Critical,
        ToastTypes.Warning,
        ToastTypes.Informational,
      ],
    },
    horizontalPosition: {
      control: { type: 'radio' },
      options: [
        ToastHorizontalPositions.Start,
        ToastHorizontalPositions.Center,
        ToastHorizontalPositions.End,
        ToastHorizontalPositions.Left,
        ToastHorizontalPositions.Right,
      ],
    },
    verticalPosition: {
      control: { type: 'radio' },
      options: [ToastVerticalPositions.Top, ToastVerticalPositions.Bottom],
    },
  },
  parameters: {
    layout: 'padded',
  },
} as Meta;

const Template: Story<LaunchToastComponent> = (args: LaunchToastComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  title: 'Toast title',
  message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
  icon: ToastIconTypes.Informational,
  duration: 3000,
  close: true,
  action: { text: 'link', link: 'https://www.google.com' },
  type: ToastTypes.Informational,
  horizontalPosition: ToastHorizontalPositions.Center,
  verticalPosition: ToastVerticalPositions.Bottom,
};
