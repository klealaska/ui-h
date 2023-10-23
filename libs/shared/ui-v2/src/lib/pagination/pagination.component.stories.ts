import { moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaginationComponent } from './pagination.component';

export default {
  title: 'Components/Pagination',
  component: PaginationComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, BrowserAnimationsModule, PaginationComponent],
    }),
  ],
};

const Template: Story<PaginationComponent> = (args: PaginationComponent) => ({
  props: {
    ...args,
    pageIndexChange: DefaultEvent.pageIndexChange,
    pageSizeChange: DefaultEvent.pageSizeChange,
  },
});

export const Default = Template.bind({});
const DefaultEvent = {
  pageIndexChange: action('pageIndexChange'),
  pageSizeChange: action('pageSizeChange'),
};

Default.args = {
  currentPage: 1,
  totalItems: 300,
  showQuickJumper: true,
  showSizeChanger: true,
  disabled: false,
  pageSizeOptions: [10, 20, 30],
};
