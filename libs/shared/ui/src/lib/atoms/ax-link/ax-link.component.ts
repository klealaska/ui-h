import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ax-link',
  templateUrl: './ax-link.component.html',
  styleUrls: ['./ax-link.component.scss'],
})
export class AxLinkComponent implements OnInit {
  @Input() bold = false;
  @Input() size = 'sm';
  @Input() text: string;
  @Input() uppercase = false;
  @Input() id: string;
  @Input() isLocked = false;
  @Output() linkClick = new EventEmitter<void>();

  ngOnInit(): void {
    this.id = this.id ?? `ax-link-${new Date().getTime()}`;
  }

  onLinkClick(): void {
    if (!this.isLocked) {
      this.linkClick.emit();
    }
  }
}
