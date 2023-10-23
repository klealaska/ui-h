import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SideSheetV2Component } from './side-sheet-v2.component';
import { ButtonComponent } from '../button/button.component';
import { action } from '@storybook/addon-actions';
import { InputComponent } from '../input/input.component';
import { HeaderComponent } from '../header/header.component';

export default {
  title: 'Components/SideSheetv2',
  component: SideSheetV2Component,
  argTypes: {},
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    moduleMetadata({
      imports: [
        ButtonComponent,
        HeaderComponent,
        InputComponent,
        CommonModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
} as Meta<SideSheetV2Component>;

const Template: Story<SideSheetV2Component> = (args: SideSheetV2Component) => ({
  template: `
  <ax-header></ax-header>
  <ax-button (click)="opened = !opened">Open</ax-button>

  <ax-side-sheet-v2
    [opened]='opened'
    [boxShadow]='boxShadow'
    [backdrop]="backdrop"
    (closeEvent)='closeEvent(opened = !opened)'
    (backdropEvent)="backdropEvent(opened = !opened)"
  >

    <div sideSheetHeader>
      <p>Side Sheet Header</p>
    </div>

    <div sideSheetContent>
      <p>Side Sheet Content</p>
    </div>

    <div sideSheetFooter>
      <p>Side Sheet Footer</p>
    </div>
  </ax-side-sheet-v2>
  `,
  props: {
    ...args,
    closeEvent: DefaultEvents.closeEvent,
    backdropEvent: DefaultEvents.backdropEvent,
  },
});

export const Default = Template.bind({});
Default.args = {
  opened: false,
  backdrop: false,
  boxShadow: true,
};

const ExampleTemplate: Story<SideSheetV2Component> = (args: SideSheetV2Component) => ({
  template: `
  <ax-header></ax-header>
  <ax-button (click)="opened = !opened">Open</ax-button>
  
    <ax-side-sheet-v2
      [opened]='opened'
      [boxShadow]='boxShadow'
      [backdrop]="backdrop"
      (closeEvent)='closeEvent(opened = !opened)'
      (backdropEvent)="backdropEvent(opened = !opened)"
    >

      <div sideSheetHeader>
        <p>Side Sheet Header</p>
      </div>

      <div sideSheetContent>
        <p class="mb-2">Side Sheet Content</p>
        <ax-input label="Input Label" class="w-full mb-2"></ax-input>
        <ax-input label="Input Label" class="w-full"></ax-input>
      </div>

      <div sideSheetFooter>
        <ax-button type="secondary" class="w-full mb-[12px]" (click)="opened = !opened">Cancel</ax-button>
        <ax-button class="w-full" (click)="opened = !opened">Submit</ax-button>
      </div>
    </ax-side-sheet-v2>
  `,
  props: {
    ...args,
    closeEvent: DefaultEvents.closeEvent,
    backdropEvent: DefaultEvents.backdropEvent,
  },
});

export const Example = ExampleTemplate.bind({});
Example.args = {
  opened: false,
  backdrop: false,
  boxShadow: true,
};

const DefaultEvents = {
  closeEvent: action('closeEvent'),
  backdropEvent: action('backdropEvent'),
};
