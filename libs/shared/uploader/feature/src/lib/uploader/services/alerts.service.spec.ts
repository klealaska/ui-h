import { TestBed } from '@angular/core/testing';

import { AlertsService } from './alerts.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('AlertsService', () => {
  let service: AlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
    });
    service = TestBed.inject(AlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
