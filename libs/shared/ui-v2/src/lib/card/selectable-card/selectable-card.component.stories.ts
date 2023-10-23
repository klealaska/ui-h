import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SelectableCardComponent } from './selectable-card.component';
import { CardActionsComponent } from '../card-actions/card-actions.component';
import { CardContentComponent } from '../card-content/card-content.component';
import { CardOverlineComponent } from '../card-overline/card-overline.component';
import { CardTitleComponent } from '../card-title/card-title.component';
import { ButtonComponent } from '../../button/button.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Components/Card',
  component: SelectableCardComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        CardOverlineComponent,
        CardTitleComponent,
        CardContentComponent,
        CardActionsComponent,
        ButtonComponent,
      ],
    }),
  ],
} as Meta<SelectableCardComponent>;

const Template: Story<SelectableCardComponent> = (args: SelectableCardComponent) => ({
  template: `
  <ax-selectable-card class="w-[408px]" [disabled]="disabled" [selected]="selected" [checkbox]="checkbox" (selectedState)="selectedState($event)">
    <ax-card-overline>Overline</ax-card-overline>
    <ax-card-title>Selectable card title</ax-card-title>
    <ax-card-content>
      <p>Put the card content here. Use clear and concise language to ensure the reader understands the purpose of the card and what action to take.</p>
    </ax-card-content>
  </ax-selectable-card>
  `,
  props: {
    ...args,
    selectedState: DefaultEvents.selectedState,
  },
});

export const SelectableCard = Template.bind({});
SelectableCard.args = {
  disabled: false,
  selected: false,
  checkbox: true,
};

const DefaultEvents = {
  selectedState: action('selectedState'),
};
