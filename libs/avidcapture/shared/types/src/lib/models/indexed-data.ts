import { Activity } from './activity';
import { IndexedLabel } from './indexed-label';

export interface IndexedData {
  documentId: string;
  fileId: string;
  indexer: string;
  dateReceived: string;
  lastModified: string;
  labels: IndexedLabel[];
  activities: Activity[];
  isSubmitted?: boolean;
}
