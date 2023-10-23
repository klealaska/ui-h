import { Injectable } from '@angular/core';
import {
  fromEvent,
  interval,
  merge,
  Observable,
  startWith,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  expired$: Subject<boolean> = new Subject<boolean>();

  private timeOutMilliSeconds: number;
  private idleEvents$: Observable<Event>;
  private timerSubscription: Subscription;

  startWatching(timeOutSeconds: number): Observable<boolean> {
    this.idleEvents$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'DOMMouseScroll'),
      fromEvent(document, 'mousewheel'),
      fromEvent(document, 'touchmove'),
      fromEvent(document, 'MSPointerMove'),
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'resize'),
      fromEvent(window, 'scroll')
    );
    this.timeOutMilliSeconds = timeOutSeconds * 1000;
    this.startTimer();

    return this.expired$;
  }

  resetWatch(): void {
    this.resetTimer();
  }

  stopTimer(): void {
    this.timerSubscription?.unsubscribe();
  }

  private resetTimer(): void {
    this.timerSubscription?.unsubscribe();
    this.startTimer();
  }

  private startTimer(): void {
    this.timerSubscription = this.idleEvents$
      .pipe(
        startWith(this.timeOutMilliSeconds),
        switchMap(() => interval(this.timeOutMilliSeconds)),
        tap(() => this.expired$.next(true))
      )
      .subscribe();
  }
}
