import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthTokenInterceptor } from './auth-token.interceptor';

export const httpInterceptors = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
];
