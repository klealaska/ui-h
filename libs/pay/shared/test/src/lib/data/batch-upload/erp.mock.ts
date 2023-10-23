import { IErp } from '@ui-coe/pay/shared/types';
import { EntityState } from '@ngrx/entity';

export const mockErpList: IErp[] = [
  {
    id: '1',
    name: 'Erp 1',
  },
  {
    id: '2',
    name: 'Erp 2',
  },
  {
    id: '3',
    name: 'Erp 3',
  },
];

export const mockErpEntityList: EntityState<IErp> = {
  ids: [1, 2, 3],
  entities: {
    1: mockErpList[0],
    2: mockErpList[1],
    3: mockErpList[2],
  },
};
