import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ax-mat-link',
  templateUrl: './link.component.html',
})
export class LinkComponent implements OnInit {
  @Input() text: string;
  @Input() id: string;
  @Input() disabled = false;
  @Output() linkClick = new EventEmitter<void>();

  ngOnInit(): void {
    this.id = this.id ?? `ax-link-${new Date().getTime()}`;
  }

  onLinkClick(): void {
    if (!this.disabled) {
      this.linkClick.emit();
    }
  }
}
