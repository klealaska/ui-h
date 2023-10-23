export interface Escalation {
  category: EscalationCategory;
  description: string;
  escalationLevel: string;
  resolution: string;
}

export interface EscalationCategory {
  issue: string;
  reason: string;
}
