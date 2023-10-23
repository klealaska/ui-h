import { ApiErrorResponse } from './api.models';

export interface IParamsProps<T1 = void, T2 = void> {
  type?: string;
  params?: T1;
  body?: T2;
  correlationId?: string;
}

export interface ISuccessProps<T> {
  type?: string;
  response: T;
  correlationId: string;
}

export interface IFailureProps {
  type?: string;
  error: ApiErrorResponse;
  correlationId: string;
}
