import { of } from 'rxjs';

export const mockUploadFacade = {
  batches$: of([]),
  dispatchLoadBatches: jest.fn(),
  getView: jest.fn(),
};
