export interface LabelValue {
  text: string;
  confidence: number;
  boundingBox: number[];
  required: boolean;
  verificationState: string;
  incomplete: boolean;
  incompleteReason: string;
  type: string;
}
