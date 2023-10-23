import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MaterialUiModule } from '../../material-ui.module';
import { DialogV2Component } from '../dialog-v2.component';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ButtonComponent } from '../../button/button.component';
import { DialogDataV2, ButtonTypes, ButtonColors } from '@ui-coe/shared/types';

@Component({
  selector: 'open-dialog',
  template: `<ax-button (click)="OpenDialog()">Modal Dialog</ax-button>`,
})
class OpenDialogComponent {
  @Input() data: DialogDataV2;

  constructor(private _dialog: MatDialog) {
    this.data = {
      draggable: false,
      type: 'default',
      closeIcon: true,
      title: 'Title',
      message:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
      overline: {
        hasAlertIcon: false,
        text: 'Overline',
      },
      actionBtn: {
        type: 'primary',
        color: 'default',
        text: 'Action',
      },
      cancelBtn: {
        type: 'secondary',
        color: 'default',
        text: 'Cancel',
      },
    };
  }

  OpenDialog(): void {
    const dialogRef = this._dialog.open(DialogV2Component, {
      data: this.data,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}

export default {
  title: 'Components/Dialog/Modal Dialog',
  component: OpenDialogComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      declarations: [OpenDialogComponent],
      imports: [CommonModule, BrowserAnimationsModule, MaterialUiModule, ButtonComponent],
    }),
  ],
} as Meta<DialogV2Component>;

const Template: Story<DialogV2Component> = (args: DialogV2Component) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  data: {
    draggable: false,
    type: 'default',
    closeIcon: true,
    title: 'Title',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    overline: {
      hasAlertIcon: false,
      text: 'Overline',
    },
    actionBtn: {
      type: ButtonTypes.primary,
      color: ButtonColors.default,
      text: 'Action',
    },
    cancelBtn: {
      type: ButtonTypes.secondary,
      color: ButtonColors.default,
      text: 'Cancel',
    },
  },
};

// Changes Source Code Snippet
Default.parameters = {
  docs: {
    source: {
      code: `
      Reference the dialog wiki
      `,
      language: 'yml',
      type: 'auto',
    },
  },
};

export const Alert = Template.bind({});
Alert.args = {
  data: {
    draggable: false,
    type: 'alert',
    closeIcon: true,
    title: 'Title',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    overline: {
      hasAlertIcon: false,
      text: 'Overline',
    },
    actionBtn: {
      type: ButtonTypes.primary,
      color: ButtonColors.critical,
      text: 'Action',
    },
    cancelBtn: {
      type: ButtonTypes.secondary,
      color: ButtonColors.critical,
      text: 'Cancel',
    },
  },
};

// Changes Source Code Snippet
Alert.parameters = {
  docs: {
    source: {
      code: `
      Reference the dialog wiki
      `,
      language: 'yml',
      type: 'auto',
    },
  },
};
