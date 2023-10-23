import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthTokenInterceptor } from './auth-token.interceptor';
import { HeadersInterceptor } from './headers.interceptor';
import { LoadingInterceptor } from './loading.interceptor';

export const httpInterceptors = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
];
