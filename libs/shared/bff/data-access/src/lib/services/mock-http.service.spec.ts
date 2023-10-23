import { Test, TestingModule } from '@nestjs/testing';
import { MockHttpService } from './mock-http.service';
import { defaultSortFilterConfig } from './sort-filter-config.interface';

describe('MockHttpService', () => {
  let service: MockHttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockHttpService,
        {
          provide: 'MOCK_FILE_PATH',
          useValue: '/foo/bar',
        },
        {
          provide: 'SORT_FILTER_CONFIG',
          useValue: defaultSortFilterConfig,
        },
      ],
    }).compile();

    service = module.get<MockHttpService>(MockHttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
