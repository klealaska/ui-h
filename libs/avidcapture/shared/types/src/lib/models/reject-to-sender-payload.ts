export interface RejectToSenderPayload {
  toEmailAddress: string;
  submitterEmailAddress: string;
  templateId: number;
  fileId: number;
  dateReceived: string;
}
