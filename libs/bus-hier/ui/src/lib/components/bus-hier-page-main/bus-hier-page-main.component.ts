import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType, ButtonTypes, FormFieldError } from '@ui-coe/shared/types';
import {
  HierarchyType,
  IDetails,
  IEntity,
  IActivateOrDeactivateItem,
  DetailsType,
  AddressSectionContent,
  IEditBusinessLevelName,
  IStatusEntity,
  defaultPageContent,
  IItemSelection,
  IDeactiveActivateAddressEvent,
  IEditAddressEvent,
  DetailsContent,
} from '@ui-coe/bus-hier/shared/types';

@Component({
  selector: 'bus-hier-page-main',
  templateUrl: './bus-hier-page-main.component.html',
  styleUrls: ['./bus-hier-page-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusHierPageMainComponent {
  @Input() orgId: string;
  @Input() erpId: string;
  @Input() type: DetailsType;
  @Input() loading: boolean;
  @Input() entities: IEntity[];
  @Input() details: IDetails;
  @Input() entityListTitle: string;
  @Input() entityListNameSingular: string;
  @Input() entityListSubTitle: string;
  @Input() editMode: boolean;
  @Input() backBtnHidden: boolean;
  @Input() editValidationErrors: FormFieldError[];
  @Input() organizations: IStatusEntity[];
  @Input() erps: IStatusEntity[];
  @Input() selectMode: boolean;
  @Input() addressSectionContent: AddressSectionContent;
  @Input() businessLevelNameSideSheetToggle: boolean;
  @Input() businessLevelID: string;
  @Input() defaultPageContent: defaultPageContent;
  @Input() viewHierBtnEnabled: boolean;
  @Input() detailsContent: DetailsContent;
  @Input() renameBusLevelValidationError: string[];
  // TODO: revisit naming of entity
  @Output() selectEntity = new EventEmitter<{
    id: string;
    type: string;
    level: number;
    entityTypeName: string;
  }>();
  @Output() backBtnClicked = new EventEmitter<void>();
  @Output() activateItem = new EventEmitter<IActivateOrDeactivateItem>();
  @Output() deactivateItem = new EventEmitter<IActivateOrDeactivateItem>();
  @Output() toggleEditDetailsMode = new EventEmitter<void>();
  @Output() saveDetails = new EventEmitter<any>();
  @Output() activateAddressButtonClick = new EventEmitter<IDeactiveActivateAddressEvent>();
  @Output() deactivateAddressButtonClick = new EventEmitter<IDeactiveActivateAddressEvent>();
  @Output() addAddressButtonClick = new EventEmitter<void>();
  @Output() businessLevelNameEdit = new EventEmitter<void>();
  @Output() saveBusinessLevelNameEdit = new EventEmitter<IEditBusinessLevelName>();
  @Output() toggleOrgSelection = new EventEmitter<IItemSelection>();
  @Output() toggleErpSelection = new EventEmitter<IItemSelection>();
  @Output() viewHierBtnClick = new EventEmitter<void>();
  @Output() editAddress = new EventEmitter<IEditAddressEvent>();
  @Output() orgClick = new EventEmitter<number>();
  @Output() erpClick = new EventEmitter<number>();

  primary: ButtonType = ButtonTypes.primary;
  secondary: ButtonType = ButtonTypes.secondary;
  tertiary: ButtonType = ButtonTypes.tertiary;
  entitiesType = HierarchyType.ENTITIES;
  detailsType = DetailsType.DETAILS;
  editDetailsType = DetailsType.EDIT_DETAILS;
  listType = DetailsType.LIST;
  landingType = DetailsType.LANDING;
}
