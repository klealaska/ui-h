import { Component, EventEmitter, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SubscriptionManagerService } from '@ui-coe/shared/util/services';
import { IGetTenantParams } from '@ui-coe/tenant/shared/types';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'ui-coe-tenant-list-filter-bar',
  templateUrl: './tenant-list-filter-bar.component.html',
  styleUrls: ['./tenant-list-filter-bar.component.scss'],
})
export class TenantListFilterBarComponent implements OnInit, OnDestroy {
  @Input() nameFieldValue: string;
  // this will support only Name field for now
  @Output() public filterValue: EventEmitter<IGetTenantParams> = new EventEmitter();

  formGroup: FormGroup;

  constructor(private subManager: SubscriptionManagerService) {}

  private readonly _subKey = this.subManager.init();

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      nameField: new FormControl(),
    });

    this.formGroup.setValue({ nameField: this.nameFieldValue });

    this.subManager.add(
      this._subKey,
      this.formGroup.valueChanges.pipe(debounceTime(200)),
      ({ nameField }) => {
        this.filterValue.emit({ siteName: nameField });
      }
    );
  }

  ngOnDestroy(): void {
    this.subManager.tearDown(this._subKey);
  }
}
