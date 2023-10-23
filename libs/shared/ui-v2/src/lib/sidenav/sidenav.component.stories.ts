import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SidenavComponent } from './sidenav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

export default {
  title: 'Components/Sidenav',
  component: SidenavComponent,
  argTypes: {},
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatSidenavModule,
        BrowserAnimationsModule,
      ],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<SidenavComponent>;

const Template: Story<SidenavComponent> = (args: SidenavComponent) => ({
  props: {
    ...args,
    navItems: [
      {
        displayName: 'Tenant',
        iconName: 'cloud',
        route: 'tenant-spa',
        children: [],
      },
      {
        displayName: 'BAM',
        iconName: 'cloud',
        route: 'bank-account-mgmt-spa',
        children: [
          {
            displayName: 'Test Feature',
            iconName: '',
            route: 'feature1',
            children: [
              {
                displayName: 'Test Sub Feature 1',
                iconName: '',
                route: '',
                children: [],
              },
              {
                displayName: 'Test Sub Feature 2',
                iconName: '',
                route: '',
                children: [],
              },
              {
                displayName: 'Test Sub Feature 3',
                iconName: '',
                route: '',
                children: [],
              },
            ],
          },
          {
            displayName: 'Test Feature',
            iconName: '',
            route: '',
            children: [],
          },
          {
            displayName: 'Test Feature',
            iconName: '',
            route: '',
          },
        ],
      },
      {
        displayName: 'Pay Transformation',
        iconName: 'cloud',
        route: 'pay-transformation-spa',
        children: [],
      },
    ],
  },
});

export const Default = Template.bind({});
Default.args = {};
