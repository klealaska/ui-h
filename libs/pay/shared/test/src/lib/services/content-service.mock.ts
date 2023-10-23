import { of } from 'rxjs';

export const mockContentService = {
  get: jest.fn(() => of({})),
};
