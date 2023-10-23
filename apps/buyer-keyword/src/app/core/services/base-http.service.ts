import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

const HttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
  withCredentials: true,
  body: null,
};

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  constructor(public http: HttpClient) {}

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, HttpOptions).pipe(
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
}
