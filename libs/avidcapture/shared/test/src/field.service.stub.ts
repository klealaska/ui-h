/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Observable, of } from 'rxjs';

import { fieldControlStub } from './test.stub';

export class FieldServiceStub {
  getFormFieldMetaData(): Observable<any> {
    return of(fieldControlStub);
  }

  parseFieldMetaData(invoiceType: string, data: any[]): any {
    return of([fieldControlStub]);
  }
}
