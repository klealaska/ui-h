import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ax-label',
  templateUrl: './ax-label.component.html',
  styleUrls: ['./ax-label.component.scss'],
})
export class AxLabelComponent implements OnInit {
  @Input() bold = false;
  @Input() size = 'md';
  @Input() text: string;
  @Input() textColor = 'default';
  @Input() uppercase = false;
  @Input() italics = false;
  @Input() hasPointer = false;
  @Input() id: string;

  ngOnInit(): void {
    this.id = this.id ?? `ax-label-${new Date().getTime()}`;
  }
}
