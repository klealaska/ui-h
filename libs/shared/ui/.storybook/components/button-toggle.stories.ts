import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'material-button-toggle',
  template: `
    <div class="container">
      <mat-button-toggle-group
        name="fontStyle"
        aria-label="Font Style"
        [disabled]="disabled"
        multiple="false"
        [ngClass]="size"
      >
        <mat-button-toggle disableRipple="true" value="bold">Bold</mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="italic">Italic</mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="underline">Underline</mat-button-toggle>
      </mat-button-toggle-group>
      <mat-button-toggle-group
        name="fontStyle"
        aria-label="Font Style"
        [disabled]="disabled"
        multiple="false"
        [ngClass]="size"
      >
        <mat-button-toggle disableRipple="true" value="close">
          <mat-icon>close</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="save">
          <mat-icon>save</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="send">
          <mat-icon>send</mat-icon></mat-button-toggle
        >
      </mat-button-toggle-group>
    </div>
    <div class="container">
      <mat-button-toggle-group
        name="fontStyle2"
        aria-label="Font Style 2"
        [disabled]="disabled"
        multiple="false"
        class="btn-toggle-secondary"
        [ngClass]="size"
      >
        <mat-button-toggle disableRipple="true" value="bold">Bold</mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="italic">Italic</mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="underline">Underline</mat-button-toggle>
      </mat-button-toggle-group>
      <mat-button-toggle-group
        name="fontStyle2"
        aria-label="Font Style 2"
        [disabled]="disabled"
        multiple="false"
        class="btn-toggle-secondary"
        [ngClass]="size"
      >
        <mat-button-toggle disableRipple="true" value="close">
          <mat-icon>close</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="save">
          <mat-icon>save</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle disableRipple="true" value="send"
          ><mat-icon>send</mat-icon></mat-button-toggle
        >
      </mat-button-toggle-group>
    </div>

    <p>Multiselect</p>
    <div class="container">
      <mat-button-toggle-group
        name="fontStyle"
        aria-label="Font Style"
        [disabled]="disabled"
        multiple="true"
        [ngClass]="size"
      >
        <mat-button-toggle value="bold">Bold</mat-button-toggle>
        <mat-button-toggle value="italic">Italic</mat-button-toggle>
        <mat-button-toggle value="underline">Underline</mat-button-toggle>
      </mat-button-toggle-group>
      <mat-button-toggle-group
        name="fontStyle"
        aria-label="Font Style"
        [disabled]="disabled"
        multiple="true"
        [ngClass]="size"
      >
        <mat-button-toggle value="close">
          <mat-icon>close</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="save">
          <mat-icon>save</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="send"> <mat-icon>send</mat-icon></mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <div class="container">
      <mat-button-toggle-group
        name="fontStyle2"
        aria-label="Font Style 2"
        [disabled]="disabled"
        multiple="true"
        class="btn-toggle-secondary"
        [ngClass]="size"
      >
        <mat-button-toggle value="bold">Bold</mat-button-toggle>
        <mat-button-toggle value="italic">Italic</mat-button-toggle>
        <mat-button-toggle value="underline">Underline</mat-button-toggle>
      </mat-button-toggle-group>
      <mat-button-toggle-group
        name="fontStyle2"
        aria-label="Font Style 2"
        [disabled]="disabled"
        multiple="true"
        class="btn-toggle-secondary"
        [ngClass]="size"
      >
        <mat-button-toggle value="close">
          <mat-icon>close</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="save">
          <mat-icon>save</mat-icon>
        </mat-button-toggle>
        <mat-button-toggle value="send"><mat-icon>send</mat-icon></mat-button-toggle>
      </mat-button-toggle-group>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 10px;
      }
      mat-button-toggle-group {
        margin-right: 10px;
      }
    `,
  ],
})
class MatButtonToggle {
  @Input() disabled: boolean = false;
  @Input() size: string;
}

export default {
  component: MatButtonToggle,
  title: 'Components/Material/Button Toggle',
  argTypes: {
    size: {
      options: ['lg', 'md', 'sm'],
      control: { type: 'radio' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatMenuModule,
        MatButtonToggleModule,
        FontAwesomeModule,
        RouterTestingModule,
        MatIconModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<MatButtonToggle> = (args: MatButtonToggle) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  size: 'lg',
};
