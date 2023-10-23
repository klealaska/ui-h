export interface RetryStrategy {
  excludedStatusCodes?: number[];
  excludedStatusCodesToastMessage?: number[];
  duration?: number;
}
