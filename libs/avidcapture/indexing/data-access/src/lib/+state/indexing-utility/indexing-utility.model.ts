import {
  DuplicateDetectionError,
  IndexedData,
  IndexedLabel,
  LabelColor,
  RejectToSenderTemplate,
} from '@ui-coe/avidcapture/shared/types';

export interface IndexingUtilityStateModel {
  labelColors: LabelColor[];
  customerAccountExists: boolean;
  selectedDocumentText: IndexedLabel;
  duplicateDetectionError: DuplicateDetectionError;
  oldBoundingBoxCoordinates: number[];
  rejectToSenderTemplates: RejectToSenderTemplate[];
  duplicateIndexedData: IndexedData;
  canSubmit: boolean;
}
