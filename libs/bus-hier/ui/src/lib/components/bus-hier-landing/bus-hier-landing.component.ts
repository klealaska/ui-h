import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IItemSelection, IStatusEntity } from '@ui-coe/bus-hier/shared/types';
import { ButtonColors, ButtonTypes } from '@ui-coe/shared/types';

@Component({
  selector: 'bus-hier-landing',
  templateUrl: './bus-hier-landing.component.html',
  styleUrls: ['./bus-hier-landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierLandingComponent {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() listItem: string;
  @Input() listItemTwo: string;
  @Input() listItemThree: string;
  @Input() createLevelText: string;
  @Input() createObjectText: string;
  @Input() selectMode: boolean;
  @Input() organizations: IStatusEntity[];
  @Input() erps: IStatusEntity[];
  @Input() organizationsTitle: string;
  @Input() erpsTitle: string;
  @Input() intructionsTitle: string;
  @Input() viewHierBtnText: string;
  @Input() viewHierBtnEnabled: boolean;

  @Output() toggleOrgSelection = new EventEmitter<IItemSelection>();
  @Output() toggleErpSelection = new EventEmitter<IItemSelection>();
  @Output() viewHierBtnClick = new EventEmitter<void>();

  public readonly buttonTypes = ButtonTypes;
  public readonly buttonColors = ButtonColors;
}
