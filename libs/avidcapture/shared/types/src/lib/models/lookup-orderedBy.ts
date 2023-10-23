export interface LookupOrderedBy {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LookupOrderedByResponse {
  count: number;
  records: LookupOrderedBy[];
}
