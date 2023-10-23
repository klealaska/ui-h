import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubscriptionManagerService } from '@ui-coe/shared/util/services';
import * as coreActions from '../../../../core/actions/core.actions';
import { ChevronItem, Customer } from '../../../../models';
import { CoreState } from '../../../../core/state/core.state';
import { UserRoles } from '../../../../core/enums/user-roles';

@Component({
  selector: 'avc-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss'],
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  customer: Customer;
  navigation: ChevronItem[];

  constructor(private store: Store, private subManager: SubscriptionManagerService) {}

  private readonly _subKey = this.subManager.init();

  displayBackButton$: Observable<boolean> = this.store
    .select(CoreState.userRoles)
    .pipe(map((roles: string[]) => !roles.includes(UserRoles.CustomerAdmin)));

  ngOnInit(): void {
    this.subManager.add(
      this._subKey,
      combineLatest([
        this.store.select(CoreState.userRoles),
        this.store.select(CoreState.customerId),
      ]).pipe(
        map(([roles, customerId]) => {
          if (roles.includes(UserRoles.CustomerAdmin) && customerId === 0) {
            this.store.dispatch(new coreActions.GetCustomersByToken());
          } else {
            return customerId;
          }
        })
      ),
      (id: number) => {
        if (id) {
          // the getCustomersByToken brings back an array of customer objects
          // that are then stored in state with the 0th element being used to
          // set the state values for customer and customerId
          // the functionality below will be repeating the step of getting the customer object
          // using the id that was selected from state.

          // TODO: determine if there is a way that this can be rewritten so that we don't have to repeat calls
          // note: we will need to do this if it is a portal admin though
          this.store.dispatch(new coreActions.GetCustomer(id)).subscribe(() => {
            this.customer = this.store.selectSnapshot<Customer>(CoreState.customer);
            this.store.dispatch(new coreActions.GetPlatform(this.customer.platformId));
          });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subManager.tearDown(this._subKey);
  }
}
