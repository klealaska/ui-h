import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'ax-slide-panel',
  templateUrl: './slide-panel.component.html',
  styleUrls: ['./slide-panel.component.scss'],
})
export class AxSlidePanelComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title: string;
  @Input() showPanel: boolean;
  @Output() panelOpened = new EventEmitter<null>();
  @Output() panelClosed = new EventEmitter<null>();
  private element: any;

  constructor(protected el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    // rendering slide panel at the bottom of page  so it can be positioned above current page components
    document.body.appendChild(this.element);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.showPanel?.currentValue) {
      this.panelOpened.emit();
    }
  }

  ngOnDestroy(): void {
    this.element.remove();
  }
}
