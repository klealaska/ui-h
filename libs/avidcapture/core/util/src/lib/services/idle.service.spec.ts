import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { fromEvent, merge, of } from 'rxjs';

import { IdleService } from './idle.service';

describe('IdleService', () => {
  let service: IdleService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [IdleService] });
    service = TestBed.inject(IdleService);
    service['idleEvents$'] = merge(fromEvent(document, 'mousemove'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('startWatching()', () => {
    beforeEach(() => {
      jest.spyOn(service as any, 'startTimer');
      service.startWatching(60);
    });

    it('should startTimer', () => {
      expect(service['startTimer']).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetWatch()', () => {
    beforeEach(() => {
      jest.spyOn(service as any, 'resetTimer').mockImplementation();
      service.resetWatch();
    });

    it('should call resetTimer', () => {
      expect(service['resetTimer']).toHaveBeenCalledTimes(1);
    });
  });

  describe('stopTimer()', () => {
    beforeEach(() => {
      service['timerSubscription'] = of([]).subscribe();
      jest.spyOn((service as any)['timerSubscription'], 'unsubscribe');
      service.stopTimer();
    });

    it('should unsubscribe from the timer subscription', () => {
      expect(service['timerSubscription'].unsubscribe).toHaveBeenCalled();
    });

    describe('when timerSubscription is NULL', () => {
      beforeEach(() => {
        service['timerSubscription'] = null;
        service['stopTimer']();
      });

      it('should NOT call unsubscribe', () => {
        expect(service['timerSubscription']).toBeNull();
      });
    });
  });

  describe('private resetTimer()', () => {
    describe('when timerSubscription is DEFINED', () => {
      beforeEach(() => {
        service['timerSubscription'] = of([]).subscribe();
        jest.spyOn(service, 'startTimer' as any);
        service['resetTimer']();
      });

      it('should call the startTimer fn', () =>
        expect(service['startTimer']).toHaveBeenCalledTimes(1));
    });

    describe('when timerSubscription is NULL', () => {
      beforeEach(() => {
        jest.spyOn(service, 'startTimer' as any).mockImplementation();
        service['timerSubscription'] = null;
        service['resetTimer']();
      });

      it('should NOT call unsubscribe', () => {
        expect(service['timerSubscription']).toBeNull();
      });
    });
  });

  describe('startTimer()', () => {
    it('should start the idle timer', done => {
      service['timeOutMilliSeconds'] = 1000;
      service['idleEvents$'] = merge(fromEvent(document, 'mousemove'));
      service['startTimer']();

      document.dispatchEvent(new MouseEvent('mousemove'));
      done();

      expect(service.expired$.next).toBeTruthy();
    });
  });
});
