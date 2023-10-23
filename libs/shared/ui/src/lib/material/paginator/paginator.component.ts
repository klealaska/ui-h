import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { ThemePalette } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'ax-mat-paginator',
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
  @Input() color: ThemePalette = 'primary';
  @Input() disabled = false;
  @Input() hidePageSize = false;
  @Input() length: number;
  @Input() pageIndex: number;
  @Input() pageSize: number;
  @Input() pageSizeOptions: number[];
  @Input() showFirstLastButtons = true;
  @Output() page = new EventEmitter<PageEvent>();
}
