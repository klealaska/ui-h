import { Observable, Subject } from 'rxjs';

export class AxDialogRef {
  private readonly afterClosedSubject = new Subject<any>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  afterClosed: Observable<any> = this.afterClosedSubject.asObservable();

  close(result?: any): void {
    this.afterClosedSubject.next(result);
  }
}
