import { Escalation } from './escalation';

export interface BatchEscalationRequest {
  docIds: string[];
  escalation: Escalation;
}
