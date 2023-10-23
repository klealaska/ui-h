import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'ax-tabs',
  template: `
    <div>
      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="start" [ngClass]="size">
        <mat-tab label="First">Content 1</mat-tab>
        <mat-tab label="Second">Content 2</mat-tab>
        <mat-tab label="Third" [disabled]="disabled">Content 3</mat-tab>
      </mat-tab-group>
      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="center" [ngClass]="size">
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>fiber_new</mat-icon>
            Tab
          </ng-template>
          Content 1
        </mat-tab>
        <mat-tab [disabled]="disabled">
          <ng-template mat-tab-label>
            <mat-icon>fiber_new</mat-icon>
            Tab
          </ng-template>
          Content 2
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>fiber_new</mat-icon>
            Tab
          </ng-template>
          Content 3
        </mat-tab>
      </mat-tab-group>
      <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="end" [ngClass]="size">
        <mat-tab>
          <ng-template mat-tab-label>
            Tab
            <div
              matBadgeSize="small"
              matBadgePosition="below after"
              [matBadgeSize]="badgeSize"
              matBadge="1"
            ></div>
          </ng-template>
          Content 1
        </mat-tab>
        <<mat-tab>
          <ng-template mat-tab-label>
            Tab
            <div
              matBadgeSize="small"
              matBadgePosition="below after"
              [matBadgeSize]="badgeSize"
              matBadge="2"
            ></div>
          </ng-template>
          Content 2
        </mat-tab>
        <mat-tab>
          <ng-template mat-tab-label>
            Tab
            <div
              matBadgeSize="small"
              matBadgePosition="below after"
              [matBadgeSize]="badgeSize"
              matBadge="3"
            ></div>
          </ng-template>
          Content 3
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
class TabsComponent {
  @Input() size: string;
  @Input() align: string;
  @Input() disabled: boolean;
}

export default {
  component: TabsComponent,
  title: 'Components/Material/Tabs',
  argTypes: {
    size: {
      options: ['lg', 'md', 'sm'],
      control: { type: 'radio' },
    },
    disabled: {
      options: [true, false],
      control: 'boolean',
    },
    badgeSize: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        MatIconModule,
        CommonModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatBadgeModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<TabsComponent> = (args: TabsComponent) => ({
  props: { ...args },
});

export const Default = Template.bind({});
Default.args = {
  size: 'md',
  badgeSize: 'medium',
  disabled: false,
};
