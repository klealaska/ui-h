/* eslint-disable @typescript-eslint/dot-notation */
import { TestBed } from '@angular/core/testing';

import { AxDialogRef } from './ax-dialog-ref';

describe('AxDialogRef', () => {
  let ref: AxDialogRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AxDialogRef],
    });
    ref = TestBed.inject(AxDialogRef);
  });

  it('should be created', () => {
    expect(ref).toBeTruthy();
  });

  describe('close()', () => {
    beforeEach(() => {
      jest.spyOn(ref['afterClosedSubject'], 'next').mockImplementation();
      ref.close('mockResult');
    });

    it('should of called afterClosedSubject.next with a mockResult', () =>
      expect(ref['afterClosedSubject'].next).toHaveBeenCalledWith('mockResult'));
  });
});
