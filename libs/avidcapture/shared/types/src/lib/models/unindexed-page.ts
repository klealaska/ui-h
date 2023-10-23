import { UnindexedLine } from './unindexed-line';

export interface UnindexedPage {
  number: number;
  lines: UnindexedLine[];
}
