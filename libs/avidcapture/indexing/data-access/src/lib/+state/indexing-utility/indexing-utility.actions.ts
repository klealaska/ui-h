import {
  CustomerAccount,
  DuplicateDetectionError,
  FieldBase,
  IndexedLabel,
  RejectToSenderPayload,
  RejectToSenderTemplate,
  Document,
} from '@ui-coe/avidcapture/shared/types';

export class LockDocument {
  static readonly type = '[IndexingUtility] LockDocument';
  constructor(public documentId: string) {}
}

export class CreateLabelColors {
  static readonly type = '[IndexingUtility] CreateLabelColors';
}

export class HandleEscalationSubmission {
  static readonly type = '[IndexingUtility] HandleEscalationSubmission';
  constructor(public hasNewEscalations: boolean) {}
}

export class CreateCustomerAccountActivity {
  static readonly type = '[IndexingUtility] CreateCustomerAccountActivity';
  constructor(public customerAccount: CustomerAccount) {}
}

export class CreateIndexedLabel {
  static readonly type = '[IndexingUtility] CreateIndexedLabel';
  constructor(public label: string, public labelValue: string) {}
}

export class ConfirmNewAccount {
  static readonly type = '[IndexingUtility] ConfirmNewAccount';
  constructor(public accountNumber: string) {}
}

export class UpdateSelectedDocumentText {
  static readonly type = '[IndexingUtility] UpdateSelectedDocumentText';
  constructor(public selectedDocumentText: IndexedLabel) {}
}

export class SanitizeFieldValue {
  static readonly type = '[IndexingUtility] SanitizeFieldValue';
  constructor(public field: FieldBase<string>, public isLookupField: boolean) {}
}

export class SetDuplicateDocumentId {
  static readonly type = '[IndexingUtility] SetDuplicateDocumentId';
  constructor(public duplicateDetectionError: DuplicateDetectionError) {}
}

export class UpdateAdditionalLookupValue {
  static readonly type = '[IndexingUtility] UpdateAdditionalLookupValue';
  constructor(public label: IndexedLabel, public lookupValue: string, public labelName: string) {}
}

export class UpdateOldBoundingBoxCoordinates {
  static readonly type = '[IndexingUtility] UpdateOldBoundingBoxCoordinates';
  constructor(public coordinates: number[]) {}
}

export class QueryRejectToSenderTemplates {
  static readonly type = '[IndexingUtility] QueryRejectToSenderTemplates';
  constructor(public buyerId: number) {}
}

export class PostRejectToSender {
  static readonly type = '[IndexingUtility] PostRejectToSender';
  constructor(public payload: RejectToSenderPayload) {}
}

export class CheckForDuplicateDocument {
  static readonly type = '[IndexingUtility] CheckForDuplicateDocument';
}

export class CreateRejectToSenderTemplate {
  static readonly type = '[IndexingUtility] CreateRejectToSenderTemplate';
  constructor(public payload: RejectToSenderTemplate) {}
}

export class EditRejectToSenderTemplate {
  static readonly type = '[IndexingUtility] EditRejectToSenderTemplate';
  constructor(public payload: RejectToSenderTemplate) {}
}

export class DeleteRejectToSenderTemplate {
  static readonly type = '[IndexingUtility] DeleteRejectToSenderTemplate';
  constructor(public templateId: string) {}
}

export class EnableSubmitButton {
  static readonly type = '[IndexingUtility] Enable Submit Button';
  constructor(public canSubmit: boolean) {}
}

export class SwapDocument {
  static readonly type = '[IndexingUtility] SwapDocument';
  constructor(public file: File, public organizationId: string) {}
}

export class UpdateAllQueueCounts {
  static readonly type = '[IndexingUtility] UpdateAllQueueCounts';
}
