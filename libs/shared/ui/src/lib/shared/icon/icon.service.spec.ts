import { TestBed } from '@angular/core/testing';

import { IconService } from './icon.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

const sanitizer = {
  bypassSecurityTrustResourceUrl: jest.fn(),
};

describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MatIconRegistry,
        {
          provide: DomSanitizer,
          useValue: sanitizer,
        },
      ],
    });
    service = TestBed.inject(IconService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerIcons()', () => {
    it('correctly registers icons', () => {
      service.registerIcons();
    });
  });
});
