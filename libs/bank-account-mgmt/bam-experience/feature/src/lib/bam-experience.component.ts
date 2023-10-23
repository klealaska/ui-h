import { Component, ViewEncapsulation } from '@angular/core';
import { BankAccountSharedFacade } from '@ui-coe/bank-account-mgmt/shared/data-access';
import { Observable } from 'rxjs';

@Component({
  selector: 'ui-coe-bank-account-container',
  templateUrl: './bam-experience.component.html',
  styleUrls: ['./bam-experience.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BamExperienceComponent {
  public sidePanelComponentId$: Observable<string> = this._sharedFacade.sidePanelContentId$;

  constructor(private readonly _sharedFacade: BankAccountSharedFacade) {}
}
