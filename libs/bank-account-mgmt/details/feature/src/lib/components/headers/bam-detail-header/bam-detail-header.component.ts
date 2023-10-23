import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IBankAccountMapped } from '@ui-coe/bank-account-mgmt/shared/types';
import { CommonModule } from '@angular/common';
import { BamPanelHeaderSkeletonComponent } from '@ui-coe/bank-account-mgmt/shared/ui';
import { getAccountDisplayName } from '@ui-coe/bank-account-mgmt/shared/util';
import { tooltip } from '@ui-coe/shared/types';
import { TooltipComponent, TooltipDirective } from '@ui-coe/shared/ui-v2';

@Component({
  selector: 'ax-bam-detail-header',
  standalone: true,
  templateUrl: './bam-detail-header.component.html',
  styleUrls: ['./bam-detail-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BamPanelHeaderSkeletonComponent, TooltipComponent, TooltipDirective],
})
export class BamDetailHeaderComponent implements OnChanges {
  @Input() account: IBankAccountMapped;
  public accountDisplayName: string;
  public tooltip: tooltip;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['account']) {
      if (changes['account'].currentValue !== changes['account'].previousValue) {
        this.accountDisplayName = getAccountDisplayName(this.account);
        this.tooltip = {
          tooltipText: this.accountDisplayName,
          tooltipStyle: 'primary',
          tooltipPosition: 'below',
          pointerPosition: 'center',
          dynamicOverflow: true,
        };
      }
    }
  }
}
