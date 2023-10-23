import { TestBed } from '@angular/core/testing';

import { ContentService } from './content.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@ui-coe/shared/util/services';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConfigService,
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(ContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
