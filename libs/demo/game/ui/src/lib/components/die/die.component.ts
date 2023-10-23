import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'demo-die',
  templateUrl: './die.component.html',
  styleUrls: ['./die.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DieComponent {
  @Input() imageSrc: string;
  @Input() dieRolled: any;
}
