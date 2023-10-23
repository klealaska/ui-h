import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { OnPremAgent, OnPremAgentItem } from '../../../../models';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'avc-agent-list',
  templateUrl: './agent-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./agent-list.component.scss'],
})
export class AgentListComponent implements OnInit, OnChanges, AfterViewInit {
  public dataSource: MatTableDataSource<OnPremAgentItem>;
  public displayedColumns: string[] = ['hostName', 'createdDate', 'createdBy', 'button'];
  @Input() agentList: OnPremAgent;
  @Output() agentDeactivateClick: EventEmitter<OnPremAgentItem> =
    new EventEmitter<OnPremAgentItem>();
  @Output() activateMachineClick: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public ngOnInit(): void {
    const filteredAgents = this.agentList?.items.filter(
      (agent: OnPremAgentItem) => agent.customerId !== null
    );
    this.dataSource = new MatTableDataSource(filteredAgents);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.agentList.firstChange) {
      if (changes.agentList.currentValue !== changes.agentList.previousValue) {
        this.dataSource = new MatTableDataSource(this.agentList.items);
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
      }
    }
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
