import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ax-header',
  templateUrl: './ax-header.component.html',
  styleUrls: ['./ax-header.component.scss'],
})
export class AxHeaderComponent implements OnInit {
  @Input() text: string;
  @Input() size: string;
  @Input() uppercase = false;
  @Input() id: string;

  ngOnInit(): void {
    this.id = this.id ?? `ax-header-${new Date().getTime()}`;
  }
}
