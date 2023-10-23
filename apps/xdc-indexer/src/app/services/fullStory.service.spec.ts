import { TestBed } from '@angular/core/testing';
import { FullStoryService } from './fullStory.service';
describe('FullStoryService', () => {
  let service: FullStoryService;

  const fullStoryServiceStub = {
    init: jest.fn(),
    identify: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FullStoryService,
          useValue: fullStoryServiceStub,
        },
      ],
    });
    service = TestBed.inject(FullStoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Init()', () => {
    beforeEach(() => {
      jest.spyOn(fullStoryServiceStub, 'init').mockImplementation();
      service.init();
    });

    it('should call init method', () => {
      expect(fullStoryServiceStub.init).toBeCalled();
    });
  });

  describe('identify()', () => {
    beforeEach(() => {
      jest.spyOn(fullStoryServiceStub, 'identify').mockImplementation();
      service.identify('mockUsername', 'mockDisplayName', 'mockEmail');
    });

    it('should call init method', () => {
      expect(fullStoryServiceStub.identify).toHaveBeenNthCalledWith(
        1,
        'mockUsername',
        'mockDisplayName',
        'mockEmail'
      );
    });
  });
});
