import { TestBed } from '@angular/core/testing';

import { AxDialogConfig } from './ax-dialog-config';

describe('AxDialogConfig', () => {
  let config: AxDialogConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AxDialogConfig],
    });
    config = TestBed.inject(AxDialogConfig);
  });

  it('should be created', () => {
    expect(config).toBeTruthy();
  });
});
