import { TestBed } from '@angular/core/testing';
import { NGXS_PLUGINS } from '@ngxs/store';
import { throwError } from 'rxjs';

import { NgxsErrorHandlerPlugin } from './error-handler.plugin';

describe('NgxsLogoutPlugin', () => {
  let plugin: NgxsErrorHandlerPlugin;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgxsErrorHandlerPlugin,
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsErrorHandlerPlugin,
          multi: true,
        },
      ],
    });
    plugin = TestBed.inject(NgxsErrorHandlerPlugin);
  });

  it('should be created', () => {
    expect(plugin).toBeTruthy();
  });

  describe('handle()', () => {
    describe('when an error occurs from an action', () => {
      const nextStub = jest.fn(() => throwError(() => 'This is a test error!'));
      let val: any;

      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation();
        val = plugin.handle({}, { type: '' }, nextStub);
      });

      it('should display the error in the console', done => {
        val.subscribe({
          next: () => {
            return;
          },
          error: err => {
            err;
            done();
          },
        });
        expect(console.error).toHaveBeenNthCalledWith(1, 'This is a test error!');
      });
    });
  });
});
