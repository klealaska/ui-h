export interface Execution {
  executionTriggerTypeId?: number;
  origin?: string;
  isPreview?: boolean;
  createdBy?: string;
  platformKey?: string;
  customerKey?: string;
  registrationKey?: string;
  operations?: string[];
  parameters?: {
    system: {
      locations: {
        operationType: string;
        path: string; // API expects the format 'ac-blob://{fileId}'
      }[];
    };
  };
}
