export type IRequest<T> = {
  payload: T;
  correlationId?: string;
};

export type IResponse<T> = T & {
  response: T;
};
