import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeoutMessages } from '@ui-coe/avidcapture/shared/types';
import { Observable, Subscription, interval } from 'rxjs';

@Component({
  selector: 'xdc-timeout',
  templateUrl: './timeout.component.html',
  styleUrls: ['./timeout.component.scss'],
})
export class TimeoutComponent implements OnInit, OnDestroy {
  timeoutMinutes: number;
  timerDisplay = '';

  private timerSubscription: Subscription;

  constructor(
    private dialogRef: MatDialogRef<TimeoutComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { timeoutMinutes: number }
  ) {}

  ngOnInit(): void {
    this.timeoutMinutes = this.data.timeoutMinutes;
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  stillHereClick(): void {
    this.dialogRef.close(TimeoutMessages.stillHere);
  }

  private timedOut(): void {
    this.dialogRef.close(TimeoutMessages.timeout);
  }

  private startTimer(): void {
    const timeoutSeconds = this.timeoutMinutes * 60;
    this.timerDisplay = this.formatTimeDisplay(timeoutSeconds);

    const timer: Observable<number> = interval(1000);
    this.timerSubscription = timer.subscribe(n => {
      const remainingTime = timeoutSeconds - (n + 1);
      if (remainingTime === 0) {
        this.timerSubscription.unsubscribe();
        this.timerDisplay = 'Timeout Expired';
        this.timedOut();
        return;
      }
      this.timerDisplay = this.formatTimeDisplay(remainingTime);
    });
  }

  private formatTimeDisplay(time: number): string {
    const minutes = Math.floor(time / 60);
    let formattedMinutes = '';
    if (minutes === 0) {
      formattedMinutes = '';
    } else if (minutes === 1) {
      formattedMinutes = `${minutes} min`;
    } else {
      formattedMinutes = `${minutes} mins`;
    }
    let formattedSeconds = '';
    const seconds = time % 60;
    if (seconds === 1) {
      formattedSeconds = `${seconds} sec`;
    } else {
      formattedSeconds = `${seconds} secs`;
    }
    return `${formattedMinutes} ${formattedSeconds}`;
  }
}
