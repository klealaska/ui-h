import { moduleMetadata, Meta, Story } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialUiModule } from '../material-ui.module';
import {
  TableDataType,
  NestedTableDatasource,
  PeriodicElement,
} from 'libs/shared/ui/.storybook/models';
import { TableColumnDef } from '../shared/models';
import {
  DynamicTableComponent,
  MobileTableComponent,
  DynamicTableCellComponent,
  DynamicExpandableCellComponent,
  NestedTableComponent,
  NestedBottomSheetComponent,
} from '../dynamic-table';

@Component({
  template: `
    <a [href]="element?.href" target="_blank" rel="noopener noreferrer" class="column-link"
      >Column Link</a
    >
  `,
  styles: [
    `
      .column-link {
        line-height: 21px;
      }
    `,
  ],
})
class ColumnButtonComponent {
  @Input() element: PeriodicElement;
}

@Component({
  template: `
    <div class="container" (click)="callbackToParent('Child was clicked.')">
      <div class="element-container">
        <div class="element__position">{{ element.position }}</div>
        <div class="element__symbol">{{ element.symbol }}</div>
        <div class="element__name">{{ element.name }}</div>
      </div>
      <ax-nested-table
        [dataSource]="dataSource"
        [columnDefs]="tableDef"
        (buttonEvent)="buttonEvent($event)"
      ></ax-nested-table>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      .element-container {
        border: 1px solid lightgray;

        width: 5rem;
        height: 5rem;

        padding: 0.25rem;
        margin: 0.25rem;
      }
      .element__symbol {
        font-weight: bold;
        font-size: 24px;
      }
      .element__name,
      .element__weight {
        font-size: 14px;
      }
    `,
  ],
})
class DynamicComponent {
  @Input() element: PeriodicElement;

  // Example callback
  callbackToParent: (dataFromChild: string) => void;

  dataSource: MatTableDataSource<NestedTableDatasource>;
  tableDef: TableColumnDef[];

  ngOnInit() {
    this.tableDef = this.element.nestedTableColumnDefs;
    this.dataSource = new MatTableDataSource(this.element.nestedTableDatasource);
  }

  buttonEvent(event: NestedTableDatasource): void {
    console.log(event);
  }
}

const dataSource = new MatTableDataSource(returnTableData(this));

export default {
  component: DynamicTableComponent,
  decorators: [
    moduleMetadata({
      declarations: [
        DynamicTableComponent,
        MobileTableComponent,
        DynamicTableCellComponent,
        DynamicExpandableCellComponent,
        NestedTableComponent,
        NestedBottomSheetComponent,
        DynamicComponent,
      ],
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MaterialUiModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }),
  ],
  title: 'Components/DynamicTable',
  argTypes: {
    dataSource: {
      mapping: { Default: dataSource },
    },
  },
  excludeStories: /.*Data$/,
} as Meta;

export const actionsData = {
  buttonEvent: action('buttonEvent'),
  filterEvent: action('filterEvent'),
  sortEvent: action('sortEvent'),
  paginatorEvent: action('paginatorEvent'),
};

const Template: Story = args => ({
  props: {
    ...args,
    buttonEvent: actionsData.buttonEvent,
    filterEvent: actionsData.filterEvent,
    sortEvent: actionsData.sortEvent,
    paginatorEvent: actionsData.paginatorEvent,
  },
});

export const Default = Template.bind({});
Default.args = {
  dataSource: 'Default',
  columnDefs: buildTableColumnDef(),
  paginator: {
    pageSize: 5,
    pageSizeOptions: [1, 3, 5, 7],
    hidePageSize: false,
    pageIndex: 0,
    showFirstLastButtons: true,
    disabled: false,
    page: function (event) {
      console.log('Page Event Emitter');
      console.log(event);
    },
    pageLabels: {
      firstPageLabel: 'First',
      lastPageLabel: 'Last',
      nextPageLabel: 'Next',
      previousPageLabel: 'Previous',
      itemsPerPageLabel: 'Testing Items',
    },
  },
  serverSortingFiltering: false,
  filtering: false,
};

function buildTableColumnDef(): any[] {
  // columnDef acts as the keys for your table.
  const columnDef: string[] = [
    'multiSelect', // 'multiSelect' | 'singleSelect' is required to toggle the table's selection functionality.
    'position',
    'name',
    'weight',
    'symbol',
    'details',
    'action', // 'action' is required to toggle the table's expandable rows.
  ];
  // headerCellDef is the text displayed in your tables column header.
  const headerCellDef: string[] = [
    '', // We don't want a header for our 'multiSelect' | 'singleSelect' column so we pass in empty string.
    'No.',
    'Name',
    'Weight',
    'Symbol',
    'Details',
    '', // We don't want a header for our 'action' column so we pass in an empty string.
  ];
  // cellDef is used to dynamically inject components and render text into the table.
  const cellDef: any[] = [
    {
      type: 'text', // Set type to 'text' when injecting a string, number, or boolean.
      value: '', // When working with 'multiSelect' | 'singleSelect' pass in empty string.
    },
    { type: 'text', value: (element: any) => element.position },
    { type: 'text', value: (element: any) => element.name, mobileView: 1 },
    { type: 'text', value: (element: any) => element.weight, mobileView: 4 },
    { type: 'text', value: (element: any) => element.symbol, mobileView: 3 },
    {
      type: 'component', // Set type to 'component' when injecting a dynamic component.
      value: {
        type: ColumnButtonComponent,
        inputs: (element: any) => {
          // 'inputs' is used to define your dynamic components @Input property.
          return { element };
        },
      },
      mobileView: 2,
    },
    {
      type: 'text', // Set type to 'text' when injecting a string, number, or boolean.
      value: '', // When working with action pass in empty string.
    },
  ];

  return columnDef.map((columnDef, index) => {
    return {
      columnDef: columnDef,
      headerCellDef: headerCellDef[index],
      cellDef: cellDef[index],
    };
  });
}

