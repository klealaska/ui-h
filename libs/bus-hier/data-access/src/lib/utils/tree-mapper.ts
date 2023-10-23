import { HierarchyType, ITreeMapped, ITreeNode } from '@ui-coe/bus-hier/shared/types';

export const toNavigationTreeMapper = (tree: ITreeMapped): ITreeNode[] => {
  const mappedOrg = {
    id: tree.organization.id,
    count: tree.organization.count,
    type: HierarchyType.ORGANIZATION,
    name: tree.organization.name,
    hasNext: true,
    isEntitySelected: false,
  };

  const mappedErp = {
    id: tree.erp.id,
    count: tree.erp.count,
    name: tree.erp.name,
    type: HierarchyType.ERP,
    hasNext: true,
    isEntitySelected: false,
  };

  const navigationTree: ITreeNode[] = tree.businessLevel.businessLevels.map((bl, index, arr) => {
    let name;
    let parentEntityId;
    let parentBusinessLevel;

    if (arr[index - 1]?.selectedEntity) {
      parentEntityId = arr[index - 1].selectedEntity.id;
      parentBusinessLevel = arr[index - 1].level;
    }

    if (bl.selectedEntity) {
      name = bl.selectedEntity.name;
    } else {
      name = bl.name;
    }

    return {
      id: bl.selectedEntity?.id,
      businessLevelId: bl?.id,
      name,
      count: bl.count,
      type: HierarchyType.ENTITIES,
      level: bl.level,
      hasNext: index + 1 < tree.businessLevel.depth,
      isEntitySelected: !!bl.selectedEntity,
      isActive: false,
      erpId: mappedErp.id,
      parentEntityId,
      parentBusinessLevel,
    };
  });

  navigationTree.forEach((bl, idx, arr) => {
    if (arr[idx - 1]?.parentEntityId) {
      bl.parentEntityId = arr[idx - 1].parentEntityId;
      bl.parentBusinessLevel = arr[idx - 1].parentBusinessLevel;
    }
  });

  navigationTree.unshift(mappedOrg, mappedErp);
  return navigationTree;
};
