import { IndexedData } from './indexed-data';
import { UnindexedData } from './unindexed-data';
import { UserLock } from './user-lock';

export interface CompositeDocument {
  indexed: IndexedData;
  unindexed: UnindexedData;
  userLock: UserLock;
}
