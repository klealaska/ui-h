import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
// import { SharedUiV2Module } from '../shared-ui-v2.module';
import { SideSheetComponent } from './side-sheet.component';
import { ToggleService } from '@ui-coe/shared/util/services';
import { action } from '@storybook/addon-actions';
import { InputComponent } from '../input/input.component';

export default {
  title: 'Components/SideSheet',
  component: SideSheetComponent,
  service: ToggleService,
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [SideSheetComponent, CommonModule, BrowserAnimationsModule, InputComponent],
    }),
  ],
} as Meta<SideSheetComponent>;
const Template: Story<SideSheetComponent> = (args: SideSheetComponent) => ({
  template: `
    <ax-side-sheet
      [opened]='opened'
      [sheetTitle]='sheetTitle'
      [btn1]='btn1'
      [btn2]='btn2'
      (btn1Event)='btn1Event($event)'
      (btn2Event)='btn2Event($event)'
    >
      <div>
        <ax-input label='First Name' [fixed]='true'></ax-input>
        <ax-input label='Last Name'  [fixed]='true'></ax-input>
      </div>
    </ax-side-sheet>
  `,
  props: {
    ...args,
    btn1Event: DefaultEvents.btn1Event,
    btn2Event: DefaultEvents.btn2Event,
  },
});

export const Default = Template.bind({});
Default.args = {
  opened: true,
  sheetTitle: 'Template-Title',
  btn1: { text: 'btn1Name', type: 'secondary', disabled: false, color: 'default' },
  btn2: { text: 'btn2Name', type: 'secondary', disabled: false, color: 'default' },
};

const DefaultEvents = {
  btn1Event: action('btn1Event'),
  btn2Event: action('btn2Event'),
};
