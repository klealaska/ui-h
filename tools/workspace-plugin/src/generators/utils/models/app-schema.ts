import { Schema } from '@nx/angular/src/generators/application/schema';
import { AppTypes, StylesTypes } from './share';

export interface AppSchema extends Schema {
  name: string;
  title?: string;
  style?: StylesTypes;
  includeBff?: boolean;
  includeMockServer?: boolean;
  type?: AppTypes;
  remotePortNumber?: number;
  host?: string;
  includeIaC?: boolean;
  notificationsEmail?: string;
  cmsEnabled?: boolean;
  wikiEnabled?: boolean;
  businessService?: string;
  assignmentGroup?: string;
}
