import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { MaterialUiModule } from '../material-ui.module';
import { DialogData } from '@ui-coe/shared/ui';
import { DialogComponent } from './dialog.component';

@Component({
  template: ` <button mat-raised-button color="primary" (click)="launch()">Launch</button> `,
})
class LaunchDialogComponent {
  @Inject(MAT_DIALOG_DATA) data: DialogData = {
    title: 'Dialog Title',
    message: 'Here is where the message will be displayed for the dialog.',
    icon: 'info',
    cta: false,
    initAction: 'Ok',
  };
  constructor(private _dialog: MatDialog) {}

  launch(): void {
    this._dialog.open(DialogComponent, {
      data: this.data,
    });
  }
}

export default {
  title: 'Components/Dialog',
  component: LaunchDialogComponent,
  decorators: [
    moduleMetadata({
      declarations: [DialogComponent],
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule],
    }),
  ],
} as Meta;

const Template: Story<LaunchDialogComponent> = (args: LaunchDialogComponent) => ({
  props: args,
});

export const Default = Template.bind({});
