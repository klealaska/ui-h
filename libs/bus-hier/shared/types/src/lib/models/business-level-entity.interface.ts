import { IBusinessName, IEntity } from './entity.interface';

export interface IBusinessLevelEntity extends IEntity {
  level: number;
  id: string;
  count: number;
  name: IBusinessName;
  selectedEntity: IEntity;
}