function returnTableData(component?: any): any[] {
  return [
    {
      position: 1,
      name: 'Hydrogen',
      weight: 1.0079,
      symbol: 'H',
      href: 'https://www.google.com',
      isExpandable: true, // Determines whether a row is expandable or not.
      isExpanded: false, // Determines whether the expandable row is opened or closed by default.
      nestedTableColumnDefs: buildNestedTableColumnDef(),
      nestedTableDatasource: returnNestedTableData(),
      mobileView: {
        doubleColumnTop: true, // Determines whether the double column on mobile is displayed on top.
      },
      component: {
        type: 'component',
        value: {
          type: DynamicComponent,
          inputs: (element: TableDataType) => {
            return { element };
          },
          outputs: (element: TableDataType) => {
            return {
              callbackToParent: (dataFromChild: string) => {
                component.callbackFromChild(dataFromChild, element);
              },
            };
          },
        },
      },
    },
    {
      position: 2,
      name: 'Helium',
      weight: 4.0026,
      symbol: 'He',
      href: 'https://www.google.com',
      isExpandable: false,
      isExpanded: false,
      nestedTableColumnDefs: null,
      nestedTableDatasource: null,
      mobileView: {
        doubleColumnTop: false,
      },
      component: null,
    },
    {
      position: 3,
      name: 'Lithium',
      weight: 6.941,
      symbol: 'Li',
      href: 'https://www.google.com',
      isExpandable: false,
      isExpanded: false,
      nestedTableColumnDefs: null,
      nestedTableDatasource: null,
      mobileView: {
        doubleColumnTop: true,
      },
      component: null,
    },
    {
      position: 4,
      name: 'Beryllium',
      weight: 9.0122,
      symbol: 'Be',
      isExpandable: false,
      isExpanded: false,
      nestedTableColumnDefs: null,
      nestedTableDatasource: null,
      component: null,
      href: 'https://www.google.com',
      mobileView: {
        doubleColumnTop: false,
      },
    },
    {
      position: 5,
      name: 'Boron',
      weight: 10.811,
      symbol: 'B',
      href: 'https://www.google.com',
      isExpandable: false,
      isExpanded: false,
      nestedTableColumnDefs: null,
      nestedTableDatasource: null,
      mobileView: {
        doubleColumnTop: false,
      },
      component: null,
    },
  ];
}

function buildNestedTableColumnDef(): any[] {
  // columnDef acts as the keys for your table.
  const columnDef: string[] = [
    'singleSelect', // 'multiSelect' | 'singleSelect' is required to toggle the table's selection functionality.
    'position',
    'name',
    'weight',
    'symbol',
    'details',
  ];
  // headerCellDef is the text displayed in your tables column header.
  const headerCellDef: string[] = [
    '', // We don't want a header for our 'multiSelect' | 'singleSelect' column so we pass in empty string.
    'No.',
    'Name',
    'Weight',
    'Symbol',
    'Details',
  ];
  // cellDef is used to dynamically inject components and render text into the table.
  const cellDef: any[] = [
    {
      type: 'text', // Set type to 'text' when injecting a string, number, or boolean.
      value: '', // When working with 'multiSelect' | 'singleSelect' pass in empty string.
    },
    { type: 'text', value: (element: any) => element.position, mobileView: 1 },
    { type: 'text', value: (element: any) => element.name },
    { type: 'text', value: (element: any) => element.weight },
    { type: 'text', value: (element: any) => element.symbol },
    {
      type: 'component', // Set type to 'component' when injecting a dynamic component.
      value: {
        type: ColumnButtonComponent,
        inputs: (element: any) => {
          // 'inputs' is used to define your dynamic components @Input property.
          return { element };
        },
      },
      mobileView: 2,
    },
  ];

  return columnDef.map((columnDef, index) => {
    return {
      columnDef: columnDef,
      headerCellDef: headerCellDef[index],
      cellDef: cellDef[index],
    };
  });
}

function returnNestedTableData(): NestedTableDatasource[] {
  return [
    {
      position: 1,
      name: 'Hydrogen',
      weight: 1.0079,
      symbol: 'H',
      checked: false,
    },
    {
      position: 2,
      name: 'Helium',
      weight: 4.0026,
      symbol: 'He',
      checked: false,
    },
    {
      position: 3,
      name: 'Lithium',
      weight: 6.941,
      symbol: 'Li',
      checked: false,
    },
    {
      position: 4,
      name: 'Beryllium',
      weight: 9.0122,
      symbol: 'Be',
      checked: false,
    },
    {
      position: 5,
      name: 'Boron',
      weight: 10.811,
      symbol: 'B',
      checked: false,
    },
  ];
}
