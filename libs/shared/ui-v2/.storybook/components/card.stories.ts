import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'card',
  template: `
    <!-- Need to use header and content to get correct padding -->
    <mat-card>
      <mat-card-header>
        <mat-card-subtitle>Outline</mat-card-subtitle>
        <mat-card-title>Card Title</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text.
        </p>
      </mat-card-content>
    </mat-card>
  `,
})
class MatCardComponent {
  @Input() actionButtonAlign: string;
}

export default {
  component: MatCardComponent,
  title: 'Components/Material/Card',
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [
        MatIconModule,
        CommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<MatCardComponent> = (args: MatCardComponent) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {};
