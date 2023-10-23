import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'xdc-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
})
export class ContextMenuComponent {
  @Input() showContextMenu = false;
  @Output() unlockDocumentEvent = new EventEmitter<void>();
  @Output() hideContextMenuEvent = new EventEmitter<boolean>();
  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.hideContextMenuEvent.emit(true);
    }
  }

  unlockDocument(): void {
    this.hideContextMenuEvent.emit(true);
    this.unlockDocumentEvent.emit();
  }
}
