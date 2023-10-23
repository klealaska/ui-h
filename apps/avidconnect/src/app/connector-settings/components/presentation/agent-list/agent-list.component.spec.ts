import { AgentListComponent } from './agent-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { OnPremAgent, OnPremAgentItem } from '../../../../models';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { DatePipe } from '@angular/common';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'avc-mock-agent-list-parent',
  template: `<avc-agent-list #agentList [agentList]="mockAgentList"></avc-agent-list>`,
})
export class AvcMockAgentListParentComponent {
  @ViewChild(AgentListComponent) agentList: AgentListComponent;
  mockAgentList: OnPremAgent = {
    paging: {
      pageSize: 50,
      pageNumber: 1,
      pages: 1,
      pageItems: 1,
      totalItems: 1,
      queryTimeStamp: '2023-03-20T14:43:42.7617459Z',
    },
    items: [
      {
        id: 1,
        customerId: 32325,
        agentSID: 'a37a1310-d718-27b3-8180-769a55d25cb0',
        isDeactivated: false,
        isLockedOut: false,
        hostName: 'G6KQRQ2.AvidXchange.com',
        topic: 'Customer-32325',
        subscription: 'SID-a37a1310-d718-27b3-8180-769a55d25cb0',
        createdDate: '2023-02-22T09:04:26.9',
        createdBy: 'N/A',
        deactivatedDate: '0001-01-01T00:00:00',
        deactivatedBy: null,
        lastAccess: '2023-02-22T09:04:26.9',
      },
      {
        id: 2,
        customerId: null,
        agentSID: '106845ec-925b-e2f7-6108-94352a4ef92a',
        isDeactivated: false,
        isLockedOut: false,
        hostName: 'G6KQRQ2.AvidXchange.com',
        topic: 'Customer-32325',
        subscription: 'SID-106845ec-925b-e2f7-6108-94352a4ef92a',
        createdDate: '2023-02-23T16:17:51.2',
        createdBy: 'N/A',
        deactivatedDate: '0001-01-01T00:00:00',
        deactivatedBy: null,
        lastAccess: '2023-02-23T16:17:51.2',
      },
    ],
  };
}

describe('agent list', () => {
  let component: AvcMockAgentListParentComponent;
  let fixture: ComponentFixture<AvcMockAgentListParentComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvcMockAgentListParentComponent, AgentListComponent],
      imports: [MatTableModule, MatPaginatorModule, MatButtonModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(AvcMockAgentListParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create the components', () => {
    expect(component).toBeTruthy();
    expect(component.agentList).toBeTruthy();
  });

  it('should display the appropriate column names', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const firstRow = (await table.getRows())[0];
    const cells = await firstRow.getCells();
    const cellsColumnNames = await parallel(() => cells.map(cell => cell.getColumnName()));
    expect(cellsColumnNames).toEqual(['hostName', 'createdDate', 'createdBy', 'button']);
  });

  it('should display the correct number of rows', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const rows = await table.getRows();
    expect(rows.length).toBe(1);
  });

  it('should display the correct data inside the first row', async () => {
    const datePipe = new DatePipe('en');
    const rowData: OnPremAgentItem = component.mockAgentList.items[0];
    const table = await loader.getHarness(MatTableHarness);
    const secondRow = (await table.getRows())[0];
    const cells = await secondRow.getCells();
    const cellTexts = await parallel(() => cells.map(cell => cell.getText()));
    expect(cellTexts[0]).toContain(rowData.hostName);
    expect(cellTexts[1]).toContain(datePipe.transform(rowData.createdDate, 'MM/dd/yyyy, h:mm a'));
    expect(cellTexts[2]).toContain(rowData.createdBy);
    expect(cellTexts[3]).toContain('Deactivate');
  });

  it('should emit an event with the row data when deactivate is clicked', async () => {
    jest.spyOn(component.agentList.agentDeactivateClick, 'emit');
    const firstRowDeactivateBtn: MatButtonHarness[] = await loader.getAllHarnesses(
      MatButtonHarness.with({ text: 'Deactivate' })
    );
    await firstRowDeactivateBtn[0].click();
    expect(component.agentList.agentDeactivateClick.emit).toHaveBeenCalledWith(
      component.mockAgentList.items[0]
    );
  });

  it('should emit an event when add additional machine is clicked', async () => {
    jest.spyOn(component.agentList.activateMachineClick, 'emit');
    const activateMachineBtn: MatButtonHarness = await loader.getHarness(
      MatButtonHarness.with({ text: 'Activate Additional Machine' })
    );
    await activateMachineBtn.click();
    expect(component.agentList.activateMachineClick.emit).toHaveBeenCalled();
  });

  it('should update the datasource and table when the list is updated', () => {
    jest.spyOn(component.agentList.table, 'renderRows');
    const items = (component.mockAgentList.items = [
      ...component.mockAgentList.items,
      ...[
        {
          id: 3,
          customerId: 32325,
          agentSID: '106845ec-925b-e2f7-6108-94352a4ef92a',
          isDeactivated: false,
          isLockedOut: false,
          hostName: 'G6KQRQ2.AvidXchange.com',
          topic: 'Customer-32325',
          subscription: 'SID-106845ec-925b-e2f7-6108-94352a4ef92a',
          createdDate: '2023-02-23T16:17:51.2',
          createdBy: 'N/A',
          deactivatedDate: '0001-01-01T00:00:00',
          deactivatedBy: null,
          lastAccess: '2023-02-23T16:17:51.2',
        },
      ],
    ]);
    component.mockAgentList = {
      ...component.mockAgentList,
      ...component.mockAgentList.paging,
      ...{ totalItems: 3 },
      ...component.mockAgentList.items,
      ...items,
    };
    fixture.detectChanges();
    expect(component.agentList.dataSource.data.length).toBe(3);
    expect(component.agentList.table.renderRows).toHaveBeenCalled();
  });
});
