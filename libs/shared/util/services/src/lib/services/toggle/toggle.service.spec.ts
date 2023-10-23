import { Test, TestingModule } from '@nestjs/testing';
import { ToggleService } from './toggle.service';

describe('ToggleService', () => {
  let service: ToggleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToggleService],
    }).compile();

    service = module.get<ToggleService>(ToggleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setState()', () => {
    it('should update state with data', () => {
      service.setState(true);
      expect(service.getToggledState()).toBeTruthy();
    });
  });

  describe('toggleState()', () => {
    it('should flip state', () => {
      service.toggleState();
      expect(service.getToggledState()).toBeTruthy();
    });
  });

  describe('gtToggledState()', () => {
    it('should return state', () => {
      expect(service.getToggledState()).toBeFalsy();
    });
  });
});
