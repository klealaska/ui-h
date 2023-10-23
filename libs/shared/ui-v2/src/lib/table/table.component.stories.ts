import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';
import { SharedUiV2Module } from '../shared-ui-v2.module';
import { Component, Input, ViewChild } from '@angular/core';
import { TableDataSource } from './table-datasource';
import { MatSort } from '@angular/material/sort';
import { TableComponent } from './table.component';
import { Subject } from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { TagComponent } from '../tag/tag.component';
import { Meta, StoryObj, componentWrapperDecorator } from '@storybook/angular';
import { data, IData } from './example-data';
import { AvatarComponent } from '../avatar/avatar.component';

type Story = StoryObj<TableComponent<any>>;

// custom Table Approach
@Component({
  selector: 'ax-table-story-customized',
  template: `
    <ax-table
      [displayedColumns]="displayedColumns"
      [dataSource]="dataSource"
      [size]="size"
      [stickyHeader]="stickyHeader"
      [tableType]="tableType"
      [allowSort]="allowSort"
      [customTemplate]="customTemplate"
      [customSort]="customSort"
      [selection]="selection"
      [virtualScroll]="virtualScroll"
      (selectChange)="selectChange($event)"
      (allSelected)="allSelected($event)"
      (rowClicked)="onRowClicked($event)"
      matSort
    >
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header="name">Name</th>
        <td mat-cell *matCellDef="let row">
          <ax-avatar size="sm" [name]="{ first: 'H', last: 'G' }"></ax-avatar> &nbsp;{{ row.name }}
        </td>
      </ng-container>
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef mat-sort-header="position">
          <ng-container> </ng-container> Position
        </th>
        <td mat-cell *matCellDef="let row">
          <ax-button type="secondary" color="default" size="sm">
            <mat-icon>add</mat-icon> Button {{ row.position }}
          </ax-button>
        </td>
      </ng-container>
      <ng-container matColumnDef="weight">
        <th mat-header-cell *matHeaderCellDef mat-sort-header="action">Custom Weight</th>
        <td mat-cell *matCellDef="let row">
          <ax-tag [size]="'md'" [type]="'default'" [style]="'filled'" [text]="row.action"></ax-tag>
        </td>
      </ng-container>
      <ng-container matColumnDef="country">
        <th mat-header-cell *matHeaderCellDef mat-sort-header="country">
          <ng-container> </ng-container> Country
        </th>
        <td mat-cell *matCellDef="let row">
          <ax-button type="secondary" color="default" size="sm">
            country {{ row.position }} <mat-icon>add</mat-icon>
          </ax-button>
        </td>
      </ng-container>
      <ng-container matColumnDef="action">
        <th mat-header-cell *matHeaderCellDef mat-sort-header="Action">Action</th>
        <td mat-cell *matCellDef="let row; let i = dataIndex">
          <ax-button size="sm" (btnClick)="onClick(row)"> Download </ax-button>
        </td>
      </ng-container>
    </ax-table>
  `,
})
class FullCustomTableStoryComponent {
  public dataSource: TableDataSource<IData>;
  displayedColumns: string[] = ['name', 'position', 'weight', 'action', 'country'];
  @Input() size = 'relaxed';
  @Input() allowSort = true;
  @Input() customTemplate = true;
  @Input() customSort = false;
  @Input() selection = true;
  @Input() tableType;
  @Input() stickyHeader;
  @Input() virtualScroll;

  checkSelected = new Subject<IData[]>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}

  ngOnInit() {
    this.dataSource = new TableDataSource([]);
    this.dataSource.data = data;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  onClick(row) {
    console.log('clicked row->', row);
  }
  onRowClicked(row) {
    console.log('row clicked', row);
  }
}

export default {
  title: 'Components/Table',
  component: TableComponent,
  argTypes: {
    size: {
      options: ['relaxed', 'condensed'],
      control: { type: 'radio' },
    },
    tableType: {
      options: ['default', 'datagrid'],
      control: { type: 'radio' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        SharedUiV2Module,
        TableComponent,
        ButtonComponent,
        TagComponent,
      ],
    }),
  ],
};

export const Default: Meta<TableComponent<any>> = {
  title: 'Components/Table',
  render: (args: TableComponent<any>) => ({
    props: {
      ...args,
      sortFunction: DefaultEvent.sortFunction,
      rowClicked: DefaultEvent.rowClicked,
    },
  }),
  args: {
    size: 'relaxed',
    allowSort: true,
    stickyHeader: true,
    tableType: 'default',
    selection: true,
    fixedColumns: false,
    data: data,
    displayedColumns: ['name', 'position', 'weight', 'action', 'country'],
  },
};
const DefaultEvent = {
  sortFunction: action('sortFunction'),
  rowClicked: action('row clicked'),
};

// Virtual Scroll Example
export const VirtualScroll: Story = {
  args: {
    ...Default.args,
    selection: false,
    stickyHeader: true,
    allowSort: true,
    virtualScroll: true,
    gridHeight: 400,
  },
};

// CheckBoxes in table

export const CheckboxSelection: Story = {
  args: {
    ...Default.args,
    selection: true,
    size: 'relaxed',
    tableType: 'default',
  },
  render: (args: TableComponent<any>) => ({
    props: {
      ...args,
      sortFunction: DefaultEvent.sortFunction,
      selectChange: action('selectChange'),
      allSelected: action('allSelected'),
    },
  }),
};

// Sort and Custom Sort Examples

export const Sorting: Story = {
  args: {
    ...Default.args,
    size: 'relaxed',
    tableType: 'default',
    allowSort: true,
    customSort: false,
    stickyHeader: true,
    virtualScroll: true,
  },
  render: (args: TableComponent<any>) => ({
    props: {
      ...args,
      sortFunction: action('sortFunction'),
    },
  }),
};

export const CustomizedTableTemplate: Story = {
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [FullCustomTableStoryComponent],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        SharedUiV2Module,
        TableComponent,
        ButtonComponent,
        TagComponent,
        AvatarComponent,
      ],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<ax-table-story-customized></ax-table-story-customized>`),
  ],
  args: {
    customTemplate: true,
    virtualScroll: false,
    selection: true,
    size: 'relaxed',
    tableType: 'default',
    stickyHeader: false,
    data: [],
  },
  render: (args: TableComponent<any>) => ({
    props: {
      ...args,
      selectChange: action('selectChange'),
      allSelected: action('allSelected'),
    },
  }),
};

/**
 * Example with delayed initialization of data
 */
@Component({
  selector: 'ax-table-story-delayed-data',
  template: ` <ax-table [displayedColumns]="displayedColumns" [data]="data"> </ax-table> `,
})
class TableDataWithDelayedResponse {
  public dataSource: TableDataSource<IData>;
  displayedColumns: string[] = ['name', 'position', 'weight', 'action', 'country'];
  data: Array<IData> = [];
  ngOnInit() {
    setTimeout(() => {
      this.data = data;
    }, 3000);
  }
}

// Example for Default Apporach with delayed response
export const DelayedDataTableTemplate: Story = {
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [TableDataWithDelayedResponse],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(
      story => `<ax-table-story-delayed-data></ax-table-story-delayed-data>`
    ),
  ],
  args: {
    customSort: true,
    virtualScroll: true,
    selection: true,
    size: 'relaxed',
    tableType: 'default',
    stickyHeader: false,
    data: [],
  },
};
