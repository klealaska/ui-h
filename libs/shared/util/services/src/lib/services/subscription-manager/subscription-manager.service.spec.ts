import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { SubscriptionManagerService } from './subscription-manager.service';

describe('SubscriptionManagerService', () => {
  let service: SubscriptionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionManagerService],
    });
    service = TestBed.inject(SubscriptionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new key/value pair when running init', () => {
    const key = service.init();
    expect(service['_subscriptionStore'][key]).toEqual([]);
  });

  it('should add a subscription to the subscription store', () => {
    const key = service.init();
    service.add(key, new Observable(), val => val);
    expect(service['_subscriptionStore'][key].length).toBe(1);
  });

  it('should clean up a subscription', () => {
    const key = service.init();
    service.add(key, new Observable(), val => val);
    const subsription = service['_subscriptionStore'][key][0];
    const spy = jest.spyOn(subsription, 'unsubscribe');
    service.tearDown(key);
    expect(spy).toHaveBeenCalled();
    expect(service['_subscriptionStore'][key]).toBeUndefined();
  });
});
