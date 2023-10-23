import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ax-circular-stepper',
  templateUrl: './circular-stepper.component.html',
  styleUrls: ['./circular-stepper.component.scss'],
})
export class CircularStepperComponent {
  strokes = '0 ,100';

  private _totalStepCount = 1;
  private _currentStepCount = 1;
  @Input() text: string;

  /**
   * setter for total Step update
   */
  @Input() set totalStep(value: number) {
    this._totalStepCount = value;
    this.calculateProgress();
  }

  /**
   * setter to update the progress when Nexr or Previous button clicked
   */
  @Input() set progress(value: number) {
    this._currentStepCount = value;
    this.calculateProgress();
  }

  /**
   * Calculate the Progress of circular pie chart
   */
  calculateProgress() {
    const percent = Math.round((this._currentStepCount / this._totalStepCount) * 100);
    this.strokes = percent + ', ' + 100;
  }
}
