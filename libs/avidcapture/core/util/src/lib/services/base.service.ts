import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Headers } from '@ui-coe/avidcapture/shared/types';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// change for actual API response contract
export interface ApiResponse<T> {
  status: string;
  success: boolean;
  data: T;
}

const HttpOptions = {
  headers: new HttpHeaders({
    [Headers.ContentType]: Headers.appJson,
  }),
  withCredentials: true,
  body: null,
};

export class BaseAPIService {
  constructor(protected http: HttpClient) {}

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, HttpOptions).pipe(
      retry({ delay: err => (err.status === 401 ? timer(2000) : throwError(() => err)) }),
      catchError((err: HttpErrorResponse) => throwError(() => err))
    );
  }

  protected getFileBlob(url: string): Observable<Blob> {
    const headers = new HttpHeaders({
      Accept: Headers.appPdf,
      [Headers.ContentType]: Headers.appJson,
    });

    return this.http.get(url, { headers, withCredentials: true, responseType: 'blob' }).pipe(
      retry({ delay: err => (err.status === 401 ? timer(2000) : throwError(() => err)) }),
      catchError((err: HttpErrorResponse) => throwError(() => err))
    );
  }

  protected post<T>(
    url: string,
    body: any,
    options: { headers?: HttpHeaders } = {}
  ): Observable<T> {
    return this.http.post<T>(url, body, options).pipe(
      retry({ delay: err => (err.status === 401 ? timer(2000) : throwError(() => err)) }),
      catchError((err: HttpErrorResponse) => throwError(() => err))
    );
  }

  protected put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body, HttpOptions).pipe(
      retry({ delay: err => (err.status === 401 ? timer(2000) : throwError(() => err)) }),
      catchError((err: HttpErrorResponse) => throwError(() => err))
    );
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, HttpOptions).pipe(
      retry({ delay: err => (err.status === 401 ? timer(2000) : throwError(() => err)) }),
      catchError((err: HttpErrorResponse) => throwError(() => err))
    );
  }

  protected deleteWithBody<T>(url: string, body: any): Observable<T> {
    HttpOptions.body = body;

    return this.http.delete<T>(url, HttpOptions).pipe(
      retry({ delay: err => (err.status === 401 ? timer(2000) : throwError(() => err)) }),
      catchError((err: HttpErrorResponse) => throwError(() => err))
    );
  }

  protected parseUrlParams(url: string, params: any): string {
    const parameters = Object.keys(params);

    parameters.forEach(param => {
      url = url.replace(`{${param}}`, params[param]);
    });

    return url;
  }
}
