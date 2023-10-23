export interface RejectToSenderTemplate {
  templateId?: string;
  sourceSystemBuyerId: string;
  sourceSystemId: string;
  templateName: string;
  templateSubjectLine: string;
  notificationTemplate: string;
  buyerEmailAddress?: string;
  isActive: boolean;
}
