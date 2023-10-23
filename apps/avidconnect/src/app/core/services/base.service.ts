import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AvidException } from '../../models';

// change for actual API response contract
export interface ApiResponse<T> {
  status: string;
  success: boolean;
  data: T;
}

const HttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
  body: null,
};

export class BaseAPIService {
  private baseUrl: string;

  constructor(public http: HttpClient, baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected get<T>(url: string, params?: any): Observable<T> {
    return this.http.get<T>(this.getUrl(url), { ...HttpOptions, params }).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err?.error?.exception as AvidException);
      })
    );
  }

  protected post<T>(
    url: string,
    body: any,
    params?: any,
    responseType?: string,
    headers?: HttpHeaders
  ): Observable<any> {
    const postParams: any = { ...HttpOptions, params };
    if (responseType) {
      postParams.responseType = responseType;
    }
    if (headers) {
      postParams.headers = headers;
    }
    return this.http.post<T>(this.getUrl(url), body, postParams).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err.error.exception as AvidException);
      })
    );
  }

  protected delete<T>(url: string, params?: any): Observable<T> {
    return this.http.delete<T>(this.getUrl(url), { ...HttpOptions, params }).pipe(
      catchError((err: HttpErrorResponse) => {
        return throwError(err?.error?.exception as AvidException);
      })
    );
  }

  protected getBlob<T>(url: string, params?: any): Observable<T | ArrayBuffer> {
    return this.http
      .get<T>(this.getUrl(url), { ...HttpOptions, params, responseType: 'blob' as any })
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  protected getCSV<T>(url: string, params?: any): Observable<T> {
    return this.http
      .get<T>(this.getUrl(url), { ...HttpOptions, params, responseType: 'text/csv' as any })
      .pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }

  private getUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }
}
