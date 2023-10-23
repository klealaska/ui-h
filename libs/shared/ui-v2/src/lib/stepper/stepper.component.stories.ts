import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { StepperComponent } from './stepper.component';
import { StepComponent } from './step/step.component';
import { MatButtonModule } from '@angular/material/button';

export default {
  title: 'Components/Stepper',
  component: StepperComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        StepComponent,
        StepperComponent,
        MatButtonModule,
      ],
    }),
  ],
  argTypes: {
    direction: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
  },
} as Meta;

const Template: Story<StepperComponent> = (args: StepperComponent) => ({
  template: `
  <ax-stepper [direction]="direction" #stepper>
    <ax-step label="Basic Details 1" subtitle="Assistive Text 1" status="status step 1" >
      <p> This is any content of "Step 1"</p>
      <button mat-flat-button color="primary" class="sm" (click)="stepper.next()">Next Step</button>
    </ax-step>
    <!--custom error state on step 2-->
    <ax-step label="Basic Details 2" subtitle="Assistive Text 2" status="status step 2" [hasError]="hasError">
      <p> This is any content of "Step 2"</p>
      <button mat-stroked-button color="primary" class="sm" (click)="stepper.previous()">Go Back</button>
      <button mat-flat-button color="primary" class="sm" (click)="stepper.next()">Next Step</button>
    </ax-step>
    <ax-step subtitle="Assistive Text 3" status="status step 3" [completed]="completed">
       <!-- Label content with template Here -->
      <ng-template cdkStepLabel>
        Basic Details 3
      </ng-template>
      <p> This is any content of "Step 3"</p>
      <button mat-stroked-button color="primary" class="sm" (click)="stepper.previous()">Go Back</button>
      <button mat-flat-button color="primary" class="sm" (click)="stepper.next()">Next Step</button>
    </ax-step>
    <!--Step with icon example-->
    <ax-step label="Basic Details 4" subtitle="Assistive Text 4"  status="status step 4" icon="account_circle">
      <p> This is any content of "Step 4"</p>
      <button mat-stroked-button color="primary" class="sm" (click)="stepper.previous()">Go Back</button>
    </ax-step>
</ax-stepper>`,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  direction: 'vertical',
  completed: false,
  hasError: false,
};

/**
 * States of Steps which we can override on 'ax-step' selector
 *
 * [hasError]="true"
 * [completed]="true"
 */
