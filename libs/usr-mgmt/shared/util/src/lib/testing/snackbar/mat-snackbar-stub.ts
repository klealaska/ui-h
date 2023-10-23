import { of } from 'rxjs';

export class MatSnackBarStub {
  openFromComponent(component: any, config: any) {
    return this;
  }

  afterDismissed() {
    return of(null);
  }
}
