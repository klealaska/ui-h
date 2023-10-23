import { ChangeLog } from './change-log';
import { Escalation } from './escalation';
import { IndexedLabel } from './indexed-label';

export interface Activity {
  activity: string;
  changeLog: ChangeLog[];
  description: string;
  endDate: string;
  escalation: Escalation;
  indexer: string;
  labels: IndexedLabel[];
  ordinal: number;
  startDate: string;
}
