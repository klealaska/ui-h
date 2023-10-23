import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonComponent } from '@ui-coe/shared/ui-v2';
import { MockPipe } from 'ng-mocks';

import { TimeoutComponent } from './timeout.component';

const dialogRefStub = {
  close: jest.fn(),
};

describe('TimeoutComponent', () => {
  let component: TimeoutComponent;
  let fixture: ComponentFixture<TimeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeoutComponent, MockPipe(TranslatePipe)],
      imports: [MatDialogModule, ButtonComponent, MatIconModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            timeoutMinutes: 1,
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy()', () => {
    beforeEach(() => {
      jest.spyOn(component['timerSubscription'], 'unsubscribe').mockImplementation();
      component.ngOnDestroy();
    });

    it('should unsubscribe from timer subscription', () =>
      expect(component['timerSubscription'].unsubscribe).toHaveBeenCalledTimes(1));
  });

  describe('stillHereClick()', () => {
    beforeEach(() => {
      component.stillHereClick();
    });

    it('should close dialog with message of Still Here', () =>
      expect(dialogRefStub.close).toHaveBeenNthCalledWith(1, 'Still Here'));
  });

  describe('startTimer()', () => {
    describe('when timer has not timed out', () => {
      it('should set timerDisplay to Timeout Expired', fakeAsync(() => {
        component.ngOnInit();
        tick(1);
        expect(component.timerDisplay).toBe('1 min 0 secs');
        discardPeriodicTasks();
      }));

      describe('when time is higher than 1 minute', () => {
        it('should format minutes left on time counter', () => {
          const formattedMinutes = component['formatTimeDisplay'](120);
          expect(formattedMinutes).toBe('2 mins 0 secs');
        });
      });
    });

    describe('when timer has timed out', () => {
      it('should set timerDisplay to Timeout Expired', fakeAsync(() => {
        component.ngOnInit();
        tick(100000);
        expect(component.timerDisplay).toBe('Timeout Expired');
      }));
    });
  });
});
