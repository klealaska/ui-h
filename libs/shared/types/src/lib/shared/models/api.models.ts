export interface ApiErrorResponse {
  code: string;
  message: string;
  details: any[];
}

export interface CallState {
  correlationId: string;
  loading: boolean;
  loaded: boolean;
  error: boolean;
  errorCode: string;
  errorMessage: string;
}

export class InitialCallState implements CallState {
  correlationId = '';
  loading = false;
  loaded = false;
  error = false;
  errorCode = '';
  errorMessage = '';
}

export class LoadCallState implements CallState {
  correlationId = '';
  loading = true;
  loaded = false;
  error = false;
  errorCode = '';
  errorMessage = '';
}

export class SuccessCallState implements CallState {
  correlationId = '';
  loading = false;
  loaded = true;
  error = false;
  errorCode = '';
  errorMessage = '';

  constructor(correlationId: string) {
    this.correlationId = correlationId;
  }
}

export class FailureCallState implements CallState {
  correlationId = '';
  loading = false;
  loaded = false;
  error = true;
  errorCode = '';
  errorMessage = '';

  constructor(correlationId: string, error: ApiErrorResponse) {
    this.correlationId = correlationId;
    this.errorCode = error.code;
    this.errorMessage = error.message;
  }
}
