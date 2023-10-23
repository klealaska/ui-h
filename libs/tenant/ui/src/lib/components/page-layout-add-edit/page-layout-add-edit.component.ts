import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IScrollSection } from '@ui-coe/shared/util/directives';

@Component({
  selector: 'ui-coe-page-layout-add-edit',
  templateUrl: './page-layout-add-edit.component.html',
  styleUrls: ['./page-layout-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutAddEditComponent {
  @Input() sections: IScrollSection[];
  offset = 20;

  constructor() {}
}
