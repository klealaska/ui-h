import { IndexedLabel } from './indexed-label';

export interface ChangeLog {
  previous: IndexedLabel;
  current: IndexedLabel;
}
