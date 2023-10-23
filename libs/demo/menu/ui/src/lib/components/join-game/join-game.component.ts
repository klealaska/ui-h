import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumnDef } from '@ui-coe/shared/ui';
import { TableDataType } from '../../models/game.model';

@Component({
  selector: 'demo-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinGameComponent {
  @Input() joinGameForm: FormGroup;
  @Output() tableSelect = new EventEmitter<void>();
  @Output() joinGameEvent = new EventEmitter<void>();
  @Output() getGamesEvent = new EventEmitter<void>();
  @Input() dataSource: MatTableDataSource<TableDataType>;
  @Input() tableDef: TableColumnDef[];
}
