import { UserRowAction } from '../../enums';
import { IUser } from './user.interface';

export interface IRowAction {
  user: IUser;
  action: UserRowAction;
}
