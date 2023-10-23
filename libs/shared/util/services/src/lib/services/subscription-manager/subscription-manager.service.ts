import { Injectable } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionManagerService {
  /**
   * this service will handle all subscriptions within an app.
   * it is designed to be provided at the root level of a project and used as a singleton across all components
   *
   * within each consuming component you will need to store a reference to the key returned from the `init` method.
   * (this will be a unique Symbol value to prevent collisions within the `_subscriptionStore`)
   * this will allow you to add subscriptions to the `_subscriptionStore` for the appropriate component
   * as well as clean up all subscriptions for the component.
   *
   * e.g.
   * export class MyComponent implements OnDestroy {
   *
   *    constructor(private subManager: SubscriptionManagerService) {}
   *
   *    private readonly _subKey = this.subManager.init();
   *
   *    someMethod() {
   *      this.subManager.add(this._subKey, myObservable, myObserverFunctionOrObject);
   *    }
   *
   *    ngOnDestroy() {
   *      this.subManager.tearDown(this._subKey);
   *    }
   * }
   */

  // using [key: string] here because TS can't wrap its mind around Symbols
  private _subscriptionStore: { [key: string]: Subscription[] } = {};

  /**
   * @method init
   * @description sets up a unique key in the _subscriptionStore that can
   *              be used to add and teardown subscriptions
   * @returns a Symbol that will need to be saved in the consuming component
   *          so that it will have a reference to its subscriptions in the
   *          _subscriptionStore
   */
  public init(): any {
    // using `any` type here because TS doesn't play well with symbols
    const sym: any = Symbol();
    this._subscriptionStore[sym] = [];
    return sym;
  }

  /**
   * @method add
   * @description adds new subscriptions to the appropriate key in the _subscriptionStore
   * @param key string that represents the symbol produced by init
   * @param obs Observable<any> - the observable to be added and subscribed to
   * @param observer Observer<any> - the observer function or object to be passed to the subscribe method
   */
  public add(key: string, obs: Observable<any>, observer: (val?: any) => any): void;
  public add(key: string, obs: Observable<any>, observer: Observer<any>): void;
  public add(key: string, obs: Observable<any>, observer: any): void {
    // if observer is a function, it will need to be setup to accept arguments appropriately
    this._subscriptionStore[key].push(obs.subscribe(observer));
  }

  /**
   * @method tearDown
   * @description unsubscribes from all subscriptions for a given key
   *              then resets the value of that key in the _subscriptionStore to and empty array
   * @param key string that represents the symbol produced by init
   */
  public tearDown(key: string): void {
    this._subscriptionStore[key]?.forEach((sub: Subscription) => sub.unsubscribe());
    delete this._subscriptionStore[key];
  }
}
