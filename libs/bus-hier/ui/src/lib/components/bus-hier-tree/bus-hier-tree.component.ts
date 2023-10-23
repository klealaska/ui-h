import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusHierTreeNodeComponent } from './bus-hier-tree-node/bus-hier-tree-node.component';
import { ITreeNode, ITreeNodeClickEvent } from '@ui-coe/bus-hier/shared/types';

@Component({
  selector: 'bus-hier-tree',
  standalone: true,
  imports: [CommonModule, BusHierTreeNodeComponent],
  templateUrl: './bus-hier-tree.component.html',
  styleUrls: ['./bus-hier-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierTreeComponent {
  @Input() tree: ITreeNode[];
  @Input() isLoading: boolean;

  @Output() selectNode = new EventEmitter<ITreeNodeClickEvent>();

  onClick(e: ITreeNodeClickEvent) {
    this.selectNode.emit(e);
  }
}
