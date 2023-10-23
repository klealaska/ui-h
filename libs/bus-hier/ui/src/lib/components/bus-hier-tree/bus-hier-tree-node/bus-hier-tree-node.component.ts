import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { ButtonType, ButtonTypes } from '@ui-coe/shared/types';
import { ITreeNodeClickEvent, HierarchyType, IBusinessName } from '@ui-coe/bus-hier/shared/types';

@Component({
  selector: 'bus-hier-tree-node',
  standalone: true,
  imports: [CommonModule, ButtonComponent, MatBadgeModule],
  templateUrl: './bus-hier-tree-node.component.html',
  styleUrls: ['./bus-hier-tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierTreeNodeComponent {
  @Input() name: string | IBusinessName;
  @Input() id: string;
  @Input() erpId: string;
  @Input() type: HierarchyType;
  @Input() isActive: boolean;
  @Input() isEntitySelected: boolean;
  @Input() level: number;
  @Input() hasNext: boolean;
  @Input() count: number;
  @Input() parentEntityId: string;
  @Input() parentBusinessLevel: number;
  @Input() businessLevelId: string;

  @Output() clicked = new EventEmitter<ITreeNodeClickEvent>();

  primary: ButtonType = ButtonTypes.primary;
  secondary: ButtonType = ButtonTypes.secondary;

  onClick() {
    this.clicked.emit({
      id: this.id,
      type: this.type,
      level: this.level,
      erpId: this.erpId,
      businessLevelId: this.businessLevelId,
      isEntitySelected: this.isEntitySelected,
      name:
        this.type === HierarchyType.ENTITIES && !this.isEntitySelected
          ? (this.name as IBusinessName)
          : null,
      parentEntityId: this.parentEntityId,
      parentBusinessLevel: this.parentBusinessLevel,
    });
  }

  getName(name): string {
    if (typeof name === 'string') {
      return name;
    } else {
      return this.count > 1 ? name?.plural : name?.singular;
    }
  }
}
