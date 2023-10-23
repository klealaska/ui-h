import { Schema } from '@nx/angular/src/generators/library/schema';

export enum LibTypes {
  UTIL = 'util',
  FEATURE = 'feature',
  UI = 'ui',
  DATA = 'data-access',
  TYPES = 'types',
}
export interface LibSchema extends Schema {
  type?: LibTypes;
}
