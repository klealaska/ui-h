import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { EventHubFacade } from './event-hub.facade';

describe('EventHubFacadeService', () => {
  let service: EventHubFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });
    service = TestBed.inject(EventHubFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
