export interface ResponseBase<T> {
  data: T;
  message?: string | null;
  isSuccess?: boolean;
  statusCode?: number;
}
