import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, map, Observable, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import {
  DetailsFacade,
  HistoryFacade,
  TreeFacade,
  BusinessLevelFacade,
} from '@ui-coe/bus-hier/data-access';

import {
  AppActions,
  IActivateTreeNode,
  DetailsType,
  HierarchyType,
  IActivateOrDeactivateItem,
  IDetails,
  IEntity,
  IGetDetails,
  IGetEntities,
  IGetTree,
  IHistoryEvent,
  IHistoryEventList,
  IRequest,
  ITreeNode,
  ITreeNodeClickEvent,
  eventTrackingKey,
  ContentKeys,
  AddressType,
  IEditBusinessLevelName,
  IStatusEntity,
  IItemSelection,
  IDeactiveActivateAddressEvent,
  IEditAddress,
  IEditAddressEvent,
} from '@ui-coe/bus-hier/shared/types';
import { SubscriptionManagerService, ToggleService } from '@ui-coe/shared/util/services';
import { ToastComponent } from '@ui-coe/shared/ui-v2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'bus-hier-manage-container',
  templateUrl: './bus-hier-manage-container.component.html',
  styleUrls: ['./bus-hier-manage-container.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusHierManageContainerComponent implements OnInit, OnDestroy {
  pageTitle = ContentKeys.TITLE;
  fontFamily = 'font-["inter-regular"]';
  listDetailsSubTitle = ContentKeys.DETAILS_LIST_SUBTITLE;
  detailsPage = ContentKeys.DETAILS_CONTENT;
  defaultPageContent = ContentKeys.DEFAULT_PAGE_CONTENT;
  addressSection = ContentKeys.DETAILS_PAGE_ADDRESSES_CONTENT;

  orgId: string;
  erpId: string;

  toggleSidesheet = false;

  private readonly _subKey = this.subManager.init();

  constructor(
    private treeFacade: TreeFacade,
    private detailsFacade: DetailsFacade,
    private translateService: TranslateService,
    private subManager: SubscriptionManagerService,
    private snackBar: MatSnackBar,
    private historyFacade: HistoryFacade,
    private BusinessLevelFacade: BusinessLevelFacade,
    private businessLevelNameToggle: ToggleService
  ) {}
  selectedEntityListTitleText$: BehaviorSubject<string> = new BehaviorSubject('');
  selectedEntityListSingularName$: BehaviorSubject<string> = new BehaviorSubject('');
  selectedEntityListSubTitleText$: BehaviorSubject<string> = new BehaviorSubject('');
  treeNodeID$: BehaviorSubject<string> = new BehaviorSubject('');
  viewHierarchySelectMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  details$: Observable<IDetails> = this.detailsFacade.details$;
  detailsLoading$: Observable<boolean> = this.detailsFacade.loading$;
  entities$: Observable<IEntity[]> = this.detailsFacade.entities$;
  detailsType$: Observable<DetailsType> = this.detailsFacade.type$;
  backBtnHidden$: Observable<boolean> = this.detailsType$.pipe(
    map((type: DetailsType) => type === DetailsType.LANDING)
  );
  editDetailsMode$: Observable<boolean> = this.detailsFacade.editDetailsMode$;
  historyEvents$: Observable<IHistoryEventList> = this.historyFacade.historyEvents$;
  tree$: Observable<ITreeNode[]> = this.treeFacade.tree$;
  organizations$: Observable<IStatusEntity[]> = this.treeFacade.orgs$;
  erps$: Observable<IStatusEntity[]> = this.treeFacade.erps$;
  loading$: Observable<boolean> = this.treeFacade.loading$;
  viewHierBtnEnabled$: Observable<boolean> = this.treeFacade.viewHierBtnEnabled$;
  viewHierarchy$: Observable<IGetTree> = this.treeFacade.viewHierarchy$;

  ngOnInit(): void {
    this.subManager.add(
      this._subKey,
      this.BusinessLevelFacade.businessLevelNamePlural$,
      (name: string) => this.selectedEntityListTitleText$.next(name)
    );

    this.subManager.add(
      this._subKey,
      this.BusinessLevelFacade.businessLevelNameSingular$,
      (name: string) => this.selectedEntityListSingularName$.next(name)
    );

    this.treeFacade.getOrgsAndErps();
    this.treeFacade.treeState$.pipe(take(2)).subscribe(treeState => {
      if (treeState?.erps?.length === 1 && treeState?.orgs?.length === 1) {
        const erpId = treeState.erps[0].id;
        const orgId = treeState.orgs[0].id;

        this.orgId = orgId;
        this.erpId = erpId;

        const request = {
          payload: { erpId, orgId },
          correlationId: uuidv4(),
        };
        this.treeFacade.getTree(request);
        this.viewHierarchySelectMode$.next(false);
      } else {
        // TBD
        // TODO: if we have multiple orgs/erps we will come to this block
        //! we will need a way to set the orgId and erpId as done in the above `if`
        //! if needed we can refactor that somehow as well
        this.viewHierarchySelectMode$.next(true);
      }
    });

    this.subManager.add(this._subKey, this.detailsFacade.toast$, toastConfig => {
      if (toastConfig) {
        this.snackBar
          .openFromComponent(ToastComponent, toastConfig)
          .afterDismissed()
          .pipe(take(1))
          .subscribe(() => this.detailsFacade.dismissToast());
      }
    });

    this.subManager.add(this._subKey, this.BusinessLevelFacade.toast$, toastConfig => {
      if (toastConfig) {
        this.snackBar
          .openFromComponent(ToastComponent, toastConfig)
          .afterDismissed()
          .pipe(take(1))
          .subscribe(() => this.BusinessLevelFacade.dismissToast());
      }
    });

    this.buildValidationErrors();
  }

  onSelectNode(selectedNode: ITreeNodeClickEvent) {
    const correlationId: string = uuidv4();

    const treeNodeId = selectedNode.id ? selectedNode.id : selectedNode.businessLevelId;
    this.treeNodeID$.next(treeNodeId);
    this.treeFacade.activateTreeNode({ payload: { id: treeNodeId }, correlationId });

    this.editDetailsMode$.pipe(take(1)).subscribe(editDetailsMode => {
      if (editDetailsMode) {
        this.detailsFacade.toggleEditDetailsMode();
      }
    });

    // if no entities are selected we fetch list else get fetch individual details
    if (!selectedNode.isEntitySelected && selectedNode.type === HierarchyType.ENTITIES) {
      //* if an entity has been selected at a parent business level
      //* we need to calculate the child level of the current selected node
      //* relative to that parent business level so we can get the correct
      //* subset of entities for that parent
      const level = selectedNode.parentBusinessLevel
        ? selectedNode.level - selectedNode.parentBusinessLevel
        : selectedNode.level;
      const req: IRequest<IGetEntities> = {
        payload: {
          erpId: selectedNode.erpId,
          level,
          parentEntityId: selectedNode.parentEntityId,
          entityName: selectedNode.name?.singular,
        },
        correlationId,
      };

      this.detailsFacade.getEntities(req);

      this.selectedEntityListTitleText$.next(selectedNode.name?.plural);
      this.selectedEntityListSingularName$.next(selectedNode.name?.singular);

      this.translateService
        .get(this.listDetailsSubTitle)
        .pipe(take(1))
        .subscribe(translations => {
          const prefix = this.beginsWithVowel(selectedNode.name.singular) ? 'an' : 'a';

          this.selectedEntityListSubTitleText$.next(
            translations.replace(
              '{{ entityNameSingular }}',
              `${prefix} ${selectedNode.name?.singular.toLowerCase()}`
            )
          );
        });
    } else {
      const request: IRequest<IGetDetails> = {
        payload: {
          id: selectedNode.id,
          hierarchyType: selectedNode.type,
        },
        correlationId,
      };
      this.detailsFacade.getDetails(request);
    }
  }

  onSelectEntity(e) {
    const request: IRequest<IGetDetails> = {
      payload: {
        orgId: this.orgId,
        erpId: this.erpId,
        id: e.id,
        level: e.level,
        hierarchyType: e.type || HierarchyType.ENTITIES,
        entityTypeName: e.entityTypeName,
      },
      correlationId: uuidv4(),
    };
    this.detailsFacade.getDetails(request);
  }

  onToggleEditDetailsMode() {
    this.detailsFacade.toggleEditDetailsMode();
  }

  onSaveDetails(e) {
    this.detailsFacade.editDetails(e);
  }

  onActivateItem(item: IActivateOrDeactivateItem) {
    this.detailsFacade.activateItem(item);
  }

  onDeactivateItem(item: IActivateOrDeactivateItem) {
    this.detailsFacade.deactivateItem(item);
  }

  private beginsWithVowel(word): boolean {
    return ['a', 'e', 'i', 'o', 'u'].indexOf(word[0].toLowerCase()) !== -1;
  }

  backBtnClick() {
    this.historyEvents$.pipe(take(1)).subscribe((events: IHistoryEventList) => {
      const eventsCopied = cloneDeep(events);
      //* this event represents the last set of actions that were taken
      //* we don't need to replay it so we are removing it
      eventsCopied.shift();
      //* this is the set of actions that we are interested in replaying
      const items = eventsCopied.shift();

      this.historyFacade.updateHistoryEvents(eventsCopied);

      items.forEach((historyEvent: IHistoryEvent) => {
        const action = historyEvent[eventTrackingKey];
        const payload = historyEvent.payload;
        //* we are saving all the replayed actions here
        //* in order to prevent needing to determine
        //* if we need to replay the last action set or not
        //* this way we will always throw away the last action (see comments above)
        //* and then replay the actions at the following position in the events array
        switch (action) {
          case AppActions.LOAD_DETAILS:
            this.detailsFacade.getDetails({
              payload,
              correlationId: historyEvent.correlationId,
            });
            break;

          case AppActions.LOAD_ENTITIES:
            this.detailsFacade.getEntities({
              payload: payload as IGetEntities,
              correlationId: historyEvent.correlationId,
            });
            break;

          case AppActions.ACTIVATE_TREE_NODE:
            this.treeFacade.activateTreeNode({
              payload: payload as IActivateTreeNode,
              correlationId: historyEvent.correlationId,
            });
            break;

          case AppActions.LOAD_TREE:
            this.treeFacade.getTree({
              payload: payload as IGetTree,
              correlationId: historyEvent.correlationId,
            });
            this.detailsFacade.resetDetails();
            break;
          default:
            break;
        }
      });
    });
  }
  validationErrors$ = new BehaviorSubject<string[]>([]);
  renameBusLevelValidationError: string[] = [];
  buildValidationErrors(): void {
    const errors: string[] = [];
    this.translateService
      .get([ContentKeys.DETAILS_REQUIRED_ERROR, ContentKeys.DETAILS_MAX_LENGTH_ERROR])
      .pipe(take(1))
      .subscribe(translations => {
        Object.keys(translations).forEach((translation: string) => {
          errors.push(translations[translation]);
        });
        this.validationErrors$.next(errors);
      });

    this.translateService
      .get([ContentKeys.BUS_LEVEL_RENAME_REQUIRED_ERROR])
      .pipe(take(1))
      .subscribe(translation => (this.renameBusLevelValidationError = Object.values(translation)));
  }

  onDeactivateAddress(event: IDeactiveActivateAddressEvent): void {
    this.detailsFacade.deactivateAddress({
      id: event.id,
      addressId: event.addressId,
      addressType: event.type,
      hierarchyType: event.hierarchyType,
    });
  }

  onActivateAddress(event: IDeactiveActivateAddressEvent): void {
    this.detailsFacade.activateAddress({
      id: event.id,
      addressId: event.addressId,
      addressType: event.type,
      hierarchyType: event.hierarchyType,
    });
  }

  // TODO remove lint disabled line below when this functional is implemented
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onAddAddress(type: AddressType): void {
    throw new Error('onAddAddress not implemented');
  }

  organizationType: string = HierarchyType.ORGANIZATION;
  erpType: string = HierarchyType.ERP;

  toggleOrgSelection(event: IItemSelection) {
    this.treeFacade.clickOrgItem(event);
  }

  toggleErpSelection(event: IItemSelection) {
    this.treeFacade.clickErpItem(event);
  }

  viewHierBtnClick() {
    const correlationId: string = uuidv4();

    this.viewHierarchy$.pipe(take(1)).subscribe((getTreeParams: IGetTree) => {
      this.orgId = getTreeParams.orgId;
      this.erpId = getTreeParams.erpId;
      this.treeFacade.getTree({
        payload: getTreeParams,
        correlationId,
      });
      this.viewHierarchySelectMode$.next(false);
    });
  }

  // Toggle sidesheet
  onBusinessLevelNameEdit(): void {
    this.toggleSidesheet = !this.toggleSidesheet;
    this.businessLevelNameToggle.toggleState();
  }

  // Toggle side sheet for editing an address
  onEditAddress(event: IEditAddressEvent): void {
    const params: IEditAddress = {
      // this id can be of Organization Id or Entity Id since both have editable addresses
      id: event.id,
      hierarchyType: event.type,
      address: event.address,
      addressType: event.addressType,
    };
    this.detailsFacade.editAddress(params);
  }

  onSaveBusinessLevelNameEdit(e: IEditBusinessLevelName): void {
    combineLatest([this.treeFacade.selectEntityIdForTreeRedraw$, this.treeFacade.selectedNodeId$])
      .pipe(take(1))
      .subscribe(([selectedEntityId, selectedNodeId]) => {
        const event: IEditBusinessLevelName = {
          ...e,
          orgId: this.orgId,
          erpId: this.erpId,
          entityId: selectedEntityId,
          selectedNode: selectedNodeId,
        };

        this.BusinessLevelFacade.updateBusinessLevelName(event);
      });

    //TODO Add something that updates the tree
    this.toggleSidesheet = !this.toggleSidesheet;
  }

  ngOnDestroy(): void {
    this.subManager.tearDown(this._subKey);
  }
}
