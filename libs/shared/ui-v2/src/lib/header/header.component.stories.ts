import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { HeaderComponent } from './header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

export default {
  title: 'Components/HeaderNav',
  component: HeaderComponent,
  argTypes: {
    logoImgSrc: {
      option: [''],
    },
    avatarInput: {
      size: {
        options: ['lg', 'md', 'sm', 'xs'],
        control: { type: 'radio' },
      },
      img: {
        option: ['https://www.fillmurray.com/140/140'],
        control: { type: 'text' },
      },

      name: '',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatToolbarModule, MatIconModule],
    }),
  ],
} as Meta<HeaderComponent>;

const Template: Story<HeaderComponent> = (args: HeaderComponent) => ({
  props: {
    ...args,
    userClick: DefaultEvents.userClick,
  },
});

export const Default = Template.bind({});
Default.args = {
  logoImgSrc: '/Avidxchange_Primarylogo_RGB.svg',
  avatarInput: {
    size: 'md',
    img: 'https://mdbcdn.b-cdn.net/img/new/avatars/8.webp',
    name: {
      first: 'hari',
      last: 'kumar',
    },
  },
};

const DefaultEvents = {
  userClick: action('userClick'),
};
