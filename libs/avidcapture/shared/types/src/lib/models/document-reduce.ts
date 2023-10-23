import { SearchAlias } from '../enums';
import { Document } from './document';

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export interface DocumentReduce extends Document, PartialRecord<SearchAlias, string> {}
