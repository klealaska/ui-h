import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CardComponent } from './card.component';
import { CardActionsComponent } from './card-actions/card-actions.component';
import { CardContentComponent } from './card-content/card-content.component';
import { CardOverlineComponent } from './card-overline/card-overline.component';
import { CardTitleComponent } from './card-title/card-title.component';
import { ButtonComponent } from '../button/button.component';

export default {
  title: 'Components/Card',
  component: CardComponent,
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
} as Meta<CardComponent>;

const Template: Story<CardComponent> = (args: CardComponent) => ({
  template: `
  <ax-card class="w-[408px]" [disabled]="disabled">
    <ax-card-overline>Overline</ax-card-overline>
    <ax-card-title>Basic card title</ax-card-title>
    <ax-card-content><p>Put the card content here. Use clear and concise language to ensure the reader understands the purpose of the card and what action to take.</p></ax-card-content>
    <ax-card-actions>
      <ax-button>Button</ax-button>
    </ax-card-actions>
  </ax-card>
  `,
  props: {
    ...args,
  },
});

export const Default = Template.bind({});
Default.args = {
  disabled: false,
};
