import { UnindexedPage } from './unindexed-page';

export interface UnindexedData {
  documentId: string;
  fileId: string;
  indexer: string;
  dateReceived: string;
  pages: UnindexedPage[];
}
