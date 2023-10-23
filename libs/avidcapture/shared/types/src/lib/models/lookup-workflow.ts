export interface LookupWorkflow {
  id: string;
  name: string;
}

export interface LookupWorkflowResponse {
  count: number;
  records: LookupWorkflow[];
}
