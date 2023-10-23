import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, take, tap } from 'rxjs';

import { IndexingSolution } from '../../../../shared/enums';
import { Buyer, BuyerPayload } from '../../../../shared/interfaces';
import { HomeModalComponent } from '../home-modal/home-modal.component';

@Component({
  selector: 'bkws-home-panel',
  templateUrl: './home-panel.component.html',
  styleUrls: ['./home-panel.component.scss'],
})
export class HomePanelComponent implements OnInit, OnChanges, OnDestroy {
  @Input() buyer: Buyer;
  @Input() canViewMassVoid = false;
  @Input() canViewAttributeFunctions = false;
  @Input() canViewThreshold = false;
  @Input() canViewBuyerGoLive = false;
  @Input() resetForm = false;
  @Output() updateBuyerValues = new EventEmitter<BuyerPayload>();
  @Output() executeMassVoid = new EventEmitter<BuyerPayload>();
  @Output() updateFormStatus = new EventEmitter<boolean>();

  buyerKeywordForm: UntypedFormGroup;
  indexingSolutionEnum = IndexingSolution; // for template

  private subscriptions: Subscription[] = [];

  constructor(private fb: UntypedFormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.buyerKeywordForm = this.fb.group({
      sourceSystemBuyerId: [this.buyer.sourceSystemBuyerId],
      indexingSolutionId: [this.buyer.indexingSolutionId],
      portalStatus: [this.buyer.portalStatus.toLowerCase() === 'active' ? true : false],
      forwardingEmailAddress: [this.buyer.forwardingEmailAddress],
      bounceBackMessage: [this.buyer.bounceBackMessage],
      displayPredictedValues: [this.buyer.displayPredictedValues === '1' ? true : false],
      buyerKeyword: [this.buyer.buyerKeyword],
      buyerKeywordId: [this.buyer.buyerKeywordId],
      sourceSystemId: [this.buyer.sourceSystemId],
      ingestionMethodId: [this.buyer.ingestionMethodId],
      displayIdentifierSearchValues: [
        this.buyer.displayIdentifierSearchValues === '1' ? true : false,
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resetForm?.currentValue) {
      this.buyerKeywordForm.markAsPristine();
      this.updateFormStatus.emit(false);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  massVoid(customerName: string): void {
    this.subscriptions.push(
      this.dialog
        .open(HomeModalComponent, {
          autoFocus: false,
          width: '35em',
          data: {
            customerName,
          },
        })
        .afterClosed()
        .pipe(
          tap(value => {
            if (value) {
              this.executeMassVoid.emit(this.buyerKeywordForm.value);
            }
          }),
          take(1)
        )
        .subscribe()
    );
  }
}
