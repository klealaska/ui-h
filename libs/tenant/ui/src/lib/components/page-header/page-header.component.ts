import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'ui-coe-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent implements OnInit {
  @Input() title: string;
  @Input() buttonText: string;
  @Input() buttonId: string;
  @Input() showBtn: boolean = true;
  @Input() backBtnId: string;
  @Input() showBackBtn: boolean = true;
  @Input() smallTitle: boolean;
  @Input() fixedHeight: boolean;

  @Output() buttonClicked = new EventEmitter<void>();
  @Output() backButtonClicked = new EventEmitter<void>();

  getClass() {
    if (this.fixedHeight) {
      return 'fixed-height';
    }
    return '';
  }
  constructor() {}
  ngOnInit(): void {}
}
